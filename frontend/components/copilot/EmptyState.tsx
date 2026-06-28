"use client";

import React from "react";
import { WelcomeSection } from "./WelcomeSection";

export const EmptyState: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col items-center justify-start scrollbar-thin animate-fade-in">
      <WelcomeSection />
    </div>
  );
};
export default EmptyState;
