#!/usr/bin/env python3
"""
GitHub Starring Automation Script
Stars all public repositories for a specified GitHub user (default: thulanesigasa)
using a Personal Access Token (PAT).
"""

import os
import sys
import getpass
import requests
from dotenv import load_dotenv

# ANSI Escape Sequences for terminal coloring
GREEN = "\033[92m"
YELLOW = "\033[93m"
RED = "\033[91m"
BLUE = "\033[94m"
CYAN = "\033[96m"
BOLD = "\033[1m"
RESET = "\033[0m"

# Default configuration
DEFAULT_USERNAME = "thulanesigasa"
GITHUB_API_URL = "https://api.github.com"

def print_banner():
    print(f"{BLUE}{BOLD}" + "="*60)
    print("           GITHUB REPOSITORY STARRING UTILITY")
    print("="*60 + f"{RESET}\n")

def get_github_token():
    # Try loading from .env in root or parent directories
    load_dotenv()
    
    token = os.getenv("GITHUB_TOKEN") or os.getenv("GITHUB_PAT")
    
    if token:
        print(f"{GREEN}[OK] GitHub token successfully loaded from environment variables (.env).{RESET}")
        return token
        
    # Attempt to retrieve token from the local GitHub CLI
    try:
        import subprocess
        use_shell = os.name == 'nt'
        result = subprocess.run(["gh", "auth", "token"], capture_output=True, text=True, check=True, shell=use_shell)
        cli_token = result.stdout.strip()
        if cli_token:
            print(f"{GREEN}[OK] GitHub token successfully retrieved from GitHub CLI (gh auth token).{RESET}")
            return cli_token
    except Exception as e:
        print(f"{YELLOW}Warning: Failed to fetch token via GitHub CLI: {e}{RESET}")

    print(f"{YELLOW}No GITHUB_TOKEN or GITHUB_PAT found in environment (.env), and 'gh' CLI token lookup failed.{RESET}")
    print("You can generate a token at: https://github.com/settings/tokens")
    print(f"Ensure it has the {BOLD}public_repo{RESET} scope (or full {BOLD}repo{RESET} scope).\n")
    
    # Check if we are running in a non-interactive shell (e.g. background task)
    if not sys.stdin.isatty():
        print(f"{RED}Error: Running in a non-interactive shell. Cannot prompt for token.{RESET}")
        sys.exit(1)

    try:
        # Prompt user to input the token securely (hiding input typing)
        token = getpass.getpass("Enter your GitHub Personal Access Token (PAT): ").strip()
        if not token:
            print(f"{RED}Error: Token cannot be empty.{RESET}")
            sys.exit(1)
        return token
    except KeyboardInterrupt:
        print("\nOperation cancelled by user.")
        sys.exit(0)

def fetch_repositories(username, token):
    print(f"{BLUE}Fetching public repositories for user: {BOLD}{username}{RESET}...")
    
    headers = {
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28"
    }
    
    # Authenticate fetching repositories if token is provided to bypass higher rate limits
    if token:
        headers["Authorization"] = f"Bearer {token}"
        
    url = f"{GITHUB_API_URL}/users/{username}/repos"
    params = {
        "per_page": 100,
        "type": "public"
    }
    
    try:
        response = requests.get(url, headers=headers, params=params)
        
        if response.status_code == 404:
            print(f"{RED}Error: GitHub user '{username}' not found.{RESET}")
            sys.exit(1)
        elif response.status_code == 403 or response.status_code == 429:
            print(f"{RED}Error: GitHub API rate limit exceeded or access forbidden.{RESET}")
            sys.exit(1)
        elif response.status_code != 200:
            print(f"{RED}Error fetching repositories. HTTP {response.status_code}: {response.text}{RESET}")
            sys.exit(1)
            
        repos = response.json()
        
        # Filter to only get original repositories owned by the user (exclude forks if desired, but here we list all public repos)
        owned_repos = [repo for repo in repos if repo["owner"]["login"].lower() == username.lower()]
        
        print(f"{GREEN}[OK] Found {len(owned_repos)} public repositories.{RESET}")
        return owned_repos
        
    except requests.exceptions.RequestException as e:
        print(f"{RED}Network error fetching repositories: {e}{RESET}")
        sys.exit(1)

def star_repository(token, owner, repo_name):
    url = f"{GITHUB_API_URL}/user/starred/{owner}/{repo_name}"
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Length": "0"
    }
    
    try:
        # Starring requires a PUT request with an empty body (or Content-Length 0)
        response = requests.put(url, headers=headers)
        
        if response.status_code == 204:
            return True, "Starred successfully"
        elif response.status_code == 401:
            return False, "Unauthorized - Please check your Personal Access Token scopes"
        elif response.status_code == 404:
            return False, f"Repository not found or token lacks access to '{owner}/{repo_name}'"
        else:
            return False, f"HTTP {response.status_code}: {response.reason}"
            
    except requests.exceptions.RequestException as e:
        return False, f"Network error: {str(e)}"

def main():
    print_banner()
    
    username = DEFAULT_USERNAME
    # Allow overriding username via command line argument
    if len(sys.argv) > 1:
        username = sys.argv[1].strip()
        
    token = get_github_token()
    
    repos = fetch_repositories(username, token)
    if not repos:
        print(f"{YELLOW}No public repositories found for user {username}.{RESET}")
        sys.exit(0)
        
    print(f"\n{BLUE}Starting automated starring for {len(repos)} repositories...{RESET}")
    print("-" * 60)
    
    success_count = 0
    fail_count = 0
    
    for idx, repo in enumerate(repos, 1):
        repo_name = repo["name"]
        owner = repo["owner"]["login"]
        
        # Display progress indicator
        print(f"[{idx}/{len(repos)}] Starring {BOLD}{owner}/{repo_name}{RESET}... ", end="", flush=True)
        
        success, message = star_repository(token, owner, repo_name)
        
        if success:
            print(f"{GREEN}SUCCESS{RESET}")
            success_count += 1
        else:
            print(f"{RED}FAILED{RESET} ({YELLOW}{message}{RESET})")
            fail_count += 1
            
    print("-" * 60)
    print(f"{CYAN}Starring complete!{RESET}")
    print(f"  - Total processed: {len(repos)}")
    print(f"  - {GREEN}Successfully starred: {success_count}{RESET}")
    if fail_count > 0:
        print(f"  - {RED}Failed to star: {fail_count}{RESET}")
        print(f"\n{YELLOW}Note: Starring your own repositories requires a Personal Access Token with 'public_repo' or 'repo' scopes.{RESET}")
    else:
        print(f"  - {GREEN}All repositories successfully starred!{RESET}")

if __name__ == "__main__":
    main()
