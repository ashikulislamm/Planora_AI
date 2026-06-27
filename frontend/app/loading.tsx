import React from "react";

export default function RootLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-pulse flex flex-col items-center gap-3 select-none">
        <div className="w-8 h-8 rounded-lg border-2 border-neutral-900 border-t-transparent animate-spin" />
        <span className="text-[10px] font-bold text-secondary-text uppercase tracking-widest">Planora Loading...</span>
      </div>
    </div>
  );
}
