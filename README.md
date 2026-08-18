# CrimeTrack AI — Intelligent Biometric-Based Suspect Tracking and Crime Analysis System

> **B.Tech Final Year Project** — Shri Ramdeobaba College of Engineering and Management, Nagpur  
> Session 2026-27, Semester VII  
> Department of Computer Science & Engineering (Data Science)

⚠️ **SYNTHETIC / PROTOTYPE DATA — NOT FOR OPERATIONAL USE**

---

## Team

| Name | Role |
|---|---|
| Prince Maurya | Developer |
| Rudra Jawale | Developer |
| Shubham Singh | Developer |
| Vedansh Gupta | Developer |
| Yash Rahane | Developer |
| Prof. Rishiram Maskare | Guide |

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Vercel                            │
│  ┌─────────────────────────────────────────────┐    │
│  │   Next.js 14 (App Router + TypeScript)      │    │
│  │   • Tailwind CSS + shadcn/ui                │    │
│  │   • Role-based Dashboards (4 roles)         │    │
│  │   • API Route Handlers (CRUD)               │    │
│  └────────────┬──────────────────┬─────────────┘    │
│               │                  │                   │
└───────────────┼──────────────────┼───────────────────┘
                │                  │
        ┌───────▼───────┐  ┌──────▼──────────────────┐
        │   Supabase    │  │  Hugging Face Spaces     │
        │               │  │                          │
        │  PostgreSQL   │  │  FastAPI ML Service      │
        │  + pgvector   │  │  • ArcFace (FaceNet)     │
        │  + Auth       │  │  • Sentence-BERT         │
        │  + Storage    │  │  • /embed-face            │
        │               │  │  • /embed-fir             │
        └───────────────┘  │  • /match-face            │
                           │  • /link-cases             │
                           └────────────────────────────┘
```

---

## Synopsis Objective → Module Mapping

| Synopsis Objective | Module | Location |
|---|---|---|
| Centralized records platform for suspects | Suspect Management + Cases + FIRs | `src/app/(dashboard)/suspects/`, `cases/`, `firs/` |
| Role-based access control (Police/Court/Custodial/Admin) | Auth + Middleware + RLS | `src/middleware.ts`, `supabase/migrations/002_rls_policies.sql` |
| Biometric face matching with embedding similarity | Face Matching Module | `src/app/(dashboard)/matching/face/`, `ml-service/main.py` |
| FIR NLP similarity for case linking | Case Linking Module | `src/app/(dashboard)/matching/cases/`, `ml-service/main.py` |
| Suspect lifecycle tracking (Arrest→Remand→Trial→Custody) | Lifecycle Timeline | `src/app/(dashboard)/suspects/[id]/` |
| Synthetic dataset generation methodology | Data Pipeline | `data-pipeline/` |
| Evaluation metrics (Precision/Recall/Top-K) | Evaluation Dashboard | `src/app/(dashboard)/analytics/evaluation/` |
| Audit logging for compliance | Audit Module | `src/app/(dashboard)/audit/`, `supabase/migrations/001_initial_schema.sql` |
| Network visualization of suspect relationships | Analytics Dashboard | `src/app/(dashboard)/analytics/` |
| Mobile-ready API architecture | API Layer | `src/app/api/`, `ml-service/` |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui |
| Database | PostgreSQL + pgvector (Supabase) |
| Auth | Supabase Auth with role-based claims |
| ML Models | ArcFace (facenet-pytorch), Sentence-BERT (sentence-transformers) |
| ML Service | FastAPI (Python), deployed on Hugging Face Spaces |
| Frontend Hosting | Vercel |
| Vector Search | pgvector HNSW indexes for cosine similarity |
| Visualization | Recharts, @nivo/heatmap, react-force-graph-2d |

---

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account (free tier)
- Git

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd MajorProject

# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# Run database migrations
# (Apply the SQL files in supabase/migrations/ via Supabase SQL Editor)

# Start development server
npm run dev
```

### Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `ML_SERVICE_URL` | FastAPI ML service URL (HF Spaces) |

---

## Project Structure

```
MajorProject/
├── src/
│   ├── app/
│   │   ├── (auth)/              # Login page
│   │   ├── (dashboard)/         # Protected dashboard routes
│   │   │   ├── overview/        # Main dashboard
│   │   │   ├── suspects/        # Suspect management (CRUD + detail)
│   │   │   ├── cases/           # Case management
│   │   │   ├── firs/            # FIR management
│   │   │   ├── matching/        # Face matching + Case linking
│   │   │   ├── analytics/       # Network graph, heatmap, evaluation
│   │   │   ├── audit/           # Audit log viewer
│   │   │   └── settings/        # System settings (admin)
│   │   └── api/                 # API route handlers
│   ├── components/
│   │   ├── layout/              # Sidebar, TopBar, Banner
│   │   └── ui/                  # shadcn/ui components
│   ├── lib/
│   │   ├── supabase/            # Supabase client utilities
│   │   └── ml/                  # ML service abstraction
│   └── types/                   # TypeScript type definitions
├── supabase/
│   └── migrations/              # PostgreSQL schema + RLS + functions
├── ml-service/                  # FastAPI ML inference service
├── data-pipeline/               # Synthetic data generation scripts
├── scripts/                     # Seed scripts
└── public/                      # Static assets
```

---

## Data Ethics Statement

This system uses **exclusively synthetic data** for all demonstrations and evaluations:

- **Face images**: Sourced from the LFW (Labeled Faces in the Wild) public benchmark dataset, relabeled with synthetic identities using the Faker library
- **FIR narratives**: Generated programmatically with controlled near-duplicate MO clusters for algorithm testing
- **No real criminal records**, identity documents, or personal data are used
- **No integration** with live law enforcement databases (CCTNS or equivalent)

All data generation scripts and methodology are documented in `data-pipeline/README.md`.

---

## License

This project is developed for academic purposes as part of the B.Tech curriculum at RCOEM, Nagpur. Not intended for production deployment in law enforcement systems.
