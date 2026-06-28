"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

// 1. Blinking/Pulsing Animated Dots
export const AnimatedDots: React.FC = () => {
  const dotVariants = {
    start: {
      y: "0%",
    },
    end: {
      y: "80%",
    },
  };

  const containerVariants = {
    start: {
      transition: {
        staggerChildren: 0.15,
      },
    },
    end: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="start"
      animate="end"
      className="flex gap-1.5 items-center h-4 py-1"
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          variants={dotVariants}
          transition={{
            duration: 0.4,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          className="w-1.5 h-1.5 rounded-full bg-foreground"
        />
      ))}
    </motion.div>
  );
};

// 2. Simple Typing Indicator Bubble
export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex gap-3 text-left w-full items-start max-w-[85%] select-none mb-4 animate-fade-in">
      <div className="w-6.5 h-6.5 rounded-full border border-border-custom bg-secondary-bg flex items-center justify-center text-xs text-foreground shrink-0 shadow-3xs">
        <Sparkles className="w-3.5 h-3.5 text-foreground animate-pulse" />
      </div>
      <div className="flex flex-col gap-1">
        <div className="px-4 py-2.5 bg-secondary-bg border border-border-custom text-foreground rounded-2xl rounded-tl-none font-medium text-xs leading-normal">
          <AnimatedDots />
        </div>
      </div>
    </div>
  );
};

// 3. Pulsing Skeleton Message Lines for AI layout placeholders
export const SkeletonMessage: React.FC = () => {
  return (
    <div className="flex gap-3 text-left w-full items-start max-w-[85%] select-none mb-4 animate-fade-in">
      <div className="w-6.5 h-6.5 rounded-full border border-border-custom bg-secondary-bg flex items-center justify-center text-xs text-foreground shrink-0 shadow-3xs">
        <Sparkles className="w-3.5 h-3.5 text-foreground opacity-60" />
      </div>
      <div className="flex-1 flex flex-col gap-2 mt-1">
        <div className="h-3 w-3/4 rounded bg-neutral-100 animate-pulse" />
        <div className="h-3 w-5/6 rounded bg-neutral-100 animate-pulse" />
        <div className="h-3 w-1/2 rounded bg-neutral-100 animate-pulse" />
      </div>
    </div>
  );
};

// 4. Premium Thinking Shimmer/Animation
export const ThinkingAnimation: React.FC = () => {
  return (
    <div className="flex items-center gap-2 p-2 px-3 border border-border-custom bg-secondary-bg rounded-lg select-none max-w-fit shadow-3xs mb-4">
      <div className="relative w-3.5 h-3.5 shrink-0 flex items-center justify-center">
        <span className="absolute animate-ping w-2 h-2 rounded-full bg-foreground opacity-30" />
        <span className="w-2 h-2 rounded-full bg-foreground" />
      </div>
      <span className="text-[10px] font-bold text-secondary-text uppercase tracking-widest animate-pulse">
        Copilot is thinking...
      </span>
    </div>
  );
};
