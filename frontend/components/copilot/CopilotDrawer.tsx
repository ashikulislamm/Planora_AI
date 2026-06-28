"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCopilot } from "./CopilotContext";
import { CopilotHeader } from "./CopilotHeader";
import { Conversation } from "./Conversation";
import { ChatInput } from "./ChatInput";
import { EmptyState } from "./EmptyState";

export const CopilotDrawer: React.FC = () => {
  const { isOpen, setIsOpen, messages } = useCopilot();

  // Close drawer on Escape key and handle body scroll locking
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, setIsOpen]);

  const hasMessages = messages.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black backdrop-blur-xs cursor-pointer"
          />

          {/* Sliding Panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className={`
              relative h-full bg-white border-l border-border-custom shadow-xl flex flex-col z-10 w-full
              md:max-w-[440px] sm:max-w-[80vw] max-w-full
            `}
          >
            {/* Header */}
            <CopilotHeader />

            {/* Conversation list / Empty welcome view */}
            {hasMessages ? <Conversation /> : <EmptyState />}

            {/* Chat Input */}
            <ChatInput />
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};
export default CopilotDrawer;
