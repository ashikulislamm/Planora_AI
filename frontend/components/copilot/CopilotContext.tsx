"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Message {
  id: string;
  sender: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface CopilotContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  messages: Message[];
  inputValue: string;
  setInputValue: (val: string) => void;
  isLoading: boolean;
  sendMessage: (content: string) => void;
  clearConversation: () => void;
  quickFillInput: (content: string) => void;
}

const CopilotContext = createContext<CopilotContextType | undefined>(undefined);

export const useCopilot = () => {
  const context = useContext(CopilotContext);
  if (!context) {
    throw new Error("useCopilot must be used inside a CopilotProvider");
  }
  return context;
};

export const CopilotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  // Initialize with welcome message
  useEffect(() => {
    setMessages([
      {
        id: "welcome-msg",
        sender: "assistant",
        content: "Hello!\n\nI'm Planora Copilot.\n\nI'm here to help you organize your work, create tasks, and improve productivity.\n\nWhat would you like to do today?",
        timestamp: new Date(),
      },
    ]);
  }, []);

  const sendMessage = (content: string) => {
    if (!content.trim()) return;

    // 1. Append User Message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // 2. Mock Typing & AI Response Simulation
    setTimeout(() => {
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        sender: "assistant",
        content: "Thanks! AI integration will be available in the next phase.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1200); // 1.2s delay for a premium and realistic typing feel
  };

  const clearConversation = () => {
    setMessages([]);
  };

  const quickFillInput = (content: string) => {
    setInputValue(content);
  };

  return (
    <CopilotContext.Provider
      value={{
        isOpen,
        setIsOpen,
        messages,
        inputValue,
        setInputValue,
        isLoading,
        sendMessage,
        clearConversation,
        quickFillInput,
      }}
    >
      {children}
    </CopilotContext.Provider>
  );
};
