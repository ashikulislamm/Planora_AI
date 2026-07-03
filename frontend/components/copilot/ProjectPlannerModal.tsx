"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  Sparkles, 
  Plus, 
  Trash2, 
  GripVertical, 
  Calendar, 
  Clock, 
  AlertCircle, 
  Check, 
  Timer, 
  FolderPlus,
  ArrowRight,
  TrendingUp
} from "lucide-react";
import { Button } from "../shared/Button";
import { useCopilot } from "./CopilotContext";
import { ProjectPreviewSubtask, createProjectFromPreview } from "../../services/ai.service";

export const ProjectPlannerModal: React.FC = () => {
  const { activeProjectPlan, setActiveProjectPlan, updateMessage } = useCopilot();
  const [parentTitle, setParentTitle] = useState("");
  const [parentDesc, setParentDesc] = useState("");
  const [parentCategory, setParentCategory] = useState<"work" | "personal" | "study" | "health">("work");
  const [parentPriority, setParentPriority] = useState<"low" | "medium" | "high" | "critical">("medium");
  
  // Format ISO to YYYY-MM-DD for date inputs
  const formatDateString = (isoStr: string | null) => {
    if (!isoStr) return "";
    return new Date(isoStr).toISOString().split("T")[0];
  };

  const [parentDueDate, setParentDueDate] = useState("");
  const [subtasks, setSubtasks] = useState<ProjectPreviewSubtask[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync state with active project preview data on open
  useEffect(() => {
    if (activeProjectPlan?.projectPreviewData) {
      const data = activeProjectPlan.projectPreviewData;
      setParentTitle(data.parentTask.title);
      setParentDesc(data.parentTask.description);
      setParentCategory(data.parentTask.category);
      setParentPriority(data.parentTask.priority);
      setParentDueDate(formatDateString(data.parentTask.dueDate));
      setSubtasks(data.subtasks);
      setError(null);
    }
  }, [activeProjectPlan]);

  if (!activeProjectPlan || !activeProjectPlan.projectPreviewData) return null;

  // Smart Features & Statistics Calculation
  const totalSubtasks = subtasks.length;
  const totalDurationMinutes = subtasks.reduce((sum, s) => sum + (s.estimatedDuration || 0), 0);
  const totalHours = Math.round(totalDurationMinutes / 60) || 0;
  const estimatedDays = Math.ceil(totalHours / 6) || 0;
  
  const criticalCount = subtasks.filter((s) => s.priority === "critical").length;
  const highCount = subtasks.filter((s) => s.priority === "high").length;
  
  const longestTask = subtasks.length > 0 
    ? subtasks.reduce((max, s) => (s.estimatedDuration || 0) > (max.estimatedDuration || 0) ? s : max, subtasks[0])
    : null;

  // HTML5 Drag and Drop Reordering Handlers
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === index) return;

    const list = [...subtasks];
    const item = list[draggedIdx];
    list.splice(draggedIdx, 1);
    list.splice(index, 0, item);

    // Re-index execution order sequentially
    const reindexed = list.map((s, idx) => ({ ...s, order: idx + 1 }));
    setSubtasks(reindexed);
    setDraggedIdx(index);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
  };

  // Editable Fields Handlers
  const handleUpdateSubtask = (index: number, fields: Partial<ProjectPreviewSubtask>) => {
    setSubtasks(prev =>
      prev.map((sub, idx) => (idx === index ? { ...sub, ...fields } : sub))
    );
  };

  const handleDeleteSubtask = (index: number) => {
    const list = subtasks.filter((_, idx) => idx !== index);
    const reindexed = list.map((s, idx) => ({ ...s, order: idx + 1 }));
    setSubtasks(reindexed);
  };

  const handleAddSubtask = () => {
    if (subtasks.length >= 15) {
      setError("AI Project plans cannot exceed 15 subtasks");
      return;
    }
    const newSub: ProjectPreviewSubtask = {
      title: "New Subtask step",
      description: "",
      priority: "medium",
      status: "todo",
      dueDate: parentDueDate ? new Date(`${parentDueDate}T00:00:00Z`).toISOString() : null,
      estimatedDuration: 60,
      order: subtasks.length + 1,
      dependsOn: [],
    };
    setSubtasks([...subtasks, newSub]);
    setError(null);
  };

  const handleCreateProject = async () => {
    if (!parentTitle.trim()) {
      setError("Project title is required");
      return;
    }
    if (subtasks.length === 0) {
      setError("At least one subtask is required");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const projectPayload = {
      parentTask: {
        title: parentTitle.trim(),
        description: parentDesc.trim(),
        priority: parentPriority,
        category: parentCategory,
        status: "todo" as const,
        dueDate: parentDueDate ? new Date(`${parentDueDate}T00:00:00Z`).toISOString() : null,
        estimatedDuration: totalDurationMinutes,
      },
      subtasks: subtasks.map(s => ({
        ...s,
        title: s.title.trim(),
        description: s.description?.trim(),
      })),
    };

    try {
      const result = await createProjectFromPreview(projectPayload);
      
      // Update message type in conversation context to trigger success layout
      updateMessage(activeProjectPlan.id, {
        type: "success",
        content: `AI project breakdown for **${result.parentTask.title}** created successfully!`,
        createdTask: result.parentTask,
      });

      // Close Planner
      setActiveProjectPlan(null);
    } catch (err: any) {
      let failMsg = "Failed to commit project planner tasks. Please try again.";
      if (err.response?.data?.message) {
        failMsg = err.response.data.message;
      }
      setError(failMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-md p-4 animate-fade-in select-text">
      {/* Container Card */}
      <div className="bg-white border border-border-custom w-full max-w-5.5xl h-[88vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden animate-scale-in text-left">
        
        {/* Header bar */}
        <header className="border-b border-border-custom px-6 py-4 flex items-center justify-between select-none">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-foreground text-background rounded-lg flex items-center justify-center shadow-3xs">
              <FolderPlus className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-foreground leading-tight tracking-tight">
                AI Project Planner
              </h1>
              <p className="text-[11px] font-semibold text-secondary-text tracking-tight mt-0.5">
                Review, reorder, and configure your task sequence breakdown proposal.
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => setActiveProjectPlan(null)}
            className="p-1.5 rounded-lg border border-border-custom text-secondary-text hover:bg-hover-custom transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        {/* Content Body Grid */}
        <div className="flex-1 flex overflow-hidden min-h-0">
          
          {/* LEFT SIDEBAR: Main task configuration */}
          <aside className="w-80 border-r border-border-custom bg-secondary-bg/30 p-6 flex flex-col gap-4 overflow-y-auto shrink-0">
            <h2 className="text-xs font-extrabold text-foreground uppercase tracking-wider mb-1 select-none">
              Project Meta Config
            </h2>

            {/* Title */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-extrabold text-secondary-text uppercase tracking-wide select-none">
                Parent Project Title
              </label>
              <input
                type="text"
                value={parentTitle}
                onChange={(e) => setParentTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-border-custom rounded-md focus:border-neutral-450 focus:outline-none font-semibold text-foreground bg-white"
                placeholder="Project title..."
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-extrabold text-secondary-text uppercase tracking-wide select-none">
                Description
              </label>
              <textarea
                value={parentDesc}
                onChange={(e) => setParentDesc(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 text-xs border border-border-custom rounded-md focus:border-neutral-450 focus:outline-none font-semibold text-foreground bg-white resize-none"
                placeholder="Description of the project scope..."
              />
            </div>

            {/* Category selector */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-extrabold text-secondary-text uppercase tracking-wide select-none">
                Category
              </label>
              <select
                value={parentCategory}
                onChange={(e: any) => setParentCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-border-custom rounded-md focus:outline-none bg-white font-semibold text-foreground"
              >
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="study">Study</option>
                <option value="health">Health</option>
              </select>
            </div>

            {/* Priority selector */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-extrabold text-secondary-text uppercase tracking-wide select-none">
                Project Priority
              </label>
              <select
                value={parentPriority}
                onChange={(e: any) => setParentPriority(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-border-custom rounded-md focus:outline-none bg-white font-semibold text-foreground"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            {/* Due date */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-extrabold text-secondary-text uppercase tracking-wide select-none">
                Project Deadline
              </label>
              <input
                type="date"
                value={parentDueDate}
                onChange={(e) => setParentDueDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-border-custom rounded-md focus:outline-none bg-white font-semibold text-foreground"
              />
            </div>
          </aside>

          {/* RIGHT SIDE: Subtask sequence planner */}
          <main className="flex-1 flex flex-col min-h-0 bg-white p-6 overflow-hidden">
            
            {/* Top error banner */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2 mb-4">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Stats Summary cards */}
            <div className="grid grid-cols-4 gap-3.5 mb-5 select-none">
              {/* Card 1: Subtasks */}
              <div className="border border-border-custom bg-secondary-bg/25 rounded-xl p-3.5 flex flex-col gap-1">
                <span className="text-[9.5px] font-extrabold text-secondary-text uppercase tracking-wider">
                  Total Subtasks
                </span>
                <span className="text-xl font-black text-foreground tracking-tight">
                  {totalSubtasks}
                </span>
              </div>

              {/* Card 2: Estimated workload */}
              <div className="border border-border-custom bg-secondary-bg/25 rounded-xl p-3.5 flex flex-col gap-1">
                <span className="text-[9.5px] font-extrabold text-secondary-text uppercase tracking-wider">
                  Workload Estimate
                </span>
                <span className="text-xl font-black text-foreground tracking-tight flex items-baseline gap-1">
                  {totalHours} <span className="text-xs font-bold text-secondary-text">hrs</span> 
                  <span className="text-xs font-medium text-secondary-text">({estimatedDays} days)</span>
                </span>
              </div>

              {/* Card 3: Critical path */}
              <div className="border border-border-custom bg-secondary-bg/25 rounded-xl p-3.5 flex flex-col gap-1">
                <span className="text-[9.5px] font-extrabold text-secondary-text uppercase tracking-wider">
                  Critical Steps
                </span>
                <span className="text-xl font-black text-foreground tracking-tight flex items-center gap-1.5">
                  {criticalCount}
                  {criticalCount > 0 && (
                    <AlertCircle className="w-4.5 h-4.5 text-red-600 animate-pulse shrink-0" />
                  )}
                </span>
              </div>

              {/* Card 4: Longest step */}
              <div className="border border-border-custom bg-secondary-bg/25 rounded-xl p-3.5 flex flex-col gap-1 overflow-hidden">
                <span className="text-[9.5px] font-extrabold text-secondary-text uppercase tracking-wider">
                  Longest Step
                </span>
                <span className="text-xs font-bold text-foreground truncate mt-0.5" title={longestTask?.title || "N/A"}>
                  {longestTask ? `${longestTask.title} (${longestTask.estimatedDuration}m)` : "N/A"}
                </span>
              </div>
            </div>

            {/* List Header */}
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-border-custom select-none">
              <h3 className="text-xs font-extrabold text-foreground uppercase tracking-wider">
                Execution Steps Sequence ({totalSubtasks})
              </h3>
              <Button
                variant="outline"
                size="sm"
                className="py-1 text-[11px]"
                onClick={handleAddSubtask}
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add Step
              </Button>
            </div>

            {/* Subtask list */}
            <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2 scrollbar-thin">
              {subtasks.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
                  <span className="text-sm font-semibold text-secondary-text">No steps defined. Add a subtask to start.</span>
                </div>
              ) : (
                subtasks.map((sub, idx) => (
                  <div
                    key={sub.order}
                    draggable
                    onDragStart={(e) => handleDragStart(e, idx)}
                    onDragOver={(e) => handleDragOver(e, idx)}
                    onDragEnd={handleDragEnd}
                    className={`
                      border border-border-custom bg-white rounded-xl p-3 flex gap-3 items-center transition-all group
                      ${draggedIdx === idx ? "opacity-35 bg-secondary-bg" : "hover:border-neutral-350 hover:shadow-3xs"}
                    `}
                  >
                    {/* Drag Grip */}
                    <div className="cursor-grab text-secondary-text group-hover:text-foreground p-1 select-none">
                      <GripVertical className="w-3.5 h-3.5 shrink-0" />
                    </div>

                    {/* Step order index badge */}
                    <span className="w-5 h-5 rounded-full bg-secondary-bg text-secondary-text font-black text-[10px] flex items-center justify-center shrink-0 border border-border-custom/50 select-none">
                      {sub.order}
                    </span>

                    {/* Editable Title input */}
                    <input
                      type="text"
                      value={sub.title}
                      onChange={(e) => handleUpdateSubtask(idx, { title: e.target.value })}
                      className="flex-1 min-w-0 bg-transparent border-b border-transparent focus:border-neutral-300 focus:outline-none font-semibold text-xs text-foreground px-1"
                      placeholder="Subtask name..."
                      required
                    />

                    {/* Meta Fields: Priority select */}
                    <select
                      value={sub.priority}
                      onChange={(e: any) => handleUpdateSubtask(idx, { priority: e.target.value })}
                      className="text-[10px] font-bold border border-border-custom bg-secondary-bg rounded px-1.5 py-0.5 focus:outline-none text-secondary-text"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>

                    {/* Meta Fields: Estimated duration */}
                    <div className="flex items-center gap-1 shrink-0">
                      <Timer className="w-3.5 h-3.5 text-secondary-text shrink-0" />
                      <input
                        type="number"
                        value={sub.estimatedDuration || ""}
                        onChange={(e) => handleUpdateSubtask(idx, { 
                          estimatedDuration: e.target.value === "" ? 0 : Number(e.target.value) 
                        })}
                        className="w-11 text-center font-bold text-[10px] border border-border-custom bg-secondary-bg rounded py-0.5 focus:outline-none text-secondary-text"
                        placeholder="min"
                      />
                      <span className="text-[9px] text-secondary-text font-semibold select-none">m</span>
                    </div>

                    {/* Meta Fields: Due date */}
                    <div className="flex items-center gap-1 shrink-0">
                      <Calendar className="w-3.5 h-3.5 text-secondary-text shrink-0" />
                      <input
                        type="date"
                        value={formatDateString(sub.dueDate)}
                        onChange={(e) => handleUpdateSubtask(idx, { 
                          dueDate: e.target.value ? new Date(`${e.target.value}T00:00:00Z`).toISOString() : null 
                        })}
                        className="text-[10px] font-bold border border-border-custom bg-secondary-bg rounded px-1 py-0.5 focus:outline-none text-secondary-text"
                      />
                    </div>

                    {/* Delete Action button */}
                    <button
                      onClick={() => handleDeleteSubtask(idx)}
                      className="p-1 rounded text-red-500 hover:bg-red-50 transition-all select-none"
                    >
                      <Trash2 className="w-3.5 h-3.5 shrink-0" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Form Actions */}
            <footer className="border-t border-border-custom pt-4.5 mt-4 flex items-center justify-between select-none">
              <span className="text-[10.5px] font-semibold text-secondary-text flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-foreground" />
                <span>All subtasks will be created under {parentTitle || "Project"} task.</span>
              </span>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveProjectPlan(null)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleCreateProject}
                  isLoading={isSubmitting}
                >
                  Create Project
                </Button>
              </div>
            </footer>

          </main>

        </div>

      </div>
    </div>
  );
};
