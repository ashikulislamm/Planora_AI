"use client";

import React from "react";
import { FolderOpen } from "lucide-react";
import { Button } from "./Button";

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-border-custom rounded-xl bg-secondary-bg min-h-[300px]">
      <div className="flex items-center justify-center w-12 h-12 rounded-full border border-border-custom bg-white mb-4 text-secondary-text">
        {icon || <FolderOpen className="w-5 h-5" />}
      </div>
      
      <h3 className="text-sm font-semibold text-foreground tracking-tight mb-1">
        {title}
      </h3>
      
      <p className="text-xs text-secondary-text max-w-xs mb-5 leading-relaxed">
        {description}
      </p>
      
      {actionText && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
