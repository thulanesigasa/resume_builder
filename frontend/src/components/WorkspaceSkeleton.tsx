"use client";

export function WelcomeSkeleton() {
  return (
    <div className="space-y-8 animate-pulse w-full">
      {/* Hero Header Skeleton */}
      <div className="space-y-3 border-b border-slate-200 pb-6">
        <div className="h-8 bg-slate-200 rounded-lg w-72"></div>
        <div className="h-4 bg-slate-100 rounded w-full max-w-xl"></div>
      </div>

      {/* Action Cards Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 border border-slate-200 rounded-2xl space-y-4 bg-white">
            <div className="h-5 bg-slate-200 rounded w-1/2"></div>
            <div className="h-3 bg-slate-100 rounded w-full"></div>
            <div className="h-3 bg-slate-100 rounded w-3/4"></div>
            <div className="h-9 bg-slate-100 rounded-lg w-full pt-2"></div>
          </div>
        ))}
      </div>

      {/* Applications Grid Skeleton */}
      <div className="pt-6 border-t border-slate-200 space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-5 bg-slate-200 rounded w-48"></div>
          <div className="h-4 bg-slate-100 rounded w-24"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="py-3.5 px-4 border border-slate-200 rounded-xl flex items-center justify-between gap-4">
              <div className="space-y-2 w-2/3">
                <div className="h-3 bg-slate-100 rounded w-1/3"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-8 w-12 bg-slate-100 rounded-lg"></div>
                <div className="h-8 w-16 bg-purple-100 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ContentSkeleton() {
  return (
    <div className="space-y-6 animate-pulse w-full">
      <div className="h-7 bg-slate-200 rounded-lg w-64"></div>
      <div className="space-y-4">
        <div className="h-4 bg-slate-100 rounded w-full max-w-lg"></div>
        <div className="h-4 bg-slate-100 rounded w-full max-w-md"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="h-36 bg-slate-100 rounded-xl"></div>
        <div className="h-36 bg-slate-100 rounded-xl"></div>
      </div>
    </div>
  );
}
