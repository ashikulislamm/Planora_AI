"use client";

import React, { forwardRef, useId } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  suffix?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = "", id, type = "text", suffix, ...props }, ref) => {
    const reactId = useId();
    const inputId = id || reactId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;
    
    return (
      <div className="flex flex-col w-full gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[10px] font-bold text-secondary-text uppercase tracking-wider select-none mb-0.5 text-left"
          >
            {label}
          </label>
        )}
        
        <div className="relative w-full">
          <input
            id={inputId}
            type={type}
            ref={ref}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            className={`
              w-full pl-3 ${suffix ? "pr-10" : "pr-3"} py-2 text-xs sm:text-sm bg-white border border-border-custom rounded-md 
              placeholder-neutral-400 font-normal text-foreground outline-none transition-all duration-200
              hover:border-neutral-350 focus:border-foreground focus:ring-4 focus:ring-black/5
              disabled:bg-secondary-bg disabled:text-secondary-text disabled:cursor-not-allowed
              ${error ? "border-foreground ring-4 ring-black/5 font-semibold" : ""}
              ${className}
            `}
            {...props}
          />
          {suffix && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center select-none">
              {suffix}
            </div>
          )}
        </div>
        
        {error && (
          <span 
            id={errorId}
            role="alert"
            className="text-[11px] text-foreground font-bold tracking-tight mt-1 text-left"
          >
            {error}
          </span>
        )}
        
        {!error && helperText && (
          <span 
            id={helperId}
            className="text-[11px] text-secondary-text font-normal mt-1 text-left"
          >
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
