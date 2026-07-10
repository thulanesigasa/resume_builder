"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-brand-indigo border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-sm text-brand-navy/60">Redirecting...</p>
    </div>
  );
}
