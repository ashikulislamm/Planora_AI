"use client";

import React, { useEffect } from "react";
import { Button } from "../../components/shared/Button";
import { AlertCircle } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error boundary captured a crash:", error);
  }, [error]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center select-none max-w-sm mx-auto space-y-5 my-12">
      <div className="w-10 h-10 bg-red-50 text-red-650 rounded-full flex items-center justify-center shadow-3xs border border-red-100">
        <AlertCircle className="w-5 h-5" />
      </div>
      <div className="space-y-1.5">
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Dashboard Error</h3>
        <p className="text-xs text-secondary-text leading-relaxed font-medium">
          There was a problem loading this workspace page. You can try reloading the active segment.
        </p>
      </div>
      <div className="flex gap-2.5 w-full">
        <Button variant="primary" size="sm" className="flex-1 shadow-3xs" onClick={reset}>
          Retry Page
        </Button>
        <Button variant="secondary" size="sm" className="flex-1 shadow-3xs" onClick={() => window.location.reload()}>
          Force Refresh
        </Button>
      </div>
    </div>
  );
}
