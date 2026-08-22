"use client";

import {
  Award,
  BriefcaseBusiness,
  FilePlus2,
  FolderOpen,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";

type WorkspaceTab = "profile" | "builder" | "generate" | "batch" | "archive";

interface WorkspaceSidebarProps {
  activeTab: WorkspaceTab;
  onNavigate: (tab: WorkspaceTab) => void;
}

const navigation = [
  { id: "profile", label: "Overview", icon: LayoutDashboard },
  { id: "builder", label: "Build resume", icon: FilePlus2 },
  { id: "generate", label: "Tailor to job", icon: Sparkles },
  { id: "batch", label: "Batch autopilot", icon: BriefcaseBusiness },
  { id: "archive", label: "Applications", icon: FolderOpen },
] as const;

export default function WorkspaceSidebar({ activeTab, onNavigate }: WorkspaceSidebarProps) {
  return (
    <>
      <aside className="hidden lg:flex h-screen w-64 shrink-0 sticky top-0 flex-col border-r border-slate-200 bg-slate-950 px-4 py-5 text-white">
        <button
          type="button"
          onClick={() => onNavigate("profile")}
          className="flex items-center gap-3 rounded-xl px-3 py-2 text-left"
          aria-label="Go to workspace overview"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-500 text-sm font-black shadow-lg shadow-indigo-500/20">
            r
          </span>
          <span>
            <span className="block text-sm font-extrabold tracking-tight">rbptech</span>
            <span className="block text-[11px] text-slate-400">Career workspace</span>
          </span>
        </button>

        <nav className="mt-9 space-y-1" aria-label="Workspace navigation">
          {navigation.map((item) => {
            const Icon = item.icon;
            const selected = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`group flex min-h-11 w-full items-center gap-3 rounded-xl px-3.5 text-sm font-semibold transition-colors ${
                  selected
                    ? "bg-white text-slate-950 shadow-sm"
                    : "text-slate-400 hover:bg-white/8 hover:text-white"
                }`}
              >
                <Icon className={`h-4 w-4 ${selected ? "text-indigo-600" : "text-slate-500 group-hover:text-white"}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
            <Award className="h-4 w-4" />
          </div>
          <p className="text-sm font-bold">Strengthen your profile</p>
          <p className="mt-1 text-xs leading-5 text-slate-400">
            Add credentials once and reuse them in every tailored application.
          </p>
          <button
            type="button"
            onClick={() => onNavigate("profile")}
            className="mt-4 text-xs font-bold text-indigo-300 hover:text-indigo-200"
          >
            Manage credentials
          </button>
        </div>
      </aside>

      <nav className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-5 rounded-2xl border border-slate-200 bg-white/95 p-1.5 shadow-2xl shadow-slate-900/15 backdrop-blur lg:hidden" aria-label="Mobile workspace navigation">
        {navigation.map((item) => {
          const Icon = item.icon;
          const selected = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-bold transition-colors ${
                selected ? "bg-indigo-50 text-indigo-700" : "text-slate-500"
              }`}
              aria-label={item.label}
            >
              <Icon className="h-4 w-4" />
              <span className="max-w-14 truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
