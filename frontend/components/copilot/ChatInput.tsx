"use client";

import React, { useRef, useEffect } from "react";
import { Send, Paperclip, Mic } from "lucide-react";
import { useCopilot } from "./CopilotContext";

export const ChatInput: React.FC = () => {
  const { inputValue, setInputValue, sendMessage, isLoading } = useCopilot();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto resize textarea height dynamically based on contents
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    const newHeight = Math.min(textarea.scrollHeight, 140); // Max height limit of 140px
    textarea.style.height = `${newHeight}px`;
  }, [inputValue]);

  const handleSend = () => {
    if (!inputValue.trim() || isLoading) return;
    sendMessage(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t border-border-custom bg-white shrink-0 select-none">
      <div className="relative border border-border-custom rounded-xl bg-secondary-bg focus-within:border-neutral-400 focus-within:shadow-3xs transition-all duration-200 p-2.5">
        {/* Multiline Textarea */}
        <textarea
          id="copilot-chat-input"
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          rows={1}
          placeholder="Describe what you'd like to do..."
          className="w-full text-xs font-sans font-medium text-foreground bg-transparent resize-none outline-none border-none pr-12 pl-1.5 pt-1.5 pb-1 max-h-[140px] scrollbar-none leading-relaxed placeholder-secondary-text/80 disabled:opacity-50"
        />

        {/* Action Toolbar */}
        <div className="flex items-center justify-between border-t border-border-custom/50 pt-2.5 mt-2.5 px-1 bg-transparent">
          <div className="flex items-center gap-1">
            {/* Attachment Button Placeholder */}
            <button
              type="button"
              disabled
              aria-label="Attach files (coming soon)"
              title="Attach files (coming soon)"
              className="text-secondary-text/60 opacity-40 cursor-not-allowed p-1.5 rounded-md transition-colors"
            >
              <Paperclip className="w-3.5 h-3.5 shrink-0" />
            </button>

            {/* Voice Button Placeholder */}
            <button
              type="button"
              disabled
              aria-label="Voice input (coming soon)"
              title="Voice input (coming soon)"
              className="text-secondary-text/60 opacity-40 cursor-not-allowed p-1.5 rounded-md transition-colors"
            >
              <Mic className="w-3.5 h-3.5 shrink-0" />
            </button>
          </div>

          {/* Send Button */}
          <button
            type="button"
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            aria-label="Send message"
            className={`
              p-1.5 rounded-lg border focus-ring transition-all duration-200 cursor-pointer
              ${
                inputValue.trim() && !isLoading
                  ? "bg-foreground border-foreground text-background hover:scale-103"
                  : "bg-white border-border-custom text-secondary-text/50 opacity-50 cursor-not-allowed"
              }
            `}
          >
            <Send className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>
      </div>
      
      {/* Keyboard Helper text */}
      <div className="text-[9px] font-semibold text-secondary-text/60 text-right mt-1.5 select-none px-1">
        <span>Press Enter to send, Shift + Enter for new line</span>
      </div>
    </div>
  );
};
