"use client";

import React, { useState } from "react";
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  Tag, 
  AlertCircle, 
  Check, 
  Edit2, 
  XCircle,
  BookmarkCheck,
  Timer
} from "lucide-react";
import { Button } from "../shared/Button";
import { useCopilot } from "./CopilotContext";
import { TaskPreviewDTO } from "../../services/ai.service";
import { createTaskFromPreview } from "../../services/ai.service";

interface TaskPreviewCardProps {
  messageId: string;
  previewData: TaskPreviewDTO;
  type: "preview" | "success" | "cancelled";
  createdTask?: any;
}

export const TaskPreviewCard: React.FC<TaskPreviewCardProps> = ({
  messageId,
  previewData,
  type,
  createdTask,
}) => {
  const { updateMessage } = useCopilot();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Editable Form States
  const [title, setTitle] = useState(previewData.title);
  const [description, setDescription] = useState(previewData.description || "");
  const [priority, setPriority] = useState(previewData.priority);
  const [category, setCategory] = useState(previewData.category);
  const [status, setStatus] = useState(previewData.status);
  
  // Format Date ISO string to YYYY-MM-DD for standard date input, or keep null
  const formatDateForInput = (isoString: string | null) => {
    if (!isoString) return "";
    return new Date(isoString).toISOString().split("T")[0];
  };

  const [dueDate, setDueDate] = useState(formatDateForInput(previewData.dueDate));
  const [dueTime, setDueTime] = useState(previewData.dueTime || "");
  const [estimatedDuration, setEstimatedDuration] = useState<number | "">(
    previewData.estimatedDuration || ""
  );

  const handleCancelPreview = () => {
    updateMessage(messageId, {
      type: "cancelled",
      content: "Task creation cancelled.",
    });
  };

  const handleToggleEdit = () => {
    setIsEditing(true);
    setError(null);
  };

  const handleCancelEdit = () => {
    // Revert form states to original preview data
    setTitle(previewData.title);
    setDescription(previewData.description || "");
    setPriority(previewData.priority);
    setCategory(previewData.category);
    setStatus(previewData.status);
    setDueDate(formatDateForInput(previewData.dueDate));
    setDueTime(previewData.dueTime || "");
    setEstimatedDuration(previewData.estimatedDuration || "");
    setIsEditing(false);
    setError(null);
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Task title is required");
      return;
    }
    // Update local previewData in context so the view reflects modifications
    const updatedPreview: TaskPreviewDTO = {
      ...previewData,
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      category,
      dueDate: dueDate ? new Date(`${dueDate}T${dueTime || "00:00"}:00`).toISOString() : null,
      dueTime: dueTime || null,
      estimatedDuration: estimatedDuration ? Number(estimatedDuration) : null,
    };

    updateMessage(messageId, {
      previewData: updatedPreview,
    });
    setIsEditing(false);
    setError(null);
  };

  const handleCreateTask = async () => {
    setIsSubmitting(true);
    setError(null);

    // Build the request payload from the latest state values
    const taskPayload = {
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      category,
      dueDate: dueDate ? new Date(`${dueDate}T${dueTime || "00:00"}:00`).toISOString() : null,
      dueTime: dueTime || null,
      estimatedDuration: estimatedDuration ? Number(estimatedDuration) : null,
    };

    try {
      const created = await createTaskFromPreview(taskPayload);
      updateMessage(messageId, {
        type: "success",
        content: "Task successfully created!",
        createdTask: created,
      });
    } catch (err: any) {
      let failMessage = "Failed to create task. Please try again.";
      if (err.response?.data?.message) {
        failMessage = err.response.data.message;
      }
      setError(failMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case "critical":
        return "bg-red-50 text-red-700 border-red-200";
      case "high":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "medium":
        return "bg-zinc-100 text-zinc-800 border-zinc-200";
      case "low":
      default:
        return "bg-neutral-50 text-neutral-600 border-neutral-200";
    }
  };

  // SUCCESS STATE
  if (type === "success") {
    return (
      <div className="w-full border border-border-custom bg-secondary-bg rounded-xl p-4.5 mb-4 animate-scale-in select-none">
        <div className="flex gap-2.5 items-start">
          <div className="w-6.5 h-6.5 rounded-full bg-foreground text-background flex items-center justify-center shrink-0 shadow-3xs">
            <BookmarkCheck className="w-3.5 h-3.5" />
          </div>
          <div className="flex-1 text-left flex flex-col gap-1">
            <span className="text-xs font-bold text-foreground">Task Created Successfully</span>
            <span className="text-[11px] font-medium text-foreground tracking-tight line-clamp-1">
              Title: {createdTask?.title || title}
            </span>
            <span className="text-[10.5px] text-secondary-text font-medium leading-relaxed mt-0.5">
              I have added this task to your workspace. You can now track it in your Dashboard or My Tasks panel.
            </span>
          </div>
        </div>
      </div>
    );
  }

  // CANCELLED STATE
  if (type === "cancelled") {
    return (
      <div className="w-full border border-border-custom bg-secondary-bg/50 rounded-xl p-4.5 mb-4 text-left animate-fade-in opacity-70 select-none">
        <div className="flex gap-2.5 items-center">
          <XCircle className="w-4 h-4 text-secondary-text shrink-0" />
          <span className="text-xs font-bold text-secondary-text tracking-tight">
            Task Preview Cancelled
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full border border-border-custom bg-white shadow-2xs rounded-xl overflow-hidden mb-4 animate-scale-in text-left">
      {/* Confidence Sparkle Banner */}
      <div className="bg-secondary-bg border-b border-border-custom/60 px-4 py-2 flex items-center justify-between select-none">
        <div className="flex items-center gap-1.5 text-[9.5px] font-extrabold text-secondary-text uppercase tracking-widest">
          <Sparkles className="w-3 h-3 text-foreground shrink-0" />
          <span>Task Proposal</span>
        </div>
        <span className="text-[9px] font-extrabold text-secondary-text bg-white px-2 py-0.5 border border-border-custom rounded-md shadow-3xs">
          Match: {Math.round(previewData.confidence * 100)}%
        </span>
      </div>

      {isEditing ? (
        /* EDITING FORM VIEW */
        <form onSubmit={handleSaveChanges} className="p-4 flex flex-col gap-3">
          {error && (
            <div className="p-2.5 bg-red-50/50 border border-red-200 text-red-700 text-[10.5px] font-medium rounded-lg flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title input */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-extrabold text-secondary-text uppercase tracking-wide">
              Task Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-border-custom rounded-md focus:border-neutral-450 focus:outline-none font-medium text-foreground bg-secondary-bg"
              placeholder="e.g. Upgrade frontend libraries"
              required
            />
          </div>

          {/* Description input */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-extrabold text-secondary-text uppercase tracking-wide">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-2.5 py-1.5 text-xs border border-border-custom rounded-md focus:border-neutral-450 focus:outline-none font-medium text-foreground bg-secondary-bg resize-none"
              placeholder="Provide a description..."
            />
          </div>

          {/* Inline fields grid */}
          <div className="grid grid-cols-3 gap-2">
            {/* Priority */}
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-extrabold text-secondary-text uppercase tracking-wide">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e: any) => setPriority(e.target.value)}
                className="w-full px-2 py-1 text-xs border border-border-custom rounded-md focus:outline-none bg-secondary-bg font-semibold text-foreground"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            {/* Category */}
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-extrabold text-secondary-text uppercase tracking-wide">
                Category
              </label>
              <select
                value={category}
                onChange={(e: any) => setCategory(e.target.value)}
                className="w-full px-2 py-1 text-xs border border-border-custom rounded-md focus:outline-none bg-secondary-bg font-semibold text-foreground"
              >
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="study">Study</option>
                <option value="health">Health</option>
              </select>
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-extrabold text-secondary-text uppercase tracking-wide">
                Status
              </label>
              <select
                value={status}
                onChange={(e: any) => setStatus(e.target.value)}
                className="w-full px-2 py-1 text-xs border border-border-custom rounded-md focus:outline-none bg-secondary-bg font-semibold text-foreground"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Due Date */}
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-extrabold text-secondary-text uppercase tracking-wide">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-2 py-1 text-xs border border-border-custom rounded-md focus:outline-none bg-secondary-bg font-semibold text-foreground"
              />
            </div>

            {/* Due Time */}
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-extrabold text-secondary-text uppercase tracking-wide">
                Due Time
              </label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full px-2 py-1 text-xs border border-border-custom rounded-md focus:outline-none bg-secondary-bg font-semibold text-foreground"
              />
            </div>
          </div>

          {/* Estimated Duration */}
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-extrabold text-secondary-text uppercase tracking-wide">
              Duration (minutes)
            </label>
            <input
              type="number"
              value={estimatedDuration}
              onChange={(e) => setEstimatedDuration(e.target.value === "" ? "" : Number(e.target.value))}
              placeholder="e.g. 120"
              className="w-full px-2.5 py-1 text-xs border border-border-custom rounded-md focus:outline-none bg-secondary-bg font-semibold text-foreground"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2 border-t border-border-custom/50 pt-3.5 mt-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCancelEdit}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save
            </Button>
          </div>
        </form>
      ) : (
        /* STANDARD VIEW MODE CARD */
        <div className="p-4.5 flex flex-col gap-3.5">
          {error && (
            <div className="p-2.5 bg-red-50/50 border border-red-200 text-red-700 text-[10.5px] font-medium rounded-lg flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Task Info Header */}
          <div className="flex flex-col text-left">
            <span className="text-sm font-extrabold text-foreground tracking-tight leading-snug">
              {title}
            </span>
            {description && (
              <span className="text-[11px] font-medium text-secondary-text leading-relaxed mt-1">
                {description}
              </span>
            )}
          </div>

          {/* Metadata Grid */}
          <div className="flex flex-wrap gap-2 pt-1">
            {/* Priority Badge */}
            <span
              className={`
                px-2.5 py-1 rounded text-[9.5px] font-extrabold border uppercase tracking-wider select-none
                ${getPriorityColor(priority)}
              `}
            >
              {priority}
            </span>

            {/* Category Badge */}
            <span className="px-2.5 py-1 rounded text-[9.5px] font-extrabold border border-border-custom bg-white text-secondary-text flex items-center gap-1 uppercase tracking-wider select-none">
              <Tag className="w-2.5 h-2.5 text-secondary-text shrink-0" />
              <span>{category}</span>
            </span>

            {/* Status Badge */}
            <span className="px-2.5 py-1 rounded text-[9.5px] font-extrabold border border-border-custom bg-neutral-50 text-secondary-text flex items-center gap-1 uppercase tracking-wider select-none">
              <Check className="w-2.5 h-2.5 text-secondary-text shrink-0" />
              <span>{status}</span>
            </span>

            {/* Estimated Duration if specified */}
            {estimatedDuration && (
              <span className="px-2.5 py-1 rounded text-[9.5px] font-extrabold border border-border-custom bg-white text-secondary-text flex items-center gap-1 uppercase tracking-wider select-none">
                <Timer className="w-3 h-3 text-secondary-text shrink-0" />
                <span>{estimatedDuration} min</span>
              </span>
            )}
          </div>

          {/* Due date container */}
          {dueDate && (
            <div className="p-3 bg-secondary-bg border border-border-custom rounded-lg flex items-center gap-2 select-none">
              <Calendar className="w-3.5 h-3.5 text-foreground shrink-0" />
              <div className="flex items-baseline gap-1 text-[10.5px] font-bold text-foreground">
                <span>Due:</span>
                <span className="font-semibold text-secondary-text">
                  {new Date(dueDate).toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                {dueTime && (
                  <span className="font-semibold text-secondary-text ml-1 flex items-center gap-0.5">
                    <Clock className="w-2.5 h-2.5 shrink-0" />
                    {dueTime}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* View Mode Actions */}
          <div className="flex items-center justify-between border-t border-border-custom/50 pt-4.5 mt-1 select-none">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancelPreview}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleToggleEdit}
                disabled={isSubmitting}
              >
                <Edit2 className="w-3 h-3 mr-1 shrink-0" />
                <span>Edit</span>
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={handleCreateTask}
                isLoading={isSubmitting}
              >
                Create Task
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
