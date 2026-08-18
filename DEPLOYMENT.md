# Deployment Guide — CrimeTrack AI

## Overview

CrimeTrack AI is deployed as a three-service architecture:

1. **Next.js Frontend** → Vercel (free tier)
2. **PostgreSQL + pgvector** → Supabase (free tier)
3. **FastAPI ML Service** → Hugging Face Spaces (free Docker CPU tier)

All services use genuinely free tiers — no credit card required.

---

## 1. Supabase Setup (Database + Auth)

### Create Project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project (choose a region close to your users)
3. Note your **Project URL** and **anon key** from Settings → API

### Enable pgvector

1. Go to Database → Extensions
2. Search for "vector" and enable it
3. Alternatively, run in SQL Editor:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```

### Run Migrations

Apply the migration files in order via the SQL Editor:

1. `supabase/migrations/001_initial_schema.sql` — Tables, indexes, triggers
2. `supabase/migrations/002_rls_policies.sql` — Row Level Security policies
3. `supabase/migrations/003_vector_functions.sql` — RPC functions for similarity search

### Configure Auth

1. Go to Authentication → Settings
2. Enable Email/Password sign-up
3. Disable email confirmation for development (Settings → Auth → Confirm email = OFF)

### Create Demo Users

Run in SQL Editor after creating auth users:

```sql
-- First create users via Supabase Auth Dashboard or API, then:
-- Update their app_metadata with roles

-- Example (replace USER_ID with actual UUID from auth.users):
UPDATE auth.users SET raw_app_meta_data = 
  raw_app_meta_data || '{"role": "admin"}'::jsonb
WHERE id = 'USER_ID';
```

### Get Credentials

From Settings → API, copy:
- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

---

## 2. Hugging Face Spaces Setup (ML Service)

### Create Space

1. Go to [huggingface.co/spaces](https://huggingface.co/spaces)
2. Click "Create new Space"
3. Configure:
   - **Space name**: `crimetrack-ml-service`
   - **SDK**: Docker
   - **Hardware**: CPU basic (free)
   - **Visibility**: Public (required for free tier)

### Deploy via GitHub

Option A — **Connect to GitHub repo**:
1. In Space settings, connect your GitHub repo
2. Set the Dockerfile path to `ml-service/Dockerfile`

Option B — **Push directly**:
```bash
cd ml-service
git init
git remote add space https://huggingface.co/spaces/YOUR_USERNAME/crimetrack-ml-service
git add .
git commit -m "Initial ML service deployment"
git push space main
```

### Set Environment Variables

In Space Settings → Variables and Secrets:

| Variable | Value |
|---|---|
| `CORS_ORIGINS` | `https://your-app.vercel.app,http://localhost:3000` |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key |

### Verify Deployment

```bash
# Health check
curl https://YOUR_USERNAME-crimetrack-ml-service.hf.space/health

# Test face embedding
curl -X POST https://YOUR_USERNAME-crimetrack-ml-service.hf.space/embed-face \
  -F "file=@test_face.jpg"

# Test FIR embedding
curl -X POST https://YOUR_USERNAME-crimetrack-ml-service.hf.space/embed-fir \
  -H "Content-Type: application/json" \
  -d '{"text": "Armed robbery at jewelry store using forged credentials"}'
```

### Important Notes

- **Cold starts**: HF Spaces free tier may take ~30s to wake up if idle
- **CPU only**: Inference is slower than GPU but fine for demo datasets
- **Model caching**: Models are pre-cached in the Docker image during build
- **Port**: HF Spaces expects port 7860 (configured in Dockerfile)

---

## 3. Vercel Deployment (Frontend)

### Connect Repository

1. Go to [vercel.com](https://vercel.com) and import your GitHub repository
2. Framework Preset: Next.js (auto-detected)
3. Root Directory: `.` (project root)

### Set Environment Variables

In Vercel Project Settings → Environment Variables:

| Variable | Value | Environment |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | All |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | All |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | Production, Preview |
| `ML_SERVICE_URL` | `https://xxx.hf.space` | All |

### Deploy

```bash
# Vercel auto-deploys on git push, or manually:
npx vercel --prod
```

### Custom Domain (Optional)

1. In Vercel → Domains, add your custom domain
2. Update CORS_ORIGINS on HF Spaces to include the new domain

---

## 4. Environment Variables Summary

### Next.js (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ML_SERVICE_URL=https://your-username-crimetrack-ml-service.hf.space
```

### FastAPI ML Service (HF Spaces Secrets)
```env
CORS_ORIGINS=https://your-app.vercel.app,http://localhost:3000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## 5. Local Development

```bash
# Terminal 1: Next.js frontend
npm run dev
# → http://localhost:3000

# Terminal 2: FastAPI ML service (optional, for real model inference)
cd ml-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# → http://localhost:8000

# Without the ML service running, the app uses mock embeddings automatically
```

---

## 6. Troubleshooting

| Issue | Solution |
|---|---|
| `Module not found: @supabase/ssr` | Run `npm install @supabase/supabase-js @supabase/ssr` |
| pgvector extension not found | Enable it in Supabase Dashboard → Database → Extensions |
| ML service returns 503 | Models are still loading (~30s on cold start). Wait and retry. |
| CORS errors from ML service | Check `CORS_ORIGINS` env var includes your frontend URL |
| Auth redirect loop | Ensure Supabase URL and keys are correct in `.env.local` |
| Face match returns empty | Seed the database with face embeddings first |
