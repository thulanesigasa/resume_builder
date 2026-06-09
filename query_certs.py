import os
import sys

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from src.supabase_client import get_supabase_client

supabase = get_supabase_client()

if not supabase:
    print("Failed to initialize Supabase client")
    sys.exit(1)

res = supabase.table("certificates").select("id, name, user_id").execute()
for cert in res.data:
    print(f"[{cert['user_id']}] {cert['name']} (ID: {cert['id']})")
