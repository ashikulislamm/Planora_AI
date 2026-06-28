"use client";

import React from "react";
import { X, Sparkles, Settings, Trash2 } from "lucide-react";
import { useCopilot } from "./CopilotContext";

export const CopilotHeader: React.FC = () => {
  const { setIsOpen, messages, clearConversation } = useCopilot();
  const hasMessages = messages.length > 0;

  return (
    <div className="h-16 px-6 border-b border-border-custom flex items-center justify-between bg-white shrink-0 select-none">
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1.5 font-bold text-sm tracking-tight text-foreground">
          <Sparkles className="w-4 h-4 text-foreground shrink-0" />
          <span>Planora Copilot</span>
        </div>
        <span className="text-[10px] text-secondary-text font-medium mt-0.5">
          Your AI Productivity Assistant
        </span>
      </div>

      <div className="flex items-center gap-2">
        {/* Clear Conversation Option */}
        {hasMessages && (
          <button
            onClick={clearConversation}
            aria-label="Clear chat history"
            title="Clear chat history"
            className="text-secondary-text hover:text-red-500 p-1 rounded-md hover:bg-red-50/50 transition-colors cursor-pointer focus-ring"
          >
            <Trash2 className="w-4 h-4 shrink-0" />
          </button>
        )}

        {/* Future Settings Placeholder (disabled/hidden) */}
        <button
          disabled
          aria-label="Settings (coming soon)"
          title="Settings (coming soon)"
          className="text-secondary-text opacity-40 cursor-not-allowed p-1 rounded-md transition-colors"
        >
          <Settings className="w-4 h-4 shrink-0" />
        </button>

        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          aria-label="Close Copilot"
          className="text-secondary-text hover:text-foreground p-1 rounded-md hover:bg-hover-custom transition-all duration-200 cursor-pointer focus-ring"
        >
          <X className="w-4 h-4 shrink-0" />
        </button>
      </div>
    </div>
  );
};
