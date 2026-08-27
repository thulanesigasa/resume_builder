"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import HeroSection from "@/components/landing/HeroSection";
import TrustStatsBar from "@/components/landing/TrustStatsBar";
import AtsSandboxDemo from "@/components/landing/AtsSandboxDemo";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import TemplateShowcase from "@/components/landing/TemplateShowcase";
import FeatureSuperpowerMatrix from "@/components/landing/FeatureSuperpowerMatrix";
import ComparisonMatrix from "@/components/landing/ComparisonMatrix";
import FaqAccordion from "@/components/landing/FaqAccordion";
import CtaBanner from "@/components/landing/CtaBanner";

export default function LandingPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, []);

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-50/30 text-brand-deep relative overflow-hidden">
      {/* 1. Hero Section with Interactive ATS Scanner Simulator */}
      <HeroSection user={user} />

      {/* 2. Social Proof & Impact Metrics Bar */}
      <TrustStatsBar />

      {/* 3. Interactive AI Rewriter & ATS Sandbox Demo */}
      <AtsSandboxDemo />

      {/* 4. 3-Step Interactive "How It Works" Timeline */}
      <HowItWorksSection />

      {/* 5. Filterable Resume & Cover Letter Template Showcase */}
      <TemplateShowcase />

      {/* 6. 6 Core Superpowers Feature Grid */}
      <FeatureSuperpowerMatrix />

      {/* 7. rbptech vs R350/mo Subscription Builders Comparison Matrix */}
      <ComparisonMatrix />

      {/* 8. Expandable FAQ Accordion */}
      <FaqAccordion />

      {/* 9. High-Converting Bottom CTA Banner */}
      <CtaBanner user={user} />
    </div>
  );
}
