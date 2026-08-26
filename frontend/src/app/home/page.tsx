"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { api, API_BASE_URL } from "@/lib/api";
import ResumeBuilderWizard from "@/components/ResumeBuilderWizard";
import MarketingFooter from "@/components/MarketingFooter";
import {
  User,
  LogOut,
  FolderOpen,
  Award,
  BarChart3,
  Save,
  FileText,
  Check,
  Upload,
  Plus,
  Trash2,
  Globe,
  Settings,
  FileCheck,
  RefreshCw,
  Briefcase,
  Zap,
  Download,
  Eye,
  ChevronDown,
  ChevronRight,
  Key,
  Construction,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"welcome" | "profile" | "mycv" | "parameters" | "generate" | "batch" | "archive" | "builder">("welcome");
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [settingsSubmenuOpen, setSettingsSubmenuOpen] = useState<boolean>(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [deleteCertId, setDeleteCertId] = useState<string | null>(null);

  const triggerToast = (message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  };

  // Profile data state
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [targetJobTitle, setTargetJobTitle] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("Entry Level");
  const [showExperienceDropdown, setShowExperienceDropdown] = useState(false);
  const experienceOptions = [
    { label: "Entry Level (0-2 yrs)", value: "Entry Level" },
    { label: "Mid Level (3-5 yrs)", value: "Mid Level" },
    { label: "Senior (5-10 yrs)", value: "Senior" },
    { label: "Executive (10+ yrs)", value: "Executive" }
  ];
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [changingEmail, setChangingEmail] = useState(false);
  const [profileRaw, setProfileRaw] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [parsingCv, setParsingCv] = useState(false);

  // Master CV storage URL
  const [masterCvUrl, setMasterCvUrl] = useState<string | null>(null);

  // Certificates state
  const [certificates, setCertificates] = useState<any[]>([]);
  const [certUrls, setCertUrls] = useState<{ [id: string]: string }>({});
  const [newCertName, setNewCertName] = useState("");
  const [manualCertText, setManualCertText] = useState("");
  const [certPdfFiles, setCertPdfFiles] = useState<File[]>([]);
  const [uploadingCert, setUploadingCert] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>("");
  const [previewCert, setPreviewCert] = useState<any | null>(null);

  // States for advanced upload queue
  const [uploadingFiles, setUploadingFiles] = useState<any[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const certificatesRef = useRef(certificates);

  useEffect(() => {
    certificatesRef.current = certificates;
  }, [certificates]);

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  // Stats
  const [stats, setStats] = useState({ appsCount: 0, certsCount: 0, avgAts: 0 });
  const [userCredits, setUserCredits] = useState<number>(0);
  const [userRole, setUserRole] = useState<string>("standard");

  // Job Scraper & Gen state
  const [inputMethod, setInputMethod] = useState<"scrape" | "paste">("scrape");
  const [jobUrl, setJobUrl] = useState("");
  const [jobText, setJobText] = useState("");
  const [isGeneral, setIsGeneral] = useState(false);
  const [includeCoverLetter, setIncludeCoverLetter] = useState(false);
  const [isRedirectingToPayfast, setIsRedirectingToPayfast] = useState(false);
  const [selectedResume, setSelectedResume] = useState("ui_ux_pro_max_resume.html");
  const [selectedCl, setSelectedCl] = useState("caleb_foster_cover_letter.html");
  const [customInstructions, setCustomInstructions] = useState("");
  const [generating, setGenerating] = useState(false);
  const [genSteps, setGenSteps] = useState<string[]>([]);

  // Batch autopilot
  interface ScrapedJob {
    url: string;
    company_name: string;
    job_title: string;
    job_description: string;
    requirements: { resume: boolean; cover_letter: boolean };
  }
  const [batchFile, setBatchFile] = useState<File | null>(null);
  const [batchProcessing, setBatchProcessing] = useState(false);
  const [isAnalyzingBatch, setIsAnalyzingBatch] = useState(false);
  const [batchScrapedJobs, setBatchScrapedJobs] = useState<ScrapedJob[] | null>(null);
  const [batchLogs, setBatchLogs] = useState<string[]>([]);
  const [batchProgress, setBatchProgress] = useState(0);

  // Archive
  const [applications, setApplications] = useState<any[]>([]);
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ids: string[]} | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<{name: string, type: string} | null>(null);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  // Re-authentication Modal
  const [showReauthModal, setShowReauthModal] = useState(false);
  const [reauthPassword, setReauthPassword] = useState("");
  const [reauthError, setReauthError] = useState<string | null>(null);
  const [isReauthenticating, setIsReauthenticating] = useState(false);



  const handlePreview = async (templateName: string, type: string) => {
    setPreviewTemplate({ name: templateName, type });
    setPreviewLoading(true);
    setPreviewHtml(null);
    try {
      const dummyData = type === 'Resume' ? {
        contact_info: {name: "Jane Doe", email: "jane@example.com", phone: "123-456-7890", location: "New York, NY", linkedin: "linkedin.com/in/janedoe"},
        professional_summary: "Experienced professional with a track record of success and driving key business objectives.",
        skills: ["Project Management", "Data Analysis", "Communication", "Leadership", "Agile", "Scrum"],
        experience: [
          {company: "Tech Corp", title: "Senior Developer", dates: "2020 - Present", achievements: ["Led a cross-functional team of 5", "Increased revenue by 10% through optimization"]}
        ],
        education: [
          {institution: "State University", degree: "BS Computer Science", dates: "2016 - 2020"}
        ]
      } : {
        contact_info: {name: "Jane Doe", email: "jane@example.com", phone: "123-456-7890", location: "New York, NY", linkedin: "linkedin.com/in/janedoe"},
        date: "October 10, 2023",
        recipient_name: "Hiring Manager",
        company_name: "InnovateTech",
        greeting: "Dear Hiring Manager,",
        opening_paragraph: "I am writing to express my interest in the open position at InnovateTech. With my extensive background, I am confident I would be a great fit.",
        body_paragraphs: ["During my previous role, I successfully managed several large-scale projects and delivered them on time and under budget.", "I am particularly drawn to InnovateTech's mission and innovative approach to problem solving."],
        closing_paragraph: "Thank you for considering my application. I look forward to the possibility of discussing this exciting opportunity with you.",
        sign_off: "Sincerely,",
        applicant_name: "Jane Doe"
      };
      
      const res = await api.previewHtml(templateName, dummyData);
      setPreviewHtml(res.html_content);
    } catch (e) {
      setPreviewHtml("<div style='padding:20px; color:red; text-align:center;'>Failed to load preview. Please try again later.</div>");
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleOpenInEditor = (app: any) => {
    if (!app.resume_json) {
      triggerToast("Cannot edit: This application does not contain resume data.", "error");
      return;
    }

    try {
      const r = app.resume_json;
      const contact = {
        firstName: r.contact_info?._wizard?.firstName || r.contact_info?.name?.split(" ")[0] || "",
        lastName: r.contact_info?._wizard?.lastName || r.contact_info?.name?.split(" ").slice(1).join(" ") || "",
        city: r.contact_info?._wizard?.city || r.contact_info?.location || "",
        postalCode: r.contact_info?._wizard?.postalCode || "",
        phone: r.contact_info?.phone || "",
        email: r.contact_info?.email || ""
      };
      
      const experiences = (r.experience || []).map((e: any, i: number) => {
         if (e._wizard) {
           return {
             id: Date.now().toString() + i,
             title: e.title || "",
             employer: e.company || "",
             city: e._wizard.city || "",
             startDate: e._wizard.startDate || "",
             endDate: e._wizard.endDate || "",
             current: e._wizard.current || false,
             description: (e.achievements || []).join("\n")
           };
         }
         let startDate = "";
         let endDate = "";
         let current = false;
         if (e.dates) {
           const parts = e.dates.split(" - ");
           startDate = parts[0] || "";
           if (parts[1]) {
             if (parts[1].toLowerCase().includes("present")) {
               current = true;
             } else {
               endDate = parts[1];
             }
           }
         }
         return {
           id: Date.now().toString() + i,
           title: e.title || "",
           employer: e.company || "",
           city: "",
           startDate,
           endDate,
           current,
           description: (e.achievements || []).join("\n")
         };
      });

      const educations = (r.education || []).map((e: any, i: number) => {
         if (e._wizard) {
           return {
             id: Date.now().toString() + i,
             school: e.institution || "",
             degree: e._wizard.degree || "",
             course: e._wizard.course || "",
             city: e._wizard.city || "",
             startDate: e._wizard.startDate || "",
             endDate: e._wizard.endDate || "",
             current: e._wizard.current || false,
             description: ""
           };
         }
         let startDate = "";
         let endDate = "";
         let current = false;
         if (e.dates) {
           const parts = e.dates.split(" - ");
           startDate = parts[0] || "";
           if (parts[1]) {
             if (parts[1].toLowerCase().includes("present")) {
               current = true;
             } else {
               endDate = parts[1];
             }
           }
         }
         let degree = e.degree || e.qualification || "";
         let course = "";
         if (degree.includes(" - ")) {
           const parts = degree.split(" - ");
           degree = parts[0];
           course = parts.slice(1).join(" - ");
         } else if (degree.includes(" in ")) {
           const parts = degree.split(" in ");
           degree = parts[0];
           course = parts.slice(1).join(" in ");
         }
         return {
           id: Date.now().toString() + i,
           school: e.institution || "",
           degree,
           course,
           city: "",
           startDate,
           endDate,
           current,
           description: ""
         };
      });

      const skills = (r.skills || []).map((s: any, i: number) => {
        let name = s;
        if (typeof s === 'object') {
           name = s.name;
        }
        
        let type = "Technical";
        // Deduce type from r.soft_skills if available (works for AI-tailored and older CVs)
        if (r.soft_skills && Array.isArray(r.soft_skills) && r.soft_skills.includes(name)) {
            type = "Soft";
        } else if (typeof s === 'object' && s.type) {
            type = s.type;
        }
        
        return {
          id: Date.now().toString() + i,
          name: name || "",
          level: "Expert",
          type: type
        };
      });
      
      const summary = r.professional_summary || "";
      const documentTitle = app.job_title === "General CV" ? app.company_name : `${app.job_title} at ${app.company_name}`;
      
      const formatState = r._wizard_format || {
        template: selectedResume || "ats_resume_template.html",
        accentColor: r.accent_color || "#4f46e5",
        titleFont: r.title_font || "BEBAS NEUE (DEFAULT)",
        bodyFont: r.body_font || "Lato",
        language: "English"
      };
      
      const draft = {
        contact,
        experiences: experiences.length > 0 ? experiences : [{ id: "1", title: "", employer: "", startDate: "", endDate: "", city: "", current: false, description: "" }],
        educations: educations.length > 0 ? educations : [{ id: "1", school: "", degree: "", course: "", startDate: "", endDate: "", city: "", current: false, description: "" }],
        skills: skills.length > 0 ? skills : [{ id: "1", name: "", level: "Expert", type: "Technical" }],
        summary,
        documentTitle,
        format: formatState
      };
      
      setSelectedResume(formatState.template);
      localStorage.setItem("resume_wizard_draft", JSON.stringify(draft));
      
      // Update active tab to builder to open the Wizard
      setActiveTab("builder");
    } catch (e) {
      console.error(e);
      triggerToast("Failed to load resume into Wizard.", "error");
    }
  };

  const handleDeleteApps = async (ids: string[]) => {
    setConfirmDelete({ ids });
  };

  const executeDelete = async () => {
    if (!confirmDelete) return;
    const ids = confirmDelete.ids;
    setIsDeleting(true);
    setConfirmDelete(null);
    try {
      const { error } = await supabase.from("applications").delete().in("id", ids);
      if (error) throw error;
      setApplications((prev) => prev.filter((a) => !ids.includes(a.id)));
      setSelectedApps((prev) => prev.filter((id) => !ids.includes(id)));
      triggerToast("Successfully deleted application(s)", "success");
      setStats((prev) => ({ ...prev, appsCount: Math.max(0, prev.appsCount - ids.length) }));
    } catch (e: any) {
      triggerToast("Failed to delete: " + e.message, "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // File inputs
  const cvFileInputRef = useRef<HTMLInputElement>(null);
  const certFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        const checkoutType = searchParams.get("checkout");
        const jobs = searchParams.get("jobs");
        const bType = searchParams.get("batchType");
        let redirectUrl = "/login?redirect=/home";
        if (checkoutType) {
          redirectUrl += `?checkout=${checkoutType}`;
          if (jobs) redirectUrl += `%26jobs=${jobs}`;
          if (bType) redirectUrl += `%26batchType=${bType}`;
        }
        router.replace(redirectUrl);
      } else {
        setUser(user);
        await loadUserData(user.id);

        // Check if redirect query parameters contain checkout info
        const checkoutSuccess = searchParams.get("checkout_success");
        const checkoutCancel = searchParams.get("checkout_cancel");
        
        if (checkoutSuccess) {
          triggerToast("Payment successful! Credits have been added to your account. You can now generate documents.", "success");
          router.replace("/home");
        } else if (checkoutCancel) {
          triggerToast("Payment was cancelled or unsuccessful. Please verify your payment details.", "error");
          router.replace("/home");
        }
      }
      setLoading(false);
    };
    checkUser();

    // Listen for BFCache restore (when the user hits the browser's Back button from PayFast)
    // This resets the stuck "Connecting to Payfast..." button.
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        setIsRedirectingToPayfast(false);
      }
    };
    window.addEventListener("pageshow", onPageShow);
    
    return () => {
      window.removeEventListener("pageshow", onPageShow);
    };
  }, [router, searchParams]);


  const loadUserData = async (userId: string) => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser?.email && !emailInput) {
        setEmailInput(currentUser.email);
      }

      // 1. Fetch Profile (with safe schema fallback)
      let profile: any = null;
      try {
        const res = await supabase
          .from("profiles")
          .select("raw_info, username, first_name, last_name, phone, credits, target_job_title, experience_level, location, linkedin_url, role, last_credit_reset")
          .eq("id", userId)
          .single();
        profile = res.data;
      } catch (err) {
        console.warn("Failed to select role/last_credit_reset (schema may not exist yet), falling back:", err);
        const res = await supabase
          .from("profiles")
          .select("raw_info, username, first_name, last_name, phone, credits, target_job_title, experience_level, location, linkedin_url")
          .eq("id", userId)
          .single();
        profile = res.data;
      }

      let activeRawInfo = profile?.raw_info || "";

      if (profile) {
        setUsername(profile.username || "");
        setFirstName(profile.first_name || "");
        setLastName(profile.last_name || "");
        setPhone(profile.phone || "");
        setTargetJobTitle(profile.target_job_title || "");
        if (profile.experience_level) setExperienceLevel(profile.experience_level);
        setLinkedinUrl(profile.linkedin_url || "");

        // Determine if admin (by role column or email)
        const isAdmin = profile.role === "admin" || currentUser?.email === "kairosounds.01@gmail.com";
        
        if (isAdmin) {
          setUserRole("admin");
          // Check if daily reset is needed (50 credits a day)
          const todayStr = new Date().toISOString().split("T")[0];
          const lastReset = profile.last_credit_reset;
          
          if (!lastReset || lastReset !== todayStr) {
            await supabase
              .from("profiles")
              .update({ credits: 50, last_credit_reset: todayStr })
              .eq("id", userId);
            setUserCredits(50);
            console.log(`[Admin Reset] Reset credits to 50 for today: ${todayStr}`);
          } else {
            setUserCredits(profile.credits ?? 0);
          }
        } else {
          setUserRole(profile.role || "standard");
          setUserCredits(profile.credits ?? 0);
        }
      }

      // Fallback/Sync: If raw_info is empty, check if Master_CV.txt exists in storage
      if (!activeRawInfo.trim()) {
        try {
          const { data: textData } = await supabase.storage
            .from("resumes")
            .download(`${userId}/master_cv/Master_CV.txt`);
          if (textData) {
            const textContent = await textData.text();
            if (textContent.trim()) {
              activeRawInfo = textContent;
              // Sync back to database
              await supabase.from("profiles").upsert({
                id: userId,
                raw_info: textContent,
                updated_at: new Date().toISOString(),
              });
            }
          }
        } catch (e) {
          // file may not exist yet
        }
      }
      setProfileRaw(activeRawInfo);

      // 2. Fetch Master CV File Download URL if exists in storage
      try {
        const { data: listRes, error: listError } = await supabase.storage
          .from("resumes")
          .list(`${userId}/master_cv`);
          
        const hasMasterCv = listRes?.some(file => file.name === "Master_CV.pdf");
        
        if (hasMasterCv) {
          const { data: cvSignRes } = await supabase.storage
            .from("resumes")
            .createSignedUrl(`${userId}/master_cv/Master_CV.pdf`, 7200);
          if (cvSignRes?.signedUrl) {
            setMasterCvUrl(cvSignRes.signedUrl);
          } else {
            setMasterCvUrl(null);
          }
        } else {
          setMasterCvUrl(null);
        }
      } catch (e) {
        setMasterCvUrl(null);
      }

      // 3. Fetch Certificates
      const { data: certs } = await supabase
        .from("certificates")
        .select("*")
        .eq("user_id", userId);
      
      const loadedCerts = certs || [];
      setCertificates(loadedCerts);

      // Fetch signed URLs for certificates
      const loadedCertUrls: { [id: string]: string } = {};
      for (const cert of loadedCerts) {
        try {
          const { data: cSignRes } = await supabase.storage
            .from("resumes")
            .createSignedUrl(`${userId}/certificates/${cert.id}.pdf`, 7200);
          if (cSignRes?.signedUrl) {
            loadedCertUrls[cert.id] = cSignRes.signedUrl;
          }
        } catch (e) {
          // File might not exist
        }
      }
      setCertUrls(loadedCertUrls);

      // 4. Fetch Applications
      const { data: apps } = await supabase
        .from("applications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      const loadedApps = apps || [];
      setApplications(loadedApps);

      // 5. Calculate Stats
      const scoreRows = loadedApps.filter((a) => a.ats_score !== null);
      const avg = scoreRows.length > 0
        ? Math.round(scoreRows.reduce((sum, a) => sum + (a.ats_score || 0), 0) / scoreRows.length)
        : 0;

      setStats({
        appsCount: loadedApps.length,
        certsCount: loadedCerts.length,
        avgAts: avg,
      });
    } catch (err) {
      console.error("Error loading user data:", err);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    try {
      setSavingProfile(true);

      let formattedPhone = phone.trim().replace(/\s+/g, '');
      if (formattedPhone.startsWith("0")) {
        formattedPhone = "+27" + formattedPhone.substring(1);
      } else if (formattedPhone.startsWith("27") && formattedPhone.length === 11) {
        formattedPhone = "+" + formattedPhone;
      } else if (!formattedPhone.startsWith("+") && formattedPhone.length > 0) {
        formattedPhone = "+27" + formattedPhone;
      }

      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        username,
        first_name: firstName,
        last_name: lastName,
        phone: formattedPhone,
        target_job_title: targetJobTitle,
        experience_level: experienceLevel,
        linkedin_url: linkedinUrl,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      triggerToast("Profile details updated successfully!", "success");
      setPhone(formattedPhone); // Update UI to show formatted phone
    } catch (err: any) {
      triggerToast("Error updating profile: " + err.message, "error");
    } finally {
      setSavingProfile(false);
    }
  };

  const promptChangeEmail = () => {
    if (!user || !emailInput || emailInput === user.email) return;
    setShowReauthModal(true);
    setReauthPassword("");
    setReauthError(null);
  };

  const confirmChangeEmail = async () => {
    if (!user || !emailInput || emailInput === user.email) return;
    try {
      setIsReauthenticating(true);
      setReauthError(null);

      // Verify current password first
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: reauthPassword,
      });

      if (signInError) {
        throw new Error("Incorrect password. Please try again.");
      }

      setChangingEmail(true);
      const { error } = await supabase.auth.updateUser({ email: emailInput });
      if (error) throw error;
      
      setShowReauthModal(false);
      triggerToast("Email change initiated! Check BOTH your old and new email inboxes for verification links.", "success");
    } catch (err: any) {
      setReauthError(err.message);
    } finally {
      setIsReauthenticating(false);
      setChangingEmail(false);
    }
  };

  const handleUpdateMasterCvText = async () => {
    if (!user) return;
    setSavingProfile(true);
    try {
      // 1. Save text to database
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        raw_info: profileRaw,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;

      // 2. Compile Master CV to PDF and upload to Supabase Storage
      const compileRes = await api.compileMasterCv(user.id, profileRaw);
      if (compileRes.download_url) {
        setMasterCvUrl(compileRes.download_url);
      }

      // 3. Upload raw text as a text file to Supabase Storage
      const textBlob = new Blob([profileRaw], { type: "text/plain" });
      const textFile = new File([textBlob], "Master_CV.txt", { type: "text/plain" });
      await supabase.storage
        .from("resumes")
        .upload(`${user.id}/master_cv/Master_CV.txt`, textFile, { upsert: true });

      triggerToast("Master CV raw text saved and PDF compiled successfully!", "success");
    } catch (err: any) {
      triggerToast("Failed to save CV text: " + err.message, "error");
    } finally {
      setSavingProfile(false);
    }
  };



  const handleParseCvPdf = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setParsingCv(true);
    try {
      // 1. Upload original PDF to Supabase Storage
      await supabase.storage
        .from("resumes")
        .upload(`${user.id}/master_cv/Master_CV.pdf`, file, { upsert: true });

      // 2. Call API to extract text and save it to the database
      const res = await api.parseCv(file, user.id);
      setProfileRaw(res.extracted_text);

      // Upload raw text as a text file to Supabase Storage
      const textBlob = new Blob([res.extracted_text], { type: "text/plain" });
      const textFile = new File([textBlob], "Master_CV.txt", { type: "text/plain" });
      await supabase.storage
        .from("resumes")
        .upload(`${user.id}/master_cv/Master_CV.txt`, textFile, { upsert: true });

      // 3. Reload download URL
      const { data: cvSignRes } = await supabase.storage
        .from("resumes")
        .createSignedUrl(`${user.id}/master_cv/Master_CV.pdf`, 7200);
      if (cvSignRes?.signedUrl) {
        setMasterCvUrl(cvSignRes.signedUrl);
      }

      triggerToast("Master CV PDF parsed, saved, and text updated successfully!", "success");
    } catch (err: any) {
      triggerToast("Parsing failed: " + err.message, "error");
    } finally {
      setParsingCv(false);
      if (cvFileInputRef.current) cvFileInputRef.current.value = "";
    }
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
        triggerToast("Only PDF files are supported for certificates.", "error");
      }
    }
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
    
    // Sequential uploads — process one at a time to avoid overwhelming the backend
    (async () => {
      for (const item of newItems) {
        await uploadSingleFile(item.id, item.file);
      }
    })();
  };

  const uploadSingleFile = async (uploadId: string, file: File): Promise<void> => {
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

    return new Promise<void>((resolve) => {
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

            setUploadingFiles(prev => prev.map(f => f.id === uploadId ? { 
              ...f, 
              status: "success", 
              progress: 100,
              aiName: aiName,
              aiDescription: extractedText,
              isEditing: false
            } : f));
          } catch (err: any) {
            setUploadingFiles(prev => prev.map(f => f.id === uploadId ? { ...f, status: "error", errorMsg: err.message || "Parse failed" } : f));
          }
        } else {
          setUploadingFiles(prev => prev.map(f => f.id === uploadId ? { ...f, status: "error", errorMsg: `Upload failed (${xhr.status})` } : f));
        }
        resolve();
      };

      xhr.onerror = () => {
        setUploadingFiles(prev => prev.map(f => f.id === uploadId ? { ...f, status: "error", errorMsg: "Connection failed — please retry" } : f));
        resolve();
      };

      xhr.ontimeout = () => {
        setUploadingFiles(prev => prev.map(f => f.id === uploadId ? { ...f, status: "error", errorMsg: "Request timed out — please retry" } : f));
        resolve();
      };

      xhr.timeout = 60000; // 60 second timeout per file
      xhr.open("POST", `${API_BASE_URL}/api/parse-cv`);
      xhr.setRequestHeader("Authorization", `Bearer ${session.access_token}`);
      xhr.send(formData);
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

      // Refresh data
      if (user?.id) {
        await loadUserData(user.id);
      }
    } catch (err: any) {
      triggerToast("Failed to update certificate: " + err.message, "error");
    }
  };
  
  const handleCompleteUploads = async () => {
    if (!user) return;
    setIsSyncing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (!userId) throw new Error("Session expired");

      const successItems = uploadingFiles.filter(f => f.status === "success");
      if (successItems.length === 0) {
        triggerToast("No successful uploads to sync.", "info");
        return;
      }

      for (const item of successItems) {
        // 1. Insert into database
        const { data: certRecord, error: insertError } = await supabase
          .from("certificates")
          .insert({
            user_id: userId,
            name: item.aiName || item.name,
            extracted_text: item.aiDescription || "",
          })
          .select("id")
          .single();

        if (insertError) throw insertError;

        // 2. Upload file to Supabase storage using the new DB ID
        if (certRecord) {
          await supabase.storage
            .from("resumes")
            .upload(`${userId}/certificates/${certRecord.id}.pdf`, item.file, { upsert: true });
        }
      }

      // 3. Filter out successfully synced files from the queue
      setUploadingFiles(prev => prev.filter(f => f.status !== "success"));

      // 4. Force a fresh load of user certificates and signed URLs
      await loadUserData(user.id);
      
      triggerToast(`${successItems.length} certificate(s) synced and saved successfully!`, "success");
    } catch (err: any) {
      triggerToast("Sync failed: " + err.message, "error");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleUploadCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    // We either need files or manual text with a manually provided name
    if (certPdfFiles.length === 0 && (!manualCertText.trim() || !newCertName.trim())) {
      triggerToast("Please upload PDF documents or manually provide a name and text description.", "error");
      return;
    }

    setUploadingCert(true);
    setUploadProgress("Starting upload...");
    try {
      // 1. Process files if uploaded
      let uploadedCount = 0;
      let skippedCount = 0;
      
      let index = 0;
      for (const file of certPdfFiles) {
        index++;
        setUploadProgress(`Processing ${index} of ${certPdfFiles.length}: ${file.name}...`);
        
        // Extract text from the PDF
        const parseRes = await api.parseCv(file, user.id);
        const extractedText = parseRes.extracted_text;
        
        if (!extractedText.trim()) {
          triggerToast(`Skipped ${file.name}: Could not extract any text.`, "error");
          skippedCount++;
          continue;
        }

        // Prevent duplicates
        const isDuplicate = certificates.some(c => c.extracted_text === extractedText);
        if (isDuplicate) {
          triggerToast(`Skipped duplicate document: ${file.name}`, "info");
          skippedCount++;
          continue;
        }

        // Auto-name the document using our new AI endpoint
        const nameRes = await api.autoNameDocument(extractedText);
        const aiName = nameRes.name || "Untitled Document";

        // Insert record into database certificates table
        const { data: certRecord, error: insertError } = await supabase
          .from("certificates")
          .insert({
            user_id: user.id,
            name: aiName,
            extracted_text: extractedText,
          })
          .select("id")
          .single();

        if (insertError) throw insertError;

        // Upload file to Supabase Storage using certificate ID
        if (certRecord) {
          await supabase.storage
            .from("resumes")
            .upload(`${user.id}/certificates/${certRecord.id}.pdf`, file, { upsert: true });
        }
        uploadedCount++;
      }

      // 2. Process manual text entry if provided
      if (manualCertText.trim() && newCertName.trim()) {
        setUploadProgress("Saving manual entry...");
        const isDuplicate = certificates.some(c => c.extracted_text === manualCertText);
        if (isDuplicate) {
          triggerToast(`Skipped duplicate manual document: ${newCertName}`, "info");
          skippedCount++;
        } else {
          const { error: manualError } = await supabase
            .from("certificates")
            .insert({
              user_id: user.id,
              name: newCertName,
              extracted_text: manualCertText,
            });
          if (manualError) throw manualError;
          uploadedCount++;
        }
      }

      setNewCertName("");
      setManualCertText("");
      setCertPdfFiles([]);
      if (certFileInputRef.current) certFileInputRef.current.value = "";
      
      setUploadProgress("Refreshing your documents...");
      await loadUserData(user.id);
      
      if (uploadedCount > 0) {
        triggerToast(`${uploadedCount} Document(s) uploaded and saved successfully!`, "success");
      } else if (skippedCount > 0) {
        triggerToast("No new documents saved. All documents were duplicates or empty.", "error");
      }
    } catch (err: any) {
      triggerToast("Failed to process document(s): " + err.message, "error");
    } finally {
      setUploadingCert(false);
      setUploadProgress("");
    }
  };

  const handleDeleteCert = (certId: string) => {
    setDeleteCertId(certId);
  };

  const executeDeleteCert = async (certId: string) => {
    try {
      // 1. Delete from database
      const { error } = await supabase.from("certificates").delete().eq("id", certId);
      if (error) throw error;

      // 2. Delete file from storage if it exists
      try {
        await supabase.storage.from("resumes").remove([`${user!.id}/certificates/${certId}.pdf`]);
      } catch (se) {
        // file might not exist
      }

      await loadUserData(user!.id);
      setUploadingFiles(prev => prev.filter(f => f.dbRecordId !== certId));
      triggerToast("Credential deleted successfully!", "success");
    } catch (err: any) {
      triggerToast("Failed to delete certificate: " + err.message, "error");
    }
  };

  const handleLogOut = async () => {
    localStorage.removeItem("edit_resume_json");
    localStorage.removeItem("edit_cl_json");
    localStorage.removeItem("edit_company");
    localStorage.removeItem("edit_job_title");
    localStorage.removeItem("edit_ats_score");
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleGenerateWorkflow = async () => {
    if (!profileRaw.trim()) {
      triggerToast("Please load your Master CV Data in the Profile tab first.", "error");
      return;
    }

    // 1. Detect multiple links in single job tailoring (URL scraper or pasted text)
    if (!isGeneral) {
      const textToSearch = inputMethod === "scrape" ? jobUrl : jobText;
      const urlMatches = textToSearch?.match(/https?:\/\/[^\s]+/g);
      if (urlMatches && urlMatches.length > 1) {
        triggerToast(`Multiple job links detected (${urlMatches.length} links)! Which specific job should it tailor for? Please paste only a single job URL in this field, or use Batch Autopilot mode.`, "error");
        return;
      }
    }

    // Check credits
    const isCombo = includeCoverLetter;
    const price = isCombo ? 25 : 18;
    const desc = isCombo ? "Tailored Resume & Cover Letter Combo" : "Tailored Resume Only";
    const costInCredits = isCombo ? 2 : 1;

    console.log("[Generate] userCredits:", userCredits, "cost:", costInCredits);

    if (userCredits >= costInCredits) {
      console.log("[Generate] Sufficient credits, running directly");
      executeGenerateWorkflow();
      return;
    }

    // Not enough credits – redirect to Payfast
    console.log("[Generate] Insufficient credits, redirecting to Payfast...");
    setIsRedirectingToPayfast(true);
    try {
      console.log("[Generate] Insufficient credits, redirecting to Payfast...");
      await api.createPayfastCheckout(price, desc);
      // createPayfastCheckout writes the backend HTML page directly into the
      // document, which auto-submits the PayFast form from Render's domain.
    } catch (e: any) {
      console.error("[Generate] Payfast error:", e);
      setIsRedirectingToPayfast(false);
      triggerToast("Error connecting to Payfast: " + e.message, "error");
    }
  };

  const executeGenerateWorkflow = async () => {
    setGenerating(true);
    setGenSteps(["Analyzing job description..."]);

    try {
      let company = "General";
      let title = "Resume";
      let requirements = { resume: true, cover_letter: includeCoverLetter };
      let jobDescriptionText = "";

      if (isGeneral) {
        requirements = { resume: true, cover_letter: false };
      } else {
        let activeInputMethod = inputMethod;
        let activeJobUrl = jobUrl;

        // Auto-detect single URL pasted into job text area
        if (inputMethod === "paste") {
          const trimmed = jobText.trim();
          const isUrl = /^https?:\/\/[^\s]+$/i.test(trimmed);
          if (isUrl) {
            activeInputMethod = "scrape";
            activeJobUrl = trimmed;
            setGenSteps((prev) => [...prev, "URL link detected in pasted text. Automatically scraping job details..."]);
          }
        }

        if (activeInputMethod === "scrape") {
          setGenSteps((prev) => [...prev, "Contacting scraping proxy server..."]);
          const scrapeRes = await api.scrapeJob(activeJobUrl);
          setGenSteps((prev) => [
            ...prev,
            `Successfully scraped! Detected: ${scrapeRes.job_title} at ${scrapeRes.company_name}`,
          ]);
          company = scrapeRes.company_name;
          title = scrapeRes.job_title;
          requirements = {
            resume: true,
            cover_letter: includeCoverLetter
          };
          jobDescriptionText = scrapeRes.job_description;
        } else {
          jobDescriptionText = jobText;
          company = "Extracted Company";
          title = "Pasted Role";
          requirements = { resume: true, cover_letter: includeCoverLetter };
        }
      }

      await runSingleTailoring(company, title, requirements, jobDescriptionText);
    } catch (err: any) {
      setGenerating(false);
      triggerToast("Failed to analyze job description: " + err.message, "error");
    }
  };

  const runSingleTailoring = async (
    company: string,
    title: string,
    requirements: { resume: boolean; cover_letter: boolean },
    jobDescriptionText: string
  ) => {
    setGenerating(true);
    setGenSteps((prev) => [...prev, "Payment confirmed. Beginning tailoring pipeline..."]);
    try {
      // Compile personal data including certs
      let personalDataCombined = profileRaw;
      if (firstName || lastName) {
        personalDataCombined = `Name: ${firstName} ${lastName}\n` + (phone ? `Phone: ${phone}\n` : "") + personalDataCombined;
      }
      if (certificates.length > 0) {
        personalDataCombined += "\n\n--- USER'S OFFICIALLY VERIFIED CERTIFICATES & CREDENTIALS ---\n";
        certificates.forEach((c) => {
          personalDataCombined += `Certificate: ${c.name}\nSkills & Text Extracted:\n${c.extracted_text}\n\n`;
        });
      }


      let generatedResumeJson = null;
      let generatedClJson = null;

      setGenSteps((prev) => [...prev, "Generating content via OpenAI GPT-4o-mini..."]);
      
      if (requirements.resume) {
        setGenSteps((prev) => [...prev, "Cooking tailored ATS Resume in JSON format..."]);
        generatedResumeJson = await api.generateDoc(
          jobDescriptionText,
          personalDataCombined,
          isGeneral ? "general_resume" : "resume",
          customInstructions
        );
      }

      if (requirements.cover_letter) {
        setGenSteps((prev) => [...prev, "Writing matching Cover Letter JSON document..."]);
        generatedClJson = await api.generateDoc(
          jobDescriptionText,
          personalDataCombined,
          "cover_letter",
          customInstructions
        );
      }

      let currentAts = null;
      if (requirements.resume && !isGeneral) {
        setGenSteps((prev) => [...prev, "Running ATS match scan and keyword audit..."]);
        currentAts = await api.getAtsScore(jobDescriptionText, generatedResumeJson);
      }

      // Save to database
      setGenSteps((prev) => [...prev, "Saving application to database..."]);
      const dbApp = {
        user_id: user.id,
        job_title: title,
        company_name: company,
        resume_url: null,
        cover_letter_url: null,
        ats_score: currentAts ? currentAts.score : null,
        resume_json: generatedResumeJson,
        cl_json: generatedClJson,
      };
      const { data: newApp, error: appError } = await supabase.from("applications").insert(dbApp).select().single();
      if (appError) throw appError;

      // Update local state for credits
      const costInCredits = requirements.resume && requirements.cover_letter ? 2 : 1;
      setUserCredits(userCredits - costInCredits);

      setGenSteps((prev) => [...prev, "Success! Directing to Editor workspace..."]);

      // Save to localStorage for editor access
      localStorage.setItem("edit_resume_json", JSON.stringify(generatedResumeJson));
      localStorage.setItem("edit_cl_json", JSON.stringify(generatedClJson));
      localStorage.setItem("edit_company", company);
      localStorage.setItem("edit_job_title", title);
      localStorage.setItem("edit_ats_score", JSON.stringify(currentAts));
      localStorage.setItem("edit_selected_resume_template", selectedResume);
      localStorage.setItem("edit_selected_cl_template", selectedCl);
      localStorage.setItem("edit_app_id", newApp.id);
      localStorage.setItem("edit_resume_compile_count", "0");
      localStorage.setItem("edit_cl_compile_count", "0");

      setTimeout(() => {
        router.push("/editor");
      }, 1000);
    } catch (err: any) {
      if (err.message === "INSUFFICIENT_CREDITS") {
        triggerToast("Insufficient credits! Redirecting to pricing page...", "error");
        setTimeout(() => router.push("/pricing"), 1500);
      } else {
        triggerToast("AI tailer pipeline failed: " + err.message, "error");
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleAnalyzeBatch = async () => {
    if (!batchFile || !profileRaw.trim()) {
      triggerToast("Ensure you have a valid urls file uploaded and Master CV details loaded.", "error");
      return;
    }

    try {
      setIsAnalyzingBatch(true);
      setBatchLogs(["Starting Batch Analysis..."]);
      
      const text = await batchFile.text();
      const urls = text.split("\n").map((u) => u.trim()).filter((u) => u.length > 0);
      
      if (urls.length === 0) {
        triggerToast("No links found in file.", "error");
        setIsAnalyzingBatch(false);
        return;
      }

      setBatchLogs((prev) => [...prev, `Found ${urls.length} URLs to analyze.`]);
      
      const scrapedJobs: ScrapedJob[] = [];
      
      for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        setBatchLogs((prev) => [...prev, `[${i + 1}/${urls.length}] Analyzing ${url.slice(0, 40)}...`]);
        try {
          const sRes = await api.scrapeJob(url);
          scrapedJobs.push({
            url: url,
            company_name: sRes.company_name,
            job_title: sRes.job_title,
            job_description: sRes.job_description,
            requirements: sRes.requirements
          });
          setBatchLogs((prev) => [...prev, `✅ Analyzed: ${sRes.job_title} at ${sRes.company_name}`]);
        } catch (e: any) {
          setBatchLogs((prev) => [...prev, `❌ Failed to analyze: ${url.slice(0, 40)}... (${e.message})`]);
        }
      }
      
      if (scrapedJobs.length === 0) {
        triggerToast("Failed to analyze any of the URLs.", "error");
        setBatchScrapedJobs(null);
      } else {
        setBatchScrapedJobs(scrapedJobs);
        setBatchLogs((prev) => [...prev, `Analysis complete. Found ${scrapedJobs.length} valid jobs.`]);
      }
    } catch (err: any) {
      triggerToast("Batch analysis failed: " + err.message, "error");
    } finally {
      setIsAnalyzingBatch(false);
    }
  };

  const handleBatchAutoPilot = async () => {
    if (!batchScrapedJobs) {
      triggerToast("Please analyze the batch first.", "error");
      return;
    }

    let resumeCount = 0;
    let comboCount = 0;

    batchScrapedJobs.forEach(job => {
        if (job.requirements.resume && job.requirements.cover_letter) comboCount++;
        else resumeCount++; 
    });

    const totalCost = (resumeCount * 15) + (comboCount * 25);
    const discounted = totalCost * 0.922;
    const costInCredits = resumeCount + (comboCount * 2);

    if (userCredits >= costInCredits) {
      runAutopilotLoop(batchScrapedJobs);
      return;
    }

    setIsRedirectingToPayfast(true);
    try {
      await api.createPayfastCheckout(discounted, `Batch Job Application: ${resumeCount} Resumes, ${comboCount} Combos`);
    } catch (e: any) {
      setIsRedirectingToPayfast(false);
      triggerToast("Error connecting to Payfast: " + e.message, "error");
    }
  };

  const runAutopilotLoop = async (scrapedJobs: ScrapedJob[]) => {
    setBatchProcessing(true);
    setBatchLogs([]);
    setBatchProgress(0);

    try {
      setBatchLogs((prev) => [...prev, `Generating ${scrapedJobs.length} target job applications.`]);

      let personalDataCombined = profileRaw;
      if (firstName || lastName) {
        personalDataCombined = `Name: ${firstName} ${lastName}\n` + (phone ? `Phone: ${phone}\n` : "") + personalDataCombined;
      }
      if (certificates.length > 0) {
        personalDataCombined += "\n\n--- USER'S OFFICIALLY VERIFIED CERTIFICATES ---\n";
        certificates.forEach((c) => {
          personalDataCombined += `Certificate: ${c.name}\n${c.extracted_text}\n\n`;
        });
      }

      for (let i = 0; i < scrapedJobs.length; i++) {
        const job = scrapedJobs[i];
        
        try {
          const cName = job.company_name;
          const jTitle = job.job_title;
          setBatchLogs((prev) => [...prev, `[Job ${i + 1}/${scrapedJobs.length}] Processing ${jTitle} at ${cName}`]);

          let resumeUrl = null;
          let clUrl = null;
          let appScore = null;
          let rJson = null;
          let clJson = null;

          if (job.requirements.resume) {
            setBatchLogs((prev) => [...prev, `[Job ${i + 1}] Generating CV...`]);
            rJson = await api.generateDoc(job.job_description, personalDataCombined, "resume", customInstructions);
            
            setBatchLogs((prev) => [...prev, `[Job ${i + 1}] Compiling CV PDF...`]);
            const cRes = await api.compileDoc({
              json_data: rJson,
              template_name: selectedResume,
              company_name: cName,
              job_title: jTitle,
              user_id: user.id,
              doc_type: "resume"
            });
            resumeUrl = cRes.download_url;

            // Score
            const scRes = await api.getAtsScore(job.job_description, rJson);
            appScore = scRes.score;
          }

          if (job.requirements.cover_letter) {
            setBatchLogs((prev) => [...prev, `[Job ${i + 1}] Generating Letter...`]);
            clJson = await api.generateDoc(job.job_description, personalDataCombined, "cover_letter", customInstructions);
            
            setBatchLogs((prev) => [...prev, `[Job ${i + 1}] Compiling Letter PDF...`]);
            const clcRes = await api.compileDoc({
              json_data: clJson,
              template_name: selectedCl,
              company_name: cName,
              job_title: jTitle,
              user_id: user.id,
              doc_type: "cover_letter"
            });
            clUrl = clcRes.download_url;
          }

          // Insert application
          await supabase.from("applications").insert({
            user_id: user.id,
            company_name: cName,
            job_title: jTitle,
            ats_score: appScore,
            resume_url: resumeUrl,
            cover_letter_url: clUrl,
            resume_json: rJson,
            cl_json: clJson
          });

          setBatchLogs((prev) => [...prev, `✅ [Job ${i + 1}] Finished and logged into archive.`]);
        } catch (e: any) {
          if (e.message === "INSUFFICIENT_CREDITS") {
            setBatchLogs((prev) => [...prev, `❌ [Job ${i + 1}] Failed: Insufficient credits to generate document.`]);
            triggerToast("Insufficient credits! Halting autopilot run.", "error");
            break; // Stop processing the rest of the batch
          } else {
            setBatchLogs((prev) => [...prev, `❌ [Job ${i + 1}] Failed: ${e.message}`]);
          }
        }

        setBatchProgress(((i + 1) / scrapedJobs.length) * 100);
      }
      if (user?.id) {
        await loadUserData(user.id);
      }
      setBatchLogs((prev) => [...prev, "Autopilot run complete!"]);
    } catch (err: any) {
      setBatchLogs((prev) => [...prev, `Critical Autopilot Error: ${err.message}`]);
    } finally {
      setBatchProcessing(false);
      setBatchScrapedJobs(null); // Reset after processing
    }
  };

  if (loading || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-brand-indigo border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-brand-navy/60">Loading user workspace...</p>
      </div>
    );
  }

  return (
    <>
    <div className="flex-1 flex flex-col min-h-screen bg-slate-50/50">

      {/* Fixed Viewport-Height Left Sidebar (Positioned in Far-Left Red Box) */}
      <aside
        className={`fixed top-0 left-0 h-screen z-50 bg-white border-r border-brand-navy/15 shadow-xl transition-all duration-300 ease-in-out flex flex-col justify-between ${
          sidebarCollapsed ? "w-16 p-2" : "w-64 p-4"
        }`}
      >
        {/* Top Portion: Title & Navigation */}
        <div className="space-y-4 overflow-y-auto pr-0.5">
          {/* Header & Toggle Activation Button */}
          <div className="flex items-center justify-between pb-3 border-b border-brand-navy/10">
            {!sidebarCollapsed && (
              <span className="text-xs font-black uppercase tracking-wider text-brand-deep flex items-center gap-2 px-1">
                <Settings className="w-4 h-4 text-brand-indigo" />
                Navigation
              </span>
            )}
            <button
              type="button"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              title={sidebarCollapsed ? "Activate / Expand Sidebar" : "Deactivate / Collapse Sidebar"}
              className="p-2 rounded-xl bg-slate-100 hover:bg-brand-indigo/10 text-brand-deep hover:text-brand-indigo transition-all duration-300 mx-auto lg:mx-0 cursor-pointer shadow-xs"
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen className="w-5 h-5 text-brand-indigo" />
              ) : (
                <PanelLeftClose className="w-5 h-5 text-brand-indigo" />
              )}
            </button>
          </div>

          {/* COLLAPSED MODE: Sleek Icon Panel (Uiverse-inspired) */}
          {sidebarCollapsed ? (
            <div className="flex flex-col gap-2 items-center py-2">
              <button
                type="button"
                onClick={() => setActiveTab("welcome")}
                title="Welcome Overview"
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group cursor-pointer ${
                  activeTab === "welcome"
                    ? "bg-brand-indigo text-white shadow-md scale-110"
                    : "bg-slate-50 text-slate-700 hover:bg-brand-indigo/10 hover:text-brand-indigo hover:scale-110"
                }`}
              >
                <Globe className="w-5 h-5" />
              </button>

              <hr className="w-8 border-brand-navy/10 my-1" />

              <button
                type="button"
                onClick={() => setActiveTab("profile")}
                title="My Profile"
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group cursor-pointer ${
                  activeTab === "profile"
                    ? "bg-brand-indigo text-white shadow-md scale-110"
                    : "bg-slate-50 text-slate-700 hover:bg-brand-indigo/10 hover:text-brand-indigo hover:scale-110"
                }`}
              >
                <User className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("parameters")}
                title="Parameters & Templates"
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group cursor-pointer ${
                  activeTab === "parameters"
                    ? "bg-brand-indigo text-white shadow-md scale-110"
                    : "bg-slate-50 text-slate-700 hover:bg-brand-indigo/10 hover:text-brand-indigo hover:scale-110"
                }`}
              >
                <Settings className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("mycv")}
                title="My CV & Documents"
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group cursor-pointer ${
                  activeTab === "mycv"
                    ? "bg-brand-indigo text-white shadow-md scale-110"
                    : "bg-slate-50 text-slate-700 hover:bg-brand-indigo/10 hover:text-brand-indigo hover:scale-110"
                }`}
              >
                <FileText className="w-5 h-5" />
              </button>

              <hr className="w-8 border-brand-navy/10 my-1" />

              <button
                type="button"
                onClick={() => setActiveTab("generate")}
                title="Tailor (Single Job)"
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group cursor-pointer ${
                  activeTab === "generate"
                    ? "bg-brand-indigo text-white shadow-md scale-110"
                    : "bg-slate-50 text-slate-700 hover:bg-brand-indigo/10 hover:text-brand-indigo hover:scale-110"
                }`}
              >
                <Zap className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("batch")}
                title="Batch Autopilot"
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group cursor-pointer ${
                  activeTab === "batch"
                    ? "bg-brand-indigo text-white shadow-md scale-110"
                    : "bg-slate-50 text-slate-700 hover:bg-brand-indigo/10 hover:text-brand-indigo hover:scale-110"
                }`}
              >
                <Briefcase className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("builder")}
                title="Resume Builder"
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group cursor-pointer ${
                  activeTab === "builder"
                    ? "bg-brand-indigo text-white shadow-md scale-110"
                    : "bg-slate-50 text-slate-700 hover:bg-brand-indigo/10 hover:text-brand-indigo hover:scale-110"
                }`}
              >
                <Construction className="w-5 h-5" />
              </button>

              <hr className="w-8 border-brand-navy/10 my-1" />

              <button
                type="button"
                onClick={() => setActiveTab("archive")}
                title="Saved Archives"
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group cursor-pointer ${
                  activeTab === "archive"
                    ? "bg-brand-indigo text-white shadow-md scale-110"
                    : "bg-slate-50 text-slate-700 hover:bg-brand-indigo/10 hover:text-brand-indigo hover:scale-110"
                }`}
              >
                <FolderOpen className="w-5 h-5" />
              </button>
            </div>
          ) : (
            /* EXPANDED MODE: Full Menu with Categories & Sub-items */
            <div className="space-y-4">

              <button
                onClick={() => setActiveTab("welcome")}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "welcome"
                    ? "bg-brand-indigo text-white shadow-sm"
                    : "text-brand-deep hover:bg-brand-navy/5"
                }`}
              >
                <Globe className="w-4 h-4" />
                Welcome Overview
              </button>
              
              {/* SETTINGS MENU GROUP */}
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setSettingsSubmenuOpen(!settingsSubmenuOpen)}
                  className="w-full flex items-center justify-between px-2 py-1.5 text-[10px] font-bold text-brand-navy/60 uppercase tracking-widest hover:text-brand-deep cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <Settings className="w-3.5 h-3.5 text-brand-indigo" />
                    Settings & Profile
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${settingsSubmenuOpen ? "rotate-180" : ""}`} />
                </button>

                {settingsSubmenuOpen && (
                  <div className="pl-2 space-y-1 border-l-2 border-brand-indigo/20 ml-2 animate-in fade-in duration-200">
                    <button
                      onClick={() => setActiveTab("profile")}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        activeTab === "profile"
                          ? "bg-brand-indigo text-white shadow-sm"
                          : "text-brand-deep hover:bg-brand-navy/5"
                      }`}
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </button>

                    <button
                      onClick={() => setActiveTab("parameters")}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        activeTab === "parameters"
                          ? "bg-brand-indigo text-white shadow-sm"
                          : "text-brand-deep hover:bg-brand-navy/5"
                      }`}
                    >
                      <Settings className="w-4 h-4" />
                      Parameters
                    </button>

                    <button
                      onClick={() => setActiveTab("mycv")}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        activeTab === "mycv"
                          ? "bg-brand-indigo text-white shadow-sm"
                          : "text-brand-deep hover:bg-brand-navy/5"
                      }`}
                    >
                      <FileText className="w-4 h-4" />
                      My CV
                    </button>
                  </div>
                )}
              </div>

              {/* AI TAILORING TOOLS GROUP */}
              <div className="space-y-1 pt-2 border-t border-brand-navy/10">
                <span className="text-[10px] font-bold text-brand-navy/60 uppercase tracking-widest px-2 block mb-1">
                  AI Tailoring Tools
                </span>
                <button
                  onClick={() => setActiveTab("generate")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === "generate"
                      ? "bg-brand-indigo text-white shadow-sm"
                      : "text-brand-deep hover:bg-brand-navy/5"
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  Tailor (Single Job)
                </button>

                <button
                  onClick={() => setActiveTab("batch")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === "batch"
                      ? "bg-brand-indigo text-white shadow-sm"
                      : "text-brand-deep hover:bg-brand-navy/5"
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  Batch Autopilot
                </button>

                <button
                  onClick={() => setActiveTab("builder")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === "builder"
                      ? "bg-brand-indigo text-white shadow-sm"
                      : "text-brand-deep hover:bg-brand-navy/5"
                  }`}
                >
                  <Construction className="w-4 h-4" />
                  Resume Builder
                </button>
              </div>

              {/* ARCHIVES GROUP */}
              <div className="space-y-1 pt-2 border-t border-brand-navy/10">
                <span className="text-[10px] font-bold text-brand-navy/60 uppercase tracking-widest px-2 block mb-1">
                  Archives
                </span>
                <button
                  onClick={() => setActiveTab("archive")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === "archive"
                      ? "bg-brand-indigo text-white shadow-sm"
                      : "text-brand-deep hover:bg-brand-navy/5"
                  }`}
                >
                  <FolderOpen className="w-4 h-4" />
                  Saved Archives
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Portion: User Account, Credits & Log Out (Moved from Header) */}
        <div className="pt-3 border-t border-brand-navy/10 space-y-2 shrink-0">
          {sidebarCollapsed ? (
            /* Collapsed Mode User Controls */
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("profile")}
                title={`${username || user?.email} (${userCredits} Credits)`}
                className="w-10 h-10 rounded-xl bg-brand-indigo/10 border border-brand-indigo/30 flex items-center justify-center text-brand-indigo font-bold text-xs hover:scale-110 transition-transform cursor-pointer"
              >
                <User className="w-4 h-4" />
              </button>
              <button
                onClick={handleLogOut}
                title="Log Out"
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Expanded Mode User Controls */
            <div className="space-y-2">
              <div 
                onClick={() => setActiveTab("profile")}
                className="p-2.5 rounded-xl bg-slate-50 border border-brand-navy/10 flex items-center justify-between cursor-pointer hover:bg-brand-indigo/5 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-brand-indigo/15 flex items-center justify-center text-brand-indigo font-bold text-xs shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-brand-deep truncate">{username || user?.email}</p>
                    <span className="text-[10px] font-semibold text-brand-indigo flex items-center gap-1">
                      <Zap className="w-3 h-3" /> {userCredits} Credits
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogOut}
                className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Workspace Container (With Left Padding for Fixed Sidebar) */}
      <main className={`flex-1 ${activeTab === 'builder' ? 'max-w-[1700px]' : 'max-w-7xl'} w-full mx-auto p-6 md:p-8 space-y-8 transition-all duration-300 ${sidebarCollapsed ? "pl-20" : "pl-72"}`}>

        {/* TAB 0: WELCOME OVERVIEW (60-30-10 RULE: WHITE - BLACK/GRAY - PURPLE) */}
        {activeTab === "welcome" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-150 ease-out w-full">
            
            {/* Frameless Hero Welcome Section */}
            <div className="space-y-2 border-b border-slate-200 pb-6">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome back, {firstName || username || user?.email?.split("@")[0]}
              </h2>
              <p className="text-sm text-slate-600 max-w-2xl leading-relaxed font-medium">
                Select an option below to start compiling tailored resumes, managing master documents, or setting up bulk application workflows.
              </p>
            </div>

            {/* Clean Frameless Quick Action Grid (No Logos, No Card Div Boxes) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-2">
              <div 
                onClick={() => setActiveTab("generate")}
                className="space-y-3 cursor-pointer group"
              >
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-purple-600 transition-colors flex items-center gap-2">
                  Tailor Resume (Single Job)
                  <span className="text-purple-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">&rarr;</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Extract requirements from a job URL or description text and instantly compile an ATS-optimized CV and cover letter.
                </p>
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition-colors cursor-pointer shadow-xs"
                >
                  Start Single Tailoring
                </button>
              </div>

              <div 
                onClick={() => setActiveTab("batch")}
                className="space-y-3 cursor-pointer group"
              >
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-purple-600 transition-colors flex items-center gap-2">
                  Batch Autopilot
                  <span className="text-purple-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">&rarr;</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Upload job description links in bulk to automatically generate, score, and store multiple application packages.
                </p>
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-800 hover:bg-purple-600 hover:text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Start Batch Autopilot
                </button>
              </div>

              <div 
                onClick={() => setActiveTab("builder")}
                className="space-y-3 cursor-pointer group"
              >
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-purple-600 transition-colors flex items-center gap-2">
                  Interactive Resume Builder
                  <span className="text-purple-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">&rarr;</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Step-by-step interactive resume creator to format experience, skills, and layout structure from scratch.
                </p>
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-800 hover:bg-purple-600 hover:text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Open Resume Builder
                </button>
              </div>
            </div>

            {/* Quick Navigation Links */}
            <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-slate-200 text-xs text-slate-600">
              <span className="font-bold text-slate-900">Quick Links:</span>
              <button 
                onClick={() => setActiveTab("mycv")}
                className="text-purple-600 hover:underline font-semibold cursor-pointer"
              >
                My CV & Master Data
              </button>
              <span className="text-slate-300">•</span>
              <button 
                onClick={() => setActiveTab("archive")}
                className="text-purple-600 hover:underline font-semibold cursor-pointer"
              >
                Applications Archives ({stats.appsCount})
              </button>
              <span className="text-slate-300">•</span>
              <button 
                onClick={() => setActiveTab("profile")}
                className="text-purple-600 hover:underline font-semibold cursor-pointer"
              >
                Account Settings
              </button>
            </div>

            {/* Recent Tailored Applications Preview (Utilizes lower workspace space framelessly) */}
            <div className="pt-6 border-t border-slate-200 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-purple-600" />
                  Recent Tailored Applications ({applications.length})
                </h3>
                {applications.length > 0 && (
                  <button
                    onClick={() => setActiveTab("archive")}
                    className="text-xs font-bold text-purple-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    View All Archives &rarr;
                  </button>
                )}
              </div>

              {applications.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-4">
                  No applications generated yet. Click "Start Single Tailoring" above to tailor your first resume!
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {applications.slice(0, 4).map((app) => (
                    <div 
                      key={app.id}
                      className="py-3 px-4 border border-slate-200 hover:border-purple-300 hover:bg-slate-50 transition-colors rounded-xl flex items-center justify-between gap-4"
                    >
                      <div className="min-w-0 space-y-0.5">
                        <div className="text-[10px] text-slate-500 font-mono">
                          {app.created_at ? new Date(app.created_at).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' }) : "Recent"}
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {app.job_title} <span className="text-purple-600 font-medium">at {app.company_name}</span>
                        </h4>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {app.pdf_url && (
                          <a
                            href={app.pdf_url}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 px-2.5 rounded-lg bg-slate-100 hover:bg-purple-600 hover:text-white text-slate-800 text-[11px] font-semibold transition-colors flex items-center gap-1"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>PDF</span>
                          </a>
                        )}
                        <button
                          onClick={() => {
                            if (app.pdf_url) window.open(`/editor?pdf=${encodeURIComponent(app.pdf_url)}`, '_blank');
                          }}
                          className="p-1.5 px-2.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-600 hover:text-white text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>Editor</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 1: MY PROFILE */}
        {activeTab === "profile" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-150 ease-out w-full">
            <h3 className="text-base font-bold text-brand-deep border-b border-brand-navy/15 pb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-brand-indigo" />
              Personal Information & Profile Settings
            </h3>

            {/* Workspace Statistics Summary (Frameless text under Settings -> My Profile) */}
            <div className="pb-4 border-b border-brand-navy/15">
              <h4 className="text-xs font-bold text-brand-navy/70 uppercase mb-2.5 flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-brand-indigo" />
                Workspace Statistics
              </h4>
              <div className="flex flex-wrap items-center gap-6 text-xs text-slate-700 font-medium">
                <span className="flex items-center gap-1.5">
                  <FolderOpen className="w-3.5 h-3.5 text-brand-indigo" />
                  <span className="font-bold text-brand-deep">{stats.appsCount}</span> Tailored Applications
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-brand-indigo" />
                  <span className="font-bold text-brand-deep">{stats.certsCount}</span> Loaded Credentials
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5 text-brand-indigo" />
                  <span className="font-bold text-brand-deep">{stats.avgAts}%</span> Average ATS Match Rate
                </span>
              </div>
            </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-brand-navy/70 mb-1">Username</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 glass-input text-sm"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-brand-navy/70 mb-1">First Name</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 glass-input text-sm"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-brand-navy/70 mb-1">Last Name</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 glass-input text-sm"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-brand-navy/70 mb-1">Mobile Number</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 glass-input text-sm"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  
                  <div className="pt-2 border-t border-brand-navy/15">
                    <h4 className="text-xs font-bold text-brand-navy/70 uppercase mb-3">Professional Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs text-brand-navy/70 mb-1">Target Job Title</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 glass-input text-sm"
                          value={targetJobTitle}
                          onChange={(e) => setTargetJobTitle(e.target.value)}
                          placeholder="e.g. Software Engineer"
                        />
                      </div>
                      <div className="relative">
                        <label className="block text-xs text-brand-navy/70 mb-1">Experience Level</label>
                        <button
                          type="button"
                          onClick={() => setShowExperienceDropdown(!showExperienceDropdown)}
                          className="w-full px-3 py-2 glass-input text-sm flex justify-between items-center text-left"
                        >
                          <span>{experienceOptions.find(o => o.value === experienceLevel)?.label || "Select Level"}</span>
                          <ChevronDown className={`h-4 w-4 text-brand-navy/40 transition-transform ${showExperienceDropdown ? 'rotate-180' : ''}`} />
                        </button>

                        {showExperienceDropdown && (
                          <>
                            <div 
                              className="fixed inset-0 z-10"
                              onClick={() => setShowExperienceDropdown(false)}
                            ></div>
                            <div className="absolute z-20 w-full mt-1 bg-white border border-brand-navy/10 rounded-lg shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                              {experienceOptions.map((opt) => (
                                <button
                                  key={opt.value}
                                  type="button"
                                  onClick={() => {
                                    setExperienceLevel(opt.value);
                                    setShowExperienceDropdown(false);
                                  }}
                                  className={`w-full text-left px-4 py-2 text-sm hover:bg-brand-navy/5 transition-colors ${experienceLevel === opt.value ? 'bg-brand-indigo/5 text-brand-indigo font-medium' : 'text-brand-deep'}`}
                                >
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-xs text-brand-navy/70 mb-1">LinkedIn URL</label>
                      <input
                        type="url"
                        className="w-full px-3 py-2 glass-input text-sm"
                        value={linkedinUrl}
                        onChange={(e) => setLinkedinUrl(e.target.value)}
                        placeholder="https://linkedin.com/in/..."
                      />
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-brand-navy/15">
                    <label className="block text-xs text-brand-navy/70 mb-1">Account Email Address</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="email"
                        className="flex-1 px-3 py-2 glass-input text-sm"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                      />
                      <button
                        onClick={promptChangeEmail}
                        disabled={changingEmail || emailInput === user?.email}
                        className="px-4 py-2 btn-primary text-xs disabled:opacity-50 sm:whitespace-nowrap"
                      >
                        {changingEmail ? "Sending..." : "Change Email"}
                      </button>
                    </div>
                    <p className="text-[10px] text-brand-navy/50 mt-1">Changing your email requires verifying links sent to both your old and new inboxes.</p>
                  </div>

                  <div className="pt-2 border-t border-brand-navy/15">
                    <label className="block text-xs text-brand-navy/70 mb-1">Account Security</label>
                    <button
                      type="button"
                      onClick={() => router.push("/update-password")}
                      className="w-full py-2 border border-brand-indigo/30 text-brand-indigo hover:bg-brand-indigo/5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <Key className="w-4 h-4 text-brand-indigo" />
                      Update Account Password
                    </button>
                  </div>

                  <button
                    onClick={handleUpdateProfile}
                    disabled={savingProfile}
                    className="w-full py-2.5 btn-primary text-sm flex items-center justify-center gap-2 mt-4"
                  >
                    <Save className="w-4 h-4 text-white" />
                    {savingProfile ? "Saving..." : "Update Profile Info"}
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: MY CV & DOCUMENTS */}
            {activeTab === "mycv" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start animate-in fade-in slide-in-from-right-4 duration-150 ease-out w-full">
                <div className="space-y-6">
                  <h3 className="text-base font-bold text-brand-deep border-b border-brand-navy/15 pb-3 flex items-center gap-2">
                    <Upload className="w-5 h-5 text-brand-indigo" />
                    Load Master CV & Documents
                  </h3>

                  <div className="space-y-4">
                    <div className="p-6 border-2 border-dashed border-slate-300 hover:border-purple-600 rounded-2xl bg-slate-50/70 hover:bg-purple-50/40 transition-all relative flex flex-col items-center justify-center text-center space-y-3 group cursor-pointer">
                      <input
                        type="file"
                        accept=".pdf"
                        ref={cvFileInputRef}
                        onChange={handleParseCvPdf}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        disabled={parsingCv}
                      />
                      <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs font-extrabold text-slate-900 group-hover:text-purple-600 transition-colors block">
                          Upload Master CV (PDF)
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium block">
                          Upload your latest CV PDF to extract experience & text
                        </span>
                      </div>
                      <span className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-purple-700 transition-colors inline-flex items-center gap-2">
                        <Upload className="w-3.5 h-3.5" />
                        {parsingCv ? "Parsing PDF..." : "Browse PDF File"}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-semibold text-brand-navy/40">
                      <hr className="flex-1 border-brand-navy/10" />
                      <span>OR</span>
                      <hr className="flex-1 border-brand-navy/10" />
                    </div>

                    <button
                      onClick={() => { localStorage.removeItem("resume_wizard_draft"); setActiveTab("builder"); }}
                      className="w-full py-3 border border-brand-indigo/30 rounded-xl bg-brand-indigo/[0.02] hover:bg-brand-indigo/[0.05] transition-colors flex flex-col items-center justify-center text-center group"
                    >
                      <Plus className="w-6 h-6 text-brand-indigo mb-1 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-semibold text-brand-deep">Create from Scratch</span>
                      <span className="text-[10px] text-brand-navy/60 mt-0.5">Use our interactive builder to write your resume</span>
                    </button>

                    {/* Master CV File details preview/download */}
                    {masterCvUrl && (
                      <div className="p-3.5 rounded-lg bg-brand-navy/5 border border-brand-navy/10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4.5 h-4.5 text-brand-indigo" />
                          <span className="text-xs font-bold text-brand-deep">Active Master CV PDF</span>
                        </div>
                        <a
                          href={masterCvUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 px-2.5 btn-secondary text-[10px] font-bold flex items-center gap-1"
                        >
                          <Download className="w-3 h-3 text-brand-indigo" />
                          Download
                        </a>
                      </div>
                    )}

                    <div className="pt-4 border-t border-brand-navy/15">
                      <h4 className="text-sm font-bold text-brand-deep mb-2">Master CV Text Data</h4>
                      <p className="text-xs text-brand-navy/70 mb-4">
                        This represents your core background resume text. AI will use it as base data.
                      </p>
                      <textarea
                        value={profileRaw}
                        onChange={(e) => setProfileRaw(e.target.value)}
                        className="w-full h-48 px-3 py-2 glass-input text-xs"
                        placeholder="Paste your general resume experience details..."
                      />
                      <button
                        onClick={handleUpdateMasterCvText}
                        disabled={savingProfile}
                        className="w-full py-2 btn-secondary text-sm mt-3 flex items-center justify-center gap-2"
                      >
                        <Save className="w-4 h-4 text-brand-indigo" />
                        Save Master CV Text
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-base font-bold text-brand-deep border-b border-brand-navy/15 pb-3 flex items-center gap-2">
                    <Award className="w-5 h-5 text-brand-indigo" />
                    Credentials & Certificates Vault
                  </h3>

                  <div className="space-y-4">
                    <div className="p-6 border-2 border-dashed border-slate-300 hover:border-purple-600 rounded-2xl bg-slate-50/70 hover:bg-purple-50/40 transition-all relative flex flex-col items-center justify-center text-center space-y-3 group cursor-pointer">
                      <input
                        type="file"
                        accept=".pdf"
                        ref={certFileInputRef}
                        onChange={handleUploadCert}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        disabled={uploadingCert}
                      />
                      <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs font-extrabold text-slate-900 group-hover:text-purple-600 transition-colors block">
                          Upload Certificate (PDF)
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium block">
                          Upload certificate PDF to store in vault & enhance resume ATS match
                        </span>
                      </div>
                      <span className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-purple-700 transition-colors inline-flex items-center gap-2">
                        <Upload className="w-3.5 h-3.5" />
                        {uploadingCert ? "Uploading..." : "Browse Certificate PDF"}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-semibold text-brand-navy/40">
                      <hr className="flex-1 border-brand-navy/10" />
                      <span>OR</span>
                      <hr className="flex-1 border-brand-navy/10" />
                    </div>

                    <button
                      onClick={() => { localStorage.removeItem("resume_wizard_draft"); setActiveTab("builder"); }}
                      className="w-full py-3 border border-brand-indigo/30 rounded-xl bg-brand-indigo/[0.02] hover:bg-brand-indigo/[0.05] transition-colors flex flex-col items-center justify-center text-center group"
                    >
                      <Plus className="w-6 h-6 text-brand-indigo mb-1 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-semibold text-brand-deep">Create from Scratch</span>
                      <span className="text-[10px] text-brand-navy/60 mt-0.5">Use our interactive builder to write your resume</span>
                    </button>

                    {/* Master CV File details preview/download */}
                    {masterCvUrl && (
                      <div className="p-3.5 rounded-lg bg-brand-navy/5 border border-brand-navy/10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4.5 h-4.5 text-brand-indigo" />
                          <span className="text-xs font-bold text-brand-deep">Active Master CV PDF</span>
                        </div>
                        <a
                          href={masterCvUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 px-2.5 btn-secondary text-[10px] font-bold flex items-center gap-1"
                        >
                          <Download className="w-3 h-3 text-brand-indigo" />
                          Download
                        </a>
                      </div>
                    )}

                    <div className="pt-4 border-t border-brand-navy/15 space-y-4">
                      <h4 className="text-sm font-bold text-brand-deep flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-brand-indigo" />
                        Credentials & Certificates
                      </h4>

                      {certificates.length === 0 ? (
                        <p className="text-xs text-brand-navy/60 italic">No certificates loaded yet.</p>
                      ) : (
                        <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                          {certificates.map((cert) => (
                            <div
                              key={cert.id}
                              className="flex items-center justify-between p-2.5 rounded-lg bg-brand-navy/5 border border-brand-navy/10 hover:border-brand-indigo/30 transition-colors"
                            >
                              <button
                                onClick={() => setPreviewCert(cert)}
                                className="text-xs font-medium text-brand-deep truncate max-w-[50%] hover:underline text-left"
                              >
                                {cert.name}
                              </button>
                              
                              <div className="flex items-center gap-2">
                                {certUrls[cert.id] && (
                                  <a
                                    href={certUrls[cert.id]}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-1 px-2 btn-secondary text-[9px] font-bold flex items-center gap-0.5"
                                  >
                                    <Download className="w-2.5 h-2.5 text-brand-indigo" />
                                    PDF
                                  </a>
                                )}
                                <button
                                  onClick={() => handleDeleteCert(cert.id)}
                                  className="text-brand-navy/60 hover:text-red-500 transition-colors p-1"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

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
                        <span className="text-xs font-bold text-brand-deep">
                          {isDragActive ? "Drop files here!" : "Drag & Drop PDF Documents"}
                        </span>
                        <span className="text-[10px] text-brand-navy/60 mt-1">Or click to select files (PDF transcripts, certificates, past resumes)</span>
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
                                      ? 'border-brand-indigo/35 bg-brand-indigo/[0.01]' 
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
                                          ? 'bg-brand-indigo/15 text-brand-indigo' 
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
                                        <span className="text-[10px] font-bold text-brand-indigo bg-brand-indigo/15 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                          <Check className="w-3 h-3" /> Done
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setUploadingFiles(prev => prev.filter(item => item.id !== f.id));
                                          }}
                                          className="text-brand-navy/40 hover:text-red-500 transition-colors p-1"
                                          title="Remove from queue"
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
                                        onClick={() => {
                                          if (f.dbRecordId) {
                                            handleUpdateQueueCert(f.id, f.dbRecordId, f.aiName || "", f.aiDescription || "");
                                          } else {
                                            setUploadingFiles(prev => prev.map(item => item.id === f.id ? { ...item, isEditing: false } : item));
                                          }
                                        }}
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

                           {uploadingFiles.some(f => f.status === "success") && (
                             <button
                               type="button"
                               onClick={handleCompleteUploads}
                               disabled={isSyncing}
                               className="w-full mt-4 py-2.5 bg-brand-indigo hover:bg-brand-indigo/90 disabled:bg-brand-indigo/50 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_4px_12px_rgba(79,70,229,0.15)] hover:shadow-[0_4px_20px_rgba(79,70,229,0.25)] cursor-pointer"
                             >
                               {isSyncing ? (
                                 <>
                                   <RefreshCw className="w-4 h-4 animate-spin" />
                                   Syncing Credentials...
                                 </>
                               ) : (
                                 <>
                                   <Check className="w-4 h-4" />
                                   Complete & Sync to Credentials
                                 </>
                               )}
                             </button>
                           )}
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-xs font-semibold text-brand-navy/40 py-2">
                        <hr className="flex-1 border-brand-navy/10" />
                        <span>OR MANUAL ENTRY</span>
                        <hr className="flex-1 border-brand-navy/10" />
                      </div>

                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Manual Name (e.g. AWS Solutions Architect)"
                          className="w-full px-3 py-2 glass-input text-xs"
                          value={newCertName}
                          onChange={(e) => setNewCertName(e.target.value)}
                        />
                        <textarea
                          placeholder="Paste manual credential text description here..."
                          className="w-full h-20 px-3 py-2 glass-input text-xs"
                          value={manualCertText}
                          onChange={(e) => setManualCertText(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={handleUploadCertificate}
                          disabled={uploadingCert || (!newCertName.trim() || !manualCertText.trim())}
                          className="w-full py-2.5 btn-primary text-xs flex items-center justify-center gap-2 mt-2 relative overflow-hidden cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          {uploadingCert ? uploadProgress || "Saving..." : "Save Manual Document"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: PARAMETERS & TEMPLATES SETTINGS */}
            {activeTab === "parameters" && (
              <div className="space-y-6 animate-in fade-in duration-300 w-full">
                <h3 className="text-base font-bold text-brand-deep border-b border-brand-navy/15 pb-3 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-brand-indigo" />
                  Parameters & AI Template Settings
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Resume Template Selection */}
                  <div className="space-y-2 p-4 bg-brand-navy/[0.02] border border-brand-navy/10 rounded-xl">
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-bold text-brand-deep uppercase">
                        Resume Template
                      </label>
                      <button 
                        type="button"
                        onClick={() => handlePreview(selectedResume, 'Resume')} 
                        className="text-xs text-brand-indigo hover:underline flex items-center gap-1 font-semibold"
                      >
                        <Eye className="w-3.5 h-3.5" /> Live Preview
                      </button>
                    </div>
                    <select
                      value={selectedResume}
                      onChange={(e) => setSelectedResume(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-brand-navy/15 rounded-lg text-xs font-medium text-brand-deep focus:outline-none focus:border-brand-indigo"
                    >
                      <option value="ui_ux_pro_max_resume.html">UI/UX Pro Max (Tailored)</option>
                      <option value="ats_resume_template.html">ATS Clean Blueprint</option>
                      <option value="david_turner_resume.html">David Turner (Modern Classic)</option>
                      <option value="amy_stein_resume.html">Amy Stein (Elegant Design)</option>
                      <option value="ava_martinez_resume.html">Ava Martinez (Minimalist)</option>
                      <option value="base_resume_template_black.html">Base Blueprint (Traditional)</option>
                      <option value="noma_resume_template_black.html">Noma Clean (Modern)</option>
                      <option value="note_resume_template_black.html">Note Serif (Classic)</option>
                      <option value="page_resume_template_black.html">Page Minimalist (Modern Border)</option>
                    </select>
                    <p className="text-[10px] text-brand-navy/60">Selected layout format applied during single and batch resume generation.</p>
                  </div>

                  {/* Cover Letter Template Selection */}
                  <div className="space-y-2 p-4 bg-brand-navy/[0.02] border border-brand-navy/10 rounded-xl">
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-bold text-brand-deep uppercase">
                        Cover Letter Template
                      </label>
                      <button 
                        type="button"
                        onClick={() => handlePreview(selectedCl, 'Cover Letter')} 
                        className="text-xs text-brand-indigo hover:underline flex items-center gap-1 font-semibold"
                      >
                        <Eye className="w-3.5 h-3.5" /> Live Preview
                      </button>
                    </div>
                    <select
                      value={selectedCl}
                      onChange={(e) => setSelectedCl(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-brand-navy/15 rounded-lg text-xs font-medium text-brand-deep focus:outline-none focus:border-brand-indigo"
                    >
                      <option value="caleb_foster_cover_letter.html">Caleb Foster (Modern Bold)</option>
                      <option value="takanori_ito_cover_letter.html">Takanori Ito (Formal)</option>
                    </select>
                    <p className="text-[10px] text-brand-navy/60">Selected layout format applied during cover letter compilation.</p>
                  </div>
                </div>

                {/* AI Focus Instructions */}
                <div className="space-y-2 pt-4 border-t border-brand-navy/15">
                  <label className="block text-xs font-bold text-brand-deep uppercase mb-1">
                    AI Focus & Custom Tailoring Instructions
                  </label>
                  <textarea
                    value={customInstructions}
                    onChange={(e) => setCustomInstructions(e.target.value)}
                    placeholder="e.g. Emphasise my cloud engineering background, keep tone assertive, prioritise AWS and Python skills..."
                    className="w-full h-28 px-3.5 py-2.5 bg-white border border-brand-navy/15 rounded-xl text-xs text-brand-deep placeholder-brand-navy/30 focus:outline-none focus:border-brand-indigo resize-none"
                  />
                  <p className="text-[11px] text-brand-indigo/80 font-medium">⚡ The AI strictly follows these instructions during single and batch generation runs.</p>
                </div>
              </div>
            )}

            {/* TAB B: TAILOR (SINGLE JOB) */}
            {activeTab === "generate" && (
              <div className="space-y-6 animate-in fade-in duration-300 w-full">
                <div className="flex items-center justify-between border-b border-brand-navy/15 pb-3">
                  <h3 className="text-base font-bold text-brand-deep flex items-center gap-2">
                    <Zap className="w-5 h-5 text-brand-indigo" />
                    AI Resume Generation Pipeline
                  </h3>
                  <div className="flex items-center gap-4 text-xs">
                    <label className="flex items-center gap-1.5 text-brand-navy/70 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isGeneral}
                        onChange={(e) => setIsGeneral(e.target.checked)}
                        className="rounded accent-brand-indigo"
                      />
                      Generalize CV
                    </label>
                  </div>
                </div>

                {!isGeneral && (
                  <div className="space-y-4">
                    <div className="flex gap-4 border-b border-brand-navy/10 pb-2">
                      <button
                        type="button"
                        onClick={() => setInputMethod("scrape")}
                        className={`text-xs font-semibold pb-1 ${
                          inputMethod === "scrape" ? "text-brand-indigo border-b-2 border-brand-indigo" : "text-brand-navy/50"
                        }`}
                      >
                        Scrape Job URL
                      </button>
                      <button
                        type="button"
                        onClick={() => setInputMethod("paste")}
                        className={`text-xs font-semibold pb-1 ${
                          inputMethod === "paste" ? "text-brand-indigo border-b-2 border-brand-indigo" : "text-brand-navy/50"
                        }`}
                      >
                        Paste Job Text
                      </button>
                    </div>

                    {inputMethod === "scrape" ? (
                      <div>
                        <label className="block text-xs font-semibold text-brand-navy/70 uppercase mb-2">
                          Job Description Listing URL
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            placeholder="https://www.linkedin.com/jobs/view/..."
                            className="w-full px-4 py-2.5 glass-input text-sm"
                            value={jobUrl}
                            onChange={(e) => setJobUrl(e.target.value)}
                            onBlur={async () => {
                              if (jobUrl) {
                                try {
                                  const scrapeRes = await api.scrapeJob(jobUrl);
                                  if (scrapeRes.requirements?.cover_letter && !includeCoverLetter) {
                                    setIncludeCoverLetter(true);
                                    triggerToast("AI detected a Cover Letter is recommended. We've checked the box for you!", "info");
                                  }
                                } catch (e) { /* ignore */ }
                              }
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-semibold text-brand-navy/70 uppercase mb-2">
                          Paste Job Description Text
                        </label>
                        <textarea
                          placeholder="Copy and paste the listing description here..."
                          className="w-full h-40 px-3 py-2 glass-input text-sm"
                          value={jobText}
                          onChange={(e) => setJobText(e.target.value)}
                        />
                      </div>
                    )}


                    <div className="pt-2">
                      <label className="flex items-center gap-1.5 text-xs text-brand-navy/70 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeCoverLetter}
                          onChange={(e) => setIncludeCoverLetter(e.target.checked)}
                          className="rounded accent-brand-indigo"
                        />
                        Include Tailored Cover Letter (Combo rate of R25 applies)
                      </label>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleGenerateWorkflow}
                  disabled={generating || isRedirectingToPayfast}
                  className="w-full py-3.5 btn-primary text-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {generating || isRedirectingToPayfast ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      <span>{isRedirectingToPayfast ? "Connecting to Payfast..." : "Generating..."}</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4.5 h-4.5" />
                      Compile & Tailor (AI)
                    </>
                  )}
                </button>

                {/* Loading status panel */}
                {generating && (
                  <div className="p-4 rounded-xl border border-brand-navy/15 bg-brand-navy/[0.03] space-y-2.5 font-mono text-xs">
                    <div className="text-brand-navy/70 flex items-center justify-between border-b border-brand-navy/10 pb-2">
                      <span>Pipeline execution log:</span>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-indigo" />
                    </div>
                    <div className="space-y-1 max-h-40 overflow-y-auto text-brand-deep">
                      {genSteps.map((step, idx) => (
                        <div key={idx} className="flex gap-2 items-start">
                          <span className="text-brand-indigo">›</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB C: BATCH AUTOPILOT */}
            {activeTab === "batch" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-150 ease-out w-full">
                <h3 className="text-base font-bold text-brand-deep border-b border-brand-navy/15 pb-3 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-brand-indigo" />
                  Batch Auto-Pilot Mode
                </h3>
                <p className="text-xs text-brand-navy/70">
                  Upload a plain text `.txt` file containing job description URLs (one URL per line). The AI builder will read each URL, generate, score, compile, and upload PDFs directly to your history.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      Upload Links File (.txt)
                    </label>
                    <div className="relative group cursor-pointer">
                      <input
                        type="file"
                        accept=".txt"
                        onChange={(e) => setBatchFile(e.target.files?.[0] || null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="p-6 border-2 border-dashed border-slate-300 hover:border-purple-600 rounded-2xl bg-slate-50/70 hover:bg-purple-50/40 transition-all flex flex-col items-center justify-center text-center space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold shadow-xs group-hover:scale-110 transition-transform">
                          <Upload className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                          <span className="text-xs font-extrabold text-slate-900 group-hover:text-purple-600 transition-colors block">
                            {batchFile ? batchFile.name : "Click or Drag & Drop .txt file here"}
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium block">
                            {batchFile ? `${(batchFile.size / 1024).toFixed(1)} KB file loaded` : "Plain text file containing job URLs (1 URL per line)"}
                          </span>
                        </div>
                        <span className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-purple-700 transition-colors inline-flex items-center gap-2">
                          <Upload className="w-3.5 h-3.5" />
                          {batchFile ? "Change Selected File" : "Browse & Upload .txt File"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {!batchScrapedJobs ? (
                    <button
                      onClick={handleAnalyzeBatch}
                      disabled={isAnalyzingBatch || batchProcessing}
                      className="w-full py-3 btn-primary text-sm flex items-center justify-center gap-2"
                    >
                      {isAnalyzingBatch ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      ) : (
                        <>
                          <Zap className="w-4 h-4" />
                          Analyze Jobs & Quote
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2 max-h-60 overflow-y-auto pr-1 border border-brand-navy/10 p-2 rounded-lg bg-brand-navy/[0.01]">
                        {batchScrapedJobs.map((job, idx) => (
                          <div key={idx} className="p-3 border border-brand-navy/10 rounded-lg bg-white shadow-sm flex items-start justify-between gap-3">
                            <div className="truncate">
                              <h5 className="text-sm font-bold text-brand-deep truncate">{job.job_title}</h5>
                              <p className="text-xs text-brand-indigo truncate">{job.company_name}</p>
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer text-[11px] font-semibold text-brand-navy/80 shrink-0 mt-1">
                              <input 
                                type="checkbox" 
                                checked={job.requirements.cover_letter}
                                onChange={() => {
                                  const updated = [...batchScrapedJobs];
                                  updated[idx] = { 
                                    ...updated[idx], 
                                    requirements: { ...updated[idx].requirements, cover_letter: !updated[idx].requirements.cover_letter } 
                                  };
                                  setBatchScrapedJobs(updated);
                                }}
                                className="rounded accent-brand-indigo w-3.5 h-3.5"
                              />
                              Cover Letter (+R10)
                            </label>
                          </div>
                        ))}
                      </div>

                      <div className="p-4 rounded-xl border border-brand-indigo/30 bg-brand-indigo/5 mt-4 flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-brand-deep">Quote Summary</h4>
                          <div className="text-xs text-brand-navy/70 space-y-0.5 mt-1">
                            <p>Resumes (R15): {batchScrapedJobs.filter(j => !j.requirements.cover_letter).length}</p>
                            <p>Combos (R25): {batchScrapedJobs.filter(j => j.requirements.cover_letter).length}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-brand-navy/50 line-through">
                            R {((batchScrapedJobs.filter(j => !j.requirements.cover_letter).length * 15) + (batchScrapedJobs.filter(j => j.requirements.cover_letter).length * 25)).toFixed(2)}
                          </p>
                          <p className="text-lg font-black text-brand-indigo">
                            R {(((batchScrapedJobs.filter(j => !j.requirements.cover_letter).length * 15) + (batchScrapedJobs.filter(j => j.requirements.cover_letter).length * 25)) * 0.922).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleBatchAutoPilot}
                        disabled={batchProcessing || isRedirectingToPayfast}
                        className="w-full py-3 btn-primary text-sm flex items-center justify-center gap-2"
                      >
                        {batchProcessing || isRedirectingToPayfast ? (
                          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        ) : (
                          <>
                            <Zap className="w-4 h-4" />
                            Pay & Generate
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {batchProcessing && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs text-brand-navy/70">
                        <span>Overall Progress</span>
                        <span>{batchProgress}%</span>
                      </div>
                      <div className="w-full bg-brand-navy/5 border border-brand-navy/10 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-brand-indigo h-full rounded-full transition-all duration-300"
                          style={{ width: `${batchProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {(batchProcessing || batchLogs.length > 0) && (
                    <div className="p-4 rounded-xl border border-brand-navy/15 bg-brand-navy/[0.03] space-y-2 font-mono text-xs max-h-60 overflow-y-auto">
                      {batchLogs.map((log, idx) => (
                        <div key={idx} className="text-brand-deep">
                          {log}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB E: RESUME BUILDER WIZARD (COMING SOON) */}
            {activeTab === "builder" && (
              <div className="flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in slide-in-from-right-4 duration-150 ease-out w-full py-12">
                <div className="w-16 h-16 rounded-full bg-brand-indigo/10 border border-brand-indigo/20 flex items-center justify-center text-brand-indigo animate-bounce">
                  <Construction className="w-8 h-8" />
                </div>
                <div className="space-y-2 max-w-md">
                  <span className="px-3.5 py-1.5 bg-brand-indigo/15 text-brand-indigo border border-brand-indigo/25 text-[11px] uppercase font-bold rounded-md tracking-wider">
                    Coming Soon
                  </span>
                  <h3 className="text-2xl font-black text-brand-deep">Interactive Resume Builder</h3>
                  <p className="text-sm text-brand-navy/70 leading-relaxed pt-2">
                    We are currently perfecting the step-by-step wizard to give you the most flawless and beautiful CV builder experience possible.
                  </p>
                  <p className="text-xs text-brand-navy/50 leading-relaxed italic">
                    In the meantime, you can upload your master CV in the <strong>My Profile & CV</strong> tab, then use our <strong>Tailor</strong> and <strong>Batch Autopilot</strong> tools to generate tailored applications instantly!
                  </p>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setActiveTab("profile")}
                    className="px-5 py-2.5 btn-primary text-xs cursor-pointer"
                  >
                    Go to My Profile
                  </button>
                  <button
                    onClick={() => setActiveTab("generate")}
                    className="px-5 py-2.5 btn-secondary text-xs cursor-pointer"
                  >
                    Try Single-Job Tailoring
                  </button>
                </div>
              </div>
            )}

            {/* TAB D: SAVED ARCHIVES */}
            {activeTab === "archive" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-150 ease-out w-full">
                <div className="flex justify-between items-center border-b border-brand-navy/15 pb-3 flex-wrap gap-2">
                  <h3 className="text-base font-bold text-brand-deep flex items-center gap-2">
                    <FolderOpen className="w-5 h-5 text-brand-indigo" />
                    Applications Archives
                  </h3>
                  <div className="flex gap-2 items-center flex-wrap">
                    {applications.length > 0 && (
                      <>
                        <button
                          onClick={() => {
                            if (selectedApps.length === applications.length) setSelectedApps([]);
                            else setSelectedApps(applications.map(a => a.id));
                          }}
                          className="px-3 py-1.5 btn-secondary text-xs"
                        >
                          {selectedApps.length === applications.length ? "Deselect All" : "Select All"}
                        </button>
                        {selectedApps.length > 0 && (
                          <button
                            onClick={() => handleDeleteApps(selectedApps)}
                            disabled={isDeleting}
                            className="px-3 py-1.5 btn-secondary text-xs hover:text-red-500 hover:border-red-200 disabled:opacity-50 transition-colors"
                          >
                            Delete Selected ({selectedApps.length})
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteApps(applications.map(a => a.id))}
                          disabled={isDeleting}
                          className="px-3 py-1.5 btn-secondary text-xs hover:text-red-500 hover:border-red-200 disabled:opacity-50 transition-colors"
                        >
                          Delete All
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => loadUserData(user.id)}
                      className="p-2 btn-secondary hover:text-brand-indigo flex items-center gap-1.5 text-xs"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Refresh
                    </button>
                  </div>
                </div>

                {applications.length === 0 ? (
                  <p className="text-sm text-brand-navy/50 italic text-center py-10">
                    No tailored applications generated yet. Use the Generation Pipeline to get started!
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {applications.map((app) => (
                      <div
                        key={app.id}
                        className="py-4 border-b border-brand-navy/15 flex flex-col justify-between space-y-3"
                      >
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <div className="text-[10px] text-brand-navy/60 font-mono">
                              Compiled on {app.created_at ? new Date(app.created_at).toLocaleDateString("en-US", { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : "Unknown date"}
                            </div>
                            <input 
                              type="checkbox" 
                              checked={selectedApps.includes(app.id)}
                              onChange={(e) => {
                                if (e.target.checked) setSelectedApps(prev => [...prev, app.id]);
                                else setSelectedApps(prev => prev.filter(id => id !== app.id));
                              }}
                              className="w-3.5 h-3.5 text-brand-indigo rounded border-brand-navy/20 cursor-pointer"
                            />
                          </div>
                          <div className="text-sm font-bold text-brand-deep">
                            {app.job_title === "General CV" ? (
                              <span className="text-brand-indigo">{app.company_name}</span>
                            ) : (
                              <>{app.job_title} at <span className="text-brand-indigo">{app.company_name}</span></>
                            )}
                          </div>
                          <div className="inline-flex items-center gap-1 bg-brand-navy/5 border border-brand-navy/10 px-2 py-0.5 rounded text-[10px] text-brand-navy">
                            {app.job_title === "General CV" ? "ATS score: Master CV" : `ATS score: ${app.ats_score !== null ? `${app.ats_score}%` : "Pending"}`}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-brand-navy/10">
                          {app.resume_url ? (
                            <a
                              href={app.resume_url}
                              target="_blank"
                              rel="noreferrer"
                              className="py-1.5 btn-secondary text-xs text-center flex items-center justify-center gap-1"
                            >
                              <FileCheck className="w-3.5 h-3.5 text-brand-indigo" />
                              Download CV
                            </a>
                          ) : (
                            <span className="text-xs text-brand-navy/40 italic text-center self-center">No CV compiled</span>
                          )}

                          {app.cover_letter_url ? (
                            <a
                              href={app.cover_letter_url}
                              target="_blank"
                              rel="noreferrer"
                              className="py-1.5 btn-secondary text-xs text-center flex items-center justify-center gap-1"
                            >
                              <FileCheck className="w-3.5 h-3.5 text-brand-indigo" />
                              Download Letter
                            </a>
                          ) : (
                            <span className="text-xs text-brand-navy/40 italic text-center self-center">No CL compiled</span>
                          )}
                          
                          {(app.resume_json || app.cl_json) && (
                            <button
                              onClick={() => handleOpenInEditor(app)}
                              className="col-span-2 py-1.5 btn-secondary text-xs text-center flex items-center justify-center gap-1 mt-1 border-brand-indigo/30 hover:border-brand-indigo text-brand-indigo"
                            >
                              <Zap className="w-3.5 h-3.5" />
                              Open in Editor
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleDeleteApps([app.id])}
                            disabled={isDeleting}
                            className="col-span-2 py-1.5 mt-1 btn-secondary text-xs text-center flex justify-center items-center gap-1 hover:text-red-500 hover:border-red-200 disabled:opacity-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

      {/* Preview Certificate Modal */}
      {previewCert && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-2xl w-full rounded-2xl p-6 relative">
            <h3 className="text-lg font-bold text-brand-deep mb-2 flex items-center gap-2">
              <Award className="w-5 h-5 text-brand-indigo" />
              Credential: {previewCert.name}
            </h3>
            <p className="text-xs text-brand-navy/60 border-b border-brand-navy/10 pb-3 mb-4">
              Here is the parsed verification context used during CV compiling.
            </p>
            <textarea
              className="w-full h-80 px-3 py-2 bg-white border border-brand-navy/15 rounded-lg text-xs text-brand-navy/80 focus:outline-none"
              value={previewCert.extracted_text}
              readOnly
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setPreviewCert(null)}
                className="px-4 py-2 btn-secondary text-xs"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Certificate Confirmation Modal */}
      {deleteCertId && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-sm w-full rounded-2xl p-6 relative space-y-4 bg-white border border-brand-navy/15">
            <h3 className="text-base font-bold text-brand-deep">Delete Credential</h3>
            <p className="text-xs text-brand-navy/70 leading-relaxed">
              Are you sure you want to permanently delete this credential? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteCertId(null)}
                className="px-4 py-2 btn-secondary text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const id = deleteCertId;
                  setDeleteCertId(null);
                  executeDeleteCert(id);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-xs transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

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

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-sm w-full rounded-2xl p-6 relative bg-white flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-brand-navy/5 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6 text-brand-indigo" />
            </div>
            <h3 className="text-lg font-bold text-brand-deep mb-2">Delete {confirmDelete.ids.length > 1 ? `${confirmDelete.ids.length} items` : 'Item'}</h3>
            <p className="text-sm text-brand-navy/70 mb-6">
              Are you sure you want to delete {confirmDelete.ids.length > 1 ? 'these items' : 'this item'}? This action cannot be undone.
            </p>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 px-4 py-2 btn-secondary text-sm"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                className="flex-1 px-4 py-2 bg-brand-deep text-white rounded text-sm hover:bg-brand-navy transition-colors font-semibold shadow-md shadow-brand-deep/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
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
            <button onClick={() => setToast(null)} className="text-xs ml-auto opacity-75 hover:opacity-100 font-bold px-1.5 py-0.5 cursor-pointer">×</button>
          </div>
        </div>
      )}



      {/* RE-AUTHENTICATION MODAL FOR EMAIL CHANGE */}
      {showReauthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-brand-deep/80 backdrop-blur-sm transition-opacity" 
            onClick={() => !isReauthenticating && setShowReauthModal(false)}
          ></div>
          <div className="relative bg-white border border-brand-navy/10 rounded-2xl p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-brand-deep mb-2 flex items-center gap-2">
              <Key className="w-5 h-5 text-brand-indigo" />
              Verify Your Identity
            </h3>
            <p className="text-sm text-brand-navy/70 mb-6">
              For security, please enter your password to authorize this email change to <span className="font-semibold text-brand-deep">{emailInput}</span>.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-brand-navy/70 uppercase mb-2 flex justify-between">
                  <span>Current Password</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-navy/40">
                    <Key className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={reauthPassword}
                    onChange={(e) => setReauthPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 text-sm bg-white border border-brand-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-indigo/50 focus:border-brand-indigo transition-shadow text-brand-deep"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              {reauthError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs">
                  {reauthError}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowReauthModal(false)}
                  disabled={isReauthenticating}
                  className="flex-1 py-2.5 btn-secondary text-sm disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmChangeEmail}
                  disabled={isReauthenticating || !reauthPassword}
                  className="flex-1 py-2.5 btn-primary text-sm disabled:opacity-50"
                >
                  {isReauthenticating ? "Verifying..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}



    </main>
    </div>
    <MarketingFooter />
    </>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-brand-indigo border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-brand-navy/60">Loading user workspace...</p>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
