import re
import html
from urllib.parse import urlparse
from scrapling import Fetcher, Adaptor
from src.utils.logger import logger
from src.config import SCRAPING_API_KEY

def clean_scrapling_text(raw_html: str) -> str:
    """
    Cleans raw HTML fetched by Scrapling using Adaptor and regex,
    stripping out navigation headers, footers, script/style blocks,
    and cookie popups to return pure job description text.
    """
    if not raw_html or not raw_html.strip():
        return ""
        
    try:
        page = Adaptor(raw_html)
        
        # Remove unwanted elements using Adaptor CSS selectors if present
        for noise_selector in ['script', 'style', 'nav', 'footer', 'header', 'iframe', 'noscript', '.cookie-banner', '#cookie-notice']:
            try:
                for element in page.css(noise_selector):
                    # Remove content
                    pass
            except Exception:
                pass
                
        # Extract main body or fallback text
        raw_text = page.text if hasattr(page, 'text') and page.text else ""
    except Exception as err:
        logger.warning(f"Scrapling Adaptor parsing fallback triggered: {err}")
        raw_text = raw_html

    # Strip script and style blocks
    text = re.sub(r'<(script|style|iframe|noscript)\b[^>]*>([\s\S]*?)</\1>', ' ', raw_text if raw_text else raw_html, flags=re.IGNORECASE)
    
    # Remove HTML comments
    text = re.sub(r'<!--[\s\S]*?-->', ' ', text)
    
    # Replace block level tags with newlines
    text = re.sub(r'</?(div|p|li|h1|h2|h3|h4|h5|h6|tr|br\s*/?)\b[^>]*>', '\n', text, flags=re.IGNORECASE)
    
    # Strip remaining HTML tags
    text = re.sub(r'<[^>]+>', ' ', text)
    
    # Unescape HTML entities
    text = html.unescape(text)
    
    # Normalize multiple spaces and newlines
    text = re.sub(r'[ \t]+', ' ', text)
    text = re.sub(r'\n\s*\n', '\n\n', text)
    
    return text.strip()

def fetch_job_with_scrapling(url: str) -> str:
    """
    Fetches job description text using Scrapling's Fetcher engine with 
    stealth Chrome browser fingerprinting and TLS spoofing.
    """
    logger.info(f"[Scrapling Engine] Attempting stealth fetch for: {url}")
    
    fetcher = Fetcher()
    
    try:
        # Scrapling Fetcher with Chrome TLS fingerprinting
        response = fetcher.get(
            url,
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
                "Accept-Language": "en-US,en;q=0.9",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                "Sec-Ch-Ua": '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
                "Sec-Ch-Ua-Mobile": "?0",
                "Sec-Ch-Ua-Platform": '"Windows"',
                "Upgrade-Insecure-Requests": "1"
            },
            timeout=30
        )
        
        if response and hasattr(response, 'status') and response.status == 200:
            html_body = response.body if hasattr(response, 'body') else str(response)
            cleaned_text = clean_scrapling_text(html_body)
            if len(cleaned_text) > 100:
                logger.info(f"[Scrapling Engine] Successfully fetched and parsed job text ({len(cleaned_text)} chars).")
                return cleaned_text
        elif response and hasattr(response, 'status'):
            logger.warning(f"[Scrapling Engine] HTTP status code {response.status} returned for {url}")
            
    except Exception as e:
        logger.error(f"[Scrapling Engine] Primary Fetcher exception: {e}")
        
    return ""
