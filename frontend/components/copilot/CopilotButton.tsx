"use client";

import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCopilot } from "./CopilotContext";

export const CopilotButton: React.FC = () => {
  const { isOpen, setIsOpen } = useCopilot();
  const [showTooltip, setShowTooltip] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center justify-center">
      <AnimatePresence>
        {showTooltip && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-16 right-0 bg-foreground text-background px-3 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider shadow-md border border-neutral-800 whitespace-nowrap pointer-events-none select-none z-50"
          >
            Planora Copilot
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={handleToggle}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open Planora Copilot"
        aria-expanded={isOpen}
        className={`
          w-12 h-12 rounded-full flex items-center justify-center cursor-pointer shadow-md focus-ring select-none transition-colors duration-200
          ${
            isOpen
              ? "bg-foreground text-background border border-foreground"
              : "bg-white text-foreground border border-border-custom hover:bg-hover-custom"
          }
        `}
      >
        <motion.div
          animate={isOpen ? { rotate: 90 } : { rotate: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Sparkles className="w-5 h-5 shrink-0" />
        </motion.div>
      </motion.button>
    </div>
  );
};
