import json
import io
import time
import os
import hashlib
import urllib.parse
import pdfplumber
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Body, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional, List

from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from src.scraper.job_link_reader import get_job_description
from src.scraper.requirement_analyzer import analyze_requirements
from src.supabase_client import get_supabase_client
from src.ai_engine.openai_client import generate_document, extract_job_metadata, extract_text_from_pdf_ocr
from src.ai_engine.ats_scorer import calculate_ats_score
from src.document_builder.json_to_html_injector import inject_json_to_html
from src.document_builder.pdf_compiler import compile_to_pdf, create_application_folder_name
from src.utils.logger import logger

security = HTTPBearer()

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        supabase = get_supabase_client()
        user_response = supabase.auth.get_user(token)
        if not user_response or not user_response.user:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_response.user
    except Exception as e:
        logger.error(f"Auth error: {e}")
        raise HTTPException(status_code=401, detail="Invalid or expired token")

app = FastAPI(title="AI Resume Builder API", description="FastAPI Backend serving AI Tailoring and PDF Compilers")

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        logger.info(f"Incoming Request: {request.method} {request.url.path}")
        response = await call_next(request)
        process_time = (time.time() - start_time) * 1000
        logger.info(f"Response: {response.status_code} | Time: {process_time:.2f}ms | Path: {request.url.path}")
        return response

app.add_middleware(LoggingMiddleware)

# Configure CORS for decoupled frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Safe to use * since allow_credentials is False
    allow_credentials=False, # We use Authorization headers, not cookies
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic request models
class ScrapeRequest(BaseModel):
    url: str

class GenerateRequest(BaseModel):
    job_description: str
    personal_data: str
    doc_type: str  # 'resume', 'general_resume', or 'cover_letter'
    custom_instructions: Optional[str] = ""

class AtsScoreRequest(BaseModel):
    job_description: str
    resume_json: Dict[str, Any]

class CompileRequest(BaseModel):
    json_data: Dict[str, Any]
    template_name: str
    company_name: str
    job_title: str
    user_id: str
    doc_type: str  # 'resume' or 'cover_letter'

class CompileMasterCvRequest(BaseModel):
    user_id: str
    raw_text: str

@app.get("/api/health")
@limiter.limit("60/minute")
def health_check(request: Request):
    return {"status": "healthy", "service": "resume-builder-api"}

@app.api_route("/", methods=["GET", "HEAD"])
def root_check():
    return {"status": "active", "message": "AI Resume Builder API is online"}

@app.post("/api/compile-master-cv")
@limiter.limit("10/minute")
async def compile_master_cv(payload: CompileMasterCvRequest, request: Request, user: dict = Depends(verify_token)):
    logger.info(f"API Compile Master CV request received for user: {payload.user_id}")
    try:
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Master CV</title>
            <style>
                body {{
                    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                    padding: 50px;
                    color: #112c71;
                    line-height: 1.6;
                    background-color: #ffffff;
                }}
                h1 {{
                    font-size: 28px;
                    border-bottom: 2px solid #112c71;
                    padding-bottom: 15px;
                    margin-bottom: 30px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }}
                pre {{
                    white-space: pre-wrap;
                    word-wrap: break-word;
                    font-size: 14px;
                    font-family: inherit;
                }}
            </style>
        </head>
        <body>
            <h1>Master Curriculum Vitae</h1>
            <pre>{payload.raw_text}</pre>
        </body>
        </html>
        """
        # Save it to user_id/master_cv/Master_CV.pdf
        download_url = compile_to_pdf(html_content, "master_cv", "Master_CV.pdf", user_id=payload.user_id)
        if not download_url:
            raise HTTPException(status_code=500, detail="Failed to compile or upload Master CV PDF")
        return {"download_url": download_url}
    except Exception as e:
        logger.error(f"Error compiling Master CV: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/scrape")
@limiter.limit("30/minute")
async def scrape_job(payload: ScrapeRequest, request: Request, user: dict = Depends(verify_token)):
    logger.info(f"API Scrape request received for URL: {payload.url}")
    try:
        desc = get_job_description(payload.url)
        if not desc or not desc.strip():
            from src.config import SCRAPING_API_KEY
            detail_msg = "Failed to retrieve job description from URL."
            if not SCRAPING_API_KEY:
                detail_msg += " This job board likely uses Cloudflare/anti-bot protection. Please configure a valid SCRAPING_API_KEY in your .env file to bypass these checks."
            raise HTTPException(status_code=400, detail=detail_msg)
        
        # Also extract basic metadata if possible
        metadata = extract_job_metadata(desc)
        requirements = analyze_requirements(desc)
        
        return {
            "job_description": desc,
            "company_name": metadata.get("company_name", "Unknown Company"),
            "job_title": metadata.get("job_title", "Unknown Position"),
            "required_skills": metadata.get("required_skills", []),
            "requirements": requirements
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error scraping job URL: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate")
@limiter.limit("10/minute")
async def generate_doc(payload: GenerateRequest, request: Request, user: dict = Depends(verify_token)):
    logger.info(f"API Generate request received for doc_type: {payload.doc_type}")
    
    supabase = get_supabase_client()
    if not supabase:
        raise HTTPException(status_code=500, detail="Database not configured")

    # 1. Check if user has enough credits
    try:
        profile_res = supabase.table("profiles").select("credits").eq("id", user.id).execute()
        current_credits = profile_res.data[0].get("credits", 0) if profile_res.data else 0
        
        if current_credits <= 0:
            raise HTTPException(status_code=402, detail="INSUFFICIENT_CREDITS")
            
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error checking user credits: {e}")
        raise HTTPException(status_code=500, detail="Failed to verify account balance")

    # 2. Run the heavy AI generation
    try:
        data_dict = generate_document(
            payload.job_description,
            payload.personal_data,
            payload.doc_type,
            payload.custom_instructions
        )
        if not data_dict:
            raise HTTPException(status_code=500, detail="AI generation failed or failed to parse JSON response")
            
        # 3. Deduct credit after successful generation
        supabase.table("profiles").update({
            "credits": current_credits - 1
        }).eq("id", user.id).execute()
        
        logger.info(f"Successfully deducted 1 credit from user {user.id}. Remaining: {current_credits - 1}")
        
        return data_dict
    except Exception as e:
        logger.error(f"Error in document generation API: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ats-score")
@limiter.limit("20/minute")
async def get_ats_score(payload: AtsScoreRequest, request: Request, user: dict = Depends(verify_token)):
    logger.info("API ATS scoring request received")
    try:
        score_res = calculate_ats_score(payload.job_description, payload.resume_json)
        return score_res
    except Exception as e:
        logger.error(f"Error calculating ATS score: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/compile")
@limiter.limit("20/minute")
async def compile_document(payload: CompileRequest, request: Request, user: dict = Depends(verify_token)):
    logger.info(f"API Compile request received for: {payload.doc_type}")
    try:
        # Create folder name
        folder_name = create_application_folder_name(payload.company_name, payload.job_title)
        
        # Inject JSON into HTML
        html_content = inject_json_to_html(payload.json_data, payload.template_name)
        if not html_content:
            raise HTTPException(status_code=500, detail="Failed to inject JSON into template HTML")
        
        # File name
        if payload.doc_type == "resume":
            filename = f"Resume_{payload.company_name.replace(' ', '_')}.pdf"
        else:
            filename = f"CoverLetter_{payload.company_name.replace(' ', '_')}.pdf"
            
        # Compile PDF and upload to Supabase storage
        download_url = compile_to_pdf(html_content, folder_name, filename, user_id=payload.user_id)
        if not download_url:
            raise HTTPException(status_code=500, detail="Failed to compile or upload PDF")
            
        return {"download_url": download_url}
    except Exception as e:
        logger.error(f"Error compiling document: {e}")
        raise HTTPException(status_code=500, detail=str(e))

class PreviewRequest(BaseModel):
    json_data: dict
    template_name: str

@app.post("/api/preview-html")
@limiter.limit("30/minute")
async def preview_html(payload: PreviewRequest, request: Request, user: dict = Depends(verify_token)):
    logger.info(f"API Preview HTML request received for: {payload.template_name}")
    try:
        html_content = inject_json_to_html(payload.json_data, payload.template_name)
        if not html_content:
            raise HTTPException(status_code=500, detail="Failed to inject JSON into template HTML")
        return {"html_content": html_content}
    except Exception as e:
        logger.error(f"Error previewing document: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/parse-cv")
@limiter.limit("20/minute")
async def parse_cv(request: Request, file: UploadFile = File(...), user_id: str = Form(...), user: dict = Depends(verify_token)):
    logger.info(f"API Parse CV PDF request received from user_id: {user_id}")
    try:
        pdf_bytes = await file.read()
        extracted_text = ""
        
        # Try standard extraction first
        try:
            with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
                extracted_text = "\n".join([page.extract_text() for page in pdf.pages if page.extract_text()])
        except Exception as e:
            logger.warning(f"Standard PDF parser failed: {e}")
            
        # Fallback to OCR if standard text is empty
        if not extracted_text.strip():
            logger.info("Standard parsing empty, invoking OCR fallback...")
            extracted_text = extract_text_from_pdf_ocr(pdf_bytes)
            
        if not extracted_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from the PDF. Ensure it is not empty or corrupted.")
            
        # Note: Do not automatically save to profiles here. The frontend decides what to do with the extracted text.
                
        return {"extracted_text": extracted_text.strip()}
    except Exception as e:
        logger.error(f"Error parsing CV PDF: {e}")
        raise HTTPException(status_code=500, detail=str(e))

class AutoNameRequest(BaseModel):
    extracted_text: str

@app.post("/api/documents/auto-name")
@limiter.limit("20/minute")
async def auto_name_document(payload: AutoNameRequest, request: Request, user: dict = Depends(verify_token)):
    logger.info(f"API Auto-name document request received from user: {user.id}")
    try:
        if not payload.extracted_text.strip():
            return {"name": "Blank Document"}
            
        from src.ai_engine.openai_client import generate_document_name
        ai_name = generate_document_name(payload.extracted_text)
        return {"name": ai_name}
    except Exception as e:
        logger.error(f"Error auto-naming document: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# =========================================================
# PAYFAST INTEGRATION
# =========================================================

PAYFAST_MERCHANT_ID = os.getenv("PAYFAST_MERCHANT_ID", "10000100").strip()
PAYFAST_MERCHANT_KEY = os.getenv("PAYFAST_MERCHANT_KEY", "46f0cd694581a").strip()
PAYFAST_PASSPHRASE = os.getenv("PAYFAST_PASSPHRASE", "").strip()
PAYFAST_TEST_MODE = os.getenv("PAYFAST_TEST_MODE", "true").strip().lower() == "true"

if PAYFAST_TEST_MODE and (not PAYFAST_MERCHANT_ID.startswith("100") or PAYFAST_MERCHANT_ID == "10000100"):
    logger.info("PAYFAST_TEST_MODE is true. Using default Sandbox credentials (10000100) and passphrase.")
    PAYFAST_MERCHANT_ID = "10000100"
    PAYFAST_MERCHANT_KEY = "46f0cd694581a"
    PAYFAST_PASSPHRASE = "jt7NOE43FZPn"

def generate_payfast_signature(data: dict, passphrase: str = None):
    # PayFast requires fields in the EXACT ORDER they appear — do NOT sort
    # Also skip any empty-string values
    filtered = {k: v for k, v in data.items() if v != ""}
    pf_string = urllib.parse.urlencode(filtered)
    if passphrase:
        pf_string += f"&passphrase={urllib.parse.quote_plus(passphrase)}"
    logger.info(f"[PayFast] Signature string: {pf_string}")
    return hashlib.md5(pf_string.encode('utf-8')).hexdigest()

class CheckoutRequest(BaseModel):
    plan_name: str
    amount: float

@app.post("/api/payfast/create-checkout")
@limiter.limit("10/minute")
async def create_payfast_checkout(payload: CheckoutRequest, request: Request, user: dict = Depends(verify_token)):
    logger.info(f"API PayFast checkout request received for user: {user.id}")
    try:
        supabase = get_supabase_client()
        if not supabase:
            raise HTTPException(status_code=500, detail="Database not configured")

        profile_res = supabase.table("profiles").select("*").eq("id", user.id).execute()
        profile = profile_res.data[0] if profile_res.data else {}

        name_first = profile.get("first_name", "") or user.user_metadata.get("first_name", "User") if hasattr(user, 'user_metadata') and user.user_metadata else profile.get("first_name", "User")
        name_last = profile.get("last_name", "") or user.user_metadata.get("last_name", "") if hasattr(user, 'user_metadata') and user.user_metadata else profile.get("last_name", "")
        email_address = user.email if hasattr(user, 'email') else "unknown@example.com"

        import uuid
        m_payment_id = uuid.uuid4().hex  # 32-char alphanumeric, no hyphens (PayFast requirement)

        # Create an order in DB
        order_insert = supabase.table("payfast_orders").insert({
            "user_id": user.id,
            "m_payment_id": m_payment_id,
            "amount_gross": payload.amount,
            "item_name": payload.plan_name,
            "status": "PENDING"
        }).execute()
        


        base_url = os.getenv("NEXT_PUBLIC_APP_URL", "https://rbptech.co.za")
        
        # Sanitise item_name: PayFast only allows alphanumeric + spaces + hyphens
        safe_item_name = payload.plan_name.replace("&", "and").replace("  ", " ").strip()

        # Build pf_data in the exact order PayFast expects
        pf_data = {
            "merchant_id": PAYFAST_MERCHANT_ID,
            "merchant_key": PAYFAST_MERCHANT_KEY,
            "return_url": f"{base_url}/dashboard?checkout_success=true",
            "cancel_url": f"{base_url}/dashboard?checkout_cancel=true",
            "notify_url": "https://rbptech-backend.onrender.com/api/payfast/itn",
            "name_first": name_first,
            "name_last": name_last if name_last else "",
            "email_address": email_address,
            "m_payment_id": m_payment_id,
            "amount": f"{payload.amount:.2f}",
            "item_name": safe_item_name,
        }

        # Sign BEFORE adding signature key
        signature = generate_payfast_signature(pf_data, PAYFAST_PASSPHRASE if PAYFAST_PASSPHRASE else None)
        pf_data["signature"] = signature

        payfast_url = "https://sandbox.payfast.co.za/eng/process" if PAYFAST_TEST_MODE else "https://www.payfast.co.za/eng/process"
        logger.info(f"PayFast mode: {'SANDBOX' if PAYFAST_TEST_MODE else 'LIVE'}, URL: {payfast_url}")

        return {
            "payfast_url": payfast_url,
            "form_fields": pf_data
        }

    except Exception as e:
        logger.error(f"Error creating PayFast checkout: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/payfast/itn")
async def payfast_itn(request: Request):
    try:
        form_data = await request.form()
        pf_dict = dict(form_data)
        
        logger.info(f"Received ITN from PayFast: {pf_dict}")
        
        received_signature = pf_dict.pop("signature", None)
        calculated_signature = generate_payfast_signature(pf_dict, PAYFAST_PASSPHRASE)
        
        if received_signature != calculated_signature:
            logger.error("Invalid ITN signature")
            raise HTTPException(status_code=400, detail="Invalid signature")
            
        m_payment_id = pf_dict.get("m_payment_id")
        payment_status = pf_dict.get("payment_status")
        pf_payment_id = pf_dict.get("pf_payment_id")
        
        supabase = get_supabase_client()
        if not supabase:
            raise HTTPException(status_code=500, detail="Database not configured")

        if payment_status == "COMPLETE":
            order_res = supabase.table("payfast_orders").update({
                "status": "COMPLETE",
                "pf_payment_id": pf_payment_id
            }).eq("m_payment_id", m_payment_id).eq("status", "PENDING").execute()
            
            if order_res.data:
                order = order_res.data[0]
                user_id = order["user_id"]
                
                # Assign credits based on plan
                credits_to_add = 1
                if "combo" in order["item_name"].lower():
                    credits_to_add = 2
                elif "batch" in order["item_name"].lower():
                    # calculate roughly from amount
                    amt = float(order["amount_gross"])
                    credits_to_add = int(amt / 15) # Approx logic for batches
                
                profile_res = supabase.table("profiles").select("credits").eq("id", user_id).execute()
                current_credits = profile_res.data[0].get("credits", 0) if profile_res.data else 0
                
                from datetime import datetime, timezone
                supabase.table("profiles").upsert({
                    "id": user_id,
                    "credits": current_credits + credits_to_add,
                    "updated_at": datetime.now(timezone.utc).isoformat()
                }).execute()
                
                logger.info(f"Successfully processed ITN for order {m_payment_id}, added {credits_to_add} credits.")
        
        return "OK"
    except Exception as e:
        logger.error(f"Error processing PayFast ITN: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
