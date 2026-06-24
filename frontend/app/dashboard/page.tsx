"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Plus, 
  Trash2, 
  Edit2, 
  CheckCircle2, 
  Circle, 
  Clock, 
  CheckSquare, 
  ChevronRight,
  TrendingUp,
  Calendar,
  AlertCircle,
  Folder
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/shared/Toast";
import { taskService, Task } from "../../services/task.service";
import { useDashboardLayout } from "./layout";
import { Button } from "../../components/shared/Button";
import { Input } from "../../components/shared/Input";
import { Modal } from "../../components/shared/Modal";
import { ConfirmDialog } from "../../components/shared/ConfirmDialog";
import { EmptyState } from "../../components/shared/EmptyState";
import { DashboardPageSkeleton } from "../../components/shared/Loader";

// Task Validation Schemas
const taskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title is too long"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description is too long"),
  status: z.enum(["todo", "in-progress", "done"]),
  priority: z.enum(["low", "medium", "high", "critical"]),
  dueDate: z.string().optional().nullable().or(z.literal("")),
  category: z.enum(["work", "personal", "study", "health"]),
});

type TaskFormValues = z.infer<typeof taskSchema>;

export default function DashboardPage() {
  const { user } = useAuth();
  const { success, error } = useToast();
  const { createModalOpen, setCreateModalOpen } = useDashboardLayout();
  const queryClient = useQueryClient();

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [greeting, setGreeting] = useState("Welcome back");
  const [dashboardCategoryFilter, setDashboardCategoryFilter] = useState<"all" | "work" | "personal" | "study" | "health">("all");

  // Determine welcome greeting based on local time
  useEffect(() => {
    const hrs = new Date().getHours();
    if (hrs < 12) setGreeting("Good morning");
    else if (hrs < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  // Form Hooks
  const {
    register: registerCreate,
    handleSubmit: handleCreateSubmit,
    reset: resetCreateForm,
    formState: { errors: createErrors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      category: "personal",
      dueDate: "",
    },
  });

  const {
    register: registerEdit,
    handleSubmit: handleEditSubmit,
    setValue: setEditValue,
    formState: { errors: editErrors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
  });

  // Load editing task data into edit form fields
  useEffect(() => {
    if (editingTask) {
      setEditValue("title", editingTask.title);
      setEditValue("description", editingTask.description);
      setEditValue("status", editingTask.status);
      setEditValue("priority", editingTask.priority || "medium");
      setEditValue("category", editingTask.category || "personal");
      setEditValue("dueDate", editingTask.dueDate ? editingTask.dueDate.split("T")[0] : "");
    }
  }, [editingTask, setEditValue]);

  // React Query: Get User Tasks
  const { data: response, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await taskService.getTasks();
      return res.data;
    },
  });

  const tasks = response || [];

  // Mutations
  const createTaskMutation = useMutation({
    mutationFn: taskService.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      success("Task created successfully!");
      setCreateModalOpen(false);
      resetCreateForm();
    },
    onError: (err: any) => {
      error(err.response?.data?.message || "Failed to create task");
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Task> }) =>
      taskService.updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      success("Task updated successfully!");
      setEditingTask(null);
    },
    onError: (err: any) => {
      error(err.response?.data?.message || "Failed to update task");
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: taskService.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      success("Task deleted successfully!");
      setDeletingTaskId(null);
    },
    onError: (err: any) => {
      error(err.response?.data?.message || "Failed to delete task");
    },
  });

  // Quick Status Transition
  const handleQuickStatusChange = (task: Task, newStatus: "todo" | "in-progress" | "done") => {
    updateTaskMutation.mutate({
      id: task._id,
      data: { status: newStatus },
    });
  };

  const handleCreateTask = (data: TaskFormValues) => {
    const formattedData = {
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
    };
    createTaskMutation.mutate(formattedData);
  };

  const handleUpdateTask = (data: TaskFormValues) => {
    if (editingTask) {
      const formattedData = {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
      };
      updateTaskMutation.mutate({
        id: editingTask._id,
        data: formattedData,
      });
    }
  };

  const handleDeleteTask = () => {
    if (deletingTaskId) {
      deleteTaskMutation.mutate(deletingTaskId);
    }
  };

  // Overdue Check
  const isTaskOverdue = (task: Task) => {
    if (!task.dueDate || task.status === "done") return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(task.dueDate) < today;
  };

  // Stat computations
  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.status === "done").length;
  const todoCount = tasks.filter((t) => t.status === "todo").length;
  const inProgressCount = tasks.filter((t) => t.status === "in-progress").length;
  
  // Overdue logic
  const overdueCount = tasks.filter((t) => isTaskOverdue(t)).length;

  // Due Today logic
  const dueTodayCount = tasks.filter((t) => {
    const todayStr = new Date().toISOString().split("T")[0];
    return t.dueDate && t.dueDate.split("T")[0] === todayStr;
  }).length;

  // Upcoming logic
  const upcomingCount = tasks.filter((t) => {
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    return t.dueDate && new Date(t.dueDate) > todayEnd && t.status !== "done";
  }).length;

  // Category counts
  const categoryStats = {
    work: tasks.filter((t) => t.category === "work").length,
    personal: tasks.filter((t) => t.category === "personal").length,
    study: tasks.filter((t) => t.category === "study").length,
    health: tasks.filter((t) => t.category === "health").length,
  };

  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Filter tasks to show only pending ones (todo or in-progress) on dashboard summary
  // Also filter by selected category
  const dashboardPendingTasks = tasks
    .filter((t) => t.status === "todo" || t.status === "in-progress")
    .filter((t) => dashboardCategoryFilter === "all" || t.category === dashboardCategoryFilter)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  // Next 5 upcoming deadlines, sorted by nearest due date ascending (excluding completed tasks and tasks without a due date)
  const upcomingDeadlines = tasks
    .filter((t) => t.dueDate && t.status !== "done")
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 5);

  // Recent Activity logic
  const getRecentActivities = () => {
    if (tasks.length === 0) return [];
    
    const sorted = [...tasks].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    return sorted.slice(0, 4).map((task) => {
      const isNew = task.createdAt === task.updatedAt;
      const dateStr = new Date(task.updatedAt).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });

      return {
        id: task._id,
        title: task.title,
        status: task.status,
        date: dateStr,
        description: isNew 
          ? `Created task: "${task.title}"` 
          : `Moved task "${task.title}" to status "${task.status}"`
      };
    });
  };

  const recentActivities = getRecentActivities();

  if (isLoading) {
    return <DashboardPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            {greeting}, {user?.name.split(" ")[0]}
          </h2>
          <p className="text-xs text-secondary-text leading-tight mt-0.5">
            Here is your productivity brief for today.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-1.5" />
          <span>New Task</span>
        </Button>
      </div>

      {/* Grid of Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 select-none">
        {[
          { label: "Total Tasks", val: totalCount, icon: CheckSquare, desc: "Aggregate tasks logged" },
          { label: "Due Today", val: dueTodayCount, icon: Calendar, desc: "Deadlines finishing today" },
          { label: "Upcoming", val: upcomingCount, icon: Clock, desc: "Future active deadlines" },
          { label: "Overdue", val: overdueCount, icon: AlertCircle, desc: "Overdue tasks pending", warn: overdueCount > 0 },
          { label: "Completed", val: completedCount, icon: CheckCircle2, desc: "Successfully completed" },
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="p-4 bg-white border border-border-custom rounded-lg shadow-sm flex flex-col justify-between min-h-[105px]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-secondary-text uppercase tracking-wider">
                  {card.label}
                </span>
                <Icon className={`w-4 h-4 shrink-0 ${card.warn ? "text-neutral-900 font-bold" : "text-secondary-text"}`} />
              </div>
              <div className="mt-2 text-left">
                <span className="text-2xl font-bold tracking-tight text-foreground">
                  {card.val}
                </span>
                <p className="text-[10px] text-secondary-text mt-1.5 leading-none">
                  {card.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Summary List vs Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Pending Tasks Overview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border-custom pb-2 gap-2 select-none">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-secondary-text" />
              <h3 className="text-sm font-semibold text-foreground tracking-tight">
                Pending Actions ({dashboardPendingTasks.length})
              </h3>
            </div>
            
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 sm:pb-0">
              {[
                { id: "all", label: "All" },
                { id: "work", label: "Work" },
                { id: "personal", label: "Personal" },
                { id: "study", label: "Study" },
                { id: "health", label: "Health" }
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setDashboardCategoryFilter(pill.id as any)}
                  className={`
                    px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-tight font-bold border transition
                    ${dashboardCategoryFilter === pill.id 
                      ? "bg-foreground text-white border-foreground" 
                      : "bg-secondary-bg text-secondary-text border-border-custom hover:text-foreground"
                    }
                  `}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Task list summary */}
          <div className="flex flex-col gap-3">
            <AnimatePresence mode="popLayout">
              {dashboardPendingTasks.length > 0 ? (
                dashboardPendingTasks.map((task) => {
                  const overdue = isTaskOverdue(task);
                  return (
                    <motion.div
                      key={task._id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="p-4 bg-white border border-border-custom rounded-lg shadow-xs hover:border-foreground/45 transition flex items-center justify-between gap-4 group"
                    >
                      <div className="flex items-start gap-3 min-w-0 text-left">
                        {/* Checkbox for quick completion */}
                        <button
                          onClick={() => 
                            handleQuickStatusChange(task, "done")
                          }
                          className="text-secondary-text hover:text-foreground shrink-0 mt-0.5 transition cursor-pointer"
                          aria-label="Mark completed"
                        >
                          <Circle className="w-4.5 h-4.5" />
                        </button>
                        
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-xs font-bold tracking-tight text-foreground truncate">
                              {task.title}
                            </h4>
                            <span className="text-[9px] text-secondary-text font-bold uppercase">
                              [{task.category}]
                            </span>
                            {overdue && (
                              <span className="inline-flex items-center gap-0.5 border border-neutral-400 bg-neutral-100 text-neutral-900 px-1 py-0.5 rounded text-[8px] font-extrabold uppercase animate-pulse">
                                <span>Overdue</span>
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-secondary-text leading-normal mt-1 line-clamp-1">
                            {task.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2.5 select-none text-[10px]">
                            <span className="text-[9px] text-secondary-text font-bold uppercase border border-border-custom bg-secondary-bg px-1.5 py-0.5 rounded leading-none shrink-0">
                              {task.status}
                            </span>
                            {task.dueDate && (
                              <span className={`text-[10px] font-semibold leading-none shrink-0 ${overdue ? "text-neutral-900 font-bold" : "text-secondary-text"}`}>
                                Due: {new Date(task.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions panel */}
                      <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setEditingTask(task)}
                          className="text-secondary-text hover:text-foreground p-1 hover:bg-hover-custom rounded transition cursor-pointer"
                          aria-label="Edit task"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingTaskId(task._id)}
                          className="text-secondary-text hover:text-foreground p-1 hover:bg-hover-custom rounded transition cursor-pointer"
                          aria-label="Delete task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <EmptyState
                  title="No pending tasks"
                  description={
                    dashboardCategoryFilter !== "all"
                      ? `No tasks found under category "${dashboardCategoryFilter}".`
                      : "You have no pending tasks. Enjoy your day or create a new one!"
                  }
                  actionText={dashboardCategoryFilter === "all" ? "Create Task" : undefined}
                  onAction={() => setCreateModalOpen(true)}
                />
              )}
            </AnimatePresence>
            
            {dashboardPendingTasks.length > 0 && (
              <div className="pt-2 text-center select-none">
                <Link href="/dashboard/tasks">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary-text hover:text-foreground transition cursor-pointer">
                    <span>Manage all {totalCount} tasks in Workspace</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Productivity Widgets */}
        <div className="space-y-6 select-none">
          
          {/* Widget 1: Completion rate progress */}
          <div className="p-5 border border-border-custom rounded-lg bg-white shadow-sm space-y-4 text-left">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-foreground tracking-tight uppercase">
                Productivity Brief
              </h3>
              <TrendingUp className="w-4 h-4 text-secondary-text shrink-0" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-end text-xs">
                <span className="text-secondary-text font-medium">Completion rate</span>
                <span className="text-foreground font-bold">{completionRate}%</span>
              </div>
              <div className="w-full h-2 bg-secondary-bg border border-border-custom rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completionRate}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="h-full bg-foreground rounded-full"
                />
              </div>
              <p className="text-[10px] text-secondary-text leading-normal pt-1">
                Completed {completedCount} of {totalCount} total logged tasks. Keep it up!
              </p>
            </div>
          </div>

          {/* Widget 2: Task Distribution Breakdown & Priority Breakdown */}
          <div className="p-5 border border-border-custom rounded-lg bg-white shadow-sm space-y-4 text-left">
            <h3 className="text-xs font-bold text-foreground tracking-tight uppercase border-b border-border-custom pb-2">
              Status & Priority Metrics
            </h3>
            
            <div className="grid grid-cols-2 gap-4 text-xs">
              {/* Status Breakdown */}
              <div className="space-y-2">
                <span className="text-[9px] font-bold text-secondary-text uppercase block">Status</span>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-secondary-text">Todo:</span>
                    <span className="font-bold text-foreground">{todoCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-text">Running:</span>
                    <span className="font-bold text-foreground">{inProgressCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-text">Done:</span>
                    <span className="font-bold text-foreground">{completedCount}</span>
                  </div>
                </div>
              </div>

              {/* Priority Breakdown */}
              <div className="space-y-2">
                <span className="text-[9px] font-bold text-secondary-text uppercase block">Priority</span>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-secondary-text">Critical:</span>
                    <span className="font-bold text-foreground">{tasks.filter(t => t.priority === "critical").length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-text">High:</span>
                    <span className="font-bold text-foreground">{tasks.filter(t => t.priority === "high").length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-text">Medium:</span>
                    <span className="font-bold text-foreground">{tasks.filter(t => t.priority === "medium" || !t.priority).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-text">Low:</span>
                    <span className="font-bold text-foreground">{tasks.filter(t => t.priority === "low").length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Widget 3: Category Statistics */}
          <div className="p-5 border border-border-custom rounded-lg bg-white shadow-sm space-y-3.5 text-left">
            <h3 className="text-xs font-bold text-foreground tracking-tight uppercase border-b border-border-custom pb-2 flex items-center gap-1.5">
              <Folder className="w-4 h-4 text-secondary-text" />
              <span>Category Workspace Statistics</span>
            </h3>
            <div className="space-y-2 text-xs">
              {[
                { name: "Work Tasks", count: categoryStats.work },
                { name: "Personal Tasks", count: categoryStats.personal },
                { name: "Study Tasks", count: categoryStats.study },
                { name: "Health Tasks", count: categoryStats.health }
              ].map((cat, idx) => (
                <div key={idx} className="flex justify-between items-center py-0.5">
                  <span className="text-secondary-text font-medium">{cat.name}:</span>
                  <span className="font-bold text-foreground px-2 py-0.5 border border-border-custom bg-secondary-bg rounded text-[10px]">{cat.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Widget 4: Upcoming Deadlines */}
          <div className="p-5 border border-border-custom rounded-lg bg-white shadow-sm space-y-4 text-left">
            <h3 className="text-xs font-bold text-foreground tracking-tight uppercase border-b border-border-custom pb-2 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-secondary-text" />
              <span>Upcoming Deadlines</span>
            </h3>

            {upcomingDeadlines.length > 0 ? (
              <div className="flex flex-col gap-2">
                {upcomingDeadlines.map((task) => {
                  const overdue = isTaskOverdue(task);
                  return (
                    <div key={task._id} className="p-2.5 border border-border-custom rounded-md bg-secondary-bg space-y-1.5 text-left">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-xs font-semibold text-foreground truncate">{task.title}</span>
                        <span className={`text-[9px] uppercase font-bold shrink-0 px-1.5 py-0.5 border rounded ${overdue ? "border-neutral-400 bg-neutral-200 text-neutral-900" : "border-border-custom bg-white text-secondary-text"}`}>
                          {overdue ? "Overdue" : "Pending"}
                        </span>
                      </div>
                      <div className="flex justify-between text-[10px] text-secondary-text">
                        <span>{task.category}</span>
                        <span className="font-semibold">{new Date(task.dueDate!).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-secondary-text text-center py-2">
                No upcoming deadlines.
              </p>
            )}
          </div>

          {/* Widget 5: Recent Activity logs */}
          <div className="p-5 border border-border-custom rounded-lg bg-white shadow-sm space-y-4 text-left">
            <h3 className="text-xs font-bold text-foreground tracking-tight uppercase border-b border-border-custom pb-2">
              Recent Activity
            </h3>
            
            {recentActivities.length > 0 ? (
              <div className="relative border-l border-border-custom ml-1.5 pl-3.5 space-y-4 text-left">
                {recentActivities.map((act) => (
                  <div key={act.id} className="relative text-xs leading-normal">
                    {/* Ring timeline marker */}
                    <div className="absolute -left-[19.5px] top-1 w-2.5 h-2.5 rounded-full bg-white border border-foreground" />
                    
                    <span className="text-foreground font-semibold line-clamp-2">
                      {act.description}
                    </span>
                    <span className="text-[10px] text-secondary-text font-medium block mt-1 leading-none">
                      {act.date}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-secondary-text text-center py-4">
                No recent activity recorded.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* CREATE TASK MODAL */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Task"
        size="md"
      >
        <form onSubmit={handleCreateSubmit(handleCreateTask)} className="space-y-4 text-left">
          <Input
            label="Task Title"
            placeholder="e.g. Set up deployment pipeline"
            error={createErrors.title?.message}
            disabled={createTaskMutation.isPending}
            {...registerCreate("title")}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground tracking-tight select-none">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Provide context or instructions for this task..."
              disabled={createTaskMutation.isPending}
              className={`
                w-full px-3 py-2 text-sm bg-white border border-border-custom rounded-md 
                placeholder-secondary-text text-foreground outline-none transition
                focus:border-foreground focus:ring-1 focus:ring-foreground
                disabled:bg-secondary-bg disabled:text-secondary-text disabled:cursor-not-allowed
                ${createErrors.description?.message ? "border-foreground ring-1 ring-foreground" : ""}
              `}
              {...registerCreate("description")}
            />
            {createErrors.description?.message && (
              <span className="text-xs text-foreground font-medium mt-0.5 block">
                {createErrors.description.message}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div className="flex flex-col gap-1.5 select-none">
              <label className="text-xs font-semibold text-foreground tracking-tight">
                Category
              </label>
              <select
                disabled={createTaskMutation.isPending}
                className="
                  w-full px-3 py-2 text-sm bg-white border border-border-custom rounded-md 
                  text-foreground outline-none cursor-pointer transition uppercase font-semibold
                  focus:border-foreground focus:ring-1 focus:ring-foreground
                "
                {...registerCreate("category")}
              >
                <option value="personal">Personal</option>
                <option value="work">Work</option>
                <option value="study">Study</option>
                <option value="health">Health</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5 select-none">
              <label className="text-xs font-semibold text-foreground tracking-tight">
                Priority
              </label>
              <select
                disabled={createTaskMutation.isPending}
                className="
                  w-full px-3 py-2 text-sm bg-white border border-border-custom rounded-md 
                  text-foreground outline-none cursor-pointer transition uppercase font-semibold
                  focus:border-foreground focus:ring-1 focus:ring-foreground
                "
                {...registerCreate("priority")}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div className="flex flex-col gap-1.5 select-none">
              <label className="text-xs font-semibold text-foreground tracking-tight">
                Due Date
              </label>
              <input
                type="date"
                disabled={createTaskMutation.isPending}
                className="
                  w-full px-3 py-2 text-sm bg-white border border-border-custom rounded-md 
                  text-foreground outline-none cursor-pointer transition
                  focus:border-foreground focus:ring-1 focus:ring-foreground
                "
                {...registerCreate("dueDate")}
              />
            </div>

            <div className="flex flex-col gap-1.5 select-none">
              <label className="text-xs font-semibold text-foreground tracking-tight">
                Initial Status
              </label>
              <select
                disabled={createTaskMutation.isPending}
                className="
                  w-full px-3 py-2 text-sm bg-white border border-border-custom rounded-md 
                  text-foreground outline-none cursor-pointer transition uppercase font-semibold
                  focus:border-foreground focus:ring-1 focus:ring-foreground
                "
                {...registerCreate("status")}
              >
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 select-none">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCreateModalOpen(false)}
              type="button"
              disabled={createTaskMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              isLoading={createTaskMutation.isPending}
            >
              Create Task
            </Button>
          </div>
        </form>
      </Modal>

      {/* EDIT TASK MODAL */}
      <Modal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        title="Edit Task Details"
        size="md"
      >
        <form onSubmit={handleEditSubmit(handleUpdateTask)} className="space-y-4 text-left">
          <Input
            label="Task Title"
            placeholder="e.g. Set up deployment pipeline"
            error={editErrors.title?.message}
            disabled={updateTaskMutation.isPending}
            {...registerEdit("title")}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground tracking-tight select-none">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Provide context or instructions for this task..."
              disabled={updateTaskMutation.isPending}
              className={`
                w-full px-3 py-2 text-sm bg-white border border-border-custom rounded-md 
                placeholder-secondary-text text-foreground outline-none transition
                focus:border-foreground focus:ring-1 focus:ring-foreground
                disabled:bg-secondary-bg disabled:text-secondary-text disabled:cursor-not-allowed
                ${editErrors.description?.message ? "border-foreground ring-1 ring-foreground" : ""}
              `}
              {...registerEdit("description")}
            />
            {editErrors.description?.message && (
              <span className="text-xs text-foreground font-medium mt-0.5 block">
                {editErrors.description.message}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div className="flex flex-col gap-1.5 select-none">
              <label className="text-xs font-semibold text-foreground tracking-tight">
                Category
              </label>
              <select
                disabled={updateTaskMutation.isPending}
                className="
                  w-full px-3 py-2 text-sm bg-white border border-border-custom rounded-md 
                  text-foreground outline-none cursor-pointer transition uppercase font-semibold
                  focus:border-foreground focus:ring-1 focus:ring-foreground
                "
                {...registerEdit("category")}
              >
                <option value="personal">Personal</option>
                <option value="work">Work</option>
                <option value="study">Study</option>
                <option value="health">Health</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5 select-none">
              <label className="text-xs font-semibold text-foreground tracking-tight">
                Priority
              </label>
              <select
                disabled={updateTaskMutation.isPending}
                className="
                  w-full px-3 py-2 text-sm bg-white border border-border-custom rounded-md 
                  text-foreground outline-none cursor-pointer transition uppercase font-semibold
                  focus:border-foreground focus:ring-1 focus:ring-foreground
                "
                {...registerEdit("priority")}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div className="flex flex-col gap-1.5 select-none">
              <label className="text-xs font-semibold text-foreground tracking-tight">
                Due Date
              </label>
              <input
                type="date"
                disabled={updateTaskMutation.isPending}
                className="
                  w-full px-3 py-2 text-sm bg-white border border-border-custom rounded-md 
                  text-foreground outline-none cursor-pointer transition
                  focus:border-foreground focus:ring-1 focus:ring-foreground
                "
                {...registerEdit("dueDate")}
              />
            </div>

            <div className="flex flex-col gap-1.5 select-none">
              <label className="text-xs font-semibold text-foreground tracking-tight">
                Status
              </label>
              <select
                disabled={updateTaskMutation.isPending}
                className="
                  w-full px-3 py-2 text-sm bg-white border border-border-custom rounded-md 
                  text-foreground outline-none cursor-pointer transition uppercase font-semibold
                  focus:border-foreground focus:ring-1 focus:ring-foreground
                "
                {...registerEdit("status")}
              >
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 select-none">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditingTask(null)}
              type="button"
              disabled={updateTaskMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              isLoading={updateTaskMutation.isPending}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRMATION DIALOG */}
      <ConfirmDialog
        isOpen={!!deletingTaskId}
        onClose={() => setDeletingTaskId(null)}
        onConfirm={handleDeleteTask}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action is permanent and cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deleteTaskMutation.isPending}
      />
    </div>
  );
}
