# 📄 AI-Powered SaaS Resume Builder

A modern, cloud-native, multi-tenant AI-driven SaaS application built with Streamlit, Supabase, and OpenAI. It generates highly tailored, ATS-friendly Resumes and Cover Letters based on Job Description URLs or pasted text.

Featuring a premium **OLED-optimized Cyber-Amethyst & Glassmorphic UI**, this project is stateless, secure, and ready for deployment to cloud platforms like Render.

---

## ✨ Features

- **Centered Auth UI:** Multi-tenant support with high-end glassmorphism login and signup screens.
- **Master CV Profile:** Edit personal details and upload a master resume PDF to parse and save your background history.
- **Credentials & Certificates:** Upload, store, and manage your certificates. The AI automatically scans these credentials to enhance the context of generated resumes.
- **Advanced Scraping & SSRF Protection:** A lightweight scraping service that routes requests through proxy APIs. Includes hostname IP resolution and validation (RFC 1918 blocking) to prevent Server-Side Request Forgery (SSRF).
- **AI Tailoring Pipeline:** Powered by **OpenAI (`gpt-4o-mini`)** in structured JSON mode for rapid, high-fidelity resume and cover letter content.
- **ATS Match Scorer:** Analyzes the generated resume against job requirements to compute alignment and list missing keywords.
- **Applications History Archive:** Browse and download previously compiled resumes and cover letters in a bento-style card grid, using secure Supabase Storage signed URLs.
- **Batch Auto-Pilot Mode:** Upload a list of job URLs and let the background worker generate resumes and cover letters automatically.
- **Robust Security Safeguards:** Parameterized database calls (SQL injection prevention), automated 15-minute inactivity session endings, and scheme/network level scraper blocks.

---

## 🏗️ Tech Stack & Architecture

- **Frontend:** [Streamlit](https://streamlit.io/) (configured with a Cyber-Amethyst OLED theme).
- **Backend Logic:** Python 3.11+.
- **AI Engine:** [OpenAI API](https://openai.com/) (using `gpt-4o-mini`).
- **Database & Storage:** [Supabase](https://supabase.com/) (PostgreSQL for user profiles/applications, Private Object Storage for compiled PDFs).
- **PDF Compiler:** `pdfkit` + `wkhtmltopdf` (compiling from HTML templates injected with JSON).

---

## 🚀 Quick Start (Local)

### Prerequisites

1. **Python 3.11+**
2. **wkhtmltopdf**: Install on your system and add to your path (required for HTML-to-PDF compilation).
3. **Supabase Account**: A database and private storage bucket.

### Installation

1. **Clone the repository:**
   ```bash
   git clone git@github.com:thulanesigasa/resume_builder.git
   cd resume_builder
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   OPENAI_API_KEY=your-openai-api-key
   OPENAI_MODEL_NAME=gpt-4o-mini
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_KEY=your-supabase-service-role-key-or-anon-key
   SUPABASE_BUCKET=resumes
   SCRAPING_API_KEY=your-optional-scraping-proxy-token
   ```

4. **Initialize Supabase Database:**
   Execute the SQL setup script located in the deployment guides to set up tables, triggers, and Row Level Security (RLS) policies.

5. **Start the application:**
   ```bash
   streamlit run app.py
   ```

---

## 🔐 Database & Storage Policies (Supabase)

### Database Schema (SQL Editor)
Run the following SQL in your Supabase dashboard to create the database architecture:
```sql
-- Profiles Table
create table public.profiles (
  id uuid references auth.users not null primary key,
  raw_info text,
  username text,
  first_name text,
  last_name text,
  phone text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

create policy "Users can view and edit their own profiles"
  on public.profiles for all using (auth.uid() = id);

-- Automate Profile Creation on Signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, first_name, last_name, phone)
  values (
    new.id,
    split_part(new.email, '@', 1),
    coalesce(new.raw_user_metadata->>'first_name', ''),
    coalesce(new.raw_user_metadata->>'last_name', ''),
    coalesce(new.raw_user_metadata->>'phone', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### Storage Bucket Policies
Create a **private** bucket named `resumes` and add the following RLS policies:
```sql
-- Upload Restriction
create policy "Users can upload their own resumes"
  on storage.objects for insert
  with check (bucket_id = 'resumes' and auth.uid()::text = split_part(name, '/', 1));

-- Read Restriction
create policy "Users can read their own resumes"
  on storage.objects for select
  using (bucket_id = 'resumes' and auth.uid()::text = split_part(name, '/', 1));
```

---

## 📂 Directory Structure

```
├── .streamlit/             # Streamlit configuration and theme styling
├── logs/                   # System runtime logs and .gitkeep tracker
├── src/
│   ├── ai_engine/          # OpenAI completion APIs & ATS scorer
│   ├── document_builder/   # Jinja2 injection and PDF compiler
│   ├── scraper/            # HTTP Scraper with proxy routing and SSRF protection
│   ├── utils/              # Application logging utility
│   ├── config.py           # Environment config parsing
│   └── supabase_client.py  # Supabase client connector
├── templates/              # Jinja2 HTML/CSS templates for resumes/cover letters
├── app.py                  # Main SaaS Streamlit Dashboard
└── requirements.txt        # Python dependency manifest
```
