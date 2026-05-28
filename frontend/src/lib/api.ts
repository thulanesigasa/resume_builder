const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

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

export const api = {
  async scrapeJob(url: string): Promise<ScrapeResponse> {
    const res = await fetch(`${API_BASE_URL}/api/scrape`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
      headers: { 'Content-Type': 'application/json' },
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
      headers: { 'Content-Type': 'application/json' },
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to compile document' }));
      throw new Error(err.detail || 'Failed to compile document');
    }
    return res.json();
  },

  async parseCv(file: File, userId: string): Promise<{ extracted_text: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_id', userId);

    const res = await fetch(`${API_BASE_URL}/api/parse-cv`, {
      method: 'POST',
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, raw_text: rawText }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to compile Master CV' }));
      throw new Error(err.detail || 'Failed to compile Master CV');
    }
    return res.json();
  },
};

