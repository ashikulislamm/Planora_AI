"use client";

import React from "react";
import { Sparkles, BookmarkCheck, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Message, useCopilot } from "./CopilotContext";
import { useAuth } from "../../context/AuthContext";
import { TaskPreviewCard } from "./TaskPreviewCard";
import { Button } from "../shared/Button";

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { user } = useAuth();
  const { setActiveProjectPlan } = useCopilot();
  const isAssistant = message.sender === "assistant";

  // Generate initials for avatar
  const getInitials = (name: string = "User") => {
    const names = name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Format timestamp to hh:mm AM/PM
  const formatTime = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={`
        flex gap-3 text-left w-full items-start max-w-[88%] mb-4.5
        ${isAssistant ? "mr-auto" : "ml-auto flex-row-reverse"}
      `}
    >
      {/* Avatar Container */}
      {isAssistant ? (
        <div className="w-6.5 h-6.5 rounded-full border border-border-custom bg-secondary-bg flex items-center justify-center text-xs text-foreground shrink-0 shadow-3xs select-none">
          <Sparkles className="w-3.5 h-3.5 text-foreground shrink-0" />
        </div>
      ) : (
        <div className="w-6.5 h-6.5 rounded-full border border-border-custom bg-foreground text-background flex items-center justify-center text-[10px] font-extrabold shrink-0 shadow-3xs select-none">
          {getInitials(user?.name)}
        </div>
      )}

      {/* Message content */}
      <div className="flex flex-col gap-1 w-full max-w-[calc(100%-2.5rem)]">
        {/* Sender Name */}
        <span
          className={`
            text-[10px] font-extrabold text-foreground/90 select-none mb-0.5 tracking-tight
            ${isAssistant ? "text-left" : "text-right"}
          `}
        >
          {isAssistant ? "Planora AI" : (user?.name || "You")}
        </span>

        <div
          className={`
            px-4 py-2.5 rounded-2xl text-[12px] leading-relaxed tracking-tight select-text font-medium break-words whitespace-pre-wrap
            ${
              isAssistant
                ? "bg-secondary-bg border border-border-custom text-foreground rounded-tl-none"
                : "bg-foreground text-background rounded-tr-none"
            }
          `}
        >
          {message.content}
        </div>

        {/* Task Preview Card (rendered inline for AI task creation) */}
        {isAssistant && message.type && ["preview", "success", "cancelled"].includes(message.type) && message.previewData && (
          <div className="mt-2 w-full">
            <TaskPreviewCard
              messageId={message.id}
              previewData={message.previewData}
              type={message.type as any}
              createdTask={message.createdTask}
            />
          </div>
        )}

        {/* Project Preview Trigger Card */}
        {isAssistant && message.type === "project-preview" && message.projectPreviewData && (
          <div className="mt-2.5 w-full border border-border-custom bg-white shadow-2xs rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between select-none">
              <div className="flex items-center gap-1.5 text-[9.5px] font-extrabold text-secondary-text uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5 text-foreground shrink-0" />
                <span>Project Proposal</span>
              </div>
              <span className="text-[10px] font-bold text-foreground bg-secondary-bg px-2.5 py-0.5 border border-border-custom rounded-md">
                {message.projectPreviewData.summary.totalSubtasks} steps
              </span>
            </div>
            
            <div className="flex flex-col text-left">
              <span className="text-xs font-extrabold text-foreground tracking-tight leading-snug">
                {message.projectPreviewData.parentTask.title}
              </span>
              <span className="text-[10.5px] font-medium text-secondary-text leading-relaxed mt-0.5 line-clamp-2">
                {message.projectPreviewData.parentTask.description}
              </span>
            </div>
            
            <Button
              variant="primary"
              size="sm"
              className="w-full text-center mt-1 select-none"
              onClick={() => setActiveProjectPlan(message)}
            >
              Open Project Planner
            </Button>
          </div>
        )}

        {/* Project Creation Success Card */}
        {isAssistant && message.type === "success" && message.projectPreviewData && (
          <div className="mt-2.5 w-full border border-border-custom bg-secondary-bg rounded-xl p-4 flex gap-2.5 items-start">
            <div className="w-6.5 h-6.5 rounded-full bg-foreground text-background flex items-center justify-center shrink-0 shadow-3xs">
              <BookmarkCheck className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 text-left flex flex-col gap-1">
              <span className="text-xs font-bold text-foreground">Project Created Successfully</span>
              <span className="text-[11px] font-semibold text-secondary-text tracking-tight line-clamp-1">
                {message.projectPreviewData.parentTask.title}
              </span>
              <span className="text-[10.5px] text-secondary-text font-medium leading-relaxed mt-0.5">
                AI project breakdown successfully created with all subtasks and timeline schedules.
              </span>
            </div>
          </div>
        )}

        {/* Project Plan Cancelled Card */}
        {isAssistant && message.type === "cancelled" && message.projectPreviewData && (
          <div className="mt-2.5 w-full border border-border-custom bg-secondary-bg/50 rounded-xl p-4 flex gap-2.5 items-center opacity-70">
            <XCircle className="w-4 h-4 text-secondary-text shrink-0" />
            <span className="text-xs font-bold text-secondary-text tracking-tight">
              Project Plan Cancelled
            </span>
          </div>
        )}
        
        {/* Timestamp */}
        <span
          className={`
            text-[9px] font-semibold text-secondary-text/80 select-none px-1
            ${isAssistant ? "text-left" : "text-right"}
          `}
        >
          {formatTime(message.timestamp)}
        </span>
      </div>
    </motion.div>
  );
};
