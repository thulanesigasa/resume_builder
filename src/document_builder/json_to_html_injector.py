import os
from jinja2 import Environment, FileSystemLoader, select_autoescape
from src.utils.logger import logger

def inject_json_to_html(data: dict, template_filename: str) -> str:
    """
    Takes the JSON data and a template filename (e.g., 'ats_resume_template.html'),
    and renders the HTML using Jinja2 with autoescaping enabled for security.
    """
    logger.info(f"Injecting data into {template_filename}...")
    
    try:
        # Search for templates in the root templates folder as well as the new subdirectories
        search_paths = ["templates", "templates/ats_resumes", "templates/cover_letters"]
        
        # SECURITY: autoescape=True prevents Cross-Site Scripting (XSS) if the AI hallucinates HTML tags
        env = Environment(
            loader=FileSystemLoader(search_paths),
            autoescape=select_autoescape(['html', 'xml'])
        )
        template = env.get_template(template_filename)
        
        # We pass the data dictionary directly into the template context
        rendered_html = template.render(**data)
        return rendered_html
    except Exception as e:
        logger.error(f"Failed to render HTML template '{template_filename}': {e}")
        return ""
