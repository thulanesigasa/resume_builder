import json
import io
import pdfplumber
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Body, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional, List

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

# Configure CORS for decoupled frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the actual frontend domains
    allow_credentials=True,
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
def health_check():
    return {"status": "healthy", "service": "resume-builder-api"}

@app.post("/api/compile-master-cv")
async def compile_master_cv(payload: CompileMasterCvRequest, user: dict = Depends(verify_token)):
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
async def scrape_job(payload: ScrapeRequest, user: dict = Depends(verify_token)):
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
async def generate_doc(payload: GenerateRequest, user: dict = Depends(verify_token)):
    logger.info(f"API Generate request received for doc_type: {payload.doc_type}")
    try:
        data_dict = generate_document(
            payload.job_description,
            payload.personal_data,
            payload.doc_type,
            payload.custom_instructions
        )
        if not data_dict:
            raise HTTPException(status_code=500, detail="AI generation failed or failed to parse JSON response")
        return data_dict
    except Exception as e:
        logger.error(f"Error in document generation API: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ats-score")
async def get_ats_score(payload: AtsScoreRequest, user: dict = Depends(verify_token)):
    logger.info("API ATS scoring request received")
    try:
        score_res = calculate_ats_score(payload.job_description, payload.resume_json)
        return score_res
    except Exception as e:
        logger.error(f"Error calculating ATS score: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/compile")
async def compile_document(payload: CompileRequest, user: dict = Depends(verify_token)):
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
async def preview_html(payload: PreviewRequest, user: dict = Depends(verify_token)):
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
async def parse_cv(file: UploadFile = File(...), user_id: str = Form(...), user: dict = Depends(verify_token)):
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
            
        # We can also save it directly to profiles table via supabase python client
        supabase = get_supabase_client()
        if supabase:
            try:
                supabase.table("profiles").upsert({"id": user_id, "raw_info": extracted_text.strip()}).execute()
                logger.info(f"Successfully upserted parsed CV for user: {user_id}")
            except Exception as se:
                logger.error(f"Failed to upsert to supabase: {se}")
                
        return {"extracted_text": extracted_text.strip()}
    except Exception as e:
        logger.error(f"Error parsing CV PDF: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
