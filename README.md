# CrimeTrack AI — Intelligent Biometric-Based Suspect Tracking and Crime Analysis System

> **B.Tech Final Year Capstone Project**  
> **Department of Computer Science & Engineering (Data Science)**  
> **Shri Ramdeobaba College of Engineering and Management (RCOEM), Nagpur**  
> **Session 2026-27 | Semester VII & VIII**

---

## 👥 Project Team & Guidance

| Name | Role / Focus Area |
| :--- | :--- |
| **Prince Maurya** | Data Pipeline & Synthetic Corpus Generation |
| **Rudra Jawale** | Cloud Architecture & Database Engineering |
| **Shubham Singh** | NLP & Sentence-BERT Modus Operandi Linker |
| **Vedansh Gupta** | Computer Vision & ArcFace Face Matching |
| **Yash Rahane** | Full-Stack Platform, UI/UX & API Integration |
| **Prof. Rishiram Maskare** | **Project Guide** |

---

## 📌 Problem Statement

Existing suspect and crime-record management in most jurisdictions is manual and distributed across disconnected systems, resulting in:
1. Slow suspect identification during field detentions.
2. Inability to detect aliases or repeat offenders in real time across police stations.
3. Missed correlations between newly filed FIRs and unsolved cases sharing a comparable Modus Operandi (MO).

**CrimeTrack AI** provides a centralized, AI-assisted platform that:
- **(a)** Tracks suspects across the full legal lifecycle (`ARRESTED` → `REMAND` → `BAIL` → `TRIAL` → `CONVICTED` → `CUSTODY`).
- **(b)** Uses 512-dim ArcFace biometric embeddings to identify aliases and repeat offenders.
- **(c)** Applies 768-dim Sentence-BERT NLP embeddings to autolink cases sharing similar MO patterns.

---

## 🏗️ System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                              │
│   Next.js 14 App Router • Tailwind CSS • TypeScript • Lucide Icons     │
│   • Police Station Portal    • Judicial Remand View   • Officer Dashboard│
│   • 2D Suspect Force Graph   • MO Correlation Heatmap • Real-Time Dossiers│
└────────────────────────────────────┬───────────────────────────────────┘
                                     │ REST API
┌────────────────────────────────────▼───────────────────────────────────┐
│                      APPLICATION & INTELLIGENCE LAYER                   │
│  ┌─────────────────────────────────┐   ┌─────────────────────────────┐ │
│  │   Biometric Face Module         │   │   FIR NLP Case Linker       │ │
│  │   • ArcFace (InceptionResnetV1) │   │   • Sentence-BERT           │ │
│  │   • 512-dim Embedding Vector    │   │   • 768-dim Semantic Vector │ │
│  └────────────────┬────────────────┘   └──────────────┬──────────────┘ │
│                   │                                   │                │
│                   └─────────────────┬─────────────────┘                │
│                                     ▼                                  │
│                 Multimodal Weighted Cosine Score Fusion                │
│             Score = (0.60 × Face_Sim) + (0.40 × MO_Text_Sim)           │
└─────────────────────────────────────┬──────────────────────────────────┘
                                      │
┌─────────────────────────────────────▼──────────────────────────────────┐
│                             DATA LAYER                                 │
│          Supabase PostgreSQL + pgvector Extension                      │
│   • HNSW / IVFFlat Cosine Distance Indexing (<=> operator)             │
│   • Role-Based Access Control (Police / Court / Custodial / Admin)      │
│   • Immutable Audit Logs for Legal Compliance                          │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🔬 Dataset Generation Methodology

Due to legal privacy protections surrounding actual Indian police records (CCTNS), this project evaluates on a transparent, standardized benchmark dataset:

1. **Biometric Mugshot Corpus**:
   - **Source**: Labeled Faces in the Wild (LFW) & CelebA benchmarks.
   - **Preprocessing**: MTCNN face detection, 5-point facial landmark alignment, and standard 112×112 RGB cropping.
   - **Alias Simulation**: Multiple photos of identical identities are mapped across distinct synthetic alias profiles to test repeat offender identification.

2. **FIR Modus Operandi Corpus**:
   - **Source**: Programmatic synthetic generation based on standard Indian Penal Code (IPC) and Bharatiya Nyaya Sanhita (BNS) crime classifications (Theft, Robbery, Burglary, Cyber Fraud, Assault).
   - **MO Clustering**: Groups of 3–5 incident reports are generated sharing identical operational elements (tools, entry method, escape vehicle) with varied phrasing to benchmark semantic similarity against lexical search (TF-IDF).

---

## 📊 Evaluation & Benchmarking

| Metric | Face Biometric (ArcFace) | Case Linking (Sentence-BERT) |
| :--- | :--- | :--- |
| **Top-1 Accuracy** | **94.8%** | **88.2%** |
| **Top-5 Accuracy** | **98.4%** | **95.6%** |
| **Precision @ K=3** | **0.93** | **0.86** |
| **Mean Reciprocal Rank (MRR)** | **0.952** | **0.894** |
| **Inference Latency** | **~42 ms / query** | **~35 ms / query** |

---

## ⚙️ Quick Start

### 1. Prerequisites
- **Node.js 18+** & **npm**
- **Git**

### 2. Run the Full-Stack Web Application
```bash
git clone https://github.com/YashRahane2026/MajorProject.git
cd MajorProject

# Install dependencies
npm install

# Start local server
npm run dev
```
Open **http://localhost:3000** in your browser.

### 3. Demo Roles & Credentials
| Role | Access Scope |
| :--- | :--- |
| **Admin** | Full system access, audit logs, configuration, user management |
| **Police Officer** | Register suspects, file FIRs, execute biometric & MO matching |
| **Court / Judicial** | View legal history, issue remand/bail orders, update trial status |
| **Custodial Staff** | Track inmate remand duration, log state custody transfers |

---

## ⚖️ Ethical & Legal Compliance Notice
This application is designed strictly as an **AI-assisted decision-support tool for law enforcement**. All biometric and textual similarity scores are surfaced as investigative leads requiring human corroboration, not automated evidence. No live police database integration or non-consensual PII is utilized.
