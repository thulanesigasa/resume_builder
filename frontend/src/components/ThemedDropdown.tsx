"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export interface DropdownOption {
  value: string;
  label: string;
  /** Optional small descriptor shown below the label */
  description?: string;
}

interface ThemedDropdownProps {
  label: string;
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  /** Id prefix for accessibility */
  id?: string;
}

export default function ThemedDropdown({
  label,
  value,
  options,
  onChange,
  id = "dropdown",
}: ThemedDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Find the currently selected option label
  const selected = options.find((o) => o.value === value) ?? options[0];

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <div ref={ref} className="relative" id={id}>
      {/* Floating label */}
      <label
        htmlFor={`${id}-btn`}
        className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider rounded-md z-10 pointer-events-none"
      >
        {label}
      </label>

      {/* Trigger button */}
      <button
        id={`${id}-btn`}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={`
          w-full px-4 py-3.5 bg-white rounded-xl border text-left
          flex items-center justify-between gap-2
          font-bold text-slate-900 text-sm
          transition-all duration-150 focus:outline-none
          ${
            open
              ? "border-purple-500 ring-2 ring-purple-200 shadow-md"
              : "border-slate-200 hover:border-purple-300 shadow-sm"
          }
        `}
      >
        <span className="truncate">{selected?.label ?? "Select..."}</span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
            open ? "rotate-180 text-purple-500" : ""
          }`}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          role="listbox"
          aria-label={label}
          className={`
            absolute left-0 right-0 mt-1.5 z-50
            bg-white border border-slate-200 rounded-xl shadow-xl
            overflow-hidden
            animate-in fade-in slide-in-from-top-2 duration-150
          `}
          style={{ maxHeight: "280px", overflowY: "auto" }}
        >
          {/* Thin purple accent at top of panel */}
          <div className="h-0.5 w-full bg-gradient-to-r from-purple-500 to-purple-700" />

          <ul className="py-1">
            {options.map((opt) => {
              const isActive = opt.value === value;
              return (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={isActive}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`
                    flex items-center justify-between gap-3
                    px-4 py-2.5 cursor-pointer
                    text-sm font-semibold
                    transition-colors duration-100
                    ${
                      isActive
                        ? "bg-purple-600 text-white"
                        : "text-slate-800 hover:bg-purple-50 hover:text-purple-700"
                    }
                  `}
                >
                  <div className="min-w-0">
                    <span className="block truncate">{opt.label}</span>
                    {opt.description && (
                      <span
                        className={`block text-[10px] font-normal mt-0.5 ${
                          isActive ? "text-purple-200" : "text-slate-400"
                        }`}
                      >
                        {opt.description}
                      </span>
                    )}
                  </div>
                  {isActive && <Check className="w-4 h-4 flex-shrink-0 text-white" />}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
