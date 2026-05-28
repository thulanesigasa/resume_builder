import re
import html
import socket
import ipaddress
from urllib.parse import urlparse
import requests
from src.utils.logger import logger
from src.config import SCRAPING_API_KEY

def clean_html(html_content: str) -> str:
    """
    Remove HTML tags, script/style blocks, and normalize whitespace 
    to extract plain text from job description HTML page.
    """
    # Remove script and style elements
    text = re.sub(r'<(script|style)\b[^>]*>([\s\S]*?)</\1>', ' ', html_content, flags=re.IGNORECASE)
    
    # Remove comments
    text = re.sub(r'<!--[\s\S]*?-->', ' ', text)
    
    # Replace common block-level HTML tags with newlines
    text = re.sub(r'</?(div|p|li|h1|h2|h3|h4|h5|h6|tr|br\s*/?)\b[^>]*>', '\n', text, flags=re.IGNORECASE)
    
    # Strip remaining HTML tags
    text = re.sub(r'<[^>]+>', ' ', text)
    
    # Unescape HTML entities (e.g. &amp;, &nbsp;)
    text = html.unescape(text)
    
    # Normalize multiple newlines and spaces
    text = re.sub(r'[ \t]+', ' ', text)
    text = re.sub(r'\n\s*\n', '\n\n', text)
    
    return text.strip()

def get_job_description(url: str) -> str:
    """
    Fetches the HTML of the given URL. Uses a Web Scraping API if configured,
    otherwise falls back to a direct requests.get call. Extracts plain text.
    """
    # Security: Validate URL scheme to prevent SSRF or Local File Inclusion (e.g. file:///etc/passwd)
    if not (url.startswith("http://") or url.startswith("https://")):
        logger.error(f"Security Warning: Blocked invalid URL scheme request: {url}")
        return ""

    # Security: Advanced SSRF protection - prevent connections to private/local network interfaces
    try:
        parsed_url = urlparse(url)
        hostname = parsed_url.hostname
        if not hostname:
            logger.error(f"Security Warning: URL hostname is empty or invalid: {url}")
            return ""
            
        # Resolve hostname to IP address
        resolved_ip = socket.gethostbyname(hostname)
        ip = ipaddress.ip_address(resolved_ip)
        
        # Check if IP is loopback, private, link-local, multicast, etc.
        if (ip.is_loopback or 
            ip.is_private or 
            ip.is_link_local or 
            ip.is_multicast or 
            ip.is_unspecified):
            logger.error(f"Security Warning: Blocked SSRF attempt to local/private IP address: {resolved_ip} (Host: {hostname})")
            return ""
    except Exception as e:
        logger.error(f"Security Check Error: Failed to resolve host IP for SSRF verification: {e}")
        return ""
        
    logger.info(f"Fetching job description from: {url}")
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
    }
    
    target_url = url
    params = {}
    
    # If a scraping API key is configured, route requests through it
    if SCRAPING_API_KEY:
        logger.info("Scraping API key detected. Routing request through scraping API proxy...")
        # Detect provider based on key format or default to scrape.do
        # Scrape.do key is typically 40 chars; ZenRows is 40 chars too. 
        # Let's support ZenRows first, then Scrape.do. 
        # We assume Scrape.do as the default if it doesn't match ZenRows-specific checks,
        # or we check if there's any indicator in the key.
        # Let's implement Scrape.do URL as it is very popular in SA.
        target_url = "https://api.scrape.do"
        params = {
            "token": SCRAPING_API_KEY,
            "url": url
        }
    else:
        logger.warning("No SCRAPING_API_KEY configured. Making direct request (may be blocked by job boards).")

    try:
        response = requests.get(target_url, headers=headers, params=params, timeout=30)
        
        if response.status_code == 200:
            raw_html = response.text
            # Extract readable text from the HTML page
            plain_text = clean_html(raw_html)
            logger.info("Successfully fetched and cleaned job description text.")
            return plain_text
        else:
            logger.error(f"Failed to fetch page. Status code: {response.status_code}. Response: {response.text[:200]}")
            return ""
            
    except Exception as e:
        logger.error(f"Error during job description fetch: {e}")
        return ""

if __name__ == "__main__":
    test_url = input("Enter a job URL to test: ")
    text = get_job_description(test_url)
    print("\n--- Extracted Text ---")
    print(text[:1000] + ("\n...\n[Truncated]" if len(text) > 1000 else ""))
