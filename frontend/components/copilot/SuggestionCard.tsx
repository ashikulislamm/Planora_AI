"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useCopilot } from "./CopilotContext";

interface SuggestionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  fillText: string;
}

export const SuggestionCard: React.FC<SuggestionCardProps> = ({
  icon: Icon,
  title,
  description,
  fillText,
}) => {
  const { quickFillInput } = useCopilot();

  const handleFill = () => {
    quickFillInput(fillText);
    // Try to focus the textarea manually by finding it
    const textarea = document.getElementById("copilot-chat-input") as HTMLTextAreaElement;
    if (textarea) {
      textarea.focus();
    }
  };

  return (
    <motion.button
      type="button"
      onClick={handleFill}
      whileHover={{ scale: 1.015, y: -2 }}
      whileTap={{ scale: 0.985 }}
      className="flex flex-col text-left p-4.5 bg-white border border-border-custom rounded-lg hover:border-neutral-400 hover:shadow-2xs cursor-pointer select-none transition-all duration-200 focus-ring w-full group"
    >
      <div className="flex items-center gap-2 mb-1.5">
        <Icon className="w-4 h-4 text-foreground shrink-0 transition-transform group-hover:scale-110 duration-200" />
        <span className="font-bold text-xs text-foreground tracking-tight">
          {title}
        </span>
      </div>
      <p className="text-[10.5px] text-secondary-text leading-normal tracking-tight font-medium font-sans">
        {description}
      </p>
    </motion.button>
  );
};
