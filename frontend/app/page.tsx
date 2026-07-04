"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  Shield, 
  Sparkles,
  Command,
  Clock,
  Search,
  LayoutDashboard,
  Play,
  Pause,
  X,
  ChevronDown,
  Zap
} from "lucide-react";
import { Button } from "../components/shared/Button";
import { useAuth } from "../context/AuthContext";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";

// FAQ Data
const FAQS = [
  {
    question: "How does the AI Copilot work?",
    answer: "Planora Copilot is powered by Google GenAI. It analyzes your tasks and goals, breaking them down into actionable sub-tasks, estimating time, and suggesting optimized workflows."
  },
  {
    question: "Can I use Planora entirely for free?",
    answer: "Yes! Planora is open-source and free to use for individual productivity. You can also self-host it easily using the provided Docker and deployment configurations."
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. We use enterprise-grade JWT authentication, strict HTTP-only cookies, and encrypted data storage to ensure your tasks and focus sessions remain strictly private."
  },
  {
    question: "How does the Distraction-Free Focus mode help?",
    answer: "Our focus mode completely takes over your screen, hiding navigation and notifications. By utilizing the Pomodoro technique, it forces you to dedicate 25 minutes of deep work to a single task."
  }
];

export default function LandingPage() {
  const { user } = useAuth();

  // Focus Timer State
  const [focusModeActive, setFocusModeActive] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(1500); // 25:00
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Pomodoro countdown simulation
  useEffect(() => {
    let interval: any;
    if (timerRunning) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setTimerRunning(false);
            // Play chime sound
            try {
              const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
              if (AudioContext) {
                const ctx = new AudioContext();
                const now = ctx.currentTime;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = "sine";
                osc.frequency.setValueAtTime(523.25, now);
                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.5);
              }
            } catch {}
            return 1500;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleStartFocus = () => {
    setFocusModeActive(true);
    setTimerRunning(true);
  };

  const handleExitFocus = () => {
    setFocusModeActive(false);
    setTimerRunning(false);
  };

  return (
    <div className="min-h-full flex flex-col bg-white text-foreground selection:bg-neutral-100 selection:text-foreground font-sans">
      
      {/* Fullscreen Distraction-Free Focus Overlay */}
      <AnimatePresence>
        {focusModeActive && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-neutral-950 text-white flex flex-col items-center justify-center overflow-hidden"
          >
            {/* Ambient Dark Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neutral-900 rounded-full blur-[150px] opacity-50 pointer-events-none" />

            <button 
              onClick={handleExitFocus}
              className="absolute top-8 left-8 md:top-12 md:left-12 flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
              <span className="text-sm font-bold tracking-widest uppercase hidden md:block">Exit Focus Mode</span>
            </button>

            <div className="relative z-10 flex flex-col items-center mt-[-10vh]">
              <span className="text-neutral-500 font-bold tracking-widest uppercase mb-12 text-sm">Deep Work Session</span>
              
              <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] flex items-center justify-center mb-16">
                <svg viewBox="0 0 100 100" className="absolute w-full h-full transform -rotate-90 pointer-events-none">
                  <circle cx="50" cy="50" r="45" className="stroke-neutral-800 stroke-[2]" fill="transparent" />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    className="stroke-white stroke-[2] transition-all duration-1000 ease-linear" 
                    strokeDasharray={283}
                    strokeDashoffset={283 * (1 - secondsLeft / 1500)}
                    strokeLinecap="round"
                    fill="transparent" 
                  />
                </svg>

                <div className="text-7xl md:text-9xl font-black font-mono tracking-tighter text-white z-10 select-none">
                  {formatTimer(secondsLeft)}
                </div>
              </div>

              <div className="flex items-center gap-6 z-10">
                <button 
                  onClick={() => setTimerRunning(!timerRunning)}
                  className="flex items-center justify-center w-20 h-20 rounded-full bg-white text-neutral-950 hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.2)] focus:outline-none"
                >
                  {timerRunning ? <Pause className="w-8 h-8 fill-neutral-950" /> : <Play className="w-8 h-8 fill-neutral-950 ml-1" />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden flex-1 flex flex-col justify-center items-center px-6 py-24 md:py-32 text-center w-full">
        {/* Modern ambient background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none z-0" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neutral-200/40 rounded-full blur-[120px] pointer-events-none z-0" />
        
        <div className="relative z-10 flex flex-col items-center max-w-4xl mx-auto mt-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border-custom bg-white/50 backdrop-blur-sm shadow-3xs text-xs font-bold tracking-wide uppercase mb-8"
          >
            <Sparkles className="w-3.5 h-3.5 text-foreground" />
            <span>Planora 2.0 is Here</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-[80px] font-black tracking-tighter leading-[1.05] mb-8"
          >
            Your Intelligent <br className="hidden sm:block" />
            <span className="text-secondary-text">Task & Focus</span> Workspace.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-secondary-text max-w-2xl mb-10 leading-relaxed font-medium"
          >
            Streamline your workflow, eliminate distractions, and achieve more with AI-driven task management. Designed for deep work.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Link href={user ? "/dashboard" : "/register"} className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full sm:w-auto text-sm h-12 px-8 rounded-full shadow-lg shadow-neutral-900/10 hover:shadow-xl hover:shadow-neutral-900/15 hover:-translate-y-0.5 transition-all duration-300">
                Start for Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <a href="#features" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-sm h-12 px-8 rounded-full border-border-custom hover:bg-neutral-50 transition-all">
                Explore Features
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-10 border-y border-border-custom bg-secondary-bg overflow-hidden flex flex-col items-center">
        <p className="text-xs font-bold text-secondary-text uppercase tracking-widest mb-6">Trusted by Productivity Enthusiasts Worldwide</p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-40 grayscale">
          {/* Mock Logos using text for simplicity */}
          <span className="text-xl font-black font-serif">Acme Corp</span>
          <span className="text-xl font-black tracking-tight">Vercel</span>
          <span className="text-xl font-black italic">Next.js</span>
          <span className="text-xl font-black">Google Cloud</span>
          <span className="text-xl font-black tracking-widest">MONGODB</span>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 relative bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
              A workflow designed for execution.
            </h2>
            <p className="text-sm text-secondary-text font-medium">
              We stripped away the complexity so you can focus on what actually matters: getting things done.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "Capture Thoughts", desc: "Dump everything into your inbox. Use Ctrl+K from anywhere to add tasks instantly.", icon: Search },
              { title: "AI Organization", desc: "Let Copilot break down massive goals into bite-sized actionable steps automatically.", icon: Sparkles },
              { title: "Deep Execution", desc: "Enter Focus Mode to block out the world. Work in 25 minute bursts of uninterrupted flow.", icon: Zap }
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-2xl bg-secondary-bg border border-border-custom flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-foreground group-hover:text-white transition-all duration-300">
                  <step.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-3">{step.title}</h3>
                <p className="text-sm text-secondary-text leading-relaxed font-medium max-w-xs">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Grid Features Section */}
      <section id="features" className="py-24 px-6 relative bg-secondary-bg border-t border-border-custom">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
              Everything you need. Nothing you don't.
            </h2>
            <p className="text-sm text-secondary-text font-medium">
              A carefully curated set of tools designed to maximize your execution velocity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[320px]">
            
            {/* AI Copilot (Large Feature) */}
            <div className="md:col-span-2 row-span-1 bg-white border border-border-custom rounded-3xl p-8 relative overflow-hidden group hover:border-neutral-300 transition-colors shadow-sm">
              <div className="relative z-10 w-full h-full flex flex-col justify-between">
                <div className="max-w-md">
                  <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center mb-6">
                    <Sparkles className="w-5 h-5 text-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight mb-2">Planora Copilot</h3>
                  <p className="text-sm text-secondary-text leading-relaxed font-medium">
                    Powered by Google GenAI. Instantly break down complex tasks, generate actionable sub-items, and get workflow insights directly in your workspace.
                  </p>
                </div>
                
                {/* Mock UI Element */}
                <div className="absolute -right-4 -bottom-4 w-72 md:w-[350px] bg-secondary-bg border border-border-custom rounded-2xl p-4 shadow-xl transform group-hover:-translate-y-2 group-hover:-translate-x-2 transition-transform duration-500">
                  <div className="flex gap-3 items-end mb-3">
                    <div className="bg-foreground text-white text-xs font-medium p-3 rounded-2xl rounded-bl-none max-w-[80%] shadow-sm">
                      How can I break down the "Landing Page Redesign" task?
                    </div>
                  </div>
                  <div className="flex gap-3 items-end">
                    <div className="w-6 h-6 rounded bg-neutral-200 flex-shrink-0 flex items-center justify-center shadow-sm">
                      <Sparkles className="w-3 h-3 text-secondary-text" />
                    </div>
                    <div className="bg-white border border-border-custom text-foreground text-xs p-3 rounded-2xl rounded-bl-none max-w-[85%] shadow-sm">
                      <p className="font-bold mb-1">Here is a suggested breakdown:</p>
                      <ul className="list-disc pl-4 space-y-1 text-secondary-text font-medium">
                        <li>Design wireframes</li>
                        <li>Implement Bento UI</li>
                        <li>Add Framer Motion</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Deep Focus Space - Interactive Mode Trigger */}
            <div className="md:col-span-1 row-span-1 bg-white border border-border-custom rounded-3xl p-8 relative overflow-hidden group hover:border-neutral-300 transition-colors shadow-sm flex flex-col justify-between items-center text-center">
              <div>
                <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center mb-4 mx-auto">
                  <Clock className="w-5 h-5 text-foreground" />
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-2">Deep Focus Space</h3>
                <p className="text-sm text-secondary-text leading-relaxed font-medium z-10 relative">
                  Immerse yourself completely. No distractions.
                </p>
              </div>
              
              <div className="relative mt-auto w-full flex items-center justify-center pt-2 z-10">
                <div 
                  onClick={handleStartFocus}
                  className="relative w-[120px] h-[120px] flex items-center justify-center group-hover:scale-105 transition-transform duration-500 cursor-pointer" 
                >
                  <div className="absolute inset-0 rounded-full bg-neutral-100 group-hover:bg-neutral-200 transition-colors flex items-center justify-center shadow-inner">
                    <div className="flex flex-col items-center">
                      <Play className="w-8 h-8 text-foreground ml-1 mb-1" />
                      <span className="text-[10px] font-bold text-foreground tracking-widest uppercase">Start</span>
                    </div>
                  </div>
                  <svg className="absolute w-full h-full transform -rotate-90 pointer-events-none">
                    <circle cx="60" cy="60" r="58" className="stroke-foreground stroke-[3] opacity-30" fill="transparent" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Command Palette */}
            <div className="md:col-span-1 row-span-1 bg-white border border-border-custom rounded-3xl p-8 relative overflow-hidden group hover:border-neutral-300 transition-colors shadow-sm flex flex-col">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center mb-6">
                <Command className="w-5 h-5 text-foreground" />
              </div>
              <h3 className="text-xl font-bold tracking-tight mb-2">Command Palette</h3>
              <p className="text-sm text-secondary-text leading-relaxed font-medium">
                Navigate your entire workspace instantly with <kbd className="font-mono font-bold bg-neutral-100 px-1 py-0.5 rounded text-xs border border-neutral-200">Ctrl+K</kbd>.
              </p>
              
              <div className="mt-auto relative w-full h-12 bg-secondary-bg border border-border-custom rounded-xl flex items-center px-4 shadow-inner group-hover:bg-white group-hover:border-neutral-300 transition-colors">
                <Search className="w-4 h-4 text-secondary-text mr-2" />
                <span className="text-xs font-semibold text-neutral-400">Search tasks...</span>
                <div className="ml-auto bg-white border border-border-custom px-1.5 py-0.5 rounded flex items-center text-[10px] font-bold text-neutral-500 shadow-3xs">
                  Esc
                </div>
              </div>
            </div>

            {/* Task Management & Analytics */}
            <div className="md:col-span-2 row-span-1 bg-white border border-border-custom rounded-3xl p-8 relative overflow-hidden group hover:border-neutral-300 transition-colors shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center mb-6">
                <LayoutDashboard className="w-5 h-5 text-foreground" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight mb-2">Beautiful Analytics</h3>
              <p className="text-sm text-secondary-text leading-relaxed max-w-md mb-8 font-medium">
                Visualize your execution speed, track weekly activity streaks, and optimize your productivity patterns.
              </p>
              
              {/* Mock Bar Chart */}
              <div className="absolute right-0 bottom-0 w-[60%] h-[140px] flex items-end gap-2 px-8 opacity-70 group-hover:opacity-100 transition-opacity">
                {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                  <div key={i} className="flex-1 bg-neutral-100 rounded-t-md relative overflow-hidden" style={{ height: `${h}%` }}>
                    <div 
                      className="absolute bottom-0 left-0 w-full bg-foreground rounded-t-md transition-all duration-700 ease-out" 
                      style={{ height: h > 60 ? '100%' : '0%' }} 
                    />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 bg-white border-t border-border-custom">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-secondary-text font-medium">
              Everything you need to know about the product and billing.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <div 
                key={index} 
                className="border border-border-custom rounded-2xl bg-white overflow-hidden transition-all duration-300 shadow-sm hover:border-neutral-300"
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none cursor-pointer"
                >
                  <span className="font-bold text-foreground text-sm">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-secondary-text transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 text-sm text-secondary-text leading-relaxed border-t border-neutral-100 pt-4 font-medium">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern Dark CTA Section */}
      <section className="py-24 px-6 bg-white border-t border-border-custom relative overflow-hidden">
        <div className="absolute inset-0 bg-neutral-[2%] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto bg-neutral-950 rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-neutral-800 rounded-full blur-[100px] opacity-40 pointer-events-none" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-neutral-900 rounded-full blur-[100px] opacity-60 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center">
            <Shield className="w-12 h-12 text-neutral-400 mb-6" />
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white mb-6 leading-[1.1]">
              Enterprise-grade security. <br className="hidden md:block" />
              Built for your peace of mind.
            </h2>
            <p className="text-base text-neutral-400 max-w-xl mx-auto mb-10 leading-relaxed font-medium">
              Join thousands of professionals organizing their workflow in a secure, encrypted, and blazing fast environment.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <Link href={user ? "/dashboard" : "/register"} className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto bg-white text-neutral-950 hover:bg-neutral-200 h-12 px-8 rounded-full font-bold shadow-lg transition-transform hover:-translate-y-0.5">
                  Create Free Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
