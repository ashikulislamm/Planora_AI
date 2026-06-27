"use client";

import React, { useEffect } from "react";
import { Button } from "../components/shared/Button";
import { AlertCircle } from "lucide-react";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global crash captured by root error boundary:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center select-none max-w-md mx-auto space-y-6">
      <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center shadow-xs border border-red-100">
        <AlertCircle className="w-6 h-6" />
      </div>
      <div className="space-y-2">
        <h2 className="text-lg font-bold tracking-tight text-foreground">Something went wrong</h2>
        <p className="text-xs text-secondary-text leading-relaxed">
          An unexpected error occurred in the application layout. Our engineering logs have captured this automatically.
        </p>
      </div>
      <div className="flex gap-3 w-full">
        <Button variant="primary" size="md" className="flex-1 shadow-3xs" onClick={reset}>
          Try again
        </Button>
        <Button variant="outline" size="md" className="flex-1 shadow-3xs" onClick={() => window.location.href = "/"}>
          Go Home
        </Button>
      </div>
    </div>
  );
}
