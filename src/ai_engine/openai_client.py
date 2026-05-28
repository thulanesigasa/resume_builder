import json
from openai import OpenAI
from src.ai_engine.prompt_templates import RESUME_SYSTEM_PROMPT, COVER_LETTER_SYSTEM_PROMPT, GENERAL_RESUME_SYSTEM_PROMPT
from src.config import OPENAI_API_KEY, OPENAI_MODEL_NAME, TEMPERATURE
from src.utils.logger import logger

# Initialize the OpenAI client
client = None
if OPENAI_API_KEY:
    client = OpenAI(api_key=OPENAI_API_KEY)
else:
    logger.warning("OPENAI_API_KEY is not configured. AI operations will fail.")

def get_client():
    global client
    if not client and OPENAI_API_KEY:
        client = OpenAI(api_key=OPENAI_API_KEY)
    return client

def generate_document(job_description: str, personal_data: str, doc_type: str, custom_instructions: str = "") -> dict:
    """
    Calls OpenAI GPT-4o-mini to generate either a resume or cover letter 
    in strict JSON format based on the provided inputs.
    """
    api_client = get_client()
    if not api_client:
        logger.error("OpenAI client is not initialized. Check your environment variables.")
        return {}

    if doc_type == "resume":
        system_prompt = RESUME_SYSTEM_PROMPT
    elif doc_type == "general_resume":
        system_prompt = GENERAL_RESUME_SYSTEM_PROMPT
    elif doc_type == "cover_letter":
        system_prompt = COVER_LETTER_SYSTEM_PROMPT
    else:
        raise ValueError("doc_type must be 'resume', 'general_resume', or 'cover_letter'")

    if doc_type == "general_resume":
        user_prompt = f"""
        --- USER'S PERSONAL DATA ---
        {personal_data}

        Based on the above, generate a high-quality, comprehensive GENERAL resume following the JSON schema provided in the system instructions.
        """
    else:
        user_prompt = f"""
        --- JOB DESCRIPTION ---
        {job_description}

        --- USER'S PERSONAL DATA ---
        {personal_data}

        Based on the above, generate the ATS-optimized {doc_type} following the JSON schema provided in the system instructions.
        """
    
    if custom_instructions:
        user_prompt += f"\n\n--- CUSTOM INSTRUCTIONS FROM USER ---\n{custom_instructions}\n"

    logger.info(f"Sending request to OpenAI ({OPENAI_MODEL_NAME}) for {doc_type} generation.")
    
    try:
        # Enforce structured JSON output mode using response_format
        response = api_client.chat.completions.create(
            model=OPENAI_MODEL_NAME,
            messages=[
                {'role': 'system', 'content': system_prompt},
                {'role': 'user', 'content': user_prompt}
            ],
            response_format={"type": "json_object"},
            temperature=TEMPERATURE
        )
        
        response_text = response.choices[0].message.content
        
        # Parse the JSON to ensure it's valid before returning
        data_dict = json.loads(response_text)
        logger.info(f"Successfully generated and parsed {doc_type} JSON.")
        return data_dict
        
    except json.JSONDecodeError as e:
        logger.error(f"Model did not return valid JSON. Error: {e}")
        logger.error(f"Raw Output: {response_text}")
        return {}
    except Exception as e:
        logger.error(f"OpenAI communication failed: {e}")
        return {}

def extract_job_metadata(job_description: str) -> dict:
    """
    Extracts the Company Name and Job Title from the job description using OpenAI GPT-4o-mini.
    """
    api_client = get_client()
    if not api_client:
        logger.error("OpenAI client is not initialized.")
        return {"company_name": "Unknown Company", "job_title": "Unknown Position", "required_skills": []}

    system_prompt = """You are an AI assistant. Extract the target 'company_name', 'job_title', and a list of 5-10 'required_skills' from the job description.
    You MUST return your response ENTIRELY as a valid JSON object matching this schema:
    {
        "company_name": "string",
        "job_title": "string",
        "required_skills": ["skill1", "skill2", "skill3"]
    }
    If you cannot find the company name, use 'Unknown Company'. If you cannot find the job title, use 'Unknown Position'.
    """
    
    logger.info("Extracting company name and job title from job description...")
    try:
        response = api_client.chat.completions.create(
            model=OPENAI_MODEL_NAME,
            messages=[
                {'role': 'system', 'content': system_prompt},
                {'role': 'user', 'content': job_description}
            ],
            response_format={"type": "json_object"},
            temperature=TEMPERATURE
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        logger.error(f"Failed to extract metadata: {e}")
        return {"company_name": "Unknown Company", "job_title": "Unknown Position", "required_skills": []}

def extract_text_from_pdf_ocr(pdf_bytes: bytes) -> str:
    """
    Renders PDF pages as images in memory using PyMuPDF (fitz)
    and uses GPT-4o-mini Vision to transcribe the text contents (OCR fallback).
    """
    api_client = get_client()
    if not api_client:
        logger.error("OpenAI client is not initialized.")
        return ""

    import fitz
    import base64

    logger.info("Initiating OpenAI Vision OCR fallback for scanned PDF...")
    try:
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        transcriptions = []

        for page_num in range(len(doc)):
            logger.info(f"OCR scanning page {page_num + 1}/{len(doc)}...")
            page = doc.load_page(page_num)
            pix = page.get_pixmap(dpi=150)
            img_data = pix.tobytes("png")
            
            base64_image = base64.b64encode(img_data).decode('utf-8')
            
            response = api_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": "Transcribe the text of this document page exactly. Output only the transcribed text content. Do not include markdown formatting or chat commentary."},
                            {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{base64_image}"}}
                        ],
                    }
                ],
                max_tokens=1500,
                temperature=0.1
            )
            
            page_text = response.choices[0].message.content
            if page_text:
                transcriptions.append(page_text.strip())
                
        return "\n\n".join(transcriptions)
    except Exception as e:
        logger.error(f"Failed to perform AI Vision OCR: {e}")
        return ""

