"use client";

import React from "react";
import { SuggestionCard } from "./SuggestionCard";
import { PlusCircle, Layers, ClipboardList, CalendarDays, Compass } from "lucide-react";

export const SuggestionGrid: React.FC = () => {
  const suggestions = [
    {
      icon: PlusCircle,
      title: "Create Task",
      description: "Create a task using natural language.",
      fillText: "Create a task to review the frontend codebase due Friday at 5 PM",
    },
    {
      icon: Layers,
      title: "Break Project",
      description: "Break a large project into subtasks.",
      fillText: "Break down the Project Launch into subtasks and milestones",
    },
    {
      icon: ClipboardList,
      title: "Plan Today",
      description: "Generate today's work plan.",
      fillText: "Generate a morning-to-evening productivity schedule for my day",
    },
    {
      icon: CalendarDays,
      title: "Plan This Week",
      description: "Create a weekly schedule.",
      fillText: "Create a structured task plan for my workspace this week",
    },
    {
      icon: Compass,
      title: "Prioritize Tasks",
      description: "Organize tasks by importance.",
      fillText: "Prioritize my active tasks based on urgency and deadline",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
      {suggestions.map((s, idx) => (
        <SuggestionCard
          key={idx}
          icon={s.icon}
          title={s.title}
          description={s.description}
          fillText={s.fillText}
        />
      ))}
    </div>
  );
};
