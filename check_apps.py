import os
import sys

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from src.supabase_client import get_supabase_client

supabase = get_supabase_client()
res = supabase.table("applications").select("*").limit(1).execute()
print(res.data)
