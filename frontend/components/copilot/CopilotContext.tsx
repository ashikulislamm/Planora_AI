"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  generateTaskPreview, 
  TaskPreviewDTO, 
  generateProjectPreview, 
  ProjectPreviewDTO 
} from "../../services/ai.service";

export interface Message {
  id: string;
  sender: "user" | "assistant";
  content: string;
  timestamp: Date;
  type?: "text" | "preview" | "success" | "cancelled" | "project-preview";
  previewData?: TaskPreviewDTO;
  projectPreviewData?: ProjectPreviewDTO;
  createdTask?: any;
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
  updateMessage: (id: string, updatedFields: Partial<Message>) => void;
  activeProjectPlan: Message | null;
  setActiveProjectPlan: (msg: Message | null) => void;
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
  const [activeProjectPlan, setActiveProjectPlan] = useState<Message | null>(null);

  // Initialize with welcome message
  useEffect(() => {
    setMessages([
      {
        id: "welcome-msg",
        sender: "assistant",
        content: "Hello!\n\nI'm Planora Copilot.\n\nI'm here to help you organize your work, create tasks, and improve productivity.\n\nWhat would you like to do today?",
        timestamp: new Date(),
        type: "text",
      },
    ]);
  }, []);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    // 1. Append User Message
    const userMessageId = `user-${Date.now()}`;
    const userMessage: Message = {
      id: userMessageId,
      sender: "user",
      content: content.trim(),
      timestamp: new Date(),
      type: "text",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Intelligent routing: check if user wants a project breakdown
      const isProjectQuery = /project|breakdown|break down|plan|sequence|architecture/i.test(content);

      if (isProjectQuery) {
        // Query project breakdown
        const projectPreviewData = await generateProjectPreview(content.trim());
        
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          sender: "assistant",
          content: `I've created a project breakdown proposal for **${projectPreviewData.parentTask.title}** consisting of ${projectPreviewData.summary.totalSubtasks} sequential subtasks.`,
          timestamp: new Date(),
          type: "project-preview",
          projectPreviewData,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        // Query standard single task preview
        const previewData = await generateTaskPreview(content.trim());

        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          sender: "assistant",
          content: "I've prepared a task preview for you. Please review the details below before creating it:",
          timestamp: new Date(),
          type: "preview",
          previewData,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error: any) {
      // Handle API errors gracefully
      let errorMessage = "Sorry, I encountered an issue generating your proposal. Please try again later.";
      
      if (error.response?.data?.message) {
        errorMessage = `I couldn't generate the proposal: ${error.response.data.message}`;
      }

      const errorMsg: Message = {
        id: `assistant-error-${Date.now()}`,
        sender: "assistant",
        content: errorMessage,
        timestamp: new Date(),
        type: "text",
      };

      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearConversation = () => {
    setMessages([]);
  };

  const quickFillInput = (content: string) => {
    setInputValue(content);
  };

  const updateMessage = (id: string, updatedFields: Partial<Message>) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, ...updatedFields } : msg))
    );
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
        updateMessage,
        activeProjectPlan,
        setActiveProjectPlan,
      }}
    >
      {children}
    </CopilotContext.Provider>
  );
};
