import json
from openai import OpenAI
from src.config import OPENAI_API_KEY, OPENAI_MODEL_NAME, TEMPERATURE
from src.utils.logger import logger

def calculate_ats_score(job_description: str, resume_json: dict) -> dict:
    """
    Analyzes the ATS match between the Job Description and the generated Resume.
    Returns a score from 0-100 and a list of missing keywords.
    """
    if not OPENAI_API_KEY:
        logger.error("OpenAI API key not configured. Cannot calculate ATS score.")
        return {"score": 0, "missing_keywords": []}
        
    client = OpenAI(api_key=OPENAI_API_KEY)
    resume_text = json.dumps(resume_json)
    system_prompt = """You are an expert ATS (Applicant Tracking System) Analyzer.
    Compare the provided Job Description against the provided Resume.
    Calculate a realistic match score from 0 to 100 based on keyword overlap, experience, and requirement fulfillment.
    Identify up to 5 critical keywords, tools, or skills present in the Job Description that are MISSING or poorly represented in the Resume.
    
    You MUST return your response ENTIRELY as a valid JSON object matching this schema:
    {
        "score": 85,
        "missing_keywords": ["skill1", "skill2"]
    }
    """
    
    logger.info("Calculating ATS match score...")
    try:
        response = client.chat.completions.create(
            model=OPENAI_MODEL_NAME,
            messages=[
                {'role': 'system', 'content': system_prompt},
                {'role': 'user', 'content': f"--- JOB DESCRIPTION ---\n{job_description}\n\n--- RESUME ---\n{resume_text}"}
            ],
            response_format={"type": "json_object"},
            temperature=TEMPERATURE
        )
        data = json.loads(response.choices[0].message.content)
        
        # Ensure fallback types
        score = data.get("score", 0)
        missing = data.get("missing_keywords", [])
        return {"score": int(score), "missing_keywords": missing}
        
    except Exception as e:
        logger.error(f"Failed to calculate ATS score: {e}")
        return {"score": 0, "missing_keywords": []}

