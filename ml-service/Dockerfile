# Multi-stage Docker build optimized for Hugging Face Spaces

FROM python:3.11-slim as builder

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Install pip requirements
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# Create pre-cache script
RUN echo "from facenet_pytorch import MTCNN, InceptionResnetV1; \
MTCNN(); \
InceptionResnetV1(pretrained='vggface2').eval(); \
from sentence_transformers import SentenceTransformer; \
SentenceTransformer('all-mpnet-base-v2')" > cache_models.py

# Pre-cache model weights during build
ENV PATH=/root/.local/bin:$PATH
RUN python cache_models.py

# Final stage
FROM python:3.11-slim

# Install runtime system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Set up non-root user for Hugging Face Spaces security
RUN useradd -m -u 1000 user
USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

WORKDIR $HOME/app

# Copy installed dependencies from builder
COPY --from=builder /root/.local $HOME/.local
# Copy cached models
COPY --from=builder /root/.cache $HOME/.cache

# Copy application code
COPY --chown=user:user . $HOME/app

# Environment variables
ENV PYTHONUNBUFFERED=1
ENV PORT=7860

# Expose port
EXPOSE 7860

# Start server
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-7860}"]
