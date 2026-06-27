import React from "react";
import Link from "next/link";
import { Button } from "../components/shared/Button";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center select-none max-w-md mx-auto space-y-6">
      <div className="w-12 h-12 bg-neutral-50 text-neutral-600 rounded-full flex items-center justify-center shadow-3xs border border-border-custom">
        <AlertCircle className="w-6 h-6" />
      </div>
      <div className="space-y-2">
        <h2 className="text-lg font-bold tracking-tight text-foreground">Page Not Found</h2>
        <p className="text-xs text-secondary-text leading-relaxed font-medium">
          The page you are looking for does not exist or has been relocated to another workspace.
        </p>
      </div>
      <div className="w-full">
        <Link href="/" className="w-full">
          <Button variant="primary" size="md" className="w-full shadow-3xs">
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
