"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Message } from "./CopilotContext";
import { useAuth } from "../../context/AuthContext";

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { user } = useAuth();
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
