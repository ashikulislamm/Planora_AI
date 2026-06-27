"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Check, X, ArrowLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/shared/Toast";
import { Input } from "../../components/shared/Input";
import { Button } from "../../components/shared/Button";
import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";

const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Full Name is required")
      .min(2, "Name must be at least 2 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email format"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password is too long"),
    confirmPassword: z
      .string()
      .min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: signup, loading } = useAuth();
  const { success, error } = useToast();
  
  // Visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "Weak",
    percentage: "0%",
    colorClass: "bg-red-500",
    textClass: "text-red-500",
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password", "");
  const confirmPasswordValue = watch("confirmPassword", "");

  // Update password strength indicator
  useEffect(() => {
    if (!passwordValue) {
      setPasswordStrength({ 
        score: 0, 
        label: "Weak", 
        percentage: "0%", 
        colorClass: "bg-red-500", 
        textClass: "text-red-500" 
      });
      return;
    }

    let score = 0;
    if (passwordValue.length >= 6) score += 1;
    if (passwordValue.length >= 10) score += 1;
    if (/[A-Z]/.test(passwordValue)) score += 1;
    if (/[0-9]/.test(passwordValue)) score += 1;
    if (/[^A-Za-z0-9]/.test(passwordValue)) score += 1;

    let label = "Weak";
    let percentage = "25%";
    let colorClass = "bg-red-500";
    let textClass = "text-red-500";

    if (score >= 4) {
      label = "Strong";
      percentage = "100%";
      colorClass = "bg-green-500";
      textClass = "text-green-500";
    } else if (score >= 2) {
      label = "Medium";
      percentage = "60%";
      colorClass = "bg-yellow-500";
      textClass = "text-yellow-500";
    } else {
      label = "Weak";
      percentage = "25%";
      colorClass = "bg-red-500";
      textClass = "text-red-500";
    }

    setPasswordStrength({ score, label, percentage, colorClass, textClass });
  }, [passwordValue]);

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await signup({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      success("Account created successfully! Welcome to Focus.");
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Registration failed. Email might already be registered.";
      error(errMsg);
    }
  };

  // Determine if confirm password matches
  const doesConfirmMatch = confirmPasswordValue.length > 0 && passwordValue === confirmPasswordValue;
  const showMatchStatus = confirmPasswordValue.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-secondary-bg selection:bg-neutral-100 selection:text-foreground">
      {/* Minimal Navbar */}
      <Navbar minimal />

      {/* Main Centered Content */}
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md bg-white border border-border-custom rounded-xl shadow-sm p-8 space-y-6">
          {/* Logo and Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-border-custom bg-secondary-bg text-foreground mb-1 select-none">
              F
            </div>
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              Create an account
            </h2>
            <p className="text-sm text-secondary-text leading-tight">
              Fill in the details below to register
            </p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="John Doe"
              error={errors.name?.message}
              disabled={loading}
              className="text-sm"
              {...register("name")}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              error={errors.email?.message}
              disabled={loading}
              className="text-sm"
              {...register("email")}
            />

            {/* Password field with toggle visibility */}
            <div className="flex flex-col gap-1.5 text-left">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                error={errors.password?.message}
                disabled={loading}
                className="text-sm"
                suffix={
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-secondary-text hover:text-foreground transition cursor-pointer p-0.5 outline-none focus-visible:ring-1 focus-visible:ring-foreground rounded"
                    disabled={loading}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                {...register("password")}
              />

              {/* Password Strength Indicator with colors */}
              {passwordValue && (
                <div className="space-y-1.5 pt-1.5 select-none">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-secondary-text font-medium">Password strength:</span>
                    <span className={`font-bold uppercase ${passwordStrength.textClass}`}>{passwordStrength.label}</span>
                  </div>
                  <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${passwordStrength.colorClass} transition-all duration-300`}
                      style={{ width: passwordStrength.percentage }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password field with toggle visibility & matched status */}
            <div className="flex flex-col gap-1.5 text-left">
              <Input
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                error={errors.confirmPassword?.message}
                disabled={loading}
                className="text-sm"
                suffix={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="text-secondary-text hover:text-foreground transition cursor-pointer p-0.5 outline-none focus-visible:ring-1 focus-visible:ring-foreground rounded"
                    disabled={loading}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                {...register("confirmPassword")}
              />

              {/* Password Matching Status */}
              {showMatchStatus && (
                <div className="flex items-center gap-1.5 text-xs font-semibold pt-1 select-none">
                  {doesConfirmMatch ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-500 shrink-0 animate-scale-in" />
                      <span className="text-green-500">Password matched</span>
                    </>
                  ) : (
                    <>
                      <X className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span className="text-red-500">Password not matched</span>
                    </>
                  )}
                </div>
              )}
            </div>

            <Button type="submit" className="w-full mt-2 shadow-xs" isLoading={loading}>
              Create Account
            </Button>
          </form>

          {/* Footer Link */}
          <div className="text-center pt-2">
            <p className="text-sm text-secondary-text">
              Already have an account?{" "}
              <Link href="/login">
                <span className="font-semibold text-foreground hover:underline cursor-pointer">
                  Login
                </span>
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <Footer minimal />
    </div>
  );
}
