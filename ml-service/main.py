import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, File, UploadFile, HTTPException, Depends, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import numpy as np
from PIL import Image
import io

# Model imports
import torch
from facenet_pytorch import MTCNN, InceptionResnetV1
from sentence_transformers import SentenceTransformer
from supabase import create_client, Client

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# --- Pydantic Models ---
class FIRText(BaseModel):
    text: str = Field(..., min_length=1, description="The FIR narrative text to embed")

class MatchRequest(BaseModel):
    embedding: List[float] = Field(..., description="The embedding vector")
    threshold: float = Field(0.5, ge=0.0, le=1.0, description="Similarity threshold (0 to 1)")
    limit: int = Field(5, ge=1, le=100, description="Maximum number of results to return")

class MatchResponse(BaseModel):
    matches: List[Dict[str, Any]]

class LinkResponse(BaseModel):
    links: List[Dict[str, Any]]

class EmbedResponse(BaseModel):
    embedding: List[float]
    dimensions: int

# --- Environment Configuration ---
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

# --- Global State ---
class MLModels:
    mtcnn = None
    resnet = None
    sentence_model = None
    supabase_client: Optional[Client] = None

ml_models = MLModels()

# --- Lifespan Context Manager ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    logger.info("Initializing ML models...")
    try:
        # We explicitly use CPU to fit into Hugging Face Spaces free tier
        device = torch.device('cpu')
        
        # Load Face Models
        logger.info("Loading MTCNN...")
        ml_models.mtcnn = MTCNN(keep_all=False, device=device)
        logger.info("Loading InceptionResnetV1...")
        ml_models.resnet = InceptionResnetV1(pretrained='vggface2').eval().to(device)
        
        # Load Text Model
        logger.info("Loading SentenceTransformer ('all-mpnet-base-v2')...")
        ml_models.sentence_model = SentenceTransformer('all-mpnet-base-v2', device=device)
        
        logger.info("Models loaded successfully.")
    except Exception as e:
        logger.error(f"Failed to load ML models: {e}")
        raise RuntimeError("Model loading failed.") from e

    # Initialize Supabase Client
    if SUPABASE_URL and SUPABASE_KEY:
        try:
            logger.info("Initializing Supabase client...")
            ml_models.supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
            logger.info("Supabase client initialized.")
        except Exception as e:
            logger.error(f"Failed to initialize Supabase: {e}")
    else:
        logger.warning("Supabase credentials not found. Database features will return mock data.")

    yield
    
    # Shutdown logic
    logger.info("Shutting down ML service, releasing resources...")
    ml_models.mtcnn = None
    ml_models.resnet = None
    ml_models.sentence_model = None
    ml_models.supabase_client = None


app = FastAPI(
    title="CrimeTrack AI - ML Service",
    description="Inference service for facial recognition and FIR text similarity.",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in CORS_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Endpoints ---

@app.get("/health")
async def health_check():
    """Health check endpoint to verify service and model status."""
    if not (ml_models.mtcnn and ml_models.resnet and ml_models.sentence_model):
        raise HTTPException(status_code=503, detail="Models are not loaded yet.")
    return {
        "status": "healthy",
        "models_loaded": True,
        "supabase_connected": ml_models.supabase_client is not None
    }

@app.post("/embed-face", response_model=EmbedResponse)
async def embed_face(file: UploadFile = File(...)):
    """Accepts an image file and returns a 512-dimensional facial embedding."""
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image.")
    
    try:
        content = await file.read()
        image = Image.open(io.BytesIO(content)).convert('RGB')
        
        # Detect face
        face_tensor = ml_models.mtcnn(image)
        
        if face_tensor is None:
            raise HTTPException(status_code=400, detail="No face detected in the image.")
        
        # Get embedding
        # MTCNN returns a 3D tensor for a single face. Resnet expects 4D (batch size of 1)
        face_tensor = face_tensor.unsqueeze(0)
        
        with torch.no_grad():
            embedding = ml_models.resnet(face_tensor).squeeze(0).cpu().numpy()
            
        # Normalize the embedding (L2 normalization is common for face embeddings)
        embedding = embedding / np.linalg.norm(embedding)
        
        return EmbedResponse(
            embedding=embedding.tolist(),
            dimensions=len(embedding)
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing image: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during face processing.")

@app.post("/embed-fir", response_model=EmbedResponse)
async def embed_fir(payload: FIRText):
    """Accepts FIR narrative text and returns a 768-dimensional text embedding."""
    try:
        # Generate embedding
        embedding = ml_models.sentence_model.encode(payload.text, normalize_embeddings=True)
        
        return EmbedResponse(
            embedding=embedding.tolist(),
            dimensions=len(embedding)
        )
    except Exception as e:
        logger.error(f"Error processing text: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during text processing.")

@app.post("/match-face", response_model=MatchResponse)
async def match_face(req: MatchRequest):
    """Queries Supabase pgvector to find similar faces based on embedding."""
    if not ml_models.supabase_client:
        # Mock response if Supabase is not configured
        logger.warning("Returning mock match_face data.")
        return MatchResponse(matches=[
            {"id": "mock-uuid-1", "similarity": 0.95, "metadata": {"name": "Mock Suspect"}},
            {"id": "mock-uuid-2", "similarity": 0.82, "metadata": {"name": "Mock Suspect 2"}}
        ])
        
    try:
        # Call Supabase RPC for pgvector similarity search
        response = ml_models.supabase_client.rpc(
            'match_faces',
            {
                'query_embedding': req.embedding,
                'match_threshold': req.threshold,
                'match_count': req.limit
            }
        ).execute()
        
        return MatchResponse(matches=response.data)
    except Exception as e:
        logger.error(f"Supabase query failed: {e}")
        raise HTTPException(status_code=500, detail="Database query failed.")

@app.post("/link-cases", response_model=LinkResponse)
async def link_cases(req: MatchRequest):
    """Queries Supabase pgvector to find similar FIRs based on text embedding."""
    if not ml_models.supabase_client:
        # Mock response if Supabase is not configured
        logger.warning("Returning mock link_cases data.")
        return LinkResponse(links=[
            {"id": "mock-fir-1", "similarity": 0.92, "metadata": {"crime_type": "theft"}},
            {"id": "mock-fir-2", "similarity": 0.78, "metadata": {"crime_type": "theft"}}
        ])
        
    try:
        # Call Supabase RPC for pgvector similarity search
        response = ml_models.supabase_client.rpc(
            'match_firs',
            {
                'query_embedding': req.embedding,
                'match_threshold': req.threshold,
                'match_count': req.limit
            }
        ).execute()
        
        return LinkResponse(links=response.data)
    except Exception as e:
        logger.error(f"Supabase query failed: {e}")
        raise HTTPException(status_code=500, detail="Database query failed.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=7860, reload=True)
