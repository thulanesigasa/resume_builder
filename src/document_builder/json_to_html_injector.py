import os
import re
from jinja2 import Environment, FileSystemLoader, select_autoescape
from src.utils.logger import logger

MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

def format_edu_date(date_str) -> str:
    if not date_str:
        return ""
    
    str_val = str(date_str).strip()
    if not str_val:
        return ""
    
    if " - " in str_val:
        parts = str_val.split(" - ")
        end_part = parts[-1].strip()
        return format_edu_date(end_part)
    
    m_ym = re.match(r'^(\d{4})-(\d{1,2})$', str_val)
    if m_ym:
        year, month_num = m_ym.group(1), int(m_ym.group(2))
        if 1 <= month_num <= 12:
            return f"{MONTH_NAMES[month_num - 1]} {year}"
        return year
    
    m_ymd = re.match(r'^(\d{4})-(\d{1,2})-(\d{1,2})$', str_val)
    if m_ymd:
        year, month_num, day_num = m_ymd.group(1), int(m_ymd.group(2)), int(m_ymd.group(3))
        if 1 <= month_num <= 12:
            return f"{day_num} {MONTH_NAMES[month_num - 1]} {year}"
        return year

    if re.match(r'^\d{4}$', str_val):
        return str_val
    
    if re.match(r'^\d{1,2}$', str_val):
        m_num = int(str_val)
        if 1 <= m_num <= 12:
            return f"{MONTH_NAMES[m_num - 1]} 2026"
            
    return str_val

def inject_json_to_html(data: dict, template_filename: str) -> str:
    """
    Takes the JSON data and a template filename (e.g., 'ats_resume_template.html'),
    and renders the HTML using Jinja2 with autoescaping enabled for security.
    """
    logger.info(f"Injecting data into {template_filename}...")
    
    try:
        # Preprocess education dates for clean formatting
        if 'education' in data and isinstance(data['education'], list):
            for edu in data['education']:
                if isinstance(edu, dict):
                    raw_val = edu.get('display_date') or edu.get('endDate') or edu.get('date') or edu.get('dates')
                    formatted = format_edu_date(raw_val)
                    if formatted:
                        edu['display_date'] = formatted

        # Search for templates in the root templates folder as well as the new subdirectories
        search_paths = ["templates", "templates/ats_resumes", "templates/cover_letters"]
        
        # SECURITY: autoescape=True prevents Cross-Site Scripting (XSS) if the AI hallucinates HTML tags
        env = Environment(
            loader=FileSystemLoader(search_paths),
            autoescape=select_autoescape(['html', 'xml'])
        )
        env.filters['format_edu_date'] = format_edu_date
        template = env.get_template(template_filename)
        logger.info(f"[DEBUG] Template loaded: {template.filename}")
        
        # We pass the data dictionary directly into the template context
        rendered_html = template.render(**data)
        return rendered_html
    except Exception as e:
        logger.error(f"Failed to render HTML template '{template_filename}': {e}")
        return ""

