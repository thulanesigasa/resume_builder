import re
from typing import Dict
from src.utils.logger import logger

def analyze_requirements(job_description: str) -> Dict[str, bool]:
    """
    Analyzes the job description text to determine if a resume,
    cover letter, or both are required/mentioned.
    """
    logger.info("Checking job description for required documents...")
    
    # Convert to lowercase for case-insensitive keyword matching
    text_lower = job_description.lower()
    
    # Common terminology patterns
    cover_letter_patterns = [r'\bcover letter\b', r'\bmotivation letter\b', r'\bletter of interest\b']
    resume_patterns = [r'\bresume\b', r'\bcv\b', r'\bcurriculum vitae\b']
    
    requires_cover_letter = any(re.search(pattern, text_lower) for pattern in cover_letter_patterns)
    requires_resume = any(re.search(pattern, text_lower) for pattern in resume_patterns)
    
    # If neither is explicitly found, assume at least a resume is required for a job application
    if not requires_resume and not requires_cover_letter:
        logger.info("No explicit document requirements found. Defaulting to Resume: True.")
        requires_resume = True
        
    return {
        "resume": requires_resume,
        "cover_letter": requires_cover_letter
    }

if __name__ == "__main__":
    sample_text = "To apply, please submit your CV and a brief cover letter outlining your experience."
    print("Sample Text:", sample_text)
    print("Analysis:", analyze_requirements(sample_text))
