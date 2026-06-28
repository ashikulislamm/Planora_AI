"use client";

import React, { useRef, useEffect } from "react";
import { useCopilot } from "./CopilotContext";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";

export const Conversation: React.FC = () => {
  const { messages, isLoading } = useCopilot();
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto Scroll to bottom when messages or typing status changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col scrollbar-thin">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {/* Typing loader indicator */}
      {isLoading && <TypingIndicator />}

      {/* Dummy div to scroll to */}
      <div ref={bottomRef} className="h-2 shrink-0" />
    </div>
  );
};
