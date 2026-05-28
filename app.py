import streamlit as st
import os
import json
import random
import io
import pdfplumber

from src.scraper.job_link_reader import get_job_description
from src.scraper.requirement_analyzer import analyze_requirements
from src.supabase_client import get_supabase_client
from src.ai_engine.openai_client import generate_document, extract_job_metadata, extract_text_from_pdf_ocr
from src.ai_engine.ats_scorer import calculate_ats_score
from src.document_builder.json_to_html_injector import inject_json_to_html
from src.document_builder.pdf_compiler import compile_to_pdf, create_application_folder_name
from src.config import TEMPLATES_DIR

st.set_page_config(page_title="AI Resume Builder SaaS", layout="wide")

# Professional B&W Theme Toggle in Sidebar
theme_mode = st.sidebar.selectbox("Theme Mode", ["Dark Mode", "Light Mode"], index=0, key="ui_theme_mode")

# Inject monochrome styles
if theme_mode == "Dark Mode":
    st.markdown("""
        <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        
        /* Font configurations */
        .stApp, [data-testid="stSidebar"] {
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
        }
        code, pre, textarea {
            font-family: 'JetBrains Mono', monospace !important;
        }
        
        /* Base styles */
        .stApp {
            background-color: #000000;
            color: #ffffff;
        }
        [data-testid="stHeader"] {
            background-color: rgba(0, 0, 0, 0);
            color: #ffffff;
        }
        [data-testid="stSidebar"] {
            background-color: #0a0a0a !important;
            border-right: 1px solid #18181b !important;
        }
        
        /* Headers and text */
        .stApp h1, .stApp h2, .stApp h3, .stApp h4, .stApp h5, .stApp h6, .stApp p, .stApp span, .stApp label, [data-testid="stMarkdownContainer"] p {
            color: #ffffff !important;
        }
        .hero-subtitle {
            color: rgba(255, 255, 255, 0.5) !important;
        }
        
        /* Scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #0a0a0a;
        }
        ::-webkit-scrollbar-thumb {
            background: #27272a;
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #3f3f46;
        }
        
        /* Buttons styling with absolute specificity */
        button, .stButton > button, .stLinkButton > a {
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
            border-radius: 6px !important;
        }
        .stApp button[kind="primary"], 
        .stApp .stButton > button[kind="primary"], 
        .stApp .stLinkButton > a[kind="primary"] {
            background-color: #ffffff !important;
            color: #000000 !important;
            border: 1px solid #ffffff !important;
            font-weight: 600 !important;
        }
        .stApp button[kind="primary"] *,
        .stApp .stButton > button[kind="primary"] * {
            color: #000000 !important;
            fill: #000000 !important;
        }
        .stApp button[kind="primary"]:hover, 
        .stApp .stButton > button[kind="primary"]:hover {
            background-color: #e4e4e7 !important;
            color: #000000 !important;
            transform: translateY(-1px);
        }
        .stApp button[kind="secondary"], 
        .stApp .stButton > button[kind="secondary"], 
        .stApp .stLinkButton > a[kind="secondary"] {
            background-color: #000000 !important;
            color: #ffffff !important;
            border: 1px solid #27272a !important;
        }
        .stApp button[kind="secondary"] *,
        .stApp .stButton > button[kind="secondary"] * {
            color: #ffffff !important;
            fill: #ffffff !important;
        }
        .stApp button[kind="secondary"]:hover, 
        .stApp .stButton > button[kind="secondary"]:hover {
            background-color: #0a0a0a !important;
            border-color: #ffffff !important;
            transform: translateY(-1px);
        }
        button:active, .stButton > button:active {
            transform: translateY(0);
        }
        
        /* Sidebar specific button styles */
        .stApp [data-testid="stSidebar"] button[kind="primary"] * {
            color: #000000 !important;
        }
        .stApp [data-testid="stSidebar"] button[kind="secondary"] * {
            color: #ffffff !important;
        }
        
        /* Text input and area styling */
        .stApp div[data-baseweb="input"],
        .stApp div[data-baseweb="input"] > div,
        .stApp div[data-baseweb="input"] input,
        .stApp .stTextInput input,
        .stApp .stTextArea textarea,
        .stApp textarea {
            background-color: #0e0e11 !important;
            color: #ffffff !important;
            transition: all 0.2s ease-in-out !important;
        }
        .stApp div[data-baseweb="input"] {
            border: 1px solid #27272a !important;
            border-radius: 6px !important;
        }
        .stApp textarea {
            border: 1px solid #27272a !important;
            border-radius: 6px !important;
        }
        .stApp div[data-baseweb="input"]:focus-within, .stApp textarea:focus {
            border-color: #ffffff !important;
            box-shadow: 0 0 0 1px #ffffff !important;
        }
        
        /* Eye icon and parent password buttons inside password fields */
        .stApp div[data-baseweb="input"] svg,
        .stApp div[data-baseweb="input"] button,
        .stApp div[data-baseweb="input"] button * {
            background-color: transparent !important;
            color: #ffffff !important;
            fill: #ffffff !important;
        }
        
        /* Selectboxes */
        .stApp div[data-baseweb="select"],
        .stApp div[data-baseweb="select"] > div,
        .stApp div[data-baseweb="select"] span,
        .stApp div[data-baseweb="select"] svg {
            background-color: #0e0e11 !important;
            color: #ffffff !important;
        }
        .stApp div[data-baseweb="select"] {
            border: 1px solid #27272a !important;
            border-radius: 6px !important;
            transition: all 0.2s ease-in-out !important;
        }
        
        /* Dropdown overlays (portals) */
        div[data-baseweb="popover"], div[data-baseweb="menu"], ul[role="listbox"], [data-baseweb="popover"] * {
            background-color: #0e0e11 !important;
            color: #ffffff !important;
            border: 1px solid #27272a;
        }
        li[role="option"] {
            background-color: #0e0e11 !important;
            color: #ffffff !important;
            transition: background 0.15s ease !important;
        }
        li[role="option"]:hover, li[role="option"][aria-selected="true"] {
            background-color: #27272a !important;
            color: #ffffff !important;
        }
        
        /* Code blocks */
        .stApp code {
            background-color: #18181b !important;
            color: #ffffff !important;
            border: 1px solid #27272a !important;
            padding: 2px 6px !important;
            border-radius: 4px !important;
        }
        
        /* File Uploaders */
        [data-testid="stFileUploader"] {
            border: 1px dashed #27272a !important;
            background-color: #0a0a0a !important;
            padding: 15px !important;
            border-radius: 8px !important;
        }
        [data-testid="stFileUploaderDropzone"] {
            background-color: #0a0a0a !important;
            color: #ffffff !important;
            border: none !important;
        }
        [data-testid="stFileUploaderDropzone"] button {
            background-color: #ffffff !important;
            color: #000000 !important;
            border: none !important;
        }
        [data-testid="stFileUploaderDropzone"] button * {
            color: #000000 !important;
        }
        [data-testid="stFileUploaderDropzone"] button:hover {
            background-color: #e4e4e7 !important;
        }
        
        /* Radio Buttons */
        [data-testid="stRadio"] *, div[role="radiogroup"] * {
            color: #ffffff !important;
        }
        
        /* Tabs styling */
        div[data-baseweb="tab-list"] {
            background-color: transparent !important;
            border-bottom: 1px solid #27272a !important;
        }
        button[data-baseweb="tab"] {
            background-color: transparent !important;
            color: #a1a1aa !important;
            border: none !important;
            font-weight: 500 !important;
            transition: all 0.2s ease !important;
        }
        button[data-baseweb="tab"][aria-selected="true"] {
            color: #ffffff !important;
            border-bottom: 2px solid #ffffff !important;
            font-weight: 600 !important;
        }
        
        /* Custom UI classes */
        .auth-card {
            background: rgba(9, 9, 11, 0.8) !important;
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        }
        .hero-label {
            display: inline-flex;
            align-items: center;
            font-size: 0.8rem;
            letter-spacing: 0.05em;
            color: rgba(255, 255, 255, 0.6);
            background: rgba(255, 255, 255, 0.05);
            padding: 4px 10px;
            border-radius: 20px;
            margin-bottom: 15px;
        }
        .hero-label .dot {
            width: 6px;
            height: 6px;
            background-color: #ffffff;
            border-radius: 50%;
            margin-right: 8px;
        }
        .stat-container {
            display: flex;
            gap: 15px;
            margin-bottom: 25px;
        }
        .stat-box {
            flex: 1;
            background: #09090b;
            border: 1px solid #18181b;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .stat-box:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);
            border-color: rgba(255, 255, 255, 0.2) !important;
        }
        .stat-num {
            font-size: 2rem;
            font-weight: bold;
            color: #ffffff;
        }
        .stat-label {
            font-size: 0.8rem;
            color: #a1a1aa;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .phase-banner {
            background: #09090b;
            border-left: 4px solid #ffffff;
            border-top: 1px solid #18181b;
            border-right: 1px solid #18181b;
            border-bottom: 1px solid #18181b;
            padding: 20px;
            border-radius: 0 8px 8px 0;
            margin-bottom: 25px;
        }
        .phase-banner-title {
            font-size: 1.4rem;
            font-weight: bold;
            color: #ffffff;
        }
        .phase-banner-sub {
            font-size: 0.9rem;
            color: #a1a1aa;
        }
        .day-card {
            background: #09090b;
            border-left: 4px solid #ffffff;
            border-top: 1px solid #18181b;
            border-right: 1px solid #18181b;
            border-bottom: 1px solid #18181b;
            padding: 15px;
            border-radius: 0 6px 6px 0;
            margin-bottom: 10px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .day-card:hover {
            transform: translateX(4px);
            border-color: rgba(255, 255, 255, 0.2) !important;
        }
        .day-card-header {
            font-size: 0.8rem;
            color: #a1a1aa;
        }
        .day-card-title {
            font-size: 1.1rem;
            color: #ffffff;
            margin: 5px 0;
        }
        .day-card-badge {
            display: inline-block;
            background: #27272a;
            color: #ffffff;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 0.8rem;
            margin-top: 5px;
        }
        </style>
    """, unsafe_allow_html=True)
else:
    st.markdown("""
        <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        
        /* Font configurations */
        .stApp, [data-testid="stSidebar"] {
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
        }
        code, pre, textarea {
            font-family: 'JetBrains Mono', monospace !important;
        }
        
        /* Base styles */
        .stApp {
            background-color: #ffffff !important;
            color: #0f172a !important;
        }
        [data-testid="stHeader"] {
            background-color: rgba(255, 255, 255, 0);
            color: #0f172a;
        }
        [data-testid="stSidebar"] {
            background-color: #f8fafc !important;
            border-right: 1px solid #e2e8f0 !important;
        }
        
        /* Headers and text */
        .stApp h1, .stApp h2, .stApp h3, .stApp h4, .stApp h5, .stApp h6, .stApp p, .stApp span, .stApp label, [data-testid="stMarkdownContainer"] p {
            color: #0f172a !important;
        }
        .hero-subtitle {
            color: rgba(15, 23, 42, 0.6) !important;
        }
        
        /* Scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #f8fafc;
        }
        ::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
        }
        
        /* Buttons styling with absolute specificity */
        button, .stButton > button, .stLinkButton > a {
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
            border-radius: 6px !important;
        }
        .stApp button[kind="primary"], 
        .stApp .stButton > button[kind="primary"], 
        .stApp .stLinkButton > a[kind="primary"] {
            background-color: #000000 !important;
            color: #ffffff !important;
            border: 1px solid #000000 !important;
            font-weight: 600 !important;
        }
        .stApp button[kind="primary"] *,
        .stApp .stButton > button[kind="primary"] * {
            color: #ffffff !important;
            fill: #ffffff !important;
        }
        .stApp button[kind="primary"]:hover, 
        .stApp .stButton > button[kind="primary"]:hover {
            background-color: #333333 !important;
            color: #ffffff !important;
            transform: translateY(-1px);
        }
        .stApp button[kind="secondary"], 
        .stApp .stButton > button[kind="secondary"], 
        .stApp .stLinkButton > a[kind="secondary"] {
            background-color: #ffffff !important;
            color: #000000 !important;
            border: 1px solid #cbd5e1 !important;
        }
        .stApp button[kind="secondary"] *,
        .stApp .stButton > button[kind="secondary"] * {
            color: #000000 !important;
            fill: #000000 !important;
        }
        .stApp button[kind="secondary"]:hover, 
        .stApp .stButton > button[kind="secondary"]:hover {
            background-color: #f8fafc !important;
            border-color: #000000 !important;
            transform: translateY(-1px);
        }
        button:active, .stButton > button:active {
            transform: translateY(0);
        }
        
        /* Sidebar specific button styles */
        .stApp [data-testid="stSidebar"] button[kind="primary"] * {
            color: #ffffff !important;
        }
        .stApp [data-testid="stSidebar"] button[kind="secondary"] * {
            color: #000000 !important;
        }
        
        /* Text input and area styling - styled deeply for base elements */
        .stApp div[data-baseweb="input"],
        .stApp div[data-baseweb="input"] > div,
        .stApp div[data-baseweb="input"] input,
        .stApp .stTextInput input,
        .stApp .stTextArea textarea,
        .stApp textarea {
            background-color: #ffffff !important;
            color: #0f172a !important;
            transition: all 0.2s ease-in-out !important;
        }
        .stApp div[data-baseweb="input"] {
            border: 1px solid #cbd5e1 !important;
            border-radius: 6px !important;
        }
        .stApp textarea {
            border: 1px solid #cbd5e1 !important;
            border-radius: 6px !important;
        }
        .stApp div[data-baseweb="input"]:focus-within, .stApp textarea:focus {
            border-color: #000000 !important;
            box-shadow: 0 0 0 1px #000000 !important;
        }
        
        /* Eye icon and parent password buttons inside password fields */
        .stApp div[data-baseweb="input"] svg,
        .stApp div[data-baseweb="input"] button,
        .stApp div[data-baseweb="input"] button * {
            background-color: transparent !important;
            color: #0f172a !important;
            fill: #0f172a !important;
        }
        
        /* Selectboxes */
        .stApp div[data-baseweb="select"],
        .stApp div[data-baseweb="select"] > div,
        .stApp div[data-baseweb="select"] span,
        .stApp div[data-baseweb="select"] svg {
            background-color: #ffffff !important;
            color: #0f172a !important;
        }
        .stApp div[data-baseweb="select"] {
            border: 1px solid #cbd5e1 !important;
            border-radius: 6px !important;
            transition: all 0.2s ease-in-out !important;
        }
        
        /* Dropdown overlays (portals) */
        div[data-baseweb="popover"], div[data-baseweb="menu"], ul[role="listbox"], [data-baseweb="popover"] * {
            background-color: #ffffff !important;
            color: #0f172a !important;
            border: 1px solid #cbd5e1;
        }
        li[role="option"] {
            background-color: #ffffff !important;
            color: #0f172a !important;
            transition: background 0.15s ease !important;
        }
        li[role="option"]:hover, li[role="option"][aria-selected="true"] {
            background-color: #f1f5f9 !important;
            color: #0f172a !important;
        }
        
        /* Code blocks */
        .stApp code {
            background-color: #f1f5f9 !important;
            color: #0f172a !important;
            border: 1px solid #cbd5e1 !important;
            padding: 2px 6px !important;
            border-radius: 4px !important;
        }
        
        /* File Uploaders */
        [data-testid="stFileUploader"] {
            border: 1px dashed #cbd5e1 !important;
            background-color: #f8fafc !important;
            padding: 15px !important;
            border-radius: 8px !important;
        }
        [data-testid="stFileUploaderDropzone"] {
            background-color: #f8fafc !important;
            color: #0f172a !important;
            border: none !important;
        }
        [data-testid="stFileUploaderDropzone"] button {
            background-color: #000000 !important;
            color: #ffffff !important;
            border: none !important;
        }
        [data-testid="stFileUploaderDropzone"] button * {
            color: #ffffff !important;
        }
        [data-testid="stFileUploaderDropzone"] button:hover {
            background-color: #333333 !important;
        }
        
        /* Radio Buttons */
        [data-testid="stRadio"] *, div[role="radiogroup"] * {
            color: #0f172a !important;
        }
        
        /* Tabs styling */
        div[data-baseweb="tab-list"] {
            background-color: transparent !important;
            border-bottom: 1px solid #e2e8f0 !important;
        }
        button[data-baseweb="tab"] {
            background-color: transparent !important;
            color: #64748b !important;
            border: none !important;
            font-weight: 500 !important;
            transition: all 0.2s ease !important;
        }
        button[data-baseweb="tab"][aria-selected="true"] {
            color: #0f172a !important;
            border-bottom: 2px solid #000000 !important;
            font-weight: 600 !important;
        }
        
        /* Custom UI classes */
        .auth-card {
            background: rgba(255, 255, 255, 0.8) !important;
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(15, 23, 42, 0.08);
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }
        .hero-label {
            display: inline-flex;
            align-items: center;
            font-size: 0.8rem;
            letter-spacing: 0.05em;
            color: rgba(15, 23, 42, 0.6);
            background: rgba(15, 23, 42, 0.05);
            padding: 4px 10px;
            border-radius: 20px;
            margin-bottom: 15px;
        }
        .hero-label .dot {
            width: 6px;
            height: 6px;
            background-color: #000000;
            border-radius: 50%;
            margin-right: 8px;
        }
        .stat-container {
            display: flex;
            gap: 15px;
            margin-bottom: 25px;
        }
        .stat-box {
            flex: 1;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .stat-box:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.03);
            border-color: rgba(0, 0, 0, 0.1) !important;
        }
        .stat-num {
            font-size: 2rem;
            font-weight: bold;
            color: #0f172a;
        }
        .stat-label {
            font-size: 0.8rem;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .phase-banner {
            background: #f8fafc;
            border-left: 4px solid #000000;
            border-top: 1px solid #e2e8f0;
            border-right: 1px solid #e2e8f0;
            border-bottom: 1px solid #e2e8f0;
            padding: 20px;
            border-radius: 0 8px 8px 0;
            margin-bottom: 25px;
        }
        .phase-banner-title {
            font-size: 1.4rem;
            font-weight: bold;
            color: #0f172a;
        }
        .phase-banner-sub {
            font-size: 0.9rem;
            color: #64748b;
        }
        .day-card {
            background: #f8fafc;
            border-left: 4px solid #000000;
            border-top: 1px solid #e2e8f0;
            border-right: 1px solid #e2e8f0;
            border-bottom: 1px solid #e2e8f0;
            padding: 15px;
            border-radius: 0 6px 6px 0;
            margin-bottom: 10px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .day-card:hover {
            transform: translateX(4px);
            border-color: rgba(0, 0, 0, 0.1) !important;
        }
        .day-card-header {
            font-size: 0.8rem;
            color: #64748b;
        }
        .day-card-title {
            font-size: 1.1rem;
            color: #0f172a;
            margin: 5px 0;
        }
        .day-card-badge {
            display: inline-block;
            background: #e2e8f0;
            color: #0f172a;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 0.8rem;
            margin-top: 5px;
        }
        </style>
    """, unsafe_allow_html=True)

# Initialize Supabase client
supabase = get_supabase_client()

if not supabase:
    st.error("Database is offline. Please configure SUPABASE_URL and SUPABASE_KEY in your environment variables.")
    st.stop()

# --- DIALOGS ---
@st.dialog("Credential Preview", width="large")
def preview_credential_dialog(cert_name, cert_text):
    st.write(f"### :material/school: {cert_name}")
    st.markdown("---")
    st.markdown("Here is the verified text content extracted from this document, which the AI reads to build custom resumes/cover letters.")
    st.text_area("Document Content", value=cert_text, height=350, disabled=True, label_visibility="collapsed")

# --- AUTHENTICATION ---
if "user" not in st.session_state:
    st.session_state.user = None

if not st.session_state.user:
    col_l, col_center, col_r = st.columns([1, 1.8, 1])
    
    with col_center:
        st.markdown('<div style="text-align: center; margin-top: 40px;">', unsafe_allow_html=True)
        st.markdown('<div class="hero-label"><div class="dot"></div>A PRODUCT BY T.S INDUSTRIES</div>', unsafe_allow_html=True)
        st.markdown('<h1 style="font-size: 3rem; margin-bottom: 10px;">AI ATS <em>Resume Builder</em></h1>', unsafe_allow_html=True)
        st.markdown('<p class="hero-subtitle" style="font-size: 1.1rem; margin-bottom: 30px;">Deploy resumes & cover letters matching industry profiles instantly.</p>', unsafe_allow_html=True)
        st.markdown('</div>', unsafe_allow_html=True)
        
        # Center card container
        st.markdown('<div class="auth-card">', unsafe_allow_html=True)
        auth_mode = st.tabs(["Log In", "Sign Up"])
        
        with auth_mode[0]:
            st.markdown('<div style="margin-top: 15px;"></div>', unsafe_allow_html=True)
            login_email = st.text_input("Email Address", key="login_email_input")
            login_password = st.text_input("Password", type="password", key="login_pass_input")
            if st.button("Log In", type="primary", icon=":material/login:", key="btn_login_auth"):
                with st.spinner("Logging in..."):
                    try:
                        res = supabase.auth.sign_in_with_password({"email": login_email, "password": login_password})
                        st.session_state.user = res.user
                        st.success("Successfully logged in!")
                        st.rerun()
                    except Exception as e:
                        st.error(f"Login failed: {e}")
                        
        with auth_mode[1]:
            st.markdown('<div style="margin-top: 15px;"></div>', unsafe_allow_html=True)
            signup_name = st.text_input("First Name", placeholder="e.g. John", key="signup_name")
            signup_surname = st.text_input("Surname", placeholder="e.g. Smith", key="signup_surname")
            signup_phone = st.text_input("Mobile Number", placeholder="e.g. +27821234567", key="signup_phone")
            signup_email = st.text_input("Email Address", key="signup_email_input")
            signup_password = st.text_input("Password", type="password", key="signup_pass_input")
            
            if st.button("Sign Up", type="primary", icon=":material/person_add:", key="btn_signup_auth"):
                if not signup_name.strip() or not signup_surname.strip() or not signup_phone.strip():
                    st.error("Please fill in your Name, Surname, and Mobile Number.")
                else:
                    with st.spinner("Signing up..."):
                        try:
                            # Send signup with metadata parameters which are captured by Supabase Auth and synced to profiles table via Trigger
                            res = supabase.auth.sign_up({
                                "email": signup_email,
                                "password": signup_password,
                                "options": {
                                    "data": {
                                        "first_name": signup_name.strip(),
                                        "last_name": signup_surname.strip(),
                                        "phone": signup_phone.strip()
                                    }
                                }
                            })
                            st.info("Account created! Please check your email inbox to verify your email address before logging in.")
                        except Exception as e:
                            st.error(f"Signup failed: {e}")
        st.markdown('</div>', unsafe_allow_html=True)
    st.stop()

# --- LOGGED IN SESSION ---
user = st.session_state.user

# Security: Inactivity Session Timeout (15 minutes = 900 seconds)
import time
SESSION_TIMEOUT_SECONDS = 900
current_time = time.time()
if "last_activity" in st.session_state:
    elapsed = current_time - st.session_state.last_activity
    if elapsed > SESSION_TIMEOUT_SECONDS:
        # Clear user session on timeout securely to prevent information leaks
        try:
            supabase.auth.sign_out()
        except Exception:
            pass
        st.session_state.clear()
        st.session_state.user = None
        st.warning("Session expired due to inactivity. Please log in again.")
        st.rerun()
st.session_state.last_activity = current_time

# Fetch/Update User Master Profile info (including username, name, surname, phone)
profile_data = ""
username_data = ""
first_name = ""
last_name = ""
phone_number = ""

try:
    profile_res = supabase.table("profiles").select("raw_info", "username", "first_name", "last_name", "phone").eq("id", user.id).execute()
    if profile_res.data:
        profile_data = profile_res.data[0].get("raw_info", "") or ""
        username_data = profile_res.data[0].get("username", "") or ""
        first_name = profile_res.data[0].get("first_name", "") or ""
        last_name = profile_res.data[0].get("last_name", "") or ""
        phone_number = profile_res.data[0].get("phone", "") or ""
except Exception as e:
    st.sidebar.error(f"Error fetching profile: {e}")

# Sidebar user display (displays custom username or first name if available, fallback to email)
display_name = user.email
if username_data:
    display_name = username_data
elif first_name:
    display_name = f"{first_name} {last_name}".strip()

st.sidebar.markdown(f":material/person: **Logged in as:**\n`{display_name}`")
if st.sidebar.button("Log Out", icon=":material/logout:"):
    try:
        supabase.auth.sign_out()
    except Exception:
        pass
    st.session_state.clear()
    st.session_state.user = None
    st.rerun()

st.sidebar.markdown("---")

# Fetch list of existing certificates
certificates_list = []
try:
    certs_res = supabase.table("certificates").select("*").eq("user_id", user.id).execute()
    certificates_list = certs_res.data or []
except Exception as e:
    pass

# Fetch statistics for User
apps_count = 0
avg_ats = 0
try:
    apps_res = supabase.table("applications").select("ats_score").eq("user_id", user.id).execute()
    if apps_res.data:
        apps_count = len(apps_res.data)
        scores = [row.get("ats_score") for row in apps_res.data if row.get("ats_score") is not None]
        if scores:
            avg_ats = int(sum(scores) / len(scores))
except Exception as e:
    pass

# --- STATS BAR FOR USER ---
st.markdown(f"""
<div class="stat-container">
  <div class="stat-box">
    <div class="stat-num">{apps_count}</div>
    <div class="stat-label">Tailored Apps</div>
  </div>
  <div class="stat-box">
    <div class="stat-num">{len(certificates_list)}</div>
    <div class="stat-label">Credentials Uploaded</div>
  </div>
  <div class="stat-box">
    <div class="stat-num">{avg_ats}%</div>
    <div class="stat-label">Average Match</div>
  </div>
</div>
""", unsafe_allow_html=True)

# Sidebar templates selection
st.sidebar.subheader("Resume Design")
resume_templates = ["david_turner_resume.html", "amy_stein_resume.html", "ava_martinez_resume.html", "ats_resume_template.html", "ui_ux_pro_max_resume.html"]
selected_resume = st.sidebar.selectbox("Resume Template", resume_templates)

cl_templates = ["takanori_ito_cover_letter.html", "caleb_foster_cover_letter.html"]
selected_cl = st.sidebar.selectbox("Cover Letter Template", cl_templates)

st.sidebar.markdown("---")
st.sidebar.subheader("AI Focus Prompts")
custom_instructions = st.sidebar.text_area("Custom Instructions (Optional)", placeholder="e.g. Focus heavily on my Python experience, keep the tone aggressive...")

# --- SESSION STATES FOR DOCUMENT FLOW ---
if "resume_json" not in st.session_state:
    st.session_state.resume_json = None
if "cover_letter_json" not in st.session_state:
    st.session_state.cover_letter_json = None
if "company_name" not in st.session_state:
    st.session_state.company_name = "Unknown_Company"
if "job_title" not in st.session_state:
    st.session_state.job_title = "Unknown_Position"
if "folder_name" not in st.session_state:
    st.session_state.folder_name = ""
if "ats_score" not in st.session_state:
    st.session_state.ats_score = None
if "resume_download_url" not in st.session_state:
    st.session_state.resume_download_url = None
if "cl_download_url" not in st.session_state:
    st.session_state.cl_download_url = None

if "cert_upload_counter" not in st.session_state:
    st.session_state.cert_upload_counter = 0
if "cv_upload_counter" not in st.session_state:
    st.session_state.cv_upload_counter = 0

# Combine profile with certificates for generation context
personal_generation_data = profile_data
if first_name or last_name:
    personal_generation_data = f"Name: {first_name} {last_name}\n" + (f"Phone: {phone_number}\n" if phone_number else "") + personal_generation_data

if certificates_list:
    personal_generation_data += "\n\n--- USER'S OFFICIALLY VERIFIED CERTIFICATES & CREDENTIALS ---\n"
    for cert in certificates_list:
        personal_generation_data += f"Certificate: {cert['name']}\nSkills & Text Extracted:\n{cert['extracted_text']}\n\n"

# --- MAIN WORKSPACE TABS ---
tab1, tab2, tab3, tab4 = st.tabs([
    "My Profile & Documents", 
    "Single Application (Interactive)", 
    "Batch Auto-Pilot", 
    "Applications Archive"
])

with tab1:
    st.markdown("""
    <div class="phase-banner">
      <div class="phase-banner-title">My Profile & Documentation</div>
      <div class="phase-banner-sub">Manage your personal settings, master CV profile, and credentials in one place</div>
    </div>
    """, unsafe_allow_html=True)
    
    col_left, col_right = st.columns([1, 1])
    
    with col_left:
        st.subheader("Personal Information")
        edit_username = st.text_input("Username", value=username_data, placeholder="e.g. janesmith")
        edit_fname = st.text_input("First Name", value=first_name, placeholder="e.g. Jane")
        edit_lname = st.text_input("Surname", value=last_name, placeholder="e.g. Smith")
        edit_phone = st.text_input("Mobile Number", value=phone_number, placeholder="e.g. +27821234567")
        
        if st.button("Update Profile Info", icon=":material/save:", key="btn_update_profile"):
            with st.spinner("Saving profile information..."):
                try:
                    supabase.table("profiles").upsert({
                        "id": user.id, 
                        "username": edit_username.strip(),
                        "first_name": edit_fname.strip(),
                        "last_name": edit_lname.strip(),
                        "phone": edit_phone.strip()
                    }).execute()
                    st.success("Profile details successfully updated!")
                    st.rerun()
                except Exception as e:
                    st.error(f"Failed to update profile info: {e}")
                    
        st.markdown("<br>", unsafe_allow_html=True)
        st.subheader("Master CV Raw Data")
        st.markdown("This text represents your master history. When we generate a tailored CV, the AI reads this to pull your achievements.")
        edited_profile_raw = st.text_area("Profile Raw Text", value=profile_data, height=350, key="profile_raw_editor")
        if st.button("Update Master CV Text", icon=":material/save:", key="btn_update_rawcv"):
            with st.spinner("Saving master CV data..."):
                try:
                    supabase.table("profiles").upsert({"id": user.id, "raw_info": edited_profile_raw}).execute()
                    st.success("Master CV data updated!")
                    st.rerun()
                except Exception as e:
                    st.error(f"Failed to save CV text: {e}")
                    
    with col_right:
        st.subheader("Upload Documents")
        st.markdown("**Option A: Load Master CV from PDF**")
        st.markdown("Uploading a PDF will parse its contents and overwrite your Master CV text on the left.")
        if profile_data.strip():
            st.markdown("##### Current Active Master CV:")
            if st.button("Preview Master CV", icon=":material/school:", key="btn_preview_master_cv", use_container_width=True):
                preview_credential_dialog("Master CV", profile_data)
            st.markdown("<br>", unsafe_allow_html=True)
        uploaded_profile_pdf = st.file_uploader("Upload Master CV PDF", type=["pdf"], key=f"profile_pdf_uploader_main_{st.session_state.cv_upload_counter}")
        if st.button("Parse Master CV PDF", icon=":material/picture_as_pdf:", key="btn_parse_pdfcv"):
            if not uploaded_profile_pdf:
                st.warning("Please choose a PDF file first.")
            else:
                with st.spinner("Extracting PDF contents..."):
                    try:
                        pdf_data = uploaded_profile_pdf.read()
                        extracted_text = ""
                        try:
                            with pdfplumber.open(io.BytesIO(pdf_data)) as pdf:
                                extracted_text = "\n".join([page.extract_text() for page in pdf.pages if page.extract_text()])
                        except Exception:
                            pass
                        
                        # Fallback to OCR if standard parsing yields nothing
                        if not extracted_text.strip():
                            extracted_text = extract_text_from_pdf_ocr(pdf_data)
                            
                        if extracted_text.strip():
                            supabase.table("profiles").upsert({"id": user.id, "raw_info": extracted_text.strip()}).execute()
                            st.success("Master CV PDF parsed and saved successfully!")
                            st.session_state.cv_upload_counter += 1
                            st.rerun()
                        else:
                            st.error("Could not extract clean text from the uploaded PDF automatically (even via AI Vision). Please type or paste your CV text manually.")
                    except Exception as e:
                        st.error(f"Failed to parse PDF: {e}")
                        
        st.markdown("---")
        st.subheader("Certificates / Credentials")
        
        # Display existing certificates inside this tab
        if certificates_list:
            for cert in certificates_list:
                 col_c_name, col_c_del = st.columns([5, 1])
                 if col_c_name.button(cert['name'], icon=":material/school:", key=f"view_cert_{cert['id']}", use_container_width=True):
                     preview_credential_dialog(cert['name'], cert['extracted_text'])
                 if col_c_del.button("Delete", icon=":material/delete:", key=f"del_cert_main_{cert['id']}", help=f"Delete {cert['name']}"):
                    try:
                        supabase.table("certificates").delete().eq("id", cert['id']).execute()
                        st.success("Deleted!")
                        st.rerun()
                    except Exception as e:
                        st.error(f"Failed to delete certificate: {e}")
        else:
            st.info("No credentials uploaded yet. Add them below to include them in the CV context.")
            
        st.markdown("<br>", unsafe_allow_html=True)
        st.markdown("**Add New Credential**")
        new_cert_name = st.text_input("Credential Name", placeholder="e.g. AWS Certified Solutions Architect", key=f"main_cert_name_{st.session_state.cert_upload_counter}")
        uploaded_cert_pdf = st.file_uploader("Upload Credential PDF (Optional if text is pasted below)", type=["pdf"], key=f"main_cert_pdf_{st.session_state.cert_upload_counter}")
        manual_cert_text = st.text_area("Credential Text / Description (Paste here if PDF is scanned or fails)", placeholder="Copy and paste text contents, skills, or validation details from the certificate here...", height=150, key=f"main_cert_text_{st.session_state.cert_upload_counter}")
        
        if st.button("Upload Credential", icon=":material/upload_file:", key="btn_upload_cert_main"):
            if not new_cert_name.strip():
                st.warning("Please specify a Name for the credential.")
            elif not uploaded_cert_pdf and not manual_cert_text.strip():
                st.warning("Please upload a PDF file or paste the credential text manually.")
            else:
                extracted_text = ""
                if uploaded_cert_pdf:
                    with st.spinner("Extracting PDF contents..."):
                        try:
                            pdf_data = uploaded_cert_pdf.read()
                            try:
                                with pdfplumber.open(io.BytesIO(pdf_data)) as pdf:
                                    extracted_text = "\n".join([page.extract_text() for page in pdf.pages if page.extract_text()])
                            except Exception:
                                pass
                            
                            # Fallback to OCR if standard parsing yields nothing
                            if not extracted_text.strip():
                                extracted_text = extract_text_from_pdf_ocr(pdf_data)
                        except Exception as e:
                            st.error(f"Failed to parse PDF: {e}")
                
                final_text = extracted_text.strip() or manual_cert_text.strip()
                
                if not final_text:
                    st.error("Could not extract text from the PDF automatically (even via AI Vision). Please copy and paste the credential text manually into the box below.")
                else:
                    with st.spinner("Saving credential..."):
                        try:
                            supabase.table("certificates").insert({
                                "user_id": user.id,
                                "name": new_cert_name.strip(),
                                "extracted_text": final_text
                            }).execute()
                            st.success(f"Credential '{new_cert_name}' added successfully!")
                            st.session_state.cert_upload_counter += 1
                            st.rerun()
                        except Exception as e:
                            st.error(f"Failed to save certificate: {e}")

with tab2:
    col_input, col_mode = st.columns([3, 1])
    with col_input:
        input_method = st.radio("Job Details Source", ["Scrape Job URL", "Paste Job Text"], horizontal=True)
        if input_method == "Scrape Job URL":
            job_url = st.text_input("Job Description URL", placeholder="https://linkedin.com/jobs/view/...", key="single_url")
            job_text = ""
        else:
            job_text = st.text_area("Paste Job Description Text", placeholder="Copy and paste the job listing description here...", height=200)
            job_url = ""
            
    with col_mode:
        is_general = st.checkbox("Generalize Resume", help="Generates a high-quality general resume instead of a tailored one. Job details will be ignored.")

    if st.button("Step 1: Parse & Generate (AI)", type="primary", key="btn_single", icon=":material/smart_toy:"):
        if not profile_data:
            st.error("Please load your Master CV Data in the 'My Profile & Documents' tab before generating documents.")
        elif not is_general and not job_url and not job_text:
            st.warning("Please enter a Job URL or paste the Job Description text.")
        else:
            with st.status("Building your application pipeline...", expanded=True) as status:
                if is_general:
                    st.write("Mode: Generalizing Resume...")
                    st.session_state.company_name = "General"
                    st.session_state.job_title = "Resume"
                    st.session_state.folder_name = create_application_folder_name("General", "Resume")
                    job_desc = "" 
                    requirements = {"resume": True, "cover_letter": False}
                    st.session_state.selected_resume_template = selected_resume
                else:
                    if input_method == "Scrape Job URL":
                        st.write("Scraping job description (Cloud Scraping Proxy)...")
                        job_desc = get_job_description(job_url)
                    else:
                        st.write("Parsing pasted job description...")
                        job_desc = job_text
                        
                    if not job_desc.strip():
                        status.update(label="Failed to fetch job description details.", state="error")
                        st.stop()
                        
                    st.write("Extracting Company and Job Title from description...")
                    metadata = extract_job_metadata(job_desc)
                    st.session_state.company_name = metadata.get("company_name", "Unknown_Company")
                    st.session_state.job_title = metadata.get("job_title", "Unknown_Position")
                    required_skills = metadata.get("required_skills", [])
                    
                    st.write(f"Detected: **{st.session_state.job_title}** at **{st.session_state.company_name}**")
                    if required_skills:
                        st.write(f"**Target Skills Extracted:** {', '.join(required_skills)}")
                        
                    st.session_state.folder_name = create_application_folder_name(st.session_state.company_name, st.session_state.job_title)
                    requirements = analyze_requirements(job_desc)
                    st.session_state.selected_resume_template = selected_resume

                st.write("Generating AI content using GPT-4o-mini...")
                if requirements["resume"]:
                    if is_general:
                        st.write("- Generating General Resume JSON...")
                        st.session_state.resume_json = generate_document("", personal_generation_data, "general_resume", custom_instructions)
                        st.session_state.ats_score = None
                    else:
                        st.write("- Generating Tailored Resume JSON...")
                        st.session_state.resume_json = generate_document(job_desc, personal_generation_data, "resume", custom_instructions)
                        
                        st.write("- Calculating ATS Match Score...")
                        st.session_state.ats_score = calculate_ats_score(job_desc, st.session_state.resume_json)
                    
                if requirements["cover_letter"]:
                    st.write("- Generating Cover Letter JSON...")
                    st.session_state.cover_letter_json = generate_document(job_desc, personal_generation_data, "cover_letter", custom_instructions)
                    
                # Reset download URLs
                st.session_state.resume_download_url = None
                st.session_state.cl_download_url = None
                
                status.update(label="AI Generation Complete! Edit below and compile.", state="complete", expanded=False)

    # --- ATS SCORE DISPLAY ---
    if st.session_state.ats_score:
        score = st.session_state.ats_score.get("score", 0)
        missing = st.session_state.ats_score.get("missing_keywords", [])
        
        st.markdown("---")
        st.subheader(f"ATS Match Score: {score}%")
        st.progress(score / 100.0)
        if missing:
            st.warning(f"**Missing Keywords:** Consider incorporating these into your resume JSON below: {', '.join(missing)}")
        else:
            st.success("Excellent alignment! No critical missing keywords found.")

    # --- EDITOR AREA ---
    if st.session_state.resume_json or st.session_state.cover_letter_json:
        st.markdown("---")
        st.subheader("Step 2: Review & Edit Content")
        st.markdown("Adjust the AI-generated text content. Ensure JSON syntax remains valid.")
        
        col1, col2 = st.columns(2)
        edited_resume_str = ""
        edited_cl_str = ""
        
        with col1:
            if st.session_state.resume_json:
                st.markdown("#### Resume Editor")
                edited_resume_str = st.text_area("Resume JSON", value=json.dumps(st.session_state.resume_json, indent=4), height=500, key="res_edit")
                
        with col2:
            if st.session_state.cover_letter_json:
                st.markdown("#### Cover Letter Editor")
                edited_cl_str = st.text_area("Cover Letter JSON", value=json.dumps(st.session_state.cover_letter_json, indent=4), height=500, key="cl_edit")
                
        if st.button("Step 3: Compile PDFs", type="primary", key="btn_compile", icon=":material/picture_as_pdf:"):
            with st.spinner("Compiling HTML to PDF and uploading to storage..."):
                resume_url = None
                cl_url = None
                
                if edited_resume_str:
                    try:
                        final_res_json = json.loads(edited_resume_str)
                        target_template = st.session_state.get("selected_resume_template", selected_resume)
                        html_res = inject_json_to_html(final_res_json, target_template)
                        if html_res:
                            resume_url = compile_to_pdf(html_res, st.session_state.folder_name, f"Resume_{st.session_state.company_name}.pdf", user_id=user.id)
                            st.session_state.resume_download_url = resume_url
                    except json.JSONDecodeError:
                        st.error("JSON formatting error in Resume Editor.")
                        
                if edited_cl_str:
                    try:
                        final_cl_json = json.loads(edited_cl_str)
                        html_cl = inject_json_to_html(final_cl_json, selected_cl)
                        if html_cl:
                            cl_url = compile_to_pdf(html_cl, st.session_state.folder_name, f"CoverLetter_{st.session_state.company_name}.pdf", user_id=user.id)
                            st.session_state.cl_download_url = cl_url
                    except json.JSONDecodeError:
                        st.error("JSON formatting error in Cover Letter Editor.")
                        
                if resume_url or cl_url:
                    # Save application record in database
                    try:
                        app_score = st.session_state.ats_score.get("score", 0) if st.session_state.ats_score else None
                        supabase.table("applications").insert({
                            "user_id": user.id,
                            "company_name": st.session_state.company_name,
                            "job_title": st.session_state.job_title,
                            "ats_score": app_score,
                            "resume_url": resume_url,
                            "cover_letter_url": cl_url
                        }).execute()
                        st.success("Application successfully compiled and archived in history!")
                        st.rerun() # Refresh stats
                    except Exception as e:
                        st.warning(f"Compiled successfully, but failed to log in application history table: {e}")
                        
        # Download panel
        if st.session_state.resume_download_url or st.session_state.cl_download_url:
            st.subheader("Download Generated Documents")
            d_col1, d_col2 = st.columns(2)
            with d_col1:
                if st.session_state.resume_download_url:
                    st.link_button("Download Resume PDF", st.session_state.resume_download_url, type="primary", icon=":material/download:")
            with d_col2:
                if st.session_state.cl_download_url:
                    st.link_button("Download Cover Letter PDF", st.session_state.cl_download_url, type="primary", icon=":material/download:")

with tab3:
    st.subheader("Batch Auto-Pilot Mode")
    st.markdown("Upload a text file containing job URLs (one per line). The AI will auto-generate and compile resumes directly to your archive.")
    
    uploaded_batch_file = st.file_uploader("Upload Job Links (.txt)", type=["txt"])
    if st.button("Start Batch Processing", type="primary", key="btn_batch", icon=":material/settings_suggest:"):
        if not profile_data:
            st.error("Please load your Master CV Data in the 'My Profile & Documents' tab first.")
        elif not uploaded_batch_file:
            st.warning("Please upload a .txt file containing URLs.")
        else:
            urls = [line.decode("utf-8").strip() for line in uploaded_batch_file if line.decode("utf-8").strip()]
            if not urls:
                st.error("No valid URLs found in file.")
            else:
                st.write(f"Processing {len(urls)} job links on auto-pilot...")
                progress_bar = st.progress(0)
                
                for idx, url in enumerate(urls):
                    with st.expander(f"Processing Job {idx+1}/{len(urls)}: {url[:50]}...", expanded=True):
                        job_desc = get_job_description(url)
                        if not job_desc.strip():
                            st.error("Failed to parse Job URL. Skipping.")
                            continue
                            
                        metadata = extract_job_metadata(job_desc)
                        c_name = metadata.get("company_name", "Unknown_Company")
                        j_title = metadata.get("job_title", "Unknown_Position")
                        st.write(f"**Extracted Job:** {j_title} at {c_name}")
                        
                        f_name = create_application_folder_name(c_name, j_title)
                        reqs = analyze_requirements(job_desc)
                        
                        resume_url = None
                        cl_url = None
                        app_score = None
                        
                        if reqs["resume"]:
                            st.write("- Generating Resume JSON...")
                            r_json = generate_document(job_desc, personal_generation_data, "resume", custom_instructions)
                            h_res = inject_json_to_html(r_json, selected_resume)
                            if h_res:
                                st.write("- Compiling Resume PDF...")
                                resume_url = compile_to_pdf(h_res, f_name, f"Resume_{c_name}.pdf", user_id=user.id)
                                st.write("✅ Resume compiled.")
                                
                            # Calculate score
                            st.write("- Checking ATS score...")
                            score_res = calculate_ats_score(job_desc, r_json)
                            app_score = score_res.get("score")
                                
                        if reqs["cover_letter"]:
                            st.write("- Generating Cover Letter JSON...")
                            c_json = generate_document(job_desc, personal_generation_data, "cover_letter", custom_instructions)
                            h_cl = inject_json_to_html(c_json, selected_cl)
                            if h_cl:
                                st.write("- Compiling Cover Letter PDF...")
                                cl_url = compile_to_pdf(h_cl, f_name, f"CoverLetter_{c_name}.pdf", user_id=user.id)
                                st.write("✅ Cover Letter compiled.")
                                
                        # Log application
                        try:
                            supabase.table("applications").insert({
                                "user_id": user.id,
                                "company_name": c_name,
                                "job_title": j_title,
                                "ats_score": app_score,
                                "resume_url": resume_url,
                                "cover_letter_url": cl_url
                            }).execute()
                        except Exception as e:
                            logger.error(f"Failed to log batch application: {e}")
                            
                    progress_bar.progress((idx + 1) / len(urls))
                
                st.success("Batch Auto-Pilot complete! Check the 'Applications Archive' tab to download files.")
                st.rerun() # Refresh stats

with tab4:
    # Phase Banner style title
    st.markdown("""
    <div class="phase-banner">
      <div class="phase-banner-title">Applications Archive</div>
      <div class="phase-banner-sub">Select and download previously compiled resumes and cover letters</div>
    </div>
    """, unsafe_allow_html=True)
    
    # Reload button for archive
    if st.button("Refresh Archive", icon=":material/refresh:"):
        st.rerun()
        
    try:
        archive_res = supabase.table("applications").select("*").eq("user_id", user.id).order("created_at", desc=True).execute()
        applications = archive_res.data
        
        if not applications:
            st.info("No applications generated yet. Start tailoring in the first tab!")
        else:
            # We display the applications as a grid of day-cards inspired by 60_Days_Pentest
            col1, col2 = st.columns(2)
            
            for index, app in enumerate(applications):
                created_date = app.get("created_at", "")[:10]
                score = app.get("ats_score")
                score_display = f"{score}%" if score is not None else "N/A"
                
                target_col = col1 if index % 2 == 0 else col2
                
                with target_col:
                    st.markdown(f"""
                    <div class="day-card">
                      <div class="day-card-header">Generated on {created_date}</div>
                      <div class="day-card-title">{app.get('job_title')} at <strong>{app.get('company_name')}</strong></div>
                      <div class="day-card-badge">ATS Score: {score_display}</div>
                    </div>
                    """, unsafe_allow_html=True)
                    
                    btn_a, btn_b = st.columns(2)
                    with btn_a:
                        if app.get("resume_url"):
                            st.link_button("Download CV", app.get("resume_url"), use_container_width=True, icon=":material/download:")
                        else:
                            st.caption("No CV generated")
                    with btn_b:
                        if app.get("cover_letter_url"):
                            st.link_button("Download Letter", app.get("cover_letter_url"), use_container_width=True, icon=":material/download:")
                        else:
                            st.caption("No Letter generated")
                    st.markdown("<br>", unsafe_allow_html=True)
                    
    except Exception as e:
        st.error(f"Failed to fetch application archive: {e}")

