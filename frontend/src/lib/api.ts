import { supabase } from './supabase';

export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/+$/, '');

// Intercept all API calls in this file to handle expired tokens globally
const originalFetch = typeof window !== 'undefined' ? window.fetch : globalThis.fetch;
const fetchInterceptor = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const res = await originalFetch(input, init);
  if (res.status === 401 && typeof window !== 'undefined') {
    await supabase.auth.signOut().catch(() => {});
    window.location.href = '/login?expired=true';
    throw new Error('Session expired. Redirecting to login...');
  }
  return res;
};
const fetch = fetchInterceptor;

export interface ScrapeResponse {
  job_description: string;
  company_name: string;
  job_title: string;
  required_skills: string[];
  requirements: {
    resume: boolean;
    cover_letter: boolean;
  };
}

export interface AtsScoreResponse {
  score: number;
  missing_keywords: string[];
}

export interface CompileResponse {
  download_url: string;
}

const getHeaders = async (isFormData = false): Promise<HeadersInit> => {
  const headers: Record<string, string> = {};
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  } else if (typeof window !== 'undefined') {
    // Force redirect if session is null (expired or missing)
    window.location.href = '/login?expired=true';
    throw new Error('Session expired. Redirecting to login...');
  }
  
  return headers;
};

export const api = {
  async scrapeJob(url: string): Promise<ScrapeResponse> {
    const res = await fetch(`${API_BASE_URL}/api/scrape`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify({ url }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to scrape job' }));
      throw new Error(err.detail || 'Failed to scrape job');
    }
    return res.json();
  },

  async generateDoc(
    jobDescription: string,
    personalData: string,
    docType: 'resume' | 'general_resume' | 'cover_letter',
    customInstructions = ''
  ): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify({
        job_description: jobDescription,
        personal_data: personalData,
        doc_type: docType,
        custom_instructions: customInstructions,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to generate document' }));
      throw new Error(err.detail || 'Failed to generate document');
    }
    return res.json();
  },

  async getAtsScore(jobDescription: string, resumeJson: any): Promise<AtsScoreResponse> {
    const res = await fetch(`${API_BASE_URL}/api/ats-score`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify({
        job_description: jobDescription,
        resume_json: resumeJson,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to calculate ATS score' }));
      throw new Error(err.detail || 'Failed to calculate ATS score');
    }
    return res.json();
  },

  async compileDoc(params: {
    json_data: any;
    template_name: string;
    company_name: string;
    job_title: string;
    user_id: string;
    doc_type: 'resume' | 'cover_letter';
  }): Promise<CompileResponse> {
    const res = await fetch(`${API_BASE_URL}/api/compile`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to compile document' }));
      throw new Error(err.detail || 'Failed to compile document');
    }
    return res.json();
  },

  async previewHtml(templateName: string, jsonData: any): Promise<{ html_content: string }> {
    const res = await fetch(`${API_BASE_URL}/api/preview-html`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify({ template_name: templateName, json_data: jsonData }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to fetch preview' }));
      throw new Error(err.detail || 'Failed to fetch preview');
    }
    return res.json();
  },

  async parseCv(file: File, userId: string): Promise<{ extracted_text: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_id', userId);

    const res = await fetch(`${API_BASE_URL}/api/parse-cv`, {
      method: 'POST',
      headers: await getHeaders(true),
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to parse CV PDF' }));
      throw new Error(err.detail || 'Failed to parse CV PDF');
    }
    return res.json();
  },

  async compileMasterCv(userId: string, rawText: string): Promise<CompileResponse> {
    const res = await fetch(`${API_BASE_URL}/api/compile-master-cv`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify({ user_id: userId, raw_text: rawText }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to compile Master CV' }));
      throw new Error(err.detail || 'Failed to compile Master CV');
    }
    return res.json();
  },
  
  async autoNameDocument(extracted_text: string) {
    const res = await fetch(`${API_BASE_URL}/api/documents/auto-name`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify({ extracted_text }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to auto-name document' }));
      throw new Error(err.detail || 'Failed to auto-name document');
    }
    return res.json();
  },

  async improveText(text: string, context: string = "") {
    const res = await fetch(`${API_BASE_URL}/api/improve-text`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify({ text, context }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to improve text' }));
      throw new Error(err.detail || 'Failed to improve text');
    }
    return res.json();
  },

  async generateSummary(resumeData: any): Promise<{ options: string[] }> {
    const res = await fetch(`${API_BASE_URL}/api/generate-summary`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify({ resume_data: resumeData }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to generate summary options' }));
      throw new Error(err.detail || 'Failed to generate summary options');
    }
    return res.json();
  },

  async generateSkills(resumeData: any): Promise<{ skills: string[] }> {
    const res = await fetch(`${API_BASE_URL}/api/generate-skills`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify({ resume_data: resumeData }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to generate skills' }));
      throw new Error(err.detail || 'Failed to generate skills');
    }
    return res.json();
  },

  async createPayfastCheckout(amount: number, planName: string) {
    // Get the auth token first
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login?expired=true';
      }
      throw new Error('Session expired. Redirecting to login...');
    }

    // POST to backend to create the order and get the checkout ID
    const res = await fetch(`${API_BASE_URL}/api/payfast/create-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ amount, plan_name: planName }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to initialize Payfast checkout' }));
      throw new Error(err.detail || 'Failed to initialize Payfast checkout');
    }

    const data = await res.json();
    
    // Navigate the browser entirely away from the Next.js app to the backend's Render domain.
    // The backend serves the auto-submitting HTML page, bypassing the Next.js CSP entirely.
    if (typeof window !== 'undefined' && data.checkout_id) {
      window.location.href = `${API_BASE_URL}/api/payfast/redirect/${data.checkout_id}`;
    } else {
      throw new Error('Failed to get checkout ID from server');
    }
  }
};
