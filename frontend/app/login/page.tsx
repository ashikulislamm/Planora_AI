"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/shared/Toast";
import { Input } from "../../components/shared/Input";
import { Button } from "../../components/shared/Button";
import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const { success, error } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      await login(data);
      success("Welcome back! Login successful.");
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Invalid email or password. Please try again.";
      error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-secondary-bg selection:bg-neutral-100 selection:text-foreground">
      {/* Minimal Navbar */}
      <Navbar minimal />

      {/* Main Centered Content */}
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md bg-white border border-border-custom rounded-xl shadow-sm p-8 space-y-6">
          {/* Logo and Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-border-custom bg-secondary-bg text-foreground mb-1 select-none">
              F
            </div>
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              Sign in to your account
            </h2>
            <p className="text-sm text-secondary-text leading-tight">
              Enter your email and password below to log in
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              error={errors.email?.message}
              disabled={isLoading}
              className="text-sm"
              {...register("email")}
            />

            <div className="flex flex-col gap-1.5 text-left">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-foreground tracking-tight select-none">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => success("Password reset demonstration modal triggered (UI only).")}
                  className="text-xs font-semibold text-secondary-text hover:text-foreground transition underline select-none"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className={`
                    w-full pl-3 pr-10 py-2 text-sm bg-white border border-border-custom rounded-md 
                    placeholder-secondary-text text-foreground outline-none transition
                    focus:border-foreground focus:ring-1 focus:ring-foreground
                    disabled:bg-secondary-bg disabled:text-secondary-text disabled:cursor-not-allowed
                    ${errors.password?.message ? "border-foreground ring-1 ring-foreground" : ""}
                  `}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-text hover:text-foreground transition cursor-pointer"
                  disabled={isLoading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password?.message && (
                <span className="text-xs text-foreground font-medium mt-0.5 block">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Remember me option */}
            <div className="flex items-center gap-2 select-none">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
                className="w-3.5 h-3.5 accent-foreground rounded border-border-custom text-foreground outline-none cursor-pointer"
              />
              <label htmlFor="remember" className="text-sm text-secondary-text cursor-pointer font-medium">
                Remember me
              </label>
            </div>

            <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
              Sign In
            </Button>
          </form>

          {/* Footer Link */}
          <div className="text-center pt-2">
            <p className="text-sm text-secondary-text">
              Don't have an account?{" "}
              <Link href="/register">
                <span className="font-semibold text-foreground hover:underline cursor-pointer">
                  Create one
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
