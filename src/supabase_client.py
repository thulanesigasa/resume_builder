import httpx
import warnings

# Suppress SSL verification warnings
warnings.filterwarnings("ignore", message="Unverified HTTPS request")
warnings.filterwarnings("ignore", category=UserWarning)

# Monkeypatch httpx Client & AsyncClient to bypass certificate verification (e.g. for corporate proxies/Zscaler)
original_client_init = httpx.Client.__init__
def patched_client_init(self, *args, **kwargs):
    kwargs['verify'] = False
    original_client_init(self, *args, **kwargs)
httpx.Client.__init__ = patched_client_init

original_async_init = httpx.AsyncClient.__init__
def patched_async_init(self, *args, **kwargs):
    kwargs['verify'] = False
    original_async_init(self, *args, **kwargs)
httpx.AsyncClient.__init__ = patched_async_init

from supabase import create_client, Client
from src.config import SUPABASE_URL, SUPABASE_KEY, SUPABASE_SERVICE_ROLE_KEY
from src.utils.logger import logger

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
    """
    Returns a stateless, global Supabase client instance suitable for FastAPI.
    """
    global supabase_client
    if not supabase_client and SUPABASE_URL and ACTIVE_SUPABASE_KEY:
        try:
            supabase_client = create_client(SUPABASE_URL, ACTIVE_SUPABASE_KEY)
        except Exception as e:
            logger.error(f"Failed to initialize fallback Supabase client: {e}")
    return supabase_client
