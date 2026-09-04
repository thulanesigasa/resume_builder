# 📄 rbptech - Next-Gen AI Resume Compiler

A modern, cloud-native, multi-tenant AI-driven SaaS application built with **Next.js (App Router)**, **FastAPI**, **Supabase**, and **OpenAI**. It generates highly tailored, ATS-friendly Resumes and Cover Letters based on target job descriptions to bypass automated screening filters.

Featuring a premium **Editorial Typography & Glassmorphic UI**, this project is stateless, secure, and built for scale.

---

## ✨ Features

- **Next-Gen AI Compiler:** Our proprietary AI engine (powered by `gpt-4o-mini`) scans target job descriptions and aligns your background seamlessly to the requirements, rewriting bullet points for maximum semantic impact.
- **Interactive Resume Builder:** Step-by-step interactive resume creator with AI summary options, bullet rephrasing, and structured certificate management (Certificate Name, Issuing Institution, and Date Received / Expiry).
- **ATS-Optimized Architecture:** Server-side compiled PDFs ensure 100% readability by Greenhouse, Workday, Taleo, and other enterprise systems.
- **Single Job Tailor & Batch Autopilot (Under Construction):** Single job URL scraper and bulk background autopilot modes are under active maintenance for upgraded ATS compatibility. Users are seamlessly guided to the Interactive Resume Builder.
- **Premium User Experience:** Built on Next.js App Router with smooth layout transitions, stunning typography-led editorial bento grids, and high-end animations.
- **Secure Architecture:** JWT authentication via Supabase, API validation with Pydantic, and strict role-based data isolation.
- **10+ Professional Templates:** Includes Standard ATS, UI/UX Pro Max, Amy Stein, Ava Martinez, David Turner, Base Blueprint, Noma Clean, Note Serif, Page Minimalist, and Corporate IT Support Pro (`corporate_it_support_resume.html`).
- **Floating Scroll Navigation:** Seamless floating scroll-to-top and scroll-to-bottom buttons for fast document navigation across all application views.

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
