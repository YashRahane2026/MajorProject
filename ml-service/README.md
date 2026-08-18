# CrimeTrack AI - ML Service

This FastAPI service provides ML inference for the CrimeTrack AI platform. It handles facial recognition embeddings and natural language embeddings for FIRs.

## Deployment to Hugging Face Spaces

This service is optimized to be deployed as a Docker Space on Hugging Face's free CPU tier.

### Step-by-step instructions to create a new HF Space

1. Go to [Hugging Face Spaces](https://huggingface.co/spaces) and click "Create new Space".
2. Enter a Space name (e.g., `crimetrack-ml-service`).
3. Select **Docker** as the Space SDK and choose **Blank**.
4. Set Space hardware to **Free CPU** (or higher if needed).
5. Click **Create Space**.
6. Clone the Space repository and copy the contents of the `ml-service` directory into it.
7. Commit and push the changes. The Space will automatically build the Docker image and deploy.

### Environment Variables

You need to set the following environment variables in your Hugging Face Space settings (Settings -> Variables and secrets):

*   `CORS_ORIGINS`: Comma-separated list of allowed origins (e.g., `http://localhost:3000,https://your-frontend-domain.com`). Default is `http://localhost:3000`.
*   `SUPABASE_URL`: Your Supabase project URL.
*   `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (required to bypass Row Level Security for backend operations).

## Local Development

### Using Docker

1.  Build the Docker image:
    ```bash
    docker build -t crimetrack-ml-service .
    ```
2.  Run the container:
    ```bash
    docker run -p 7860:7860 --env-file .env crimetrack-ml-service
    ```

### Using Python Virtual Environment

1.  Create and activate a virtual environment:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```
2.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3.  Run the application:
    ```bash
    uvicorn main:app --host 0.0.0.0 --port 7860 --reload
    ```

## API Documentation

Once running, you can access the interactive API documentation at `http://localhost:7860/docs`.

### Example Requests

#### 1. Health Check
```bash
curl -X GET http://localhost:7860/health
```

#### 2. Embed Face
```bash
curl -X POST http://localhost:7860/embed-face \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/path/to/suspect_face.jpg"
```
**Expected Response:**
```json
{
  "embedding": [0.012, -0.045, ...],
  "dimensions": 512
}
```

#### 3. Embed FIR
```bash
curl -X POST http://localhost:7860/embed-fir \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{"text": "A robbery occurred at the bank..."}'
```
**Expected Response:**
```json
{
  "embedding": [0.034, 0.011, ...],
  "dimensions": 768
}
```

#### 4. Match Face
```bash
curl -X POST http://localhost:7860/match-face \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "embedding": [0.012, -0.045, ...],
    "threshold": 0.6,
    "limit": 5
  }'
```
**Expected Response:**
```json
{
  "matches": [
    {
      "id": "uuid",
      "similarity": 0.85,
      "metadata": {}
    }
  ]
}
```

#### 5. Link Cases
```bash
curl -X POST http://localhost:7860/link-cases \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "embedding": [0.034, 0.011, ...],
    "threshold": 0.7,
    "limit": 5
  }'
```
**Expected Response:**
```json
{
  "links": [
    {
      "id": "uuid",
      "similarity": 0.92,
      "metadata": {}
    }
  ]
}
```
