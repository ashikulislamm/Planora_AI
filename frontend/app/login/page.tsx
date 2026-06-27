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
  const { login, loading } = useAuth();
  const { success, error } = useToast();
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
    try {
      await login(data);
      success("Welcome back! Login successful.");
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Invalid email or password. Please try again.";
      error(errMsg);
    }
  };

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
              disabled={loading}
              className="text-sm"
              {...register("email")}
            />

            <div className="flex flex-col gap-1 text-left relative">
              <div className="absolute right-0 top-0.5 z-10">
                <button
                  type="button"
                  onClick={() => success("Password reset demonstration modal triggered (UI only).")}
                  className="text-xs font-semibold text-secondary-text hover:text-foreground transition underline select-none"
                >
                  Forgot password?
                </button>
              </div>
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
            </div>

            {/* Remember me option */}
            <div className="flex items-center gap-2 select-none">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
                className="w-3.5 h-3.5 accent-foreground rounded border-border-custom text-foreground outline-none cursor-pointer"
              />
              <label htmlFor="remember" className="text-sm text-secondary-text cursor-pointer font-medium">
                Remember me
              </label>
            </div>

            <Button type="submit" className="w-full mt-2 shadow-xs" isLoading={loading}>
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
