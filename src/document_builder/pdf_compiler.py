import os
import datetime
import pdfkit
import re
import tempfile
from src.config import SUPABASE_BUCKET
from src.supabase_client import get_supabase_client
from src.utils.logger import logger

def create_application_folder_name(company: str, job_title: str) -> str:
    """
    Generates a folder name formatted as [Company_Job_Title_Date]
    """
    date_str = datetime.datetime.now().strftime("%Y-%m-%d")
    
    # Clean strings to be file-system safe
    safe_company = "".join([c for c in company if c.isalnum() or c.isspace()]).strip().replace(" ", "_")
    safe_title = "".join([c for c in job_title if c.isalnum() or c.isspace()]).strip().replace(" ", "_")
    
    if not safe_company:
        safe_company = "Company"
    if not safe_title:
        safe_title = "Role"
        
    return f"[{safe_company}_{safe_title}_{date_str}]"

def compile_to_pdf(html_content: str, folder_name: str, file_name: str, user_id: str = None) -> str:
    """
    Converts rendered HTML into an ATS-friendly PDF.
    Saves the PDF temporarily, uploads it to Supabase Storage, and returns a signed download URL.
    """
    logger.info(f"Generating PDF: {file_name}...")
    
    # pdfkit options to ensure clean, ATS-readable text
    options = {
        'page-size': 'A4',
        'margin-top': '0in',
        'margin-right': '0in',
        'margin-bottom': '0in',
        'margin-left': '0in',
        'encoding': 'UTF-8',
        'no-outline': None,
        'disable-smart-shrinking': '',
        'disable-javascript': ''         # SECURITY: Prevents SSRF/XSS execution inside the PDF engine
    }
    
    # Configure pdfkit to point directly to the Windows binary if it exists
    config = None
    windows_path = r"C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe"
    if os.path.exists(windows_path):
        config = pdfkit.configuration(wkhtmltopdf=windows_path)
        # Enable local file access on Windows for local templates
        options['enable-local-file-access'] = ''
    
    # Use python's tempfile to prevent local file persistence
    with tempfile.TemporaryDirectory() as tmpdir:
        temp_output_path = os.path.join(tmpdir, file_name)
        
        try:
            if config:
                pdfkit.from_string(html_content, temp_output_path, options=options, configuration=config)
            else:
                pdfkit.from_string(html_content, temp_output_path, options=options)
                
            logger.info(f"Successfully compiled PDF temporarily at: {temp_output_path}")
            
            # Read compiled file bytes
            with open(temp_output_path, "rb") as f:
                file_bytes = f.read()
                
            # Connect to Supabase
            supabase = get_supabase_client()
            if not supabase:
                logger.error("Supabase client is not available. PDF saved temporarily but cannot be uploaded.")
                return ""
                
            # Create a path inside the storage bucket: user_id/[Company_Title_Date]/filename.pdf
            owner_folder = user_id if user_id else "anonymous"
            storage_path = f"{owner_folder}/{folder_name}/{file_name}"
            
            logger.info(f"Uploading PDF to Supabase Storage at: {storage_path}...")
            
            # Upload to bucket
            supabase.storage.from_(SUPABASE_BUCKET).upload(
                path=storage_path,
                file=file_bytes,
                file_options={"content-type": "application/pdf", "x-upsert": "true"}
            )
            
            logger.info("PDF successfully uploaded to Supabase Storage.")
            
            # Generate a signed URL for the user to download the file (valid for 2 hours)
            signed_url_res = supabase.storage.from_(SUPABASE_BUCKET).create_signed_url(storage_path, 7200)
            
            signed_url = None
            if isinstance(signed_url_res, dict):
                signed_url = signed_url_res.get("signedURL") or signed_url_res.get("url")
            else:
                try:
                    signed_url = signed_url_res.get("signedURL")
                except Exception:
                    signed_url = getattr(signed_url_res, "signed_url", None) or getattr(signed_url_res, "url", None)
            
            if signed_url:
                logger.info(f"Signed URL generated successfully.")
                return signed_url
            else:
                logger.error(f"Failed to parse signed URL from response: {signed_url_res}")
                return ""
                
        except Exception as e:
            logger.error(f"Failed to generate/upload PDF: {e}")
            return ""
