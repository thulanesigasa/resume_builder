from supabase import create_client, Client
from src.config import SUPABASE_URL, SUPABASE_KEY, SUPABASE_SERVICE_ROLE_KEY
from src.utils.logger import logger
import streamlit as st

supabase_client: Client = None

# Prefer service_role_key if available to bypass RLS for backend operations
ACTIVE_SUPABASE_KEY = SUPABASE_SERVICE_ROLE_KEY if SUPABASE_SERVICE_ROLE_KEY else SUPABASE_KEY

if SUPABASE_URL and ACTIVE_SUPABASE_KEY:
    try:
        supabase_client = create_client(SUPABASE_URL, ACTIVE_SUPABASE_KEY)
        logger.info("Global Supabase client successfully initialized.")
    except Exception as e:
        logger.error(f"Failed to initialize global Supabase client: {e}")
else:
    logger.warning("Supabase credentials not configured. Database & Storage operations will fail.")

def get_supabase_client() -> Client:
    # Check if we are running inside streamlit and can use session_state to prevent multi-session auth leaking
    try:
        # st.session_state is only accessible in active Streamlit sessions
        if "supabase" not in st.session_state:
            if SUPABASE_URL and ACTIVE_SUPABASE_KEY:
                st.session_state.supabase = create_client(SUPABASE_URL, ACTIVE_SUPABASE_KEY)
                logger.info("Session-specific Supabase client initialized.")
            else:
                return None
        return st.session_state.supabase
    except Exception:
        # Standalone script/fallback mode (no active Streamlit context)
        global supabase_client
        if not supabase_client and SUPABASE_URL and ACTIVE_SUPABASE_KEY:
            try:
                supabase_client = create_client(SUPABASE_URL, ACTIVE_SUPABASE_KEY)
            except Exception as e:
                logger.error(f"Failed to initialize fallback Supabase client: {e}")
        return supabase_client
