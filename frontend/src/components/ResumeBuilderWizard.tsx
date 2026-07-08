"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  GripVertical,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  Link,
  AlignLeft,
  Info,
  Loader2,
  AlertCircle,
  FileText,
  RefreshCw
} from "lucide-react";
import { api, API_BASE_URL } from "@/lib/api";
import { supabase } from "@/lib/supabase";

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- MonthYearPicker Component ---
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function MonthYearPicker({ value, onChange, label, disabled = false }: { value: string; onChange: (v: string) => void; label: string; disabled?: boolean }) {
  const [open, setOpen] = useState(false);
  // Open with year-first, then switch to month after year is chosen
  const [view, setView] = useState<'year' | 'month'>('year');
  const [yearPage, setYearPage] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const selectedMonth = value ? parseInt(value.split('-')[1]) - 1 : null; // 0-indexed
  const selectedYear  = value ? parseInt(value.split('-')[0]) : null;

  const displayLabel = value
    ? `${MONTHS[selectedMonth!]} ${selectedYear}`
    : 'Select date';

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const baseYear = new Date().getFullYear() + 2;
  const yearsPerPage = 9;
  const startYear = baseYear - yearPage * yearsPerPage;
  const years = Array.from({ length: yearsPerPage }, (_, i) => startYear - i);

  // Step 1: pick year → switch to month view
  const pickYear = (yr: number) => {
    const mm = selectedMonth !== null ? String(selectedMonth + 1).padStart(2, '0') : '01';
    onChange(`${yr}-${mm}`);
    setView('month'); // after year → show months
  };

  // Step 2: pick month → close
  const pickMonth = (mIdx: number) => {
    const yr = selectedYear ?? new Date().getFullYear();
    const mm = String(mIdx + 1).padStart(2, '0');
    onChange(`${yr}-${mm}`);
    setOpen(false);
    setView('year'); // reset for next open
  };

  return (
    <div ref={ref} className="relative">
      <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-brand-navy/60 uppercase tracking-wider rounded-md z-10">{label}</label>
      <button
        type="button"
        disabled={disabled}
        onClick={() => { if (!disabled) { setOpen(!open); setView('year'); } }}
        className={`w-full text-left px-4 py-3 glass-input font-medium text-sm focus:outline-none focus:ring-2 focus:ring-brand-indigo/50 flex items-center justify-between ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-brand-indigo/50'
        } ${value ? 'text-brand-deep' : 'text-brand-navy/40'}`}
      >
        <span>{displayLabel}</span>
        <ChevronRight className="w-4 h-4 text-brand-navy/40 rotate-90" />
      </button>

      {open && (
        <div className="absolute z-50 top-[calc(100%+8px)] left-0 w-[240px] bg-white rounded-2xl shadow-2xl border border-brand-navy/10 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-brand-navy/10 bg-brand-indigo/5">
            <button
              onClick={() => setView(view === 'year' ? 'month' : 'year')}
              className="text-xs font-bold text-brand-indigo hover:underline"
            >
              {view === 'year' ? 'Pick Year' : `${selectedYear ?? new Date().getFullYear()} — Pick Month`}
            </button>
            {view === 'year' && (
              <div className="flex gap-1">
                <button onClick={() => setYearPage(p => p + 1)} className="p-1 rounded hover:bg-brand-indigo/10 text-brand-navy/60 hover:text-brand-indigo">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={() => setYearPage(p => Math.max(0, p - 1))} className="p-1 rounded hover:bg-brand-indigo/10 text-brand-navy/60 hover:text-brand-indigo">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Year Grid: 3×3, paginated with arrows */}
          {view === 'year' && (
            <div className="grid grid-cols-3 gap-1.5 p-3">
              {years.map(yr => (
                <button
                  key={yr}
                  onClick={() => pickYear(yr)}
                  className={`py-2 rounded-lg text-xs font-bold transition-all ${
                    selectedYear === yr
                      ? 'bg-brand-indigo text-white shadow-md'
                      : 'text-brand-navy/70 hover:bg-brand-indigo/10 hover:text-brand-indigo'
                  }`}
                >{yr}</button>
              ))}
            </div>
          )}

          {/* Month Grid: 3×4 */}
          {view === 'month' && (
            <div className="grid grid-cols-3 gap-1.5 p-3">
              {MONTHS.map((m, i) => (
                <button
                  key={m}
                  onClick={() => pickMonth(i)}
                  className={`py-2 rounded-lg text-xs font-bold transition-all ${
                    selectedMonth === i
                      ? 'bg-brand-indigo text-white shadow-md'
                      : 'text-brand-navy/70 hover:bg-brand-indigo/10 hover:text-brand-indigo'
                  }`}
                >{m}</button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// --- Sortable Components ---

function SortableSkillItem({ id, skill, index, onChangeName, onChangeLevel, onDelete }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 50 : 1 };
  
  const LEVELS = ["Novice", "Intermediate", "Advanced", "Expert"];
  const levelIndex = LEVELS.indexOf(skill.level);
  const levelColors = ["bg-sky-400", "bg-teal-400", "bg-brand-indigo", "bg-violet-600"];
  const activeLabelColor = ["text-sky-500", "text-teal-500", "text-brand-indigo", "text-violet-600"];

  return (
    <div ref={setNodeRef} style={style} className={`flex items-center gap-4 glass-panel px-4 py-3 rounded-xl border border-brand-navy/10 group relative transition-colors ${isDragging ? 'shadow-2xl border-brand-indigo ring-2 ring-brand-indigo/50' : 'hover:border-brand-indigo/50'}`}>
      
      {/* Skill name — full width, no truncation */}
      <div className="flex-1 min-w-0 relative">
        <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-brand-navy/60 uppercase tracking-wider rounded-md">Skill</label>
        <input 
          type="text" 
          className="w-full px-4 py-3 glass-input text-brand-deep font-medium focus:outline-none focus:ring-2 focus:ring-brand-indigo/50" 
          value={skill.name} 
          onChange={(e) => onChangeName(e.target.value)} 
          placeholder="e.g. JavaScript" 
        />
      </div>

      {/* Skill level — compact vertical stack */}
      <div className="flex flex-col gap-1.5 w-36 shrink-0">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold text-brand-navy/50 uppercase tracking-wider">Level</span>
          <span className={`text-[10px] font-extrabold uppercase tracking-wide ${activeLabelColor[levelIndex] ?? 'text-brand-navy/40'}`}>
            {skill.level}
          </span>
        </div>
        {/* 4-segment progress bar */}
        <div className="flex gap-1">
          {LEVELS.map((lvl, i) => (
            <div
              key={lvl}
              title={lvl}
              onClick={() => onChangeLevel(lvl)}
              className={`h-2 flex-1 rounded-full cursor-pointer transition-all duration-300 ${i <= levelIndex ? levelColors[levelIndex] : 'bg-brand-navy/10 hover:bg-brand-navy/20'}`}
            />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 items-center text-brand-navy/40 shrink-0">
        <div {...attributes} {...listeners} className="cursor-grab hover:text-brand-indigo touch-none">
          <GripVertical className="w-5 h-5" />
        </div>
        <button onClick={onDelete} className="hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
      </div>
    </div>
  );
}

interface UploadingFile {
  id: string;
  file: File;
  name: string;
  size: number;
  progress: number;
  speed: string;
  eta: string;
  status: "idle" | "uploading" | "success" | "error";
  errorMsg?: string;
  dbRecordId?: string;
  aiName?: string;
  aiDescription?: string;
  isEditing?: boolean;
}

interface ResumeBuilderWizardProps {
  selectedTemplate?: string;
  onSave: (compiledMarkdown: string) => void;
  onCancel: () => void;
  onComplete?: () => void;
}

const STEPS = ["CONTACT", "EXPERIENCE", "EDUCATION", "PROFESSIONAL SUMMARY", "CERTIFICATES", "SKILLS", "FINISH IT", "DOWNLOAD"];

export default function ResumeBuilderWizard({ selectedTemplate, onSave, onCancel, onComplete }: ResumeBuilderWizardProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [validationError, setValidationError] = useState<string | null>(null);

  // --- State ---
  const [contact, setContact] = useState({ firstName: "", lastName: "", city: "", postalCode: "", phone: "", email: "" });
  const [experiences, setExperiences] = useState([{ id: "1", title: "", employer: "", startDate: "", endDate: "", city: "", current: false, description: "" }]);
  const [educations, setEducations] = useState([{ id: "1", school: "", degree: "", startDate: "", endDate: "", city: "", current: false, description: "" }]);
  const [skills, setSkills] = useState([{ id: "1", name: "", level: "Expert" }]);
  const [summary, setSummary] = useState("");
  const [documentTitle, setDocumentTitle] = useState("Untitled Resume");
  const [format, setFormat] = useState({ template: "ats_resume_template.html", accentColor: "#4f46e5", titleFont: "BEBAS NEUE (DEFAULT)", bodyFont: "Lato (default)", language: "English" });

  // --- AI State ---
  const [improvingExpId, setImprovingExpId] = useState<string | null>(null);
  const [improvingSummary, setImprovingSummary] = useState(false);
  const [summaryOptions, setSummaryOptions] = useState<string[]>([]);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  // --- Certificates State ---
  const [certificates, setCertificates] = useState<any[]>([]);
  // Ref that always mirrors the latest certificates — safe to read inside async upload closures
  const certificatesRef = useRef<any[]>([]);
  const [uploadingCert, setUploadingCert] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [newCertName, setNewCertName] = useState("");
  const [manualCertText, setManualCertText] = useState("");
  const certFileInputRef = useRef<HTMLInputElement>(null);
  const [certUrls, setCertUrls] = useState<Record<string, string>>({});
  const [manualSaveSuccess, setManualSaveSuccess] = useState(false);

  // --- New Advanced Upload States ---
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);

  // --- Custom Confirm Modal State ---
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteConfirmAction, setDeleteConfirmAction] = useState<{
    title: string;
    message: string;
    onConfirm: () => Promise<void> | void;
  } | null>(null);

  // Keep ref always in sync with state so async closures can read fresh data
  useEffect(() => {
    certificatesRef.current = certificates;
  }, [certificates]);

  const formatBytes = (bytes: number, decimals = 1) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  // --- AI Skills State ---
  const [isGeneratingSkills, setIsGeneratingSkills] = useState(false);
  const [skillsOptions, setSkillsOptions] = useState<string[]>([]);

  useEffect(() => {
    const fetchCerts = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return;
      const { data } = await supabase
        .from("certificates")
        .select("*")
        .eq("user_id", session.user.id);
      if (data) {
        setCertificates(data);
        const urls: Record<string, string> = {};
        for (const cert of data) {
          const { data: signData } = await supabase.storage
            .from("resumes")
            .createSignedUrl(`${session.user.id}/certificates/${cert.id}.pdf`, 7200);
          if (signData?.signedUrl) {
            urls[cert.id] = signData.signedUrl;
          }
        }
        setCertUrls(urls);
      }
    };
    fetchCerts();
  }, []);

  // --- Live Preview State ---
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(0.4);

  // Step 8 loader states
  const [isStep7Preparing, setIsStep7Preparing] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);

  useEffect(() => {
    if (currentStep === 7) {
      setIsStep7Preparing(true);
      const timer = setTimeout(() => {
        setIsStep7Preparing(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  // Soft-confirm skip modal
  const [confirmSkipModal, setConfirmSkipModal] = useState<{ message: string; onConfirm: () => void } | null>(null);

  // --- Dynamic Preview Scale: fill container edge-to-edge ---
  useEffect(() => {
    if (!previewContainerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        // Scale to height first to fill vertical space
        let scale = height / 1131;
        // Fallback to width-based scale if height-based scale causes horizontal overflow (cutting off words)
        if (800 * scale > width) {
          scale = width / 800;
        }
        setPreviewScale(Math.min(scale, 1.5));
      }
    });
    observer.observe(previewContainerRef.current);
    return () => observer.disconnect();
  }, [isLoaded]);

  // --- Load Draft on Mount ---
  useEffect(() => {
    const draft = localStorage.getItem("resume_wizard_draft");
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        if (parsed.contact) setContact(parsed.contact);
        if (parsed.experiences) setExperiences(parsed.experiences);
        if (parsed.educations) setEducations(parsed.educations);
        if (parsed.skills) setSkills(parsed.skills);
        // Map old draft 'about' to summary if summary is empty
        if (parsed.summary) {
          setSummary(parsed.summary);
        } else if (parsed.about) {
          setSummary(parsed.about);
        }
        if (parsed.documentTitle) setDocumentTitle(parsed.documentTitle);
        if (parsed.format) {
          // Backward compatibility check for old template names
          const validTemplates = ['ats_resume_template.html', 'ui_ux_pro_max_resume.html', 'amy_stein_resume.html', 'ava_martinez_resume.html', 'david_turner_resume.html'];
          if (!validTemplates.includes(parsed.format.template)) {
            parsed.format.template = 'ats_resume_template.html';
          }
          setFormat(parsed.format);
        }
      } catch (e) {
        console.error("Failed to parse draft");
      }
    }
    setIsLoaded(true);
  }, []);

  // --- Save Draft on Change ---
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("resume_wizard_draft", JSON.stringify({ contact, experiences, educations, skills, summary, documentTitle, format }));
    }
  }, [contact, experiences, educations, skills, summary, documentTitle, format, isLoaded]);

  useEffect(() => {
    if (selectedTemplate) {
      setFormat(prev => ({ ...prev, template: selectedTemplate }));
    }
  }, [selectedTemplate]);

  // --- Live Preview API Hook ---
  useEffect(() => {
    if (!isLoaded) return;
    const hasData = contact.firstName || contact.lastName || summary || experiences[0]?.employer || educations[0]?.school || skills[0]?.name;
    if (!hasData) {
      setPreviewHtml(null);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsPreviewLoading(true);
      try {
        const dummyData = {
          accent_color: format.accentColor || '#4f46e5',
          title_font: format.titleFont || 'BEBAS NEUE (DEFAULT)',
          body_font: format.bodyFont || 'Lato',
          contact_info: {
            name: `${contact.firstName} ${contact.lastName}`.trim() || "Your Name",
            email: contact.email || "",
            phone: contact.phone || "",
            location: `${contact.city} ${contact.postalCode}`.trim() || "",
            linkedin: "",
            github: ""
          },
          professional_summary: summary || "",
          skills: skills.filter(s => s.name).map(s => `${s.name} (${s.level})`),
          technical_skills: skills.filter(s => s.name).map(s => `${s.name} (${s.level})`),
          experience: experiences.filter(e => e.title || e.employer).map(e => ({
            company: e.employer || "Employer",
            title: e.title || "Job Title",
            dates: `${e.startDate} - ${e.current ? 'Present' : e.endDate}`,
            achievements: e.description ? e.description.split('\n').filter(l => l.trim()) : []
          })),
          education: educations.filter(e => e.school || e.degree).map(e => ({
            institution: e.school || "Institution Name",
            degree: e.degree || "Degree",
            qualification: e.degree || "Degree",
            dates: `${e.startDate} - ${e.current ? 'Present' : e.endDate}`
          })),
          // Provide empty arrays for optional template sections to prevent Jinja2 errors
          certifications: [],
          professional_memberships: [],
          professional_development: [],
          languages: [],
        };

        const res = await api.previewHtml(format.template, dummyData);
        setPreviewHtml(res.html_content);
      } catch (e) {
        console.error("Failed to load live preview", e);
      } finally {
        setIsPreviewLoading(false);
      }
    }, 1000); // 1-second debounce
    return () => clearTimeout(timeoutId);
  }, [contact, experiences, educations, skills, summary, format, isLoaded]);

  // --- AI Handlers ---
  const handleImproveExperience = async (id: string, text: string, employer: string, title: string) => {
    if (!text.trim()) return;
    setImprovingExpId(id);
    try {
      const context = `Job Title: ${title}, Employer: ${employer}`;
      const res = await api.improveText(text, context);
      setExperiences(experiences.map(e => e.id === id ? { ...e, description: res.improved_text } : e));
    } catch (e) {
      console.error(e);
    } finally {
      setImprovingExpId(null);
    }
  };

  const handleImproveSummary = async (isShort = false) => {
    setImprovingSummary(true);
    try {
      // Gather all resume details to build a rich context
      let context = `Generate or improve a professional summary using the following complete resume details:\n\n`;
      context += `Name: ${contact.firstName} ${contact.lastName}\n`;
      if (experiences.length > 0) {
        context += `Experiences:\n`;
        experiences.forEach(e => {
          if (e.title || e.employer) {
            context += `- ${e.title} at ${e.employer} (${e.startDate} - ${e.endDate}). Duties: ${e.description}\n`;
          }
        });
      }
      if (educations.length > 0) {
        context += `Education:\n`;
        educations.forEach(e => {
          if (e.school || e.degree) {
            context += `- ${e.degree} at ${e.school} (${e.startDate} - ${e.current ? 'Present' : e.endDate})\n`;
          }
        });
      }
      const activeSkills = skills.filter(s => s.name).map(s => s.name);
      if (activeSkills.length > 0) {
        context += `Skills: ${activeSkills.join(", ")}\n`;
      }

      if (isShort) {
        context += `\nINSTRUCTIONS: Write a short introduction about the user. It must be exactly 2 sentences (or roughly 2 lines) in length. Make it engaging, professional, and personal. Do not use quotes, greetings, signatures, or markdown.`;
      } else {
        context += `\nINSTRUCTIONS: You must write a high-quality professional summary of exactly 3 sentences (or roughly 3 lines). Make it sound extremely professional, action-oriented, and highlight the user's key experiences and skills. Do not add any greeting, signature, or markdown.`;
      }

      const contextHint = isShort ? "about" : "summary";
      const res = await api.improveText(summary || "Generate a summary from scratch.", `${contextHint}\n${context}`);
      setSummary(res.improved_text);
    } catch (e) {
      console.error(e);
    } finally {
      setImprovingSummary(false);
    }
  };

  const handleGenerateSummaryOptions = async () => {
    setIsGeneratingSummary(true);
    try {
      const resumeData = {
        about: summary || "",
        experiences,
        educations,
        skills
      };
      const res = await api.generateSummary(resumeData);
      setSummaryOptions(res.options || []);
    } catch (e) {
      console.error(e);
      setValidationError("Failed to generate summary options. Make sure your profile has some data first.");
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleSaveManualCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCertName.trim() || !manualCertText.trim()) return;

    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    if (!userId) return;

    setUploadingCert(true);
    setUploadProgress("Saving manual entry...");
    try {
      const { error: manualError } = await supabase
        .from("certificates")
        .insert({
          user_id: userId,
          name: newCertName,
          extracted_text: manualCertText,
        });
      if (manualError) throw manualError;

      setNewCertName("");
      setManualCertText("");

      // Refresh certificates
      const { data } = await supabase
        .from("certificates")
        .select("*")
        .eq("user_id", userId);
      if (data) {
        setCertificates(data);
        const urls: Record<string, string> = {};
        for (const cert of data) {
          const { data: signData } = await supabase.storage
            .from("resumes")
            .createSignedUrl(`${userId}/certificates/${cert.id}.pdf`, 7200);
          if (signData?.signedUrl) {
            urls[cert.id] = signData.signedUrl;
          }
        }
        setCertUrls(urls);
      }
      setManualSaveSuccess(true);
      setTimeout(() => setManualSaveSuccess(false), 4000);
    } catch (err: any) {
      alert("Failed to save certificate: " + err.message);
    } finally {
      setUploadingCert(false);
      setUploadProgress("");
    }
  };

  const uploadSingleFile = async (uploadId: string, file: File) => {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    if (!userId) {
      setUploadingFiles(prev => prev.map(f => f.id === uploadId ? { ...f, status: "error", errorMsg: "Session expired" } : f));
      return;
    }

    // Check pre-upload duplicate name using ref (always fresh, no stale closure)
    const freshCerts = certificatesRef.current;
    const fileBaseName = file.name.replace(/\.[^/.]+$/, "").toLowerCase();
    const isDuplicate = freshCerts.some(cert => {
      const certName = (cert.name || "").toLowerCase();
      return certName === file.name.toLowerCase() || certName === fileBaseName;
    });
    if (isDuplicate) {
      setUploadingFiles(prev => prev.map(f => f.id === uploadId ? { ...f, status: "error", errorMsg: "A certificate with this name already exists in your saved credentials." } : f));
      return;
    }

    setUploadingFiles(prev => prev.map(f => f.id === uploadId ? { ...f, status: "uploading", progress: 0, speed: "", eta: "", errorMsg: undefined } : f));

    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", userId);

    const xhr = new XMLHttpRequest();
    
    let lastLoaded = 0;
    let lastTime = Date.now();

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        
        const now = Date.now();
        const timeDiff = (now - lastTime) / 1000;
        let speedStr = "";
        let etaStr = "";

        if (timeDiff >= 0.5) {
          const loadedDiff = event.loaded - lastLoaded;
          const speed = loadedDiff / timeDiff;
          
          if (speed > 1024 * 1024) {
            speedStr = `${(speed / (1024 * 1024)).toFixed(1)} MB/s`;
          } else if (speed > 1024) {
            speedStr = `${(speed / 1024).toFixed(0)} KB/s`;
          } else {
            speedStr = `${speed.toFixed(0)} B/s`;
          }

          const remainingBytes = event.total - event.loaded;
          if (speed > 0) {
            const eta = Math.round(remainingBytes / speed);
            etaStr = eta === 0 ? "finishing..." : `${eta}s left`;
          }

          lastLoaded = event.loaded;
          lastTime = now;
        }

        setUploadingFiles(prev => prev.map(f => f.id === uploadId ? { 
          ...f, 
          progress, 
          speed: speedStr || f.speed, 
          eta: etaStr || f.eta 
        } : f));
      }
    };

    xhr.onload = async () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const parseRes = JSON.parse(xhr.responseText);
          const extractedText = parseRes.extracted_text;

          if (!extractedText || !extractedText.trim()) {
            throw new Error("Could not extract any text.");
          }

          // Check text duplicate using ref (always fresh, no stale closure)
          const freshCertsNow = certificatesRef.current;
          const normText = extractedText.trim().toLowerCase();
          const isTextDuplicate = freshCertsNow.some(cert => 
            (cert.extracted_text || "").trim().toLowerCase() === normText
          );
          if (isTextDuplicate) {
            throw new Error("This certificate is already saved in your Credentials & Certificates.");
          }

          const nameRes = await api.autoNameDocument(extractedText);
          const aiName = nameRes.name || "Untitled Document";

          const { data: certRecord, error: insertError } = await supabase
            .from("certificates")
            .insert({
              user_id: userId,
              name: aiName,
              extracted_text: extractedText,
            })
            .select("id")
            .single();

          if (insertError) throw insertError;

          if (certRecord) {
            await supabase.storage
              .from("resumes")
              .upload(`${userId}/certificates/${certRecord.id}.pdf`, file, { upsert: true });
          }

          setUploadingFiles(prev => prev.map(f => f.id === uploadId ? { 
            ...f, 
            status: "success", 
            progress: 100,
            dbRecordId: certRecord?.id,
            aiName: aiName,
            aiDescription: extractedText,
            isEditing: false
          } : f));

          // Refresh certificates list
          const { data } = await supabase
            .from("certificates")
            .select("*")
            .eq("user_id", userId);
          if (data) {
            setCertificates(data);
            const urls: Record<string, string> = {};
            for (const cert of data) {
              const { data: signData } = await supabase.storage
                .from("resumes")
                .createSignedUrl(`${userId}/certificates/${cert.id}.pdf`, 7200);
              if (signData?.signedUrl) {
                urls[cert.id] = signData.signedUrl;
              }
            }
            setCertUrls(urls);
          }
        } catch (err: any) {
          setUploadingFiles(prev => prev.map(f => f.id === uploadId ? { ...f, status: "error", errorMsg: err.message || "Parse failed" } : f));
        }
      } else {
        setUploadingFiles(prev => prev.map(f => f.id === uploadId ? { ...f, status: "error", errorMsg: `Upload failed (${xhr.status})` } : f));
      }
    };

    xhr.onerror = () => {
      setUploadingFiles(prev => prev.map(f => f.id === uploadId ? { ...f, status: "error", errorMsg: "Connection failed" } : f));
    };

    xhr.open("POST", `${API_BASE_URL}/api/parse-cv`);
    xhr.setRequestHeader("Authorization", `Bearer ${session.access_token}`);
    xhr.send(formData);
  };

  const addFilesToUploadQueue = (files: File[]) => {
    const freshCerts = certificatesRef.current;
    const validFiles = files.filter(file => {
      const fileBaseName = file.name.replace(/\.[^/.]+$/, "").toLowerCase();
      const isDuplicate = freshCerts.some(cert => {
        const certName = (cert.name || "").toLowerCase();
        return certName === file.name.toLowerCase() || certName === fileBaseName;
      });
      if (isDuplicate) {
        setDeleteConfirmAction(null); // clear any lingering confirm state
        setUploadingFiles(prev => [
          ...prev,
          { id: Math.random().toString(36).substr(2, 9), file, name: file.name, size: file.size, progress: 0, speed: "", eta: "", status: "error" as const, errorMsg: `"${file.name}" already exists in your saved certificates.` }
        ]);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    const newItems = validFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: file.size,
      progress: 0,
      speed: "",
      eta: "",
      status: "idle" as const,
    }));

    setUploadingFiles(prev => [...prev, ...newItems]);
    
    newItems.forEach(item => {
      uploadSingleFile(item.id, item.file);
    });
  };

  const handleUpdateQueueCert = async (fId: string, dbId: string, newName: string, newDesc: string) => {
    if (!newName.trim() || !newDesc.trim()) return;
    try {
      const { error } = await supabase
        .from("certificates")
        .update({
          name: newName,
          extracted_text: newDesc
        })
        .eq("id", dbId);

      if (error) throw error;

      // Update uploadingFiles state
      setUploadingFiles(prev => prev.map(f => f.id === fId ? { ...f, aiName: newName, aiDescription: newDesc, isEditing: false } : f));

      // Refresh certificates list
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        const { data } = await supabase.from("certificates").select("*").eq("user_id", session.user.id);
        if (data) setCertificates(data);
      }
    } catch (err: any) {
      alert("Failed to update certificate: " + err.message);
    }
  };

  const handleDeleteQueueCert = (fId: string, dbId?: string) => {
    setDeleteConfirmAction({
      title: "Delete Certificate",
      message: "Are you sure you want to delete this certificate? This will permanently remove it from your Credentials & Certificates.",
      onConfirm: async () => {
        try {
          if (dbId) {
            const { data: deletedRows, error } = await supabase.from("certificates").delete().eq("id", dbId).select();
            if (error) throw error;

            if (!deletedRows || deletedRows.length === 0) {
              throw new Error("No record deleted. You may not have permission or the record was already deleted.");
            }

            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user?.id) {
              await supabase.storage.from("resumes").remove([`${session.user.id}/certificates/${dbId}.pdf`]).catch(() => {});
              
              // Refresh certificates list
              const { data } = await supabase.from("certificates").select("*").eq("user_id", session.user.id);
              if (data) setCertificates(data);
            }
          }

          // Remove from queue
          setUploadingFiles(prev => prev.filter(f => f.id !== fId));
        } catch (e: any) {
          alert("Failed to delete certificate: " + e.message);
        } finally {
          setDeleteConfirmOpen(false);
        }
      }
    });
    setDeleteConfirmOpen(true);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files).filter(f => f.type === "application/pdf");
      if (files.length > 0) {
        addFilesToUploadQueue(files);
      } else {
        alert("Only PDF files are supported for certificates.");
      }
    }
  };

  const handleDeleteCertInWizard = async (certId: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    if (!userId) return;

    setDeleteConfirmAction({
      title: "Delete Certificate",
      message: "Are you sure you want to delete this certificate? This will permanently remove it from your Credentials & Certificates.",
      onConfirm: async () => {
        try {
          const { data: deletedRows, error } = await supabase.from("certificates").delete().eq("id", certId).select();
          if (error) throw error;

          if (!deletedRows || deletedRows.length === 0) {
            throw new Error("No record deleted. You may not have permission or the record was already deleted.");
          }

          await supabase.storage.from("resumes").remove([`${userId}/certificates/${certId}.pdf`]).catch(() => {});

          setCertificates(prev => prev.filter(c => c.id !== certId));
        } catch (e: any) {
          alert("Failed to delete certificate: " + e.message);
        } finally {
          setDeleteConfirmOpen(false);
        }
      }
    });
    setDeleteConfirmOpen(true);
  };

  const handleGenerateSkills = async () => {
    setIsGeneratingSkills(true);
    try {
      const resumeData = {
        experiences: experiences.filter(e => e.employer || e.title).map(e => ({
          title: e.title,
          employer: e.employer,
          description: e.description
        })),
        educations: educations.filter(e => e.school || e.degree).map(e => ({
          school: e.school,
          degree: e.degree
        })),
        about: summary || "",
        certificates: certificates.map(c => ({
          name: c.name,
          extracted_text: c.extracted_text
        }))
      };
      
      const res = await api.generateSkills(resumeData);
      setSkillsOptions(res.skills || []);
    } catch (e: any) {
      console.error(e);
      alert("Failed to generate skills suggestions: " + e.message);
    } finally {
      setIsGeneratingSkills(false);
    }
  };

  const handleAddSuggestedSkill = (skillName: string) => {
    const exists = skills.some(s => s.name.toLowerCase() === skillName.toLowerCase());
    if (exists) return;
    
    if (skills.length === 1 && !skills[0].name.trim()) {
      setSkills([{ id: skills[0].id, name: skillName, level: "Expert" }]);
    } else {
      setSkills([...skills, { id: Date.now().toString(), name: skillName, level: "Expert" }]);
    }
  };

  // --- DND Sensors ---
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEndSkills = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setSkills((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // --- Navigation & Validation ---
  const validateStep = (stepIndex: number): boolean => {
    setValidationError(null);
    if (stepIndex === 0) {
      if (!contact.firstName.trim() || !contact.lastName.trim() || !contact.city.trim() || !contact.postalCode.trim() || !contact.phone.trim() || !contact.email.trim()) {
        setValidationError("All contact fields are mandatory to proceed.");
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contact.email.trim())) {
        setValidationError("Please provide a valid email address.");
        return false;
      }
      const strippedPhone = contact.phone.trim().replace(/[\s\-\(\)]/g, '');
      if (!/^(\+27|0)[1-9]\d{8}$/.test(strippedPhone)) {
        setValidationError("Please provide a valid South African phone number (e.g. 012 344 5678 or +27 12 344 5678).");
        return false;
      }
      const postalCodeRegex = /^\d{4}$/;
      if (!postalCodeRegex.test(contact.postalCode.trim())) {
        setValidationError("Please provide a valid South African postal code (exactly 4 digits).");
        return false;
      }
    } else if (stepIndex === 1) {
      const invalidExp = experiences.find(exp => !exp.employer.trim());
      if (invalidExp) {
        setValidationError("Please provide an Employer name for all listed experiences.");
        return false;
      }
    }
    return true;
  };

  // Checks if a step has meaningful data — used for soft-confirm prompts
  const stepHasData = (stepIndex: number): boolean => {
    if (stepIndex === 1) return experiences.some(e => e.employer.trim() || e.title.trim());
    if (stepIndex === 2) return educations.some(e => e.school.trim() || e.degree.trim());
    if (stepIndex === 5) return skills.some(s => s.name.trim());
    return true;
  };

  const STEP_EMPTY_MESSAGES: Record<number, string> = {
    1: "You haven't added any work experience. Many employers require this. Are you sure you want to continue without it?",
    2: "You haven't added any education. Are you sure you want to continue without it?",
    6: "You haven't added any skills. Skills help recruiters find you. Are you sure you want to continue without them?",
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;
    // Soft-confirm if section is empty (experience, education, skills)
    if ([1, 2, 5].includes(currentStep) && !stepHasData(currentStep)) {
      setConfirmSkipModal({
        message: STEP_EMPTY_MESSAGES[currentStep],
        onConfirm: () => {
          setConfirmSkipModal(null);
          if (currentStep < STEPS.length - 1) setCurrentStep(currentStep + 1);
        }
      });
      return;
    }
    if (currentStep < STEPS.length - 1) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setValidationError(null);
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleDownload = async () => {
    setIsCompiling(true);
    try {
      // 1. Build the dummyData JSON object (same as preview mapping)
      const dummyData = {
        accent_color: format.accentColor || '#4f46e5',
        title_font: format.titleFont || 'BEBAS NEUE (DEFAULT)',
        body_font: format.bodyFont || 'Lato',
        contact_info: {
          name: `${contact.firstName} ${contact.lastName}`.trim() || "Your Name",
          email: contact.email || "",
          phone: contact.phone || "",
          location: `${contact.city} ${contact.postalCode}`.trim() || "",
          linkedin: "",
          github: ""
        },
        professional_summary: summary || "",
        skills: skills.filter(s => s.name).map(s => `${s.name} (${s.level})`),
        technical_skills: skills.filter(s => s.name).map(s => `${s.name} (${s.level})`),
        experience: experiences.filter(e => e.title || e.employer).map(e => ({
          company: e.employer || "Employer",
          title: e.title || "Job Title",
          dates: `${e.startDate} - ${e.current ? 'Present' : e.endDate}`,
          achievements: e.description ? e.description.split('\n').filter(l => l.trim()) : []
        })),
        education: educations.filter(e => e.school || e.degree).map(e => ({
          institution: e.school || "Institution Name",
          degree: e.degree || "Degree",
          qualification: e.degree || "Degree",
          dates: `${e.startDate} - ${e.current ? 'Present' : e.endDate}`
        })),
        certifications: [],
        professional_memberships: [],
        professional_development: [],
        languages: [],
      };

      // 2. Get active user id from Supabase session
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (!userId) {
        throw new Error("Your session has expired. Please reload and log in again.");
      }

      // 3. Compile PDF via backend API
      const res = await api.compileDoc({
        json_data: dummyData,
        template_name: format.template,
        company_name: documentTitle || "Master Resume",
        job_title: "General CV",
        user_id: userId,
        doc_type: "resume"
      });

      if (!res.download_url) {
        throw new Error("Failed to compile resume PDF.");
      }

      // 4. Save record to `applications` table in Supabase
      const dbApp = {
        user_id: userId,
        company_name: documentTitle || "Master Resume",
        job_title: "General CV",
        resume_url: res.download_url,
        resume_json: dummyData,
        status: "Compiled",
        created_at: new Date().toISOString()
      };

      const { error: dbError } = await supabase.from("applications").insert(dbApp);
      if (dbError) {
        console.error("Database save error:", dbError);
      }

      // 5. Automatically download PDF in browser
      const link = document.createElement('a');
      link.href = res.download_url;
      link.target = '_blank';
      link.download = `${(documentTitle || 'Resume').replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // 6. Build the raw Markdown format for the profile tab text box
      let compiled = `--- PERSONAL DETAILS ---\n`;
      compiled += `Name: ${contact.firstName} ${contact.lastName}\n`;
      compiled += `Email: ${contact.email}\n`;
      compiled += `Phone: ${contact.phone}\n`;
      compiled += `Location: ${contact.city}, ${contact.postalCode}\n\n`;

      if (summary) {
        compiled += `--- PROFESSIONAL SUMMARY ---\n`;
        compiled += `${summary}\n\n`;
      }

      compiled += `--- EXPERIENCE ---\n`;
      experiences.forEach(exp => {
        if (exp.title || exp.employer) {
          compiled += `**${exp.title}** at ${exp.employer} (${exp.city})\n`;
          compiled += `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}\n`;
          if (exp.description) compiled += `${exp.description}\n`;
          compiled += `\n`;
        }
      });

      compiled += `--- EDUCATION ---\n`;
      educations.forEach(edu => {
        if (edu.degree || edu.school) {
          compiled += `**${edu.degree}** - ${edu.school} (${edu.city})\n`;
          compiled += `${edu.startDate} - ${edu.current ? 'Present' : edu.endDate}\n`;
          if (edu.description) compiled += `${edu.description}\n`;
          compiled += `\n`;
        }
      });

      compiled += `--- SKILLS ---\n`;
      skills.forEach(skill => {
        if (skill.name) {
          compiled += `- ${skill.name} (${skill.level})\n`;
        }
      });

      // Clear draft on successful completion
      localStorage.removeItem("resume_wizard_draft");
      
      // Save compiled text in local state
      onSave(compiled.trim());

      // Trigger completion callback
      if (onComplete) {
        onComplete();
      }
    } catch (e: any) {
      console.error(e);
      alert(e.message || "Failed to compile and save your resume.");
    } finally {
      setIsCompiling(false);
    }
  };

  if (!isLoaded) return null; // Prevent hydration mismatch on load

  return (
    <div className="flex w-full h-[85vh] bg-transparent rounded-2xl overflow-hidden shadow-2xl border border-brand-navy/10 relative">
      
      {/* Fullscreen Compiling Loader */}
      {isCompiling && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-md z-[100] flex flex-col items-center justify-center transition-all animate-in fade-in">
          <div className="bg-white shadow-2xl rounded-2xl p-8 flex flex-col items-center gap-4 max-w-sm text-center border border-brand-navy/10">
            <Loader2 className="w-12 h-12 text-brand-indigo animate-spin" />
            <h3 className="text-lg font-bold text-brand-deep">Compiling...</h3>
            <p className="text-sm text-brand-navy/70">Generating final PDF and saving to Saved Archives...</p>
          </div>
        </div>
      )}
      
      {/* LEFT COLUMN: WIZARD */}
      <div className="w-full lg:w-[50%] xl:w-[50%] flex flex-col h-full bg-white/30 backdrop-blur-xl overflow-y-auto relative">
        
        {/* Progress Bar — auto-centering sliding steps */}
        <div className="w-full border-b border-brand-navy/10 bg-white/40 backdrop-blur-xl sticky top-0 z-20 overflow-hidden">
          <div className="relative w-full py-4 overflow-hidden">

            {/* Connector line — fixed behind the dots */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-brand-navy/10 z-0 pointer-events-none" />

            {/* Sliding track — shifts so active step is always centered */}
            <div
              className="flex items-start justify-start transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
              style={{
                // Each step item is 96px wide. Center active step in the viewport.
                transform: `translateX(calc(50% - ${currentStep * 96 + 48}px))`,
                width: `${STEPS.length * 96}px`,
              }}
            >
              {STEPS.map((step, idx) => {
                const isActive = idx === currentStep;
                const isCompleted = idx < currentStep;
                const dist = Math.abs(idx - currentStep);
                return (
                  <div
                    key={step}
                    className="flex flex-col items-center gap-2 cursor-pointer px-2 transition-all duration-500"
                    style={{
                      width: '96px',
                      opacity: dist === 0 ? 1 : dist === 1 ? 0.55 : 0.2,
                      transform: `scale(${dist === 0 ? 1 : dist === 1 ? 0.88 : 0.75})`,
                    }}
                    onClick={() => {
                      if (idx <= currentStep) {
                        setCurrentStep(idx);
                      } else {
                        for (let i = currentStep; i < idx; i++) {
                          if (!validateStep(i)) { setCurrentStep(i); return; }
                          if ([1, 2, 5].includes(i) && !stepHasData(i)) {
                            setConfirmSkipModal({
                              message: STEP_EMPTY_MESSAGES[i],
                              onConfirm: () => { setConfirmSkipModal(null); setCurrentStep(idx); }
                            });
                            return;
                          }
                        }
                        setCurrentStep(idx);
                      }
                    }}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${isActive || isCompleted ? 'border-brand-indigo bg-brand-indigo shadow-[0_0_10px_rgba(79,70,229,0.5)]' : 'border-brand-navy/20 bg-white'}`} />
                    <span className={`text-[10px] font-bold uppercase tracking-wider text-center whitespace-nowrap transition-colors duration-300 ${isActive ? 'text-brand-indigo' : isCompleted ? 'text-brand-indigo/60' : 'text-brand-navy/30'}`}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* Validation Error Toast */}
        {validationError && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 animate-in slide-in-from-top-4 fade-in">
            <div className="bg-red-500 text-white px-4 py-2 rounded-full shadow-lg font-bold text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {validationError}
            </div>
          </div>
        )}

        <div className="flex-1 p-8 md:p-12 max-w-3xl mx-auto w-full">
          
          {/* STEP 1: CONTACT */}
          {currentStep === 0 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div>
                <h2 className="text-4xl font-extrabold text-brand-deep mb-3 tracking-tight">
                  Please enter your <span className="text-brand-indigo">contact</span> info
                </h2>
                <p className="text-brand-navy/70 font-medium">
                  Add your phone number and email so recruiters can reach you.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-brand-navy/60 uppercase tracking-wider rounded-md">First Name (Mandatory)</label>
                  <input type="text" className={`w-full px-4 py-3.5 glass-input text-brand-deep font-medium focus:outline-none focus:ring-2 focus:ring-brand-indigo/50 ${validationError && !contact.firstName.trim() ? 'border-red-500 ring-2 ring-red-500/20' : ''}`} value={contact.firstName} onChange={e => setContact({...contact, firstName: e.target.value})} placeholder="Sibusiso" />
                </div>
                <div className="relative mt-2 md:mt-0">
                  <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-brand-navy/60 uppercase tracking-wider rounded-md">Last Name (Mandatory)</label>
                  <input type="text" className={`w-full px-4 py-3.5 glass-input text-brand-deep font-medium focus:outline-none focus:ring-2 focus:ring-brand-indigo/50 ${validationError && !contact.lastName.trim() ? 'border-red-500 ring-2 ring-red-500/20' : ''}`} value={contact.lastName} onChange={e => setContact({...contact, lastName: e.target.value})} placeholder="Nkosi" />
                </div>
                
                <div className="relative">
                  <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-brand-navy/60 uppercase tracking-wider rounded-md">City (Mandatory)</label>
                  <input type="text" className={`w-full px-4 py-3.5 glass-input text-brand-deep font-medium focus:outline-none focus:ring-2 focus:ring-brand-indigo/50 ${validationError && !contact.city.trim() ? 'border-red-500 ring-2 ring-red-500/20' : ''}`} value={contact.city} onChange={e => setContact({...contact, city: e.target.value})} placeholder="Pretoria" />
                </div>
                <div className="relative">
                  <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-brand-navy/60 uppercase tracking-wider rounded-md">Postal Code (Mandatory)</label>
                  <input type="text" className={`w-full px-4 py-3.5 glass-input text-brand-deep font-medium focus:outline-none focus:ring-2 focus:ring-brand-indigo/50 ${validationError && (!contact.postalCode.trim() || !/^\d{4}$/.test(contact.postalCode.trim())) ? 'border-red-500 ring-2 ring-red-500/20' : ''}`} value={contact.postalCode} onChange={e => setContact({...contact, postalCode: e.target.value})} placeholder="0002" />
                </div>

                <div className="relative">
                  <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-brand-navy/60 uppercase tracking-wider flex items-center gap-1 rounded-md">
                    Phone (Mandatory) <Info className="w-3 h-3 text-brand-navy" fill="currentColor" />
                  </label>
                  <input type="text" className={`w-full px-4 py-3.5 glass-input text-brand-deep font-medium focus:outline-none focus:ring-2 focus:ring-brand-indigo/50 ${validationError && (!contact.phone.trim() || !/^(\+27|0)[1-9]\d{8}$/.test(contact.phone.trim().replace(/[\s\-\(\)]/g, ''))) ? 'border-red-500 ring-2 ring-red-500/20' : ''}`} value={contact.phone} onChange={e => setContact({...contact, phone: e.target.value})} placeholder="+27 12 344 5678" />
                </div>
                <div className="relative">
                  <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-brand-navy/60 uppercase tracking-wider rounded-md">Email (Mandatory)</label>
                  <input type="email" className={`w-full px-4 py-3.5 glass-input text-brand-deep font-medium focus:outline-none focus:ring-2 focus:ring-brand-indigo/50 ${validationError && (!contact.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim())) ? 'border-red-500 ring-2 ring-red-500/20' : ''}`} value={contact.email} onChange={e => setContact({...contact, email: e.target.value})} placeholder="sibusiso.nkosi@webmail.co.za" />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: EXPERIENCE */}
          {currentStep === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div>
                <h2 className="text-4xl font-extrabold text-brand-deep mb-3 tracking-tight">
                  <span className="text-brand-indigo">Tell us</span> about your experience
                </h2>
                <p className="text-brand-navy/70 font-medium">
                  Tell us about your experience should just be 2 lines or just 2 sentences
                </p>
              </div>

              {experiences.map((exp, index) => (
                <div key={exp.id} className="glass-panel p-6 rounded-xl space-y-6 relative group border border-brand-navy/10 hover:border-brand-indigo/30 transition-colors">
                  <div className="flex justify-between items-center pb-2 border-b border-brand-navy/10">
                    <h4 className="text-brand-navy/60 font-bold text-sm">
                      {exp.title || "(Not specified)"}, {exp.employer || "Unknown"} - {exp.city || "Unknown"}
                    </h4>
                    <button 
                      onClick={() => setExperiences(experiences.filter(e => e.id !== exp.id))}
                      className="text-brand-navy/40 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                      <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-brand-navy/60 uppercase tracking-wider rounded-md">Job Title</label>
                      <input type="text" className="w-full px-4 py-3 glass-input text-brand-deep font-medium focus:outline-none focus:ring-2 focus:ring-brand-indigo/50" value={exp.title} onChange={e => { const newExp = [...experiences]; newExp[index].title = e.target.value; setExperiences(newExp); }} placeholder="Civil Engineer" />
                    </div>
                    <div className="relative">
                      <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-[#ef4444] uppercase tracking-wider rounded-md">Employer</label>
                      <input type="text" className={`w-full px-4 py-3 glass-input text-brand-deep font-medium focus:outline-none ${validationError && !exp.employer.trim() ? 'border-[#ef4444] bg-[#fef2f2] ring-2 ring-red-500/20' : 'focus:ring-2 focus:ring-brand-indigo/50'}`} value={exp.employer} onChange={e => { const newExp = [...experiences]; newExp[index].employer = e.target.value; setExperiences(newExp); }} placeholder="Murray & Roberts" />
                      {validationError && !exp.employer.trim() && <p className="text-[10px] text-[#ef4444] font-medium mt-1 absolute -bottom-5 left-0">Employer name is mandatory.</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <MonthYearPicker
                        label="Start Date"
                        value={exp.startDate}
                        onChange={v => { const newExp = [...experiences]; newExp[index].startDate = v; setExperiences(newExp); }}
                      />
                      <MonthYearPicker
                        label="End Date"
                        value={exp.endDate}
                        disabled={exp.current}
                        onChange={v => { const newExp = [...experiences]; newExp[index].endDate = v; setExperiences(newExp); }}
                      />
                    </div>
                    
                    <div className="relative mt-4 md:mt-0">
                      <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-brand-navy/60 uppercase tracking-wider rounded-md">City</label>
                      <input type="text" className="w-full px-4 py-3 glass-input text-brand-deep font-medium focus:outline-none focus:ring-2 focus:ring-brand-indigo/50" value={exp.city} onChange={e => { const newExp = [...experiences]; newExp[index].city = e.target.value; setExperiences(newExp); }} placeholder="Johannesburg" />
                    </div>
                  </div>

                  <div className="flex gap-6 items-center">
                    <label className="flex items-center gap-2 text-sm text-brand-navy/70 font-medium cursor-pointer">
                      <input type="checkbox" checked={exp.current} onChange={e => { const newExp = [...experiences]; newExp[index].current = e.target.checked; setExperiences(newExp); }} className="w-4 h-4 rounded border-brand-navy/20 text-brand-indigo focus:ring-brand-indigo" />
                      I currently work here
                    </label>
                  </div>

                  <div className="relative border border-brand-navy/10 rounded-lg overflow-hidden bg-white/50 backdrop-blur-md">
                    <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-brand-deep uppercase tracking-wider z-10 hidden">Description</label>
                    <div className="p-4 relative">
                      {improvingExpId === exp.id && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center rounded-t-lg">
                          <Loader2 className="w-6 h-6 text-brand-indigo animate-spin" />
                        </div>
                      )}
                      <textarea 
                        className="w-full h-32 text-sm text-brand-deep placeholder-brand-navy/30 bg-transparent focus:outline-none resize-none font-medium leading-relaxed" 
                        placeholder="Oversaw the design and construction of infrastructure projects, including highways and bridges, in Johannesburg for Murray & Roberts."
                        value={exp.description}
                        onChange={e => { const newExp = [...experiences]; newExp[index].description = e.target.value; setExperiences(newExp); }}
                      />
                    </div>
                    <div className="bg-white/50 border-t border-brand-navy/5 p-3 flex justify-between items-center">
                      <div className="flex gap-4 text-brand-deep">
                        <Bold className="w-4 h-4 cursor-pointer hover:text-brand-indigo" />
                        <Italic className="w-4 h-4 cursor-pointer hover:text-brand-indigo" />
                        <Underline className="w-4 h-4 cursor-pointer hover:text-brand-indigo" />
                        <Strikethrough className="w-4 h-4 cursor-pointer hover:text-brand-indigo" />
                        <List className="w-4 h-4 cursor-pointer hover:text-brand-indigo" />
                      </div>
                      <button 
                        onClick={() => handleImproveExperience(exp.id, exp.description, exp.employer, exp.title)}
                        disabled={improvingExpId === exp.id || !exp.description.trim()}
                        className="bg-brand-indigo/10 hover:bg-brand-indigo/20 text-brand-indigo px-4 py-1.5 rounded-md text-xs font-bold transition-colors flex items-center gap-2 disabled:opacity-50"
                      >
                        Perfecting with AI
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <button 
                onClick={() => setExperiences([...experiences, { id: Date.now().toString(), title: "", employer: "", startDate: "", endDate: "", city: "", current: false, description: "" }])}
                className="flex items-center gap-2 text-brand-indigo font-bold text-sm hover:underline"
              >
                <Plus className="w-4 h-4" /> Add Experience
              </button>
            </div>
          )}

          {/* STEP 3: EDUCATION */}
          {currentStep === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
               <div>
                <h2 className="text-4xl font-extrabold text-brand-deep mb-3 tracking-tight">
                  <span className="text-brand-indigo">Please enter</span> your education information
                </h2>
                <p className="text-brand-navy/70 font-medium">
                  Write your schools or courses you finished.
                </p>
              </div>

              {educations.map((edu, index) => (
                <div key={edu.id} className="glass-panel p-6 rounded-xl border border-brand-navy/10 space-y-6 relative group hover:border-brand-indigo/30 transition-colors">
                  <div className="flex justify-between items-center pb-2 border-b border-brand-navy/10">
                    <h4 className="text-brand-navy/60 font-bold text-sm">
                      {edu.degree || "(Not specified)"} - {edu.school || "Unknown"}
                    </h4>
                    <button 
                      onClick={() => setEducations(educations.filter(e => e.id !== edu.id))}
                      className="text-brand-navy/40 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Row 1: Degree + School */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                      <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-brand-navy/60 uppercase tracking-wider rounded-md">Degree / Qualification / Grade</label>
                      <select className="w-full px-4 py-3 glass-input text-brand-deep font-medium focus:outline-none focus:ring-2 focus:ring-brand-indigo/50 appearance-none bg-white" value={edu.degree} onChange={e => { const newArr = [...educations]; newArr[index].degree = e.target.value; setEducations(newArr); }}>
                        <option value="" disabled>Select Qualification</option>
                        <option value="Grade 12 / Matric">Grade 12 / Matric</option>
                        <option value="Grade 11">Grade 11</option>
                        <option value="Grade 10">Grade 10</option>
                        <option value="Grade 9">Grade 9</option>
                        <option value="National Certificate: N1">National Certificate: N1</option>
                        <option value="National Certificate: N2">National Certificate: N2</option>
                        <option value="National Certificate: N3">National Certificate: N3</option>
                        <option value="National Certificate: N4">National Certificate: N4</option>
                        <option value="National Certificate: N5">National Certificate: N5</option>
                        <option value="National Certificate: N6">National Certificate: N6</option>
                        <option value="NQF Level 2">NQF Level 2</option>
                        <option value="NQF Level 3">NQF Level 3</option>
                        <option value="NQF Level 4">NQF Level 4</option>
                        <option value="Higher Certificate">Higher Certificate</option>
                        <option value="National Diploma">National Diploma</option>
                        <option value="Bachelor's Degree">Bachelor's Degree</option>
                        <option value="Honours Degree">Honours Degree</option>
                        <option value="Master's Degree">Master's Degree</option>
                        <option value="Doctorate / PhD">Doctorate / PhD</option>
                      </select>
                      <ChevronRight className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-brand-navy/40 rotate-90 pointer-events-none" />
                    </div>
                    <div className="relative">
                      <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-brand-navy/60 uppercase tracking-wider rounded-md">School / University</label>
                      <input type="text" className="w-full px-4 py-3 glass-input text-brand-deep font-medium focus:outline-none focus:ring-2 focus:ring-brand-indigo/50" value={edu.school} onChange={e => { const newArr = [...educations]; newArr[index].school = e.target.value; setEducations(newArr); }} placeholder="University of Pretoria" />
                    </div>
                  </div>

                  {/* Row 2: Start Date + End Date (custom picker) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <MonthYearPicker
                      label="Start Date"
                      value={edu.startDate}
                      onChange={v => { const newArr = [...educations]; newArr[index].startDate = v; setEducations(newArr); }}
                    />
                    <MonthYearPicker
                      label="End Date"
                      value={edu.endDate}
                      disabled={edu.current}
                      onChange={v => { const newArr = [...educations]; newArr[index].endDate = v; setEducations(newArr); }}
                    />
                  </div>

                  <div className="flex gap-6 items-center">
                    <label className="flex items-center gap-2 text-sm text-brand-navy/70 font-medium cursor-pointer">
                      <input type="checkbox" checked={edu.current || false} onChange={e => { const newArr = [...educations]; newArr[index].current = e.target.checked; setEducations(newArr); }} className="w-4 h-4 rounded border-brand-navy/20 text-brand-indigo focus:ring-brand-indigo" />
                      I currently study here
                    </label>
                  </div>

                  {/* Row 3: City — full width */}
                  <div className="relative">
                    <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-brand-navy/60 uppercase tracking-wider rounded-md">City</label>
                    <input type="text" className="w-full px-4 py-3 glass-input text-brand-deep font-medium focus:outline-none focus:ring-2 focus:ring-brand-indigo/50" value={edu.city} onChange={e => { const newArr = [...educations]; newArr[index].city = e.target.value; setEducations(newArr); }} placeholder="Pretoria" />
                  </div>
                </div>
              ))}

              <button 
                onClick={() => setEducations([...educations, { id: Date.now().toString(), school: "", degree: "", startDate: "", endDate: "", city: "", current: false, description: "" }])}
                className="flex items-center gap-2 text-brand-indigo font-bold text-sm hover:underline"
              >
                <Plus className="w-4 h-4" /> Add Education
              </button>
            </div>
          )}

          {/* STEP 4: PROFESSIONAL SUMMARY */}
          {currentStep === 3 && (
             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div>
                <h2 className="text-4xl font-extrabold text-brand-deep mb-3 tracking-tight">
                  <span className="text-brand-indigo">Write down</span> your professional summary
                </h2>
                <p className="text-brand-navy/70 font-medium">
                  Provide a brief summary, or use AI to generate a concise 2-sentence intro or a full 3-sentence professional summary from your details.
                </p>
              </div>

              <div className="relative border border-brand-navy/10 rounded-xl overflow-hidden glass-panel shadow-sm mt-8">
                <div className="p-6 relative">
                  {improvingSummary && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center rounded-t-xl">
                      <Loader2 className="w-6 h-6 text-brand-indigo animate-spin" />
                    </div>
                  )}
                  <textarea 
                    className="w-full h-48 text-base text-brand-deep placeholder-brand-navy/30 bg-transparent focus:outline-none resize-none font-medium leading-relaxed" 
                    placeholder="A dedicated software engineer with a passion for frontend design..."
                    value={summary}
                    onChange={e => setSummary(e.target.value)}
                  />
                </div>
                <div className="bg-white/50 border-t border-brand-navy/5 p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="flex gap-4 text-brand-deep">
                    <Bold className="w-4 h-4 cursor-pointer hover:text-brand-indigo" />
                    <Italic className="w-4 h-4 cursor-pointer hover:text-brand-indigo" />
                    <List className="w-4 h-4 cursor-pointer hover:text-brand-indigo" />
                  </div>
                  <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
                    <button 
                      onClick={handleGenerateSummaryOptions}
                      disabled={isGeneratingSummary}
                      className="flex-1 md:flex-none bg-brand-navy/5 hover:bg-brand-navy/10 text-brand-deep px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isGeneratingSummary ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                      Generate Options
                    </button>
                    <button 
                      onClick={() => handleImproveSummary(true)}
                      disabled={improvingSummary}
                      className="flex-1 md:flex-none bg-brand-indigo/10 hover:bg-brand-indigo/20 text-brand-indigo px-4 py-2.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      Perfect with AI (Short 2-Sentences)
                    </button>
                    <button 
                      onClick={() => handleImproveSummary(false)}
                      disabled={improvingSummary}
                      className="flex-1 md:flex-none bg-brand-indigo hover:bg-brand-indigo/90 text-white px-4 py-2.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
                    >
                      Perfect with AI (Full 3-Sentences)
                    </button>
                  </div>
                </div>
              </div>

              {/* AI Generated Options */}
              {summaryOptions.length > 0 && (
                <div className="space-y-4 animate-in slide-in-from-top-4">
                  <h3 className="text-sm font-bold text-brand-navy/70 uppercase tracking-wider">AI Generated Suggestions</h3>
                  <div className="grid gap-4">
                    {summaryOptions.map((opt, i) => (
                      <div 
                        key={i}
                        onClick={() => setSummary(opt)}
                        className="p-4 rounded-xl border border-brand-indigo/20 bg-brand-indigo/5 cursor-pointer hover:bg-brand-indigo/10 transition-colors group"
                      >
                        <p className="text-sm text-brand-deep font-medium leading-relaxed">{opt}</p>
                        <div className="mt-3 text-xs font-bold text-brand-indigo opacity-0 group-hover:opacity-100 transition-opacity">
                          Click to use this summary
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: CERTIFICATES */}
          {currentStep === 4 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div>
                <h2 className="text-4xl font-extrabold text-brand-deep mb-3 tracking-tight">
                  <span className="text-brand-indigo">Upload</span> your credentials & certificates
                </h2>
                <p className="text-brand-navy/70 font-medium text-sm">
                  Add certificates, transcripts, or awards. These will be saved in your profile credentials but won't print directly on this resume.
                </p>
              </div>

              {/* Upload Form */}
              <div className="glass-panel p-6 rounded-xl border border-brand-navy/10 space-y-6">
                
                {/* Drag-and-drop zone */}
                <div 
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`flex flex-col gap-2 p-6 border-2 border-dashed rounded-xl relative items-center justify-center text-center transition-all duration-300 ${
                    isDragActive 
                      ? 'border-brand-indigo bg-brand-indigo/[0.04] shadow-[0_0_20px_rgba(79,70,229,0.15)] scale-[1.01]' 
                      : 'border-brand-navy/20 bg-brand-navy/[0.01] hover:bg-brand-navy/[0.02]'
                  }`}
                >
                  <input
                    type="file"
                    accept=".pdf"
                    multiple
                    ref={certFileInputRef}
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length > 0) addFilesToUploadQueue(files);
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Plus className={`w-10 h-10 mb-2 transition-transform duration-300 ${isDragActive ? 'text-brand-indigo scale-110' : 'text-brand-indigo/60'}`} />
                  <span className="text-sm font-bold text-brand-deep">
                    {isDragActive ? "Drop files here!" : "Drag & Drop PDF Certificates"}
                  </span>
                  <span className="text-xs text-brand-navy/60 mt-1">Or click to select files (PDF transcripts, certificates, degrees)</span>
                </div>

                {/* Queue Card Indicators */}
                {uploadingFiles.length > 0 && (
                  <div className="space-y-3 pt-2 border-t border-brand-navy/5">
                    <p className="text-[10px] font-bold text-brand-navy/50 uppercase tracking-wider">Upload Queue</p>
                    <div className="grid gap-3">
                      {uploadingFiles.map((f) => (
                        <div 
                          key={f.id}
                          className={`p-4 rounded-xl border bg-white shadow-sm flex flex-col gap-3 transition-all duration-300 w-full overflow-hidden ${
                            f.status === 'error' 
                              ? 'border-red-200 bg-red-50/10' 
                              : f.status === 'success' 
                                ? 'border-green-200' 
                                : 'border-brand-navy/10 hover:border-brand-indigo/20'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-4 w-full">
                            {/* File Info */}
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                f.status === 'error' 
                                  ? 'bg-red-100 text-red-500' 
                                  : f.status === 'success' 
                                    ? 'bg-green-100 text-green-500' 
                                    : 'bg-brand-indigo/10 text-brand-indigo animate-pulse'
                              }`}>
                                <FileText className="w-5 h-5" />
                              </div>
                              <div className="truncate flex-1 min-w-0">
                                <h5 className="text-xs font-bold text-brand-deep truncate mb-0.5">
                                  {f.status === 'success' && f.aiName ? f.aiName : f.name}
                                </h5>
                                <p className="text-[10px] text-brand-navy/50 font-semibold uppercase flex items-center gap-2">
                                  <span>PDF</span>
                                  <span>•</span>
                                  <span>{formatBytes(f.size)}</span>
                                </p>
                              </div>
                            </div>

                            {/* Status or Controls */}
                            <div className="flex items-center gap-2">
                              {f.status === "uploading" && (
                                <span className="text-[10px] font-bold text-brand-indigo bg-brand-indigo/10 px-2 py-0.5 rounded-full">
                                  {f.progress}%
                                </span>
                              )}
                              {f.status === "success" && (
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setUploadingFiles(prev => prev.map(item => item.id === f.id ? { ...item, isEditing: !item.isEditing } : item));
                                    }}
                                    className="text-[10px] font-bold text-brand-indigo hover:underline px-2 py-1"
                                  >
                                    {f.isEditing ? "Close" : "Edit Details"}
                                  </button>
                                  <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                    <Check className="w-3 h-3" /> Done
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteQueueCert(f.id, f.dbRecordId)}
                                    className="text-brand-navy/40 hover:text-red-500 transition-colors p-1"
                                    title="Delete certificate"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                              {f.status === "error" && (
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => uploadSingleFile(f.id, f.file)}
                                    className="px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-600 font-bold text-[10px] rounded-full flex items-center gap-1 transition-colors"
                                  >
                                    <RefreshCw className="w-3 h-3" /> Retry
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setUploadingFiles(prev => prev.filter(item => item.id !== f.id))}
                                    className="text-brand-navy/40 hover:text-red-500 transition-colors p-1"
                                    title="Dismiss"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Progress bar and upload details */}
                          {f.status === "uploading" && (
                            <div className="space-y-1.5">
                              <div className="w-full h-1.5 bg-brand-navy/5 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-brand-indigo transition-all duration-300"
                                  style={{ width: `${f.progress}%` }}
                                ></div>
                              </div>
                              <div className="flex justify-between text-[9px] font-bold text-brand-navy/60">
                                <span>{f.speed}</span>
                                <span>{f.eta}</span>
                              </div>
                            </div>
                          )}

                          {/* Inline Edit Panel */}
                          {f.status === "success" && f.isEditing && (
                            <div className="space-y-3 pt-2 border-t border-brand-navy/5 animate-in fade-in">
                              <div className="relative">
                                <label className="absolute -top-2 left-2.5 bg-white px-1 text-[9px] font-bold text-brand-navy/50 uppercase">Certificate Name</label>
                                <input
                                  type="text"
                                  className="w-full px-3 py-2 border border-brand-navy/10 rounded-lg text-xs font-medium text-brand-deep focus:outline-none focus:border-brand-indigo"
                                  value={f.aiName || ""}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setUploadingFiles(prev => prev.map(item => item.id === f.id ? { ...item, aiName: val } : item));
                                  }}
                                />
                              </div>
                              <div className="relative">
                                <label className="absolute -top-2 left-2.5 bg-white px-1 text-[9px] font-bold text-brand-navy/50 uppercase">Credential Description</label>
                                <textarea
                                  className="w-full h-20 px-3 py-2 border border-brand-navy/10 rounded-lg text-[11px] font-medium text-brand-deep focus:outline-none focus:border-brand-indigo resize-none"
                                  value={f.aiDescription || ""}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setUploadingFiles(prev => prev.map(item => item.id === f.id ? { ...item, aiDescription: val } : item));
                                  }}
                                />
                              </div>
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setUploadingFiles(prev => prev.map(item => item.id === f.id ? { ...item, isEditing: false } : item));
                                  }}
                                  className="px-3 py-1.5 text-xs text-brand-navy/60 hover:text-brand-deep font-bold"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => f.dbRecordId && handleUpdateQueueCert(f.id, f.dbRecordId, f.aiName || "", f.aiDescription || "")}
                                  className="px-4 py-1.5 bg-brand-indigo text-white font-bold text-[10px] rounded-lg transition-colors hover:bg-brand-indigo/90"
                                >
                                  Save Changes
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Error message */}
                          {f.status === "error" && f.errorMsg && (
                            <p className="text-[10px] font-bold text-red-500/80 bg-red-50 p-2 rounded-lg leading-snug">
                              Error: {f.errorMsg}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-4 text-xs font-semibold text-brand-navy/40">
                  <hr className="flex-1 border-brand-navy/10" />
                  <span>OR MANUAL ENTRY</span>
                  <hr className="flex-1 border-brand-navy/10" />
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-brand-navy/60 uppercase tracking-wider rounded-md">Certificate Name</label>
                    <input
                      type="text"
                      placeholder="e.g. AWS Certified Solutions Architect"
                      className="w-full px-4 py-3 glass-input text-sm text-brand-deep font-medium"
                      value={newCertName}
                      onChange={(e) => setNewCertName(e.target.value)}
                    />
                  </div>
                  
                  <div className="relative">
                    <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-brand-navy/60 uppercase tracking-wider rounded-md">Credential Description</label>
                    <textarea
                      placeholder="Paste manual credential text or description here..."
                      className="w-full h-24 px-4 py-3 glass-input text-xs text-brand-deep font-medium resize-none"
                      value={manualCertText}
                      onChange={(e) => setManualCertText(e.target.value)}
                    />
                  </div>
                </div>

                {/* Manual save success toast */}
                {manualSaveSuccess && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl animate-in fade-in slide-in-from-bottom-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm font-semibold text-green-700">Certificate saved to your Credentials & Certificates!</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleSaveManualCertificate}
                  disabled={uploadingCert || (!newCertName.trim() || !manualCertText.trim())}
                  className={`w-full py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-50 rounded-xl font-bold transition-all duration-300 ${manualSaveSuccess ? 'bg-green-500 text-white shadow-green-500/20 shadow-lg' : 'btn-primary'}`}
                >
                  {uploadingCert ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{uploadProgress}</span>
                    </>
                  ) : manualSaveSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Save Certificate</span>
                    </>
                  )}
                </button>
              </div>

              {/* Saved Certificates List */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-brand-navy/70 uppercase tracking-wider">Saved Certificates</h4>
                {certificates.length === 0 ? (
                  <p className="text-xs text-brand-navy/50 italic">No certificates saved to your profile yet.</p>
                ) : (
                  <div className="grid gap-2 max-h-60 overflow-y-auto pr-1">
                    {certificates.map((cert) => (
                      <div
                        key={cert.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-white border border-brand-navy/10 hover:border-brand-indigo/30 transition-colors shadow-sm"
                      >
                        <span className="text-xs font-bold text-brand-deep truncate max-w-[70%]">{cert.name}</span>
                        <div className="flex items-center gap-2">
                          {certUrls[cert.id] && (
                            <a
                              href={certUrls[cert.id]}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1 btn-secondary text-[10px] font-bold flex items-center gap-1"
                            >
                              View PDF
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteCertInWizard(cert.id)}
                            className="text-brand-navy/60 hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 6: SKILLS */}
          {currentStep === 5 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div>
                <h2 className="text-4xl font-extrabold text-brand-deep mb-3 tracking-tight">
                  <span className="text-brand-indigo">Tell us</span> about your skills
                </h2>
                <p className="text-brand-navy/70 font-medium">
                  Pick 6 skills that match the job ad. Drag and drop to reorder.
                </p>
              </div>

              {/* AI Skill Generator Section */}
              <div className="glass-panel p-5 rounded-xl border border-brand-indigo/20 bg-brand-indigo/5 space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-brand-deep">AI Skills Generator</h4>
                    <p className="text-xs text-brand-navy/60 leading-relaxed mt-0.5">
                      Analyze your experience, education, and certificates to suggest optimal keywords.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerateSkills}
                    disabled={isGeneratingSkills}
                    className="w-full md:w-auto bg-brand-indigo hover:bg-brand-indigo/90 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    {isGeneratingSkills ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3 h-3" />
                        <span>Generate with AI</span>
                      </>
                    )}
                  </button>
                </div>

                {skillsOptions.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-brand-indigo/10 animate-in fade-in">
                    <p className="text-[10px] font-bold text-brand-navy/50 uppercase tracking-wider">Suggested Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {skillsOptions.map((opt, i) => {
                        const exists = skills.some(s => s.name.toLowerCase() === opt.toLowerCase());
                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => handleAddSuggestedSkill(opt)}
                            disabled={exists}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                              exists
                                ? 'bg-brand-navy/5 border-brand-navy/10 text-brand-navy/40 cursor-not-allowed'
                                : 'bg-white border-brand-indigo/20 text-brand-indigo hover:bg-brand-indigo hover:text-white hover:border-brand-indigo hover:scale-105 shadow-sm'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndSkills}>
                  <SortableContext items={skills} strategy={verticalListSortingStrategy}>
                    {skills.map((skill, index) => (
                      <SortableSkillItem 
                        key={skill.id} 
                        id={skill.id} 
                        skill={skill} 
                        index={index} 
                        onChangeName={(val: string) => { const newArr = [...skills]; newArr[index].name = val; setSkills(newArr); }}
                        onChangeLevel={(val: string) => { const newArr = [...skills]; newArr[index].level = val; setSkills(newArr); }}
                        onDelete={() => setSkills(skills.filter(s => s.id !== skill.id))}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              </div>

              <button 
                onClick={() => setSkills([...skills, { id: Date.now().toString(), name: "", level: "Expert" }])}
                className="flex items-center gap-2 text-brand-indigo font-bold text-sm hover:underline"
              >
                <Plus className="w-4 h-4" /> Add Skill
              </button>
            </div>
          )}

          {/* STEP 7: FINISH IT */}
          {currentStep === 6 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="relative group max-w-lg">
                <input 
                  type="text"
                  value={documentTitle}
                  onChange={(e) => setDocumentTitle(e.target.value)}
                  className="text-3xl font-extrabold text-brand-deep bg-transparent border-b-2 border-transparent hover:border-brand-indigo/30 focus:border-brand-indigo focus:outline-none px-0 py-2 w-full transition-colors"
                  placeholder="Name your resume..."
                />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 text-brand-navy/30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  Click to edit
                </div>
              </div>

              <div className="space-y-6 glass-panel p-8 rounded-xl border border-brand-navy/10 shadow-sm">
                <h3 className="text-lg font-bold text-brand-deep flex items-center gap-2 border-b border-brand-navy/5 pb-4">
                  <List className="w-5 h-5 text-brand-indigo" /> Resume Formatting
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                  <div className="relative">
                    <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-brand-navy/60 uppercase tracking-wider rounded-md">Template</label>
                    <select className="w-full px-4 py-3.5 glass-input text-brand-deep font-bold focus:outline-none focus:ring-2 focus:ring-brand-indigo/50 appearance-none" value={format.template} onChange={e => setFormat({...format, template: e.target.value})}>
                      <option value="ats_resume_template.html">Standard ATS (Default)</option>
                      <option value="ui_ux_pro_max_resume.html">UI/UX Pro Max</option>
                      <option value="amy_stein_resume.html">Amy Stein (Modern)</option>
                      <option value="ava_martinez_resume.html">Ava Martinez (Creative)</option>
                      <option value="david_turner_resume.html">David Turner (Classic)</option>
                    </select>
                    <ChevronRight className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-brand-navy/40 rotate-90 pointer-events-none" />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-brand-navy/60 uppercase tracking-wider mb-3">Accent Color</label>
                    <div className="flex gap-3">
                      {['#4f46e5', '#334155', '#7e22ce', '#1e3a8a', '#65a30d', '#b91c1c'].map(color => (
                        <div 
                          key={color}
                          onClick={() => setFormat({...format, accentColor: color})}
                          className="w-8 h-8 rounded-full cursor-pointer flex items-center justify-center transition-transform hover:scale-110 shadow-sm"
                          style={{ backgroundColor: color }}
                        >
                          {format.accentColor === color && <Check className="w-4 h-4 text-white" />}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="relative">
                    <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-brand-navy/60 uppercase tracking-wider rounded-md">Title Font</label>
                    <select className="w-full px-4 py-3.5 glass-input text-brand-deep font-bold focus:outline-none focus:ring-2 focus:ring-brand-indigo/50 appearance-none" value={format.titleFont} onChange={e => setFormat({...format, titleFont: e.target.value})}>
                      <option>BEBAS NEUE (DEFAULT)</option>
                      <option>Inter</option>
                      <option>Roboto</option>
                      <option>Calibri</option>
                      <option>Poppins</option>
                    </select>
                    <ChevronRight className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-brand-navy/40 rotate-90 pointer-events-none" />
                  </div>

                  <div className="relative">
                    <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-brand-navy/60 uppercase tracking-wider rounded-md">Body Font</label>
                    <select className="w-full px-4 py-3.5 glass-input text-brand-deep font-bold focus:outline-none focus:ring-2 focus:ring-brand-indigo/50 appearance-none" value={format.bodyFont} onChange={e => setFormat({...format, bodyFont: e.target.value})}>
                      <option>Lato (default)</option>
                      <option>Open Sans</option>
                      <option>Inter</option>
                      <option>Calibri</option>
                      <option>Poppins</option>
                    </select>
                    <ChevronRight className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-brand-navy/40 rotate-90 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 8: DOWNLOAD */}
          {currentStep === 7 && (
            isStep7Preparing ? (
              <div className="space-y-6 flex flex-col items-center justify-center text-center h-full animate-in fade-in">
                <Loader2 className="w-12 h-12 text-brand-indigo animate-spin mb-2" />
                <h3 className="text-xl font-bold text-brand-deep animate-pulse">Compiling your resume...</h3>
                <p className="text-brand-navy/60 text-sm font-medium">Preparing download package</p>
              </div>
            ) : (
              <div className="space-y-8 flex flex-col items-center justify-center text-center h-full animate-in fade-in zoom-in-95">
                <div className="w-24 h-24 bg-brand-indigo/10 rounded-full flex items-center justify-center mb-4">
                  <Check className="w-12 h-12 text-brand-indigo" />
                </div>
                <h2 className="text-4xl font-extrabold text-brand-deep tracking-tight">
                  You're all set!
                </h2>
                <p className="text-brand-navy/70 font-medium max-w-md">
                  Your resume data has been structured perfectly. Click below to compile it into the Master CV format and prepare for AI tailoring.
                </p>
              </div>
            )
          )}

        </div>

        {/* BOTTOM NAVIGATION ACTIONS */}
        <div className="p-8 border-t border-brand-navy/10 bg-white/40 backdrop-blur-xl sticky bottom-0 z-20 flex justify-between items-center max-w-4xl mx-auto w-full">
          {currentStep > 0 ? (
            <button onClick={handleBack} className="group flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border-2 border-brand-indigo/20 text-brand-indigo font-bold text-sm hover:border-brand-indigo hover:bg-brand-indigo hover:text-white transition-all duration-300">
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
              Back
            </button>
          ) : (
            <button onClick={onCancel} className="text-brand-navy/50 font-bold text-sm hover:text-brand-deep transition-colors">
              Cancel
            </button>
          )}

          {currentStep < 7 ? (
            <button onClick={handleNext} className="btn-primary text-sm shadow-lg shadow-brand-indigo/20 flex items-center gap-2 px-8 py-3.5">
              Next to {STEPS[currentStep + 1] === 'FINISH IT' ? 'Finish it' : STEPS[currentStep + 1] === 'PROFESSIONAL SUMMARY' ? 'Professional Summary' : STEPS[currentStep + 1].charAt(0) + STEPS[currentStep + 1].slice(1).toLowerCase()} <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={handleDownload} className="btn-primary text-sm shadow-lg shadow-brand-indigo/20 flex items-center gap-2 px-10 py-3.5">
              Compile & Save <Check className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: LIVE API PREVIEW */}
      <div ref={previewContainerRef} className="hidden lg:flex flex-1 h-full bg-brand-navy/5 relative overflow-hidden border-l border-brand-navy/10">
        
        {/* Loading Overlay */}
        {isPreviewLoading && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-sm z-30 flex items-center justify-center transition-all">
            <div className="bg-white shadow-xl rounded-full p-4 flex items-center gap-3 animate-in fade-in zoom-in">
              <Loader2 className="w-6 h-6 text-brand-indigo animate-spin" />
              <span className="text-sm font-bold text-brand-deep pr-2">Updating Preview...</span>
            </div>
          </div>
        )}

        {/* The Actual HTML Preview rendered inside a scaled container to fit perfectly */}
        {previewHtml ? (
          <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
            <div 
              className="origin-center transition-transform duration-200"
              style={{
                width: '800px',
                height: '1131px',
                transform: `scale(${previewScale})`,
                flexShrink: 0,
              }}
            >
              <iframe 
                srcDoc={previewHtml || undefined}
                className="w-full h-full border-none bg-white shadow-2xl"
                title="Live Resume Preview"
              />
            </div>
          </div>
        ) : (
           <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
             <div 
               className="origin-center opacity-40 transition-transform duration-200 bg-white shadow-2xl rounded-sm p-8 flex flex-col gap-6"
               style={{
                 width: '800px',
                 height: '1131px',
                 transform: `scale(${previewScale})`,
                 flexShrink: 0,
               }}
             >
            <div className="flex gap-6 items-center border-b pb-4">
              <div className="w-20 h-20 bg-brand-navy/10 rounded-full"></div>
              <div className="space-y-3 flex-1">
                <div className="h-6 bg-brand-navy/20 rounded w-3/4"></div>
                <div className="h-3 bg-brand-navy/10 rounded w-1/2"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-brand-navy/10 rounded w-full"></div>
              <div className="h-3 bg-brand-navy/10 rounded w-full"></div>
              <div className="h-3 bg-brand-navy/10 rounded w-5/6"></div>
            </div>
            <div className="space-y-4 pt-4">
              <div className="h-4 bg-brand-navy/20 rounded w-1/3 mb-2"></div>
              <div className="flex gap-4">
                <div className="w-16 h-3 bg-brand-navy/10 rounded"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-3 bg-brand-navy/20 rounded w-1/2"></div>
                  <div className="h-2 bg-brand-navy/10 rounded w-full"></div>
                  <div className="h-2 bg-brand-navy/10 rounded w-full"></div>
                </div>
              </div>
            </div>
            </div>
          </div>
        )}

      </div>

      {/* Soft-Confirm Skip Modal */}
      {confirmSkipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-brand-navy/10 max-w-sm w-full p-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center mb-4 mx-auto">
              <AlertCircle className="w-6 h-6 text-amber-500" />
            </div>
            <h3 className="text-lg font-bold text-brand-deep text-center mb-2">Are you sure?</h3>
            <p className="text-sm text-brand-navy/70 text-center mb-6 leading-relaxed">{confirmSkipModal?.message}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmSkipModal(null)}
                className="flex-1 py-2.5 rounded-xl border-2 border-brand-navy/20 text-brand-navy/70 font-semibold text-sm hover:border-brand-indigo hover:text-brand-indigo transition-all"
              >
                Go Back & Add
              </button>
              <button
                onClick={() => confirmSkipModal?.onConfirm()}
                className="flex-1 py-2.5 rounded-xl bg-brand-indigo text-white font-bold text-sm hover:bg-brand-indigo/90 transition-all shadow-md shadow-brand-indigo/20"
              >
                Continue Anyway
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {deleteConfirmOpen && deleteConfirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-brand-navy/10 max-w-sm w-full p-8 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-red-50 border-2 border-red-200 flex items-center justify-center mb-4 mx-auto">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-brand-deep text-center mb-2">{deleteConfirmAction.title}</h3>
            <p className="text-sm text-brand-navy/70 text-center mb-6 leading-relaxed">{deleteConfirmAction.message}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                className="flex-1 py-2.5 rounded-xl border-2 border-brand-navy/20 text-brand-navy/70 font-semibold text-sm hover:border-brand-navy/40 hover:text-brand-deep transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteConfirmAction.onConfirm()}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-all shadow-md shadow-red-500/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
