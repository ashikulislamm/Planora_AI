"use client";

import React, { useEffect, useState } from "react";
import { SuggestionGrid } from "./SuggestionGrid";
import { Sparkles, ArrowRight, Lightbulb } from "lucide-react";

export const WelcomeSection: React.FC = () => {
  const [greeting, setGreeting] = useState("Hello 👋");

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) {
      setGreeting("Good Morning 👋");
    } else if (hours < 18) {
      setGreeting("Good Afternoon 👋");
    } else {
      setGreeting("Good Evening 👋");
    }
  }, []);

  const tips = [
    "Type 'Plan my week' to auto-schedule pending backlogs.",
    "Type 'Break project X' to generate five actionable subtasks.",
    "Press Enter to submit, and Shift + Enter for line breaks.",
  ];

  return (
    <div className="flex flex-col gap-6 text-left w-full max-w-md mx-auto py-2">
      {/* Dynamic Greeting */}
      <div className="flex flex-col gap-1.5 select-none">
        <h2 className="text-lg font-extrabold text-foreground tracking-tight">
          {greeting}
        </h2>
        <p className="text-[12.5px] font-bold text-secondary-text leading-tight tracking-tight">
          How can I help you today?
        </p>
        <p className="text-[11.5px] text-secondary-text/85 font-medium leading-relaxed mt-1">
          I can help you create tasks, organize projects, plan your work, and boost productivity.
        </p>
      </div>

      {/* Suggestion Cards */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-1 text-[10px] font-extrabold text-secondary-text uppercase tracking-widest select-none">
          <Sparkles className="w-3 h-3 text-secondary-text shrink-0" />
          <span>Quick Prompts</span>
        </div>
        <SuggestionGrid />
      </div>

      {/* Helpful Tips */}
      <div className="p-4 bg-secondary-bg border border-border-custom rounded-lg flex flex-col gap-2">
        <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-secondary-text uppercase tracking-widest select-none">
          <Lightbulb className="w-3.5 h-3.5 text-foreground shrink-0" />
          <span>Copilot Tips</span>
        </div>
        <ul className="flex flex-col gap-1.5 text-[10.5px] text-secondary-text font-medium leading-relaxed pl-1 list-none">
          {tips.map((tip, idx) => (
            <li key={idx} className="flex gap-2">
              <span className="text-foreground font-bold select-none shrink-0">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
