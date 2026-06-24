import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "./providers/QueryProvider";
import { AuthProvider } from "../context/AuthContext";
import { ToastProvider } from "../components/shared/Toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Focus — Minimalist Task Manager",
  description: "A clean, modern, and highly polished task manager built for professionals.",
  keywords: ["task manager", "focus", "todo app", "project management", "productivity", "minimalist task manager", "productivity app"],
  authors: [{ name: "Md Ashikul Islam" }],
  creator: "Md Ashikul Islam",
  applicationName: "Focus",
  openGraph: {
    title: "Focus — Minimalist Task Manager",
    description: "A clean, modern, and highly polished task manager built for professionals.",
    siteName: "Focus Task Manager",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Focus — Minimalist Task Manager",
    description: "A clean, modern, and highly polished task manager built for professionals.",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <QueryProvider>
          <AuthProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
