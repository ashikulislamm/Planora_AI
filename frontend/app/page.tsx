"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Shield, BarChart3, Settings2, Sparkles } from "lucide-react";
import { Button } from "../components/shared/Button";
import { useAuth } from "../context/AuthContext";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";

export default function LandingPage() {
  const { user } = useAuth();

  const features = [
    {
      icon: CheckCircle2,
      title: "Task Management",
      description: "Organize, tag, and sort your tasks with custom statuses. Keep your focus where it belongs."
    },
    {
      icon: BarChart3,
      title: "Progress Tracking",
      description: "Analyze your completion rates with productivity widgets and active progress analytics."
    },
    {
      icon: Settings2,
      title: "Account Management",
      description: "Manage your profile information, password security, and options through clean forms."
    },
    {
      icon: Shield,
      title: "Secure Authentication",
      description: "Rest assured with HTTP-only, secure, strict cookie authentication keeping your sessions safe."
    }
  ];

  return (
    <div className="min-h-full flex flex-col bg-white text-foreground selection:bg-neutral-100 selection:text-foreground">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center px-6 py-20 md:py-32 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border-custom bg-secondary-bg text-xs font-medium text-secondary-text tracking-wide uppercase mb-6 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-foreground" />
          <span>Introducing Focus Task Manager</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.05] mb-6">
          Organize Tasks.<br />
          Stay Focused.<br />
          Get Things Done.
        </h1>

        <p className="text-sm sm:text-base text-secondary-text max-w-xl mb-10 leading-relaxed">
          A clean and modern task manager built to help you stay productive every day. Grayscale aesthetics, keyboard commands, and fluid interactions designed for builders.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Link href={user ? "/dashboard" : "/register"} className="w-full sm:w-auto">
            <Button variant="primary" size="lg" className="w-full sm:w-auto group">
              Get Started for Free
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
          <a href="#features" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              View Demo
            </Button>
          </a>
        </div>
      </section>

      {/* Feature Section */}
      <section id="features" className="border-t border-border-custom bg-secondary-bg py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-xl mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-4">
              Designed for high performance teams.
            </h2>
            <p className="text-xs sm:text-sm text-secondary-text leading-relaxed">
              Every detail is meticulously polished to reduce visual noise and speed up interactions, helping you focus entirely on executing your goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={i} 
                  className="p-6 bg-white border border-border-custom rounded-xl transition duration-200 hover:-translate-y-1 hover:shadow-sm flex flex-col"
                >
                  <div className="w-9 h-9 rounded-lg border border-border-custom bg-secondary-bg flex items-center justify-center text-foreground mb-5">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground tracking-tight mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-secondary-text leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
