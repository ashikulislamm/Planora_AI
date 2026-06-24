"use client";

import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = "", id, type = "text", ...props }, ref) => {
    const inputId = id || Math.random().toString(36).substring(2, 9);
    
    return (
      <div className="flex flex-col w-full gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold text-foreground tracking-tight select-none"
          >
            {label}
          </label>
        )}
        
        <input
          id={inputId}
          type={type}
          ref={ref}
          className={`
            w-full px-3 py-2 text-sm bg-white border border-border-custom rounded-md 
            placeholder-secondary-text text-foreground outline-none transition
            focus:border-foreground focus:ring-1 focus:ring-foreground
            disabled:bg-secondary-bg disabled:text-secondary-text disabled:cursor-not-allowed
            ${error ? "border-foreground ring-1 ring-foreground" : ""}
            ${className}
          `}
          {...props}
        />
        
        {error && (
          <span className="text-xs text-foreground font-medium mt-0.5">
            {error}
          </span>
        )}
        
        {!error && helperText && (
          <span className="text-xs text-secondary-text mt-0.5">
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
