# 📄 rbptech - Next-Gen AI Resume Compiler

A modern, cloud-native, multi-tenant AI-driven SaaS application built with **Next.js (App Router)**, **FastAPI**, **Supabase**, and **OpenAI**. It generates highly tailored, ATS-friendly Resumes and Cover Letters based on target job descriptions to bypass automated screening filters.

Featuring a premium **Editorial Typography & Glassmorphic UI**, this project is stateless, secure, and built for scale.

---

## ✨ Features

- **Next-Gen AI Compiler:** Our proprietary AI engine (powered by `gpt-4o-mini`) scans target job descriptions and aligns your background seamlessly to the requirements, rewriting bullet points for maximum semantic impact.
- **Interactive Editor:** Fine-tune layouts instantly with an interactive UI. Complete control over your documents before generating final PDFs.
- **ATS-Optimized Architecture:** Server-side compiled PDFs ensure 100% readability by Greenhouse, Workday, Taleo, and other enterprise systems.
- **Batch Autopilot:** Configure target job parameters and let the system automatically generate up to 50 tailored resumes and cover letters in the background. Includes dynamic bulk discounting tiers.
- **Premium User Experience:** Built on Next.js App Router with smooth layout transitions, stunning typography-led editorial bento grids, and high-end animations.
- **Secure Architecture:** JWT authentication via Supabase, API validation with Pydantic, and strict role-based data isolation.

---

## 🏗️ Tech Stack & Architecture

- **Frontend:** [Next.js 14 (App Router)](https://nextjs.org/) + React 18 + Tailwind CSS.
- **Backend API:** [FastAPI](https://fastapi.tiangolo.com/) (Python 3.11+).
- **AI Engine:** [OpenAI API](https://openai.com/) (using `gpt-4o-mini`).
- **Database, Auth & Storage:** [Supabase](https://supabase.com/) (PostgreSQL + Auth + Private Object Storage).
- **PDF Compiler:** Native server-side HTML-to-PDF compilers for raw ATS text extraction.

---

## 🚀 Quick Start (Local)

### Prerequisites

1. **Node.js 18+** & **npm**
2. **Python 3.11+**
3. **Supabase Account**: A database and private storage bucket.

### Installation

1. **Clone the repository:**
   ```bash
   git clone git@github.com:thulanesigasa/resume_builder.git
   cd resume_builder
   ```

2. **Backend Setup:**
   ```bash
   # Create virtual env
   python -m venv .venv
   source .venv/bin/activate # Windows: .venv\Scripts\activate
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Run the API
   uvicorn api:app --reload --port 8000
   ```

3. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   
   # Run the development server
   npm run dev
   ```

---

## 📜 Legal

By using this software, you agree to the integrated Terms of Service and Privacy Policy. This platform acts as an aid for candidates; rbptech does not guarantee any hiring outcomes or interview placements.

---
*Built to empower the modern candidate.*
