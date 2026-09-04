"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { api } from "@/lib/api";
import {
  ArrowLeft,
  FileCheck,
  Download,
  AlertTriangle,
  MoveVertical,
  Plus,
  Trash,
  Settings,
  Flame,
  Eye,
  Wand2,
  Sparkles,
  RefreshCw,
  Award,
  Upload,
  FileText,
  Check,
} from "lucide-react";

export default function EditorPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Resume & CL active JSON states
  const [resumeJson, setResumeJson] = useState<any>(null);
  const [clJson, setClJson] = useState<any>(null);
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [atsScore, setAtsScore] = useState<any>(null);
  const [selectedResume, setSelectedResume] = useState("ui_ux_pro_max_resume.html");
  const [selectedCl, setSelectedCl] = useState("caleb_foster_cover_letter.html");

  // View state
  const [activeTab, setActiveTab] = useState<"resume" | "cl">("resume");
  const [compiling, setCompiling] = useState(false);
  const [downloadUrls, setDownloadUrls] = useState<{ resume?: string; cl?: string }>({});
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<{name: string, type: string} | null>(null);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  // AI Feature States
  const [improvingSummary, setImprovingSummary] = useState(false);
  const [summaryOptions, setSummaryOptions] = useState<string[]>([]);
  const [isGeneratingSummaryOptions, setIsGeneratingSummaryOptions] = useState(false);
  const [isGeneratingSkills, setIsGeneratingSkills] = useState(false);
  const [suggestedSkills, setSuggestedSkills] = useState<{ name: string; type: "Technical" | "Soft" }[]>([]);
  const [improvingBulletKey, setImprovingBulletKey] = useState<string | null>(null);

  // Certificate / Credential States
  const [newCertName, setNewCertName] = useState("");
  const [newCertIssuer, setNewCertIssuer] = useState("");
  const [newCertDate, setNewCertDate] = useState("");
  const [newCertDetails, setNewCertDetails] = useState("");
  const [uploadingCert, setUploadingCert] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");

  // App-specific compile tracking
  const [appId, setAppId] = useState<string | null>(null);
  const [resumeCount, setResumeCount] = useState(0);
  const [clCount, setClCount] = useState(0);
  const MAX_RESUME_COMPILES = 2;
  const MAX_CL_COMPILES = 1;

  const handlePreview = async (templateName: string, type: string) => {
    setPreviewTemplate({ name: templateName, type });
    setPreviewLoading(true);
    setPreviewHtml(null);
    try {
      // Pass actual data from editor if it exists, otherwise pass dummy
      let previewData = type === 'Resume' ? (resumeJson || {}) : (clJson || {});
      
      // Cover letters also require contact_info for the header, grab it from resumeJson if missing
      if (type === 'Cover Letter' && !previewData.contact_info) {
        previewData = {
          ...previewData,
          contact_info: resumeJson?.contact_info || { name: "Applicant Name", email: "email@example.com", phone: "123-456-7890", location: "City, State" }
        };
      }
      
      const res = await api.previewHtml(templateName, previewData);
      setPreviewHtml(res.html_content);
    } catch (e) {
      setPreviewHtml("<div style='padding:20px; color:red; text-align:center;'>Failed to load preview. Please try again later.</div>");
    } finally {
      setPreviewLoading(false);
    }
  };

  const triggerToast = (message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  };

  // Native HTML5 Drag and Drop states
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [draggedBulletIndex, setDraggedBulletIndex] = useState<{ roleIndex: number; bulletIndex: number } | null>(null);

  useEffect(() => {
    const initEditor = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);

      // Load generation results from localStorage
      const cachedResume = localStorage.getItem("edit_resume_json");
      const cachedCl = localStorage.getItem("edit_cl_json");
      const cachedCompany = localStorage.getItem("edit_company");
      const cachedJobTitle = localStorage.getItem("edit_job_title");
      const cachedAts = localStorage.getItem("edit_ats_score");
      const cachedResTemplate = localStorage.getItem("edit_selected_resume_template");
      const cachedClTemplate = localStorage.getItem("edit_selected_cl_template");
      const cachedAppId = localStorage.getItem("edit_app_id");
      const cachedResCount = localStorage.getItem("edit_resume_compile_count");
      const cachedClCount = localStorage.getItem("edit_cl_compile_count");

      if (cachedResume) setResumeJson(JSON.parse(cachedResume));
      if (cachedCl) setClJson(JSON.parse(cachedCl));
      if (cachedCompany) setCompany(cachedCompany);
      if (cachedJobTitle) setJobTitle(cachedJobTitle);
      if (cachedAts) setAtsScore(JSON.parse(cachedAts));
      if (cachedResTemplate) setSelectedResume(cachedResTemplate);
      if (cachedClTemplate) setSelectedCl(cachedClTemplate);
      if (cachedAppId) setAppId(cachedAppId);
      if (cachedResCount) setResumeCount(parseInt(cachedResCount, 10));
      if (cachedClCount) setClCount(parseInt(cachedClCount, 10));

      setLoading(false);
    };

    initEditor();
  }, [router]);

  // Save JSON back to localStorage
  const persistChanges = (newResume: any, newCl: any) => {
    if (newResume) {
      setResumeJson(newResume);
      localStorage.setItem("edit_resume_json", JSON.stringify(newResume));
    }
    if (newCl) {
      setClJson(newCl);
      localStorage.setItem("edit_cl_json", JSON.stringify(newCl));
    }
  };

  // Compile Handler
  const handleCompilePdf = async () => {
    if (!user || !appId) {
      triggerToast("Application ID is missing. Cannot compile.", "error");
      return;
    }

    if (activeTab === "resume" && resumeCount >= MAX_RESUME_COMPILES) {
      triggerToast("Resume template compilation limit reached for this application.", "error");
      return;
    }
    if (activeTab === "cl" && clCount >= MAX_CL_COMPILES) {
      triggerToast("Cover letter template compilation limit reached for this application.", "error");
      return;
    }

    setCompiling(true);
    try {
      let finalUrl: string | null = null;

      if (activeTab === "resume" && resumeJson) {
        const res = await api.compileDoc({
          json_data: resumeJson,
          template_name: selectedResume,
          company_name: company,
          job_title: jobTitle,
          user_id: user.id,
          doc_type: "resume",
        });
        finalUrl = res.download_url;
        
        // Update database with new resume URL, json and count
        const newCount = resumeCount + 1;
        const { error } = await supabase.from("applications").update({
          resume_url: finalUrl,
          resume_json: resumeJson,
          resume_compile_count: newCount
        }).eq("id", appId);
        
        if (error) throw error;
        setResumeCount(newCount);
        localStorage.setItem("edit_resume_compile_count", String(newCount));
        setDownloadUrls((prev) => ({ ...prev, resume: finalUrl || undefined }));
      } 
      else if (activeTab === "cl" && clJson) {
        const clRes = await api.compileDoc({
          json_data: clJson,
          template_name: selectedCl,
          company_name: company,
          job_title: jobTitle,
          user_id: user.id,
          doc_type: "cover_letter",
        });
        finalUrl = clRes.download_url;

        // Update database with new CL URL, json and count
        const newCount = clCount + 1;
        const { error } = await supabase.from("applications").update({
          cover_letter_url: finalUrl,
          cl_json: clJson,
          cl_compile_count: newCount
        }).eq("id", appId);
        
        if (error) throw error;
        setClCount(newCount);
        localStorage.setItem("edit_cl_compile_count", String(newCount));
        setDownloadUrls((prev) => ({ ...prev, cl: finalUrl || undefined }));
      }

      triggerToast("PDF compiled successfully! Signed download link is ready.", "success");
    } catch (err: any) {
      triggerToast("Compilation failed: " + err.message, "error");
    } finally {
      setCompiling(false);
    }
  };

  // Skills Drag & Drop handlers
  const handleSkillDragStart = (idx: number) => {
    setDraggedItemIndex(idx);
  };

  const handleSkillDrop = (targetIdx: number) => {
    if (draggedItemIndex === null || !resumeJson) return;
    const skills = [...(resumeJson.skills || [])];
    const [dragged] = skills.splice(draggedItemIndex, 1);
    skills.splice(targetIdx, 0, dragged);
    persistChanges({ ...resumeJson, skills }, null);
    setDraggedItemIndex(null);
  };

  // Bullet Points Drag & Drop handlers
  const handleBulletDragStart = (roleIdx: number, bulletIdx: number) => {
    setDraggedBulletIndex({ roleIndex: roleIdx, bulletIndex: bulletIdx });
  };

  const handleBulletDrop = (roleIdx: number, targetBulletIdx: number) => {
    if (!draggedBulletIndex || draggedBulletIndex.roleIndex !== roleIdx || !resumeJson) return;
    const expList = [...(resumeJson.experience || [])];
    const achievements = [...(expList[roleIdx].achievements || [])];
    const [dragged] = achievements.splice(draggedBulletIndex.bulletIndex, 1);
    achievements.splice(targetBulletIdx, 0, dragged);
    expList[roleIdx].achievements = achievements;
    persistChanges({ ...resumeJson, experience: expList }, null);
    setDraggedBulletIndex(null);
  };

  // Inline changes modifiers
  const handleContactChange = (field: string, value: string) => {
    if (!resumeJson) return;
    persistChanges(
      {
        ...resumeJson,
        contact_info: {
          ...(resumeJson.contact_info || {}),
          [field]: value,
        },
      },
      null
    );
  };

  const handleSkillEdit = (idx: number, value: string) => {
    if (!resumeJson) return;
    const skills = [...(resumeJson.skills || [])];
    skills[idx] = value;
    persistChanges({ ...resumeJson, skills }, null);
  };

  const handleAddSkill = () => {
    if (!resumeJson) return;
    const skills = [...(resumeJson.skills || []), "New Skill"];
    persistChanges({ ...resumeJson, skills }, null);
  };

  const handleRemoveSkill = (idx: number) => {
    if (!resumeJson) return;
    const skills = [...(resumeJson.skills || [])];
    skills.splice(idx, 1);
    persistChanges({ ...resumeJson, skills }, null);
  };

  const handleExperienceChange = (roleIdx: number, field: string, value: string) => {
    if (!resumeJson) return;
    const expList = [...(resumeJson.experience || [])];
    expList[roleIdx] = { ...expList[roleIdx], [field]: value };
    persistChanges({ ...resumeJson, experience: expList }, null);
  };

  const handleBulletEdit = (roleIdx: number, bulletIdx: number, value: string) => {
    if (!resumeJson) return;
    const expList = [...(resumeJson.experience || [])];
    const achievements = [...(expList[roleIdx].achievements || [])];
    achievements[bulletIdx] = value;
    expList[roleIdx].achievements = achievements;
    persistChanges({ ...resumeJson, experience: expList }, null);
  };

  const handleAddBullet = (roleIdx: number) => {
    if (!resumeJson) return;
    const expList = [...(resumeJson.experience || [])];
    const achievements = [...(expList[roleIdx].achievements || []), "Describe achievement or metric..."];
    expList[roleIdx].achievements = achievements;
    persistChanges({ ...resumeJson, experience: expList }, null);
  };

  const handleRemoveBullet = (roleIdx: number, bulletIdx: number) => {
    if (!resumeJson) return;
    const expList = [...(resumeJson.experience || [])];
    const achievements = [...(expList[roleIdx].achievements || [])];
    achievements.splice(bulletIdx, 1);
    expList[roleIdx].achievements = achievements;
    persistChanges({ ...resumeJson, experience: expList }, null);
  };

  // --- AI Handlers for Editor ---
  const handleAiImproveSummary = async () => {
    if (!resumeJson) return;
    setImprovingSummary(true);
    try {
      const current = resumeJson.professional_summary || "";
      const context = `Target Job Title: ${jobTitle || "Professional"}, Company: ${company || ""}`;
      const res = await api.improveText(current || "Results-driven professional.", context);
      if (res?.improved_text) {
        persistChanges({ ...resumeJson, professional_summary: res.improved_text }, null);
        triggerToast("Summary enhanced with AI!", "success");
      }
    } catch (e: any) {
      triggerToast("Failed to improve summary: " + e.message, "error");
    } finally {
      setImprovingSummary(false);
    }
  };

  const handleAiGenerateSummaryOptions = async () => {
    if (!resumeJson) return;
    setIsGeneratingSummaryOptions(true);
    try {
      const res = await api.generateSummary(resumeJson);
      if (res?.options && res.options.length > 0) {
        setSummaryOptions(res.options);
        triggerToast("Generated 3 AI summary options!", "success");
      }
    } catch (e: any) {
      triggerToast("Failed to generate summary options: " + e.message, "error");
    } finally {
      setIsGeneratingSummaryOptions(false);
    }
  };

  const handleAiGenerateSkills = async () => {
    if (!resumeJson) return;
    setIsGeneratingSkills(true);
    try {
      const res = await api.generateSkills(resumeJson);
      if (res?.skills && res.skills.length > 0) {
        setSuggestedSkills(res.skills);
        triggerToast("Suggested AI skills ready!", "success");
      }
    } catch (e: any) {
      triggerToast("Failed to generate AI skills: " + e.message, "error");
    } finally {
      setIsGeneratingSkills(false);
    }
  };

  const handleAddSuggestedSkill = (skillName: string) => {
    if (!resumeJson) return;
    const currentSkills = resumeJson.skills || [];
    if (!currentSkills.includes(skillName)) {
      persistChanges({ ...resumeJson, skills: [...currentSkills, skillName] }, null);
      triggerToast(`Added ${skillName} to skills!`, "success");
    }
  };

  const handleAiImproveBullet = async (roleIdx: number, bulletIdx: number) => {
    if (!resumeJson) return;
    const expList = [...(resumeJson.experience || [])];
    const role = expList[roleIdx];
    const bulletText = role?.achievements?.[bulletIdx] || "";
    if (!bulletText.trim()) return;

    const key = `${roleIdx}-${bulletIdx}`;
    setImprovingBulletKey(key);
    try {
      const context = `Role Title: ${role.title || ""}, Company: ${role.company || ""}`;
      const res = await api.improveText(bulletText, context);
      if (res?.improved_text) {
        expList[roleIdx].achievements[bulletIdx] = res.improved_text;
        persistChanges({ ...resumeJson, experience: expList }, null);
        triggerToast("Bullet point rephrased with AI!", "success");
      }
    } catch (e: any) {
      triggerToast("Failed to rephrase bullet point: " + e.message, "error");
    } finally {
      setImprovingBulletKey(null);
    }
  };

  // --- Certificate Handlers ---
  const handleAddCertificate = () => {
    if (!resumeJson || !newCertName.trim()) return;
    const certList = [...(resumeJson.certifications || [])];
    certList.push({
      name: newCertName.trim(),
      issuer: newCertIssuer.trim(),
      date: newCertDate.trim(),
      details: newCertDetails.trim(),
    });
    persistChanges({ ...resumeJson, certifications: certList }, null);
    setNewCertName("");
    setNewCertIssuer("");
    setNewCertDate("");
    setNewCertDetails("");
    triggerToast("Certificate added to resume!", "success");
  };

  const handleRemoveCertificate = (idx: number) => {
    if (!resumeJson) return;
    const certList = [...(resumeJson.certifications || [])];
    certList.splice(idx, 1);
    persistChanges({ ...resumeJson, certifications: certList }, null);
    triggerToast("Certificate removed.", "info");
  };

  const handleUploadCertPdf = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !resumeJson) return;

    setUploadingCert(true);
    setUploadProgress("Parsing certificate PDF...");
    try {
      const res = await api.parseCv(file, user.id);
      const extractedText = res.extracted_text || "";

      let certName = file.name.replace(/\.[^/.]+$/, "");
      if (extractedText) {
        try {
          const nameRes = await api.autoNameDocument(extractedText);
          if (nameRes?.document_name) certName = nameRes.document_name;
        } catch (err) { /* fallback to file name */ }
      }

      const certList = [...(resumeJson.certifications || [])];
      certList.push({
        name: certName,
        issuer: "PDF Credential",
        date: new Date().getFullYear().toString(),
        details: extractedText.slice(0, 150),
      });

      persistChanges({ ...resumeJson, certifications: certList }, null);
      triggerToast("Certificate PDF uploaded & parsed successfully!", "success");
    } catch (err: any) {
      triggerToast("Failed to upload certificate: " + err.message, "error");
    } finally {
      setUploadingCert(false);
      setUploadProgress("");
    }
  };

  // CL edit modifiers
  const handleClContactChange = (field: string, value: string) => {
    if (!clJson) return;
    persistChanges(
      null,
      {
        ...clJson,
        contact_info: {
          ...(clJson.contact_info || {}),
          [field]: value,
        },
      }
    );
  };

  const handleClFieldChange = (field: string, value: string) => {
    if (!clJson) return;
    persistChanges(null, { ...clJson, [field]: value });
  };

  const handleClParagraphChange = (paraIdx: number, value: string) => {
    if (!clJson) return;
    const paragraphs = [...(clJson.body_paragraphs || [])];
    paragraphs[paraIdx] = value;
    persistChanges(null, { ...clJson, body_paragraphs: paragraphs });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-brand-indigo border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-brand-navy/60">Loading editor...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Editor top navigation bar */}
      <nav className="glass-panel sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-t-0 border-x-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/home")}
            className="p-2 btn-secondary hover:text-brand-indigo flex items-center gap-1 text-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <div className="h-6 w-[1px] bg-brand-navy/15"></div>
          <div>
            <h2 className="text-sm font-bold text-brand-deep leading-tight">
              {jobTitle || "Job Application"}
            </h2>
            <p className="text-[10px] text-brand-navy/70">Tailoring for {company || "Unknown Company"}</p>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex bg-brand-navy/5 border border-brand-navy/10 rounded-lg p-1">
          {resumeJson && (
            <button
              onClick={() => setActiveTab("resume")}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                activeTab === "resume" ? "bg-brand-indigo text-white shadow" : "text-brand-navy/65 hover:text-brand-deep"
              }`}
            >
              Resume
            </button>
          )}
          {clJson && (
            <button
              onClick={() => setActiveTab("cl")}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                activeTab === "cl" ? "bg-brand-indigo text-white shadow" : "text-brand-navy/65 hover:text-brand-deep"
              }`}
            >
              Cover Letter
            </button>
          )}
        </div>
      </nav>

      {/* Editor Split screen workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
        {/* Left Side: Drag-and-drop editor inputs */}
        <div className="lg:col-span-8 p-6 md:p-8 overflow-y-auto max-h-[calc(100vh-73px)] space-y-8">
          {activeTab === "resume" && resumeJson && (
            <div className="space-y-8">
              {/* Contact Info glass card */}
              <div className="glass-panel p-6 rounded-xl space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-brand-indigo border-b border-brand-navy/10 pb-2">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-brand-navy/70 mb-1">Full Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-1.5 glass-input text-xs"
                      value={resumeJson.contact_info?.name || ""}
                      onChange={(e) => handleContactChange("name", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-brand-navy/70 mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full px-3 py-1.5 glass-input text-xs"
                      value={resumeJson.contact_info?.email || ""}
                      onChange={(e) => handleContactChange("email", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-brand-navy/70 mb-1">Phone</label>
                    <input
                      type="text"
                      className="w-full px-3 py-1.5 glass-input text-xs"
                      value={resumeJson.contact_info?.phone || ""}
                      onChange={(e) => handleContactChange("phone", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-brand-navy/70 mb-1">Location</label>
                    <input
                      type="text"
                      className="w-full px-3 py-1.5 glass-input text-xs"
                      value={resumeJson.contact_info?.location || ""}
                      onChange={(e) => handleContactChange("location", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-brand-navy/70 mb-1">LinkedIn</label>
                    <input
                      type="text"
                      className="w-full px-3 py-1.5 glass-input text-xs"
                      value={resumeJson.contact_info?.linkedin || ""}
                      onChange={(e) => handleContactChange("linkedin", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-brand-navy/70 mb-1">GitHub</label>
                    <input
                      type="text"
                      className="w-full px-3 py-1.5 glass-input text-xs"
                      value={resumeJson.contact_info?.github || ""}
                      onChange={(e) => handleContactChange("github", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Professional Summary card with AI assistance */}
              <div className="glass-panel p-6 rounded-xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-brand-navy/10 pb-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-brand-indigo">
                    Professional Summary
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleAiImproveSummary}
                      disabled={improvingSummary}
                      className="px-2.5 py-1 btn-secondary text-[10px] font-bold flex items-center gap-1.5 text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors"
                    >
                      {improvingSummary ? (
                        <RefreshCw className="w-3 h-3 animate-spin" />
                      ) : (
                        <Wand2 className="w-3 h-3" />
                      )}
                      AI Enhance
                    </button>
                    <button
                      onClick={handleAiGenerateSummaryOptions}
                      disabled={isGeneratingSummaryOptions}
                      className="px-2.5 py-1 btn-secondary text-[10px] font-bold flex items-center gap-1.5 text-brand-indigo bg-brand-indigo/5 hover:bg-brand-indigo/10 transition-colors"
                    >
                      {isGeneratingSummaryOptions ? (
                        <RefreshCw className="w-3 h-3 animate-spin" />
                      ) : (
                        <Sparkles className="w-3 h-3" />
                      )}
                      AI Options
                    </button>
                  </div>
                </div>
                <textarea
                  className="w-full h-24 px-3 py-2 glass-input text-xs leading-relaxed"
                  value={resumeJson.professional_summary || ""}
                  onChange={(e) => persistChanges({ ...resumeJson, professional_summary: e.target.value }, null)}
                />

                {/* AI Summary Options cards if generated */}
                {summaryOptions.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-brand-navy/10 animate-in fade-in">
                    <p className="text-[10px] font-bold uppercase text-brand-navy/60">AI Suggested Variations (Click to Apply):</p>
                    <div className="space-y-2">
                      {summaryOptions.map((opt, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            persistChanges({ ...resumeJson, professional_summary: opt }, null);
                            triggerToast("Applied selected AI summary!", "success");
                          }}
                          className="p-3 bg-purple-50/50 hover:bg-purple-50 border border-purple-100 hover:border-purple-300 rounded-lg cursor-pointer transition-all text-xs text-brand-deep flex justify-between items-start gap-2 group"
                        >
                          <p className="flex-1 leading-relaxed">{opt}</p>
                          <span className="text-[10px] font-bold text-purple-700 opacity-0 group-hover:opacity-100 transition-opacity bg-white px-2 py-0.5 rounded shadow-xs">
                            Apply
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Skills Editor with AI suggestions and reorder */}
              <div className="glass-panel p-6 rounded-xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-brand-navy/10 pb-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-brand-indigo">
                    Core Skills (Drag & Drop to Rank)
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleAiGenerateSkills}
                      disabled={isGeneratingSkills}
                      className="px-2.5 py-1 btn-secondary text-[10px] font-bold flex items-center gap-1.5 text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors"
                    >
                      {isGeneratingSkills ? (
                        <RefreshCw className="w-3 h-3 animate-spin" />
                      ) : (
                        <Sparkles className="w-3 h-3" />
                      )}
                      AI Suggest Skills
                    </button>
                    <button
                      onClick={handleAddSkill}
                      className="p-1 btn-secondary text-[10px] font-bold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Skill
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {(resumeJson.skills || []).map((skill: string, idx: number) => (
                    <div
                      key={idx}
                      draggable
                      onDragStart={() => handleSkillDragStart(idx)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => handleSkillDrop(idx)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-navy/5 border border-brand-navy/10 hover:border-brand-indigo/30 rounded-lg cursor-grab active:cursor-grabbing select-none"
                    >
                      <MoveVertical className="w-3 h-3 text-brand-navy/60" />
                      <input
                        type="text"
                        className="bg-transparent border-none p-0 m-0 outline-none text-xs text-brand-deep max-w-[120px] focus:text-brand-indigo font-medium"
                        value={skill}
                        onChange={(e) => handleSkillEdit(idx, e.target.value)}
                      />
                      <button
                        onClick={() => handleRemoveSkill(idx)}
                        className="text-brand-navy/50 hover:text-red-500 transition-colors ml-1 font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                {/* AI Suggested Skill Tags */}
                {suggestedSkills.length > 0 && (
                  <div className="space-y-2 pt-3 border-t border-brand-navy/10 animate-in fade-in">
                    <p className="text-[10px] font-bold uppercase text-brand-navy/60">AI Suggested Skills (Click to Add):</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedSkills.map((s, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleAddSuggestedSkill(s.name)}
                          className="px-2.5 py-1 bg-purple-100 hover:bg-purple-200 text-purple-800 text-[11px] font-semibold rounded-md flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          {s.name} ({s.type})
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Work Experience Editor with AI rephraser */}
              <div className="glass-panel p-6 rounded-xl space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-brand-indigo border-b border-brand-navy/10 pb-2">
                  Work Experience
                </h3>

                <div className="space-y-6">
                  {(resumeJson.experience || []).map((exp: any, roleIdx: number) => (
                    <div key={roleIdx} className="p-4 bg-brand-navy/[0.01] border border-brand-navy/10 rounded-xl space-y-4">
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[9px] uppercase font-semibold text-brand-navy/60 mb-1">Company</label>
                          <input
                            type="text"
                            className="w-full px-2.5 py-1.5 glass-input text-xs"
                            value={exp.company || ""}
                            onChange={(e) => handleExperienceChange(roleIdx, "company", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase font-semibold text-brand-navy/60 mb-1">Role Title</label>
                          <input
                            type="text"
                            className="w-full px-2.5 py-1.5 glass-input text-xs"
                            value={exp.title || ""}
                            onChange={(e) => handleExperienceChange(roleIdx, "title", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase font-semibold text-brand-navy/60 mb-1">Dates</label>
                          <input
                            type="text"
                            className="w-full px-2.5 py-1.5 glass-input text-xs"
                            value={exp.dates || ""}
                            onChange={(e) => handleExperienceChange(roleIdx, "dates", e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Achievements items */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="block text-[9px] uppercase font-semibold text-brand-navy/60">
                            Bullet Achievements
                          </label>
                          <button
                            onClick={() => handleAddBullet(roleIdx)}
                            className="p-0.5 text-brand-navy/70 hover:text-brand-indigo flex items-center gap-0.5 text-[9px] font-semibold"
                          >
                            <Plus className="w-3 h-3" /> Add Bullet
                          </button>
                        </div>

                        <div className="space-y-2">
                          {(exp.achievements || []).map((bullet: string, bulletIdx: number) => {
                            const bulletKey = `${roleIdx}-${bulletIdx}`;
                            const isImproving = improvingBulletKey === bulletKey;
                            return (
                              <div
                                key={bulletIdx}
                                draggable
                                onDragStart={() => handleBulletDragStart(roleIdx, bulletIdx)}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={() => handleBulletDrop(roleIdx, bulletIdx)}
                                className="flex items-start gap-2 bg-brand-navy/[0.02] border border-brand-navy/10 p-2 rounded-lg cursor-grab active:cursor-grabbing hover:border-brand-indigo/30"
                              >
                                <MoveVertical className="w-3.5 h-3.5 text-brand-navy/60 mt-1 flex-shrink-0" />
                                <textarea
                                  className="flex-1 bg-transparent border-none p-0 m-0 outline-none text-xs text-brand-deep placeholder-brand-navy/30 resize-none h-auto focus:text-brand-deep leading-normal"
                                  rows={2}
                                  value={bullet}
                                  onChange={(e) => handleBulletEdit(roleIdx, bulletIdx, e.target.value)}
                                />
                                <button
                                  type="button"
                                  onClick={() => handleAiImproveBullet(roleIdx, bulletIdx)}
                                  disabled={isImproving}
                                  title="Rephrase & enhance bullet with AI"
                                  className="p-1 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded transition-colors flex-shrink-0 font-bold"
                                >
                                  {isImproving ? (
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-600" />
                                  ) : (
                                    <Wand2 className="w-3.5 h-3.5" />
                                  )}
                                </button>
                                <button
                                  onClick={() => handleRemoveBullet(roleIdx, bulletIdx)}
                                  className="text-brand-navy/50 hover:text-red-500 p-1 flex-shrink-0"
                                >
                                  <Trash className="w-3 h-3" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certificates & Credentials Section */}
              <div className="glass-panel p-6 rounded-xl space-y-6">
                <div className="flex items-center justify-between border-b border-brand-navy/10 pb-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-brand-indigo flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Certificates & Credentials
                  </h3>
                  <label className="px-3 py-1 btn-secondary text-[10px] font-bold flex items-center gap-1.5 cursor-pointer bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200">
                    <Upload className="w-3 h-3" />
                    {uploadingCert ? uploadProgress || "Uploading..." : "Upload Certificate (PDF)"}
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleUploadCertPdf}
                      disabled={uploadingCert}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* List of existing certificates */}
                {resumeJson.certifications && resumeJson.certifications.length > 0 ? (
                  <div className="space-y-3">
                    {resumeJson.certifications.map((cert: any, idx: number) => {
                      const isObj = typeof cert === "object" && cert !== null;
                      const cName = isObj ? cert.name : cert;
                      const cIssuer = isObj ? cert.issuer : "";
                      const cDate = isObj ? cert.date : "";
                      const cDetails = isObj ? cert.details : "";

                      return (
                        <div
                          key={idx}
                          className="p-3 bg-brand-navy/[0.02] border border-brand-navy/10 hover:border-brand-indigo/30 rounded-lg flex items-start justify-between gap-3 transition-colors"
                        >
                          <div className="space-y-1 min-w-0 flex-1">
                            <h5 className="text-xs font-bold text-brand-deep truncate">{cName}</h5>
                            {(cIssuer || cDate) && (
                              <p className="text-[10px] text-brand-navy/60 font-semibold">
                                {cIssuer}{cIssuer && cDate ? " • " : ""}{cDate}
                              </p>
                            )}
                            {cDetails && (
                              <p className="text-[11px] text-brand-navy/70 leading-snug line-clamp-2">{cDetails}</p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveCertificate(idx)}
                            className="text-brand-navy/40 hover:text-red-500 p-1"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-brand-navy/50 italic">No certificates added yet. Use the form below or upload a PDF.</p>
                )}

                {/* Add Manual Certificate Form */}
                <div className="p-4 bg-brand-navy/[0.01] border border-brand-navy/10 rounded-xl space-y-3">
                  <p className="text-[10px] font-bold uppercase text-brand-navy/60">Add Credential Manually</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Certificate Name (e.g. CCNA)"
                      className="px-3 py-1.5 glass-input text-xs"
                      value={newCertName}
                      onChange={(e) => setNewCertName(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Issuer (e.g. Cisco / TVET)"
                      className="px-3 py-1.5 glass-input text-xs"
                      value={newCertIssuer}
                      onChange={(e) => setNewCertIssuer(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Date / Year (e.g. 2026)"
                      className="px-3 py-1.5 glass-input text-xs"
                      value={newCertDate}
                      onChange={(e) => setNewCertDate(e.target.value)}
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Credential details or description (optional)"
                    className="w-full px-3 py-1.5 glass-input text-xs"
                    value={newCertDetails}
                    onChange={(e) => setNewCertDetails(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={handleAddCertificate}
                    disabled={!newCertName.trim()}
                    className="px-4 py-2 btn-primary text-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Save Certificate
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "cl" && clJson && (
            <div className="glass-panel p-6 rounded-xl space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-brand-indigo border-b border-brand-navy/10 pb-2">
                Cover Letter Editor
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-brand-navy/70 mb-1">Date</label>
                  <input
                    type="text"
                    className="w-full px-3 py-1.5 glass-input text-xs"
                    value={clJson.date || ""}
                    onChange={(e) => handleClFieldChange("date", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-brand-navy/70 mb-1">Recipient Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-1.5 glass-input text-xs"
                    value={clJson.recipient_name || ""}
                    onChange={(e) => handleClFieldChange("recipient_name", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-brand-navy/70 mb-1">Company Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-1.5 glass-input text-xs"
                    value={clJson.company_name || ""}
                    onChange={(e) => handleClFieldChange("company_name", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-brand-navy/70 mb-1">Greeting</label>
                  <input
                    type="text"
                    className="w-full px-3 py-1.5 glass-input text-xs"
                    value={clJson.greeting || ""}
                    onChange={(e) => handleClFieldChange("greeting", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-semibold text-brand-navy/70 mb-1">Opening Paragraph</label>
                <textarea
                  className="w-full h-24 px-3 py-2 glass-input text-xs leading-relaxed"
                  value={clJson.opening_paragraph || ""}
                  onChange={(e) => handleClFieldChange("opening_paragraph", e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <label className="block text-[10px] uppercase font-semibold text-brand-navy/70">Body Paragraphs</label>
                {(clJson.body_paragraphs || []).map((para: string, idx: number) => (
                  <textarea
                    key={idx}
                    className="w-full h-32 px-3 py-2 glass-input text-xs leading-relaxed"
                    value={para}
                    onChange={(e) => handleClParagraphChange(idx, e.target.value)}
                  />
                ))}
              </div>

              <div>
                <label className="block text-[10px] uppercase font-semibold text-brand-navy/70 mb-1">Closing Paragraph</label>
                <textarea
                  className="w-full h-24 px-3 py-2 glass-input text-xs leading-relaxed"
                  value={clJson.closing_paragraph || ""}
                  onChange={(e) => handleClFieldChange("closing_paragraph", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-brand-navy/70 mb-1">Sign Off</label>
                  <input
                    type="text"
                    className="w-full px-3 py-1.5 glass-input text-xs"
                    value={clJson.sign_off || ""}
                    onChange={(e) => handleClFieldChange("sign_off", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-brand-navy/70 mb-1">Applicant Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-1.5 glass-input text-xs"
                    value={clJson.applicant_name || ""}
                    onChange={(e) => handleClFieldChange("applicant_name", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Preview & compile configuration panel */}
        <div className="lg:col-span-4 p-6 bg-slate-50 border-l border-brand-navy/15 space-y-6 overflow-y-auto max-h-[calc(100vh-73px)]">
          {/* Action trigger Panel */}
          <div className="glass-panel p-5 rounded-xl space-y-4">
            <h3 className="text-sm font-bold text-brand-deep flex items-center gap-1.5">
              <Settings className="w-4.5 h-4.5 text-brand-indigo" />
              Compile & Export
            </h3>

            {/* Design styles configs */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-end mb-1">
                  <label className="block text-[10px] uppercase text-brand-navy/70 font-semibold">Active Template</label>
                  <button onClick={() => handlePreview(activeTab === "resume" ? selectedResume : selectedCl, activeTab === "resume" ? 'Resume' : 'Cover Letter')} className="text-[10px] text-brand-indigo hover:underline flex items-center gap-1">
                    <Eye className="w-3 h-3" /> Preview
                  </button>
                </div>
                <select
                  value={activeTab === "resume" ? selectedResume : selectedCl}
                  onChange={(e) =>
                    activeTab === "resume" ? setSelectedResume(e.target.value) : setSelectedCl(e.target.value)
                  }
                  className="w-full px-3 py-2 bg-white border border-brand-navy/15 rounded-lg text-xs text-brand-deep focus:outline-none focus:border-brand-indigo"
                >
                  {activeTab === "resume" ? (
                    <>
                      <option value="ui_ux_pro_max_resume.html">UI/UX Pro Max (Tailored)</option>
                      <option value="ats_resume_template.html">ATS Clean Blueprint</option>
                      <option value="david_turner_resume.html">David Turner (Modern Classic)</option>
                      <option value="amy_stein_resume.html">Amy Stein (Elegant Design)</option>
                      <option value="ava_martinez_resume.html">Ava Martinez (Minimalist)</option>
                      <option value="corporate_it_support_resume.html">Corporate IT Support Pro</option>
                    </>
                  ) : (
                    <>
                      <option value="caleb_foster_cover_letter.html">Caleb Foster (Modern Bold)</option>
                      <option value="takanori_ito_cover_letter.html">Takanori Ito (Formal)</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            <button
              onClick={handleCompilePdf}
              disabled={compiling || (activeTab === "resume" ? resumeCount >= MAX_RESUME_COMPILES : clCount >= MAX_CL_COMPILES)}
              className="w-full py-3 btn-primary text-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {compiling ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  <FileCheck className="w-4 h-4" />
                  {activeTab === "resume" 
                    ? `Compile Resume (${MAX_RESUME_COMPILES - resumeCount}/${MAX_RESUME_COMPILES} left)` 
                    : `Compile Cover Letter (${MAX_CL_COMPILES - clCount}/${MAX_CL_COMPILES} left)`}
                </>
              )}
            </button>

            {/* Download URLs panel */}
            {(downloadUrls.resume || downloadUrls.cl) && (
              <div className="pt-4 border-t border-brand-navy/10 space-y-2">
                <h4 className="text-[10px] uppercase font-semibold text-brand-navy/60">Ready Documents</h4>
                {downloadUrls.resume && (
                  <a
                    href={downloadUrls.resume}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 btn-secondary text-xs flex items-center justify-center gap-1 bg-brand-navy/5"
                  >
                    <Download className="w-3.5 h-3.5 text-brand-indigo" />
                    Download Resume PDF
                  </a>
                )}
                {downloadUrls.cl && (
                  <a
                    href={downloadUrls.cl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 btn-secondary text-xs flex items-center justify-center gap-1 bg-brand-navy/5"
                  >
                    <Download className="w-3.5 h-3.5 text-brand-indigo" />
                    Download Cover Letter PDF
                  </a>
                )}
              </div>
            )}
          </div>

          {/* ATS Score details */}
          {atsScore && activeTab === "resume" && (
            <div className="glass-panel p-5 rounded-xl space-y-4">
              <h3 className="text-sm font-bold text-brand-deep flex items-center gap-1.5">
                <Flame className="w-4.5 h-4.5 text-brand-indigo animate-pulse" />
                ATS Audit Scanner
              </h3>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-brand-navy/70">Match score:</span>
                  <span className="text-brand-deep font-bold">{atsScore.score}%</span>
                </div>
                <div className="w-full bg-brand-navy/5 border border-brand-navy/10 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-brand-indigo h-full rounded-full transition-all duration-300"
                    style={{ width: `${atsScore.score}%` }}
                  ></div>
                </div>
              </div>

              {atsScore.missing_keywords && atsScore.missing_keywords.length > 0 ? (
                <div className="space-y-2 pt-2 border-t border-brand-navy/10">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-brand-indigo uppercase tracking-wider block flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-brand-indigo" />
                      Missing Keywords
                    </span>
                    <button
                      onClick={() => {
                        const newSkills = [...(resumeJson?.skills || []), ...atsScore.missing_keywords];
                        persistChanges({ ...resumeJson, skills: newSkills }, null);
                        setAtsScore({ ...atsScore, missing_keywords: [] });
                        triggerToast("Missing keywords added to your skills!", "success");
                      }}
                      className="text-[10px] font-semibold text-white bg-brand-indigo hover:bg-brand-indigo/90 px-2 py-0.5 rounded transition-colors"
                    >
                      Add All to Skills
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {atsScore.missing_keywords.map((kw: string, i: number) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-brand-navy/5 border border-brand-navy/15 text-brand-deep font-semibold">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-700 font-semibold">
                  Optimal matching! All key skills detected.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Template Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-4xl w-full h-[85vh] rounded-2xl p-6 relative bg-white flex flex-col">
            <div className="flex items-center justify-between border-b border-brand-navy/10 pb-3 mb-4">
              <h3 className="text-base font-bold text-brand-deep flex items-center gap-2 capitalize">
                <Eye className="w-5 h-5 text-brand-indigo" />
                {previewTemplate.type} Preview: <span className="font-normal text-sm ml-1 text-brand-navy/80">{previewTemplate.name.replace('.html', '').replace(/_/g, ' ')}</span>
              </h3>
              <button onClick={() => setPreviewTemplate(null)} className="text-brand-navy/60 hover:text-brand-deep font-bold text-xl cursor-pointer">×</button>
            </div>
            
            <div className="flex-1 bg-brand-navy/5 rounded-lg border border-brand-navy/10 overflow-hidden relative">
              {previewLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10">
                  <div className="w-8 h-8 border-4 border-brand-indigo border-t-transparent rounded-full animate-spin mb-2"></div>
                  <p className="text-sm font-semibold text-brand-navy/60">Rendering Template...</p>
                </div>
              )}
              {previewHtml && (
                <>
                  <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                    <div className="transform -rotate-45 text-brand-navy/20 font-black text-6xl tracking-widest whitespace-nowrap">
                      PREVIEW ONLY
                    </div>
                  </div>
                  <iframe 
                    srcDoc={previewHtml}
                    className="w-full h-full border-none blur-[4px] select-none pointer-events-none"
                    title="Template Preview"
                  />
                </>
              )}
            </div>
            
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setPreviewTemplate(null)}
                className="px-4 py-2 btn-secondary text-xs cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className={`p-4 rounded-xl border shadow-lg flex items-center gap-2 max-w-sm ${
            toast.type === "success" 
              ? "bg-white border-green-200 text-green-800" 
              : toast.type === "error" 
              ? "bg-white border-red-200 text-red-800" 
              : "bg-white border-brand-indigo/35 text-brand-deep"
          }`}>
            <span className="text-xs font-semibold">{toast.message}</span>
            <button onClick={() => setToast(null)} className="text-xs ml-auto opacity-75 hover:opacity-100 font-bold px-1.5 py-0.5">×</button>
          </div>
        </div>
      )}
    </div>
  );
}
