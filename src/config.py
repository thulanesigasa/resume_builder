import os
from dotenv import load_dotenv

load_dotenv()

# OpenAI AI Model Configuration
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_MODEL_NAME = os.getenv("OPENAI_MODEL_NAME", "gpt-4o-mini")
TEMPERATURE = float(os.getenv("TEMPERATURE", "0.2"))

# Supabase Database & Storage Configuration
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")
SUPABASE_BUCKET = os.getenv("SUPABASE_BUCKET", "resumes")

# Web Scraping Configuration (ZenRows / Scrape.do or manual fallback)
SCRAPING_API_KEY = os.getenv("SCRAPING_API_KEY", "")

# Directory Paths (used as fallback or for template rendering)
TEMPLATES_DIR = os.getenv("TEMPLATES_DIR", "templates")
LOGS_DIR = os.getenv("LOGS_DIR", "logs")

