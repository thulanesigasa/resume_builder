"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { api } from "@/lib/api";
import {
  User,
  LogOut,
  FolderOpen,
  Award,
  BarChart3,
  Save,
  FileText,
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
} from "lucide-react";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"profile" | "generate" | "batch" | "archive">("profile");
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
  const [previewCert, setPreviewCert] = useState<any | null>(null);

  // Stats
  const [stats, setStats] = useState({ appsCount: 0, certsCount: 0, avgAts: 0 });
  const [userCredits, setUserCredits] = useState<number>(0);

  // Job Scraper & Gen state
  const [inputMethod, setInputMethod] = useState<"scrape" | "paste">("scrape");
  const [jobUrl, setJobUrl] = useState("");
  const [jobText, setJobText] = useState("");
  const [isGeneral, setIsGeneral] = useState(false);
  const [includeCoverLetter, setIncludeCoverLetter] = useState(false);
  const [pendingPayment, setPendingPayment] = useState<{ amount: string; description: string; onConfirm: () => void } | null>(null);
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
    if (!app.resume_json && !app.cl_json) {
      triggerToast("Cannot edit: This application does not contain raw JSON data.", "error");
      return;
    }
    
    // Save to localStorage for editor access
    if (app.resume_json) localStorage.setItem("edit_resume_json", JSON.stringify(app.resume_json));
    else localStorage.removeItem("edit_resume_json");
    
    if (app.cl_json) localStorage.setItem("edit_cl_json", JSON.stringify(app.cl_json));
    else localStorage.removeItem("edit_cl_json");
    
    localStorage.setItem("edit_company", app.company_name);
    localStorage.setItem("edit_job_title", app.job_title);
    localStorage.setItem("edit_ats_score", JSON.stringify({ score: app.ats_score }));
    localStorage.setItem("edit_selected_resume_template", selectedResume);
    localStorage.setItem("edit_selected_cl_template", selectedCl);
    localStorage.setItem("edit_app_id", app.id);
    localStorage.setItem("edit_resume_compile_count", String(app.resume_compile_count || 0));
    localStorage.setItem("edit_cl_compile_count", String(app.cl_compile_count || 0));
    
    router.push("/editor");
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
        let redirectUrl = "/login?redirect=/dashboard";
        if (checkoutType) {
          redirectUrl += `?checkout=${checkoutType}`;
          if (jobs) redirectUrl += `%26jobs=${jobs}`;
          if (bType) redirectUrl += `%26batchType=${bType}`;
        }
        router.push(redirectUrl);
      } else {
        setUser(user);
        await loadUserData(user.id);

        // Check if redirect query parameters contain checkout info
        const checkoutType = searchParams.get("checkout");
        if (checkoutType) {
          if (checkoutType === "resume") {
            setPendingPayment({
              amount: "R 18.00",
              description: "Tailored Resume Only Plan",
              onConfirm: () => {
                triggerToast("Payment successful! Access granted.", "success");
                router.replace("/dashboard");
              }
            });
          } else if (checkoutType === "combo") {
            setPendingPayment({
              amount: "R 25.00",
              description: "Tailored Resume & Cover Letter Combo",
              onConfirm: () => {
                triggerToast("Payment successful! Access granted.", "success");
                router.replace("/dashboard");
              }
            });
          } else if (checkoutType === "batch") {
            const jobs = parseInt(searchParams.get("jobs") || "5") || 5;
            const bType = searchParams.get("batchType") === "resume" ? "resume" : "combo";
            const price = jobs * (bType === "resume" ? 18 : 25) * 0.922;
            setPendingPayment({
              amount: `R ${price.toFixed(2)}`,
              description: `Batch Autopilot: ${jobs} Tailored Applications (${bType === "resume" ? "Resume Only" : "Combo"})`,
              onConfirm: () => {
                triggerToast("Payment successful! Access granted.", "success");
                router.replace("/dashboard");
              }
            });
          }
        }
      }
      setLoading(false);
    };
    checkUser();
  }, [router, searchParams]);

  const loadUserData = async (userId: string) => {
    try {
      // 1. Fetch Profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("raw_info, username, first_name, last_name, phone, credits")
        .eq("id", userId)
        .single();

      let activeRawInfo = profile?.raw_info || "";

      if (profile) {
        setUsername(profile.username || "");
        setFirstName(profile.first_name || "");
        setLastName(profile.last_name || "");
        setPhone(profile.phone || "");
        setUserCredits(profile.credits || 0);
      }
      
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser?.email && !emailInput) {
        setEmailInput(currentUser.email);
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
        const { data: cvSignRes } = await supabase.storage
          .from("resumes")
          .createSignedUrl(`${userId}/master_cv/Master_CV.pdf`, 7200);
        if (cvSignRes?.signedUrl) {
          setMasterCvUrl(cvSignRes.signedUrl);
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
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        username,
        first_name: firstName,
        last_name: lastName,
        phone,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      triggerToast("Profile details updated successfully!", "success");
    } catch (err: any) {
      triggerToast("Error updating profile: " + err.message, "error");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangeEmail = async () => {
    if (!user || !emailInput || emailInput === user.email) return;
    try {
      setChangingEmail(true);
      const { error } = await supabase.auth.updateUser({ email: emailInput });
      if (error) throw error;
      triggerToast("Email change initiated! Check BOTH your old and new email inboxes for verification links.", "success");
    } catch (err: any) {
      triggerToast("Error changing email: " + err.message, "error");
    } finally {
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

  const handleUploadCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    // We either need files or manual text with a manually provided name
    if (certPdfFiles.length === 0 && (!manualCertText.trim() || !newCertName.trim())) {
      triggerToast("Please upload PDF documents or manually provide a name and text description.", "error");
      return;
    }

    setUploadingCert(true);
    try {
      // 1. Process files if uploaded
      let uploadedCount = 0;
      let skippedCount = 0;
      for (const file of certPdfFiles) {
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

    // Determine ZAR price based on the cover letter inclusion checkbox
    const isCombo = includeCoverLetter;
    const price = isCombo ? 25 : 18;
    const desc = isCombo ? "Tailored Resume & Cover Letter Combo" : "Tailored Resume Only";

    // Show Payment Gateway immediately (it is impossible to tailor/compile without paying first)
    setPendingPayment({
      amount: `R ${price.toFixed(2)}`,
      description: desc,
      onConfirm: () => {
        executeGenerateWorkflow();
      }
    });
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

      setGenSteps((prev) => [...prev, "Success! Directing to Editor workspace..."]);

      // Save to localStorage for editor access
      localStorage.setItem("edit_resume_json", JSON.stringify(generatedResumeJson));
      localStorage.setItem("edit_cl_json", JSON.stringify(generatedClJson));
      localStorage.setItem("edit_company", company);
      localStorage.setItem("edit_job_title", title);
      localStorage.setItem("edit_ats_score", JSON.stringify(currentAts));
      localStorage.setItem("edit_selected_resume_template", selectedResume);
      localStorage.setItem("edit_selected_cl_template", selectedCl);

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

    const baseCost = (resumeCount * 15) + (comboCount * 25);
    const finalCost = baseCost * 0.922; // 7.8% discount

    setPendingPayment({
      amount: `R ${finalCost.toFixed(2)}`,
      description: `Batch: ${resumeCount} Resumes, ${comboCount} Combos (7.8% Discount applied)`,
      onConfirm: () => {
        runAutopilotLoop(batchScrapedJobs);
      }
    });
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
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Top Navbar */}
      <nav className="glass-panel sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-t-0 border-x-0">
        <div className="flex items-center gap-3">
          {/* Brand mark removed as requested */}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-brand-navy">
            <User className="w-4 h-4 text-brand-indigo" />
            <span className="font-mono text-xs max-w-[120px] truncate">{username || user.email}</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-indigo/10 border border-brand-indigo/20 text-brand-indigo font-bold text-xs shadow-inner">
            <Zap className="w-3.5 h-3.5" />
            {userCredits} <span className="font-medium opacity-80">Credits</span>
          </div>
          <button
            onClick={() => setActiveTab("archive")}
            className="flex items-center gap-1.5 px-3 py-1.5 btn-primary text-xs"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            My Resumes
          </button>
          <button
            onClick={handleLogOut}
            className="flex items-center gap-1.5 px-3 py-1.5 btn-secondary text-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            Log Out
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 md:gap-6">
          <div className="glass-panel p-6 rounded-xl text-center relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-24 h-24 bg-brand-indigo/5 rounded-bl-full group-hover:scale-110 transition-transform"></div>
            <div className="text-3xl md:text-4xl font-extrabold text-brand-deep mb-1">{stats.appsCount}</div>
            <div className="text-xs uppercase tracking-wider text-brand-navy/70 font-semibold flex items-center justify-center gap-1.5">
              <FolderOpen className="w-3.5 h-3.5 text-brand-indigo" />
              Tailored Apps
            </div>
          </div>

          <div className="glass-panel p-6 rounded-xl text-center relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-24 h-24 bg-brand-indigo/5 rounded-bl-full group-hover:scale-110 transition-transform"></div>
            <div className="text-3xl md:text-4xl font-extrabold text-brand-deep mb-1">{stats.certsCount}</div>
            <div className="text-xs uppercase tracking-wider text-brand-navy/70 font-semibold flex items-center justify-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-brand-indigo" />
              Credentials
            </div>
          </div>

          <div className="glass-panel p-6 rounded-xl text-center relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-24 h-24 bg-brand-indigo/5 rounded-bl-full group-hover:scale-110 transition-transform"></div>
            <div className="text-3xl md:text-4xl font-extrabold text-brand-deep mb-1">{stats.avgAts}%</div>
            <div className="text-xs uppercase tracking-wider text-brand-navy/70 font-semibold flex items-center justify-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-brand-indigo" />
              Average Match
            </div>
          </div>
        </div>

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Left Panel Sidebar Settings */}
          <div className="glass-panel p-6 rounded-xl space-y-6 lg:sticky lg:top-24">
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-navy flex items-center gap-2 border-b border-brand-navy/15 pb-3">
              <Settings className="w-4 h-4 text-brand-indigo" />
              Parameters
            </h3>

            {/* Template selections */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="block text-[10px] font-semibold text-brand-navy/70 uppercase">
                    Resume Template
                  </label>
                  <button onClick={() => handlePreview(selectedResume, 'Resume')} className="text-[10px] text-brand-indigo hover:underline flex items-center gap-1">
                    <Eye className="w-3 h-3" /> Preview
                  </button>
                </div>
                <select
                  value={selectedResume}
                  onChange={(e) => setSelectedResume(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-brand-navy/15 rounded-lg text-xs text-brand-deep focus:outline-none focus:border-brand-indigo"
                >
                  <option value="ui_ux_pro_max_resume.html">UI/UX Pro Max (Tailored)</option>
                  <option value="ats_resume_template.html">ATS Clean Blueprint</option>
                  <option value="david_turner_resume.html">David Turner (Modern Classic)</option>
                  <option value="amy_stein_resume.html">Amy Stein (Elegant Design)</option>
                  <option value="ava_martinez_resume.html">Ava Martinez (Minimalist)</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="block text-[10px] font-semibold text-brand-navy/70 uppercase">
                    Cover Letter Template
                  </label>
                  <button onClick={() => handlePreview(selectedCl, 'Cover Letter')} className="text-[10px] text-brand-indigo hover:underline flex items-center gap-1">
                    <Eye className="w-3 h-3" /> Preview
                  </button>
                </div>
                <select
                  value={selectedCl}
                  onChange={(e) => setSelectedCl(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-brand-navy/15 rounded-lg text-xs text-brand-deep focus:outline-none focus:border-brand-indigo"
                >
                  <option value="caleb_foster_cover_letter.html">Caleb Foster (Modern Bold)</option>
                  <option value="takanori_ito_cover_letter.html">Takanori Ito (Formal)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-brand-navy/70 uppercase mb-2">
                  AI Focus Instructions
                </label>
                <textarea
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  placeholder="e.g. Focus heavily on my cloud engineering, keep the tone aggressive..."
                  className="w-full h-24 px-3 py-2 bg-white border border-brand-navy/15 rounded-lg text-xs text-brand-deep placeholder-brand-navy/30 focus:outline-none focus:border-brand-indigo resize-none"
                />
              </div>
            </div>
          </div>

          {/* Right Panel Main Tabs */}
          <div className="lg:col-span-3 space-y-6">
            {/* Navigation Tabs */}
            <div className="flex border-b border-brand-navy/15 gap-6">
              {[
                { id: "profile", label: "My Profile & CV" },
                { id: "generate", label: "Tailor (Single Job)" },
                { id: "batch", label: "Batch Autopilot" },
                { id: "archive", label: "Saved Archives" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-3 text-sm font-medium transition-all relative ${
                    activeTab === tab.id
                      ? "text-brand-deep font-semibold"
                      : "text-brand-navy/70 hover:text-brand-deep"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-indigo"></span>
                  )}
                </button>
              ))}
            </div>

            {/* TAB A: PROFILE & MASTER DOCUMENTS */}
            {activeTab === "profile" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="glass-panel p-6 rounded-xl space-y-6">
                  <h3 className="text-base font-bold text-brand-deep border-b border-brand-navy/15 pb-3 flex items-center gap-2">
                    <User className="w-5 h-5 text-brand-indigo" />
                    Personal Information
                  </h3>

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
                      <label className="block text-xs text-brand-navy/70 mb-1">Account Email Address</label>
                      <div className="flex gap-2">
                        <input
                          type="email"
                          className="flex-1 px-3 py-2 glass-input text-sm"
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                        />
                        <button
                          onClick={handleChangeEmail}
                          disabled={changingEmail || emailInput === user?.email}
                          className="px-4 py-2 btn-primary text-xs disabled:opacity-50 whitespace-nowrap"
                        >
                          {changingEmail ? "Sending..." : "Change Email"}
                        </button>
                      </div>
                      <p className="text-[10px] text-brand-navy/50 mt-1">Changing your email requires verifying links sent to both your old and new inboxes.</p>
                    </div>
                    <button
                      onClick={handleUpdateProfile}
                      disabled={savingProfile}
                      className="w-full py-2 btn-secondary text-sm flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4 text-brand-indigo" />
                      {savingProfile ? "Saving..." : "Update Profile Info"}
                    </button>
                  </div>

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

                <div className="glass-panel p-6 rounded-xl space-y-6">
                  <h3 className="text-base font-bold text-brand-deep border-b border-brand-navy/15 pb-3 flex items-center gap-2">
                    <Upload className="w-5 h-5 text-brand-indigo" />
                    Load CV & Certificates
                  </h3>

                  <div className="space-y-4">
                    <div className="p-4 border border-dashed border-brand-navy/20 rounded-xl bg-brand-navy/[0.01] hover:bg-brand-navy/[0.03] transition-colors relative flex flex-col items-center justify-center text-center">
                      <input
                        type="file"
                        accept=".pdf"
                        ref={cvFileInputRef}
                        onChange={handleParseCvPdf}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={parsingCv}
                      />
                      <FileText className="w-8 h-8 text-brand-indigo mb-2" />
                      <span className="text-xs font-semibold text-brand-deep">Parse Master CV from PDF</span>
                      <span className="text-[10px] text-brand-navy/60 mt-1">Upload PDF to overwrite text history</span>
                      {parsingCv && <span className="text-xs text-brand-indigo animate-pulse mt-2">Reading PDF text...</span>}
                    </div>

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

                      <form onSubmit={handleUploadCertificate} className="space-y-3 pt-2">
                        <div className="flex flex-col gap-2 p-3 border border-dashed border-brand-navy/20 rounded-xl bg-brand-navy/[0.01]">
                          <label className="text-xs font-semibold text-brand-navy/70 uppercase">Bulk Upload Documents</label>
                          <input
                            type="file"
                            accept=".pdf"
                            multiple
                            ref={certFileInputRef}
                            onChange={(e) => setCertPdfFiles(Array.from(e.target.files || []))}
                            className="text-xs text-brand-navy/70 w-full"
                          />
                          <p className="text-[10px] text-brand-navy/60">
                            Select multiple PDFs (transcripts, certificates, past resumes). The AI will extract text and automatically name them!
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs font-semibold text-brand-navy/40">
                          <hr className="flex-1 border-brand-navy/10" />
                          <span>OR MANUAL ENTRY</span>
                          <hr className="flex-1 border-brand-navy/10" />
                        </div>

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
                          type="submit"
                          disabled={uploadingCert}
                          className="w-full py-2 btn-primary text-xs flex items-center justify-center gap-2 mt-2"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          {uploadingCert ? "Processing Documents (AI)..." : "Save Document(s)"}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB B: TAILOR (SINGLE JOB) */}
            {activeTab === "generate" && (
              <div className="glass-panel p-6 rounded-xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                  disabled={generating}
                  className="w-full py-3.5 btn-primary text-sm flex items-center justify-center gap-2"
                >
                  {generating ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
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
              <div className="glass-panel p-6 rounded-xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-base font-bold text-brand-deep border-b border-brand-navy/15 pb-3 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-brand-indigo" />
                  Batch Auto-Pilot Mode
                </h3>
                <p className="text-xs text-brand-navy/70">
                  Upload a plain text `.txt` file containing job description URLs (one URL per line). The AI builder will read each URL, generate, score, compile, and upload PDFs directly to your history.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-brand-navy/70 uppercase mb-2">
                      Upload Links file (.txt)
                    </label>
                    <input
                      type="file"
                      accept=".txt"
                      className="w-full text-sm text-brand-navy/60"
                      onChange={(e) => setBatchFile(e.target.files?.[0] || null)}
                    />
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
                        disabled={batchProcessing}
                        className="w-full py-3 btn-primary text-sm flex items-center justify-center gap-2"
                      >
                        {batchProcessing ? (
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

            {/* TAB D: SAVED ARCHIVES */}
            {activeTab === "archive" && (
              <div className="glass-panel p-6 rounded-xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                        className="glass-panel p-5 rounded-xl border border-brand-navy/10 hover:border-brand-indigo/30 transition-all flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <div className="text-[10px] text-brand-navy/60 font-mono">
                              Compiled on {app.created_at?.slice(0, 10)}
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
                            {app.job_title} at <span className="text-brand-indigo">{app.company_name}</span>
                          </div>
                          <div className="inline-flex items-center gap-1 bg-brand-navy/5 border border-brand-navy/10 px-2 py-0.5 rounded text-[10px] text-brand-navy">
                            ATS score: {app.ats_score !== null ? `${app.ats_score}%` : "N/A"}
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
          </div>
        </div>
      </main>

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

      {/* Stripe Checkout payment gateway modal */}
      {pendingPayment && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-md w-full rounded-2xl p-6 relative space-y-6 bg-white border border-brand-navy/15 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-brand-navy/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-brand-indigo rounded-full animate-pulse"></span>
                <h3 className="text-base font-bold text-brand-deep">Stripe Secure Checkout</h3>
              </div>
              <span className="text-[10px] text-brand-navy/60 font-mono">Test Mode</span>
            </div>

            <div className="space-y-1.5 p-4 bg-brand-navy/5 rounded-xl border border-brand-navy/10">
              <div className="text-[10px] text-brand-navy/60 uppercase font-semibold">Product Description</div>
              <div className="text-xs font-bold text-brand-deep">{pendingPayment.description}</div>
              <div className="flex justify-between items-baseline pt-2 border-t border-brand-navy/10 mt-2">
                <span className="text-xs font-semibold text-brand-navy/70">Amount Due:</span>
                <span className="text-xl font-extrabold text-brand-indigo">{pendingPayment.amount}</span>
              </div>
            </div>

            {/* Mock Credit Card Fields */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // Simulate payment processing
                const payBtn = document.getElementById("stripe-pay-btn");
                if (payBtn) {
                  payBtn.innerText = "Processing secure transaction...";
                  payBtn.setAttribute("disabled", "true");
                }
                setTimeout(() => {
                  triggerToast("Payment successful! Transacting via Stripe gateway.", "success");
                  const callback = pendingPayment.onConfirm;
                  setPendingPayment(null);
                  callback();
                }, 2000);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-[10px] uppercase font-bold text-brand-navy/70 mb-1">Cardholder Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jane Smith"
                  className="w-full px-3 py-2 glass-input text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-brand-navy/70 mb-1">Card Number</label>
                <input
                  type="text"
                  required
                  pattern="\d{16}"
                  maxLength={16}
                  placeholder="4242 •••• •••• ••••"
                  className="w-full px-3 py-2 glass-input text-xs font-mono"
                  onChange={(e) => {
                    // Only allow numbers
                    e.target.value = e.target.value.replace(/\D/g, "");
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-brand-navy/70 mb-1">Expiration (MM/YY)</label>
                  <input
                    type="text"
                    required
                    pattern="\d{2}/\d{2}"
                    maxLength={5}
                    placeholder="MM/YY"
                    className="w-full px-3 py-2 glass-input text-xs font-mono"
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, "");
                      if (val.length > 2) {
                        val = val.substring(0, 2) + "/" + val.substring(2, 4);
                      }
                      e.target.value = val;
                    }}
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-brand-navy/70 mb-1">CVV Code</label>
                  <input
                    type="password"
                    required
                    pattern="\d{3}"
                    maxLength={3}
                    placeholder="•••"
                    className="w-full px-3 py-2 glass-input text-xs font-mono"
                    onChange={(e) => {
                      e.target.value = e.target.value.replace(/\D/g, "");
                    }}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setPendingPayment(null);
                    if (searchParams.get("checkout")) {
                      router.replace("/dashboard");
                    }
                  }}
                  className="flex-1 py-3 btn-secondary text-xs cursor-pointer"
                >
                  Cancel Transaction
                </button>
                <button
                  type="submit"
                  id="stripe-pay-btn"
                  className="flex-1 py-3 btn-primary text-xs cursor-pointer"
                >
                  Authorize Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
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
