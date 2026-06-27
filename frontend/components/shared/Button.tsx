"use client";

import React from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-semibold transition-all duration-200 ease-out select-none active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2";
  
  const variants = {
    primary: "bg-foreground text-background hover:bg-neutral-800 active:bg-black border border-transparent shadow-xs",
    secondary: "bg-secondary-bg border border-border-custom text-foreground hover:bg-hover-custom hover:border-neutral-300 active:bg-neutral-100",
    outline: "bg-transparent border border-border-custom text-foreground hover:bg-hover-custom hover:border-neutral-300 active:bg-secondary-bg",
    danger: "bg-foreground text-background border border-foreground hover:bg-neutral-850 active:bg-black focus-visible:ring-foreground",
  };

  const sizes = {
    sm: "px-2.5 py-1.5 text-[11px] tracking-tight rounded-md",
    md: "px-3.5 py-2 text-xs sm:text-sm tracking-tight rounded-md",
    lg: "px-4.5 py-2.5 text-sm tracking-tight rounded-lg",
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading && <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin text-current" />}
      {children}
    </button>
  );
};

