"use client";

import React from "react";
import { Activity } from "../../services/activity.service";
import { 
  PlusCircle, 
  Edit3, 
  CheckCircle, 
  AlertCircle, 
  Calendar, 
  MessageSquare, 
  Trash2, 
  Play, 
  CheckSquare, 
  XOctagon,
  Clock
} from "lucide-react";

interface ActivityTimelineProps {
  activities: Activity[];
}

export default function ActivityTimeline({ activities }: ActivityTimelineProps) {
  const getRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHrs = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHrs / 24);

    if (diffSecs < 60) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHrs < 24) return `${diffHrs}h ago`;
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
  };

  const groupActivitiesByDay = (list: Activity[]) => {
    const groups: { day: string; items: Activity[] }[] = [];
    
    list.forEach((act) => {
      const date = new Date(act.createdAt);
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      let dayLabel = "Older Activity";
      if (date.toDateString() === today.toDateString()) {
        dayLabel = "Today";
      } else if (date.toDateString() === yesterday.toDateString()) {
        dayLabel = "Yesterday";
      } else {
        dayLabel = date.toLocaleDateString(undefined, { 
          weekday: "long", 
          month: "short", 
          day: "numeric" 
        });
      }

      const existingGroup = groups.find((g) => g.day === dayLabel);
      if (existingGroup) {
        existingGroup.items.push(act);
      } else {
        groups.push({ day: dayLabel, items: [act] });
      }
    });

    return groups;
  };

  const getActivityConfig = (action: string) => {
    switch (action) {
      case "task_created":
        return {
          icon: PlusCircle,
          color: "text-foreground border-border-custom bg-secondary-bg",
          text: (act: Activity) => {
            const isRecurrence = act.metadata?.isRecurrence;
            const taskTitle = act.metadata?.title || act.taskId?.title || "Unnamed Task";
            return isRecurrence 
              ? `Auto-generated next recurrence: "${taskTitle}"` 
              : `Created task: "${taskTitle}"`;
          }
        };
      case "task_updated":
        return {
          icon: Edit3,
          color: "text-secondary-text border-border-custom bg-secondary-bg",
          text: (act: Activity) => `Updated task: "${act.metadata?.title || act.taskId?.title || "Task"}"`
        };
      case "status_changed":
        return {
          icon: CheckCircle,
          color: "text-foreground border-border-custom bg-secondary-bg",
          text: (act: Activity) => {
            const title = act.metadata?.title || act.taskId?.title || "Task";
            const newStatus = act.metadata?.newStatus || "done";
            return `Moved task "${title}" to status "${newStatus}"`;
          }
        };
      case "priority_changed":
        return {
          icon: AlertCircle,
          color: "text-foreground border-border-custom bg-secondary-bg",
          text: (act: Activity) => {
            const title = act.metadata?.title || act.taskId?.title || "Task";
            const priority = act.metadata?.newPriority || "medium";
            return `Set priority of "${title}" to "${priority}"`;
          }
        };
      case "due_date_changed":
        return {
          icon: Calendar,
          color: "text-secondary-text border-border-custom bg-secondary-bg",
          text: (act: Activity) => {
            const title = act.metadata?.title || act.taskId?.title || "Task";
            const due = act.metadata?.newDueDate ? new Date(act.metadata.newDueDate).toLocaleDateString() : "No Date";
            return `Set due date of "${title}" to ${due}`;
          }
        };
      case "log_added":
        return {
          icon: MessageSquare,
          color: "text-secondary-text border-border-custom bg-secondary-bg",
          text: (act: Activity) => `Added progress log to "${act.metadata?.title || act.taskId?.title || "Task"}"`
        };
      case "log_deleted":
        return {
          icon: Trash2,
          color: "text-secondary-text border-border-custom bg-secondary-bg",
          text: (act: Activity) => `Deleted progress log from "${act.metadata?.title || act.taskId?.title || "Task"}"`
        };
      case "task_deleted":
        return {
          icon: Trash2,
          color: "text-foreground border-border-custom bg-secondary-bg",
          text: (act: Activity) => `Deleted task: "${act.metadata?.title || "Task"}"`
        };
      case "subtask_created":
        return {
          icon: PlusCircle,
          color: "text-foreground border-border-custom bg-secondary-bg",
          text: (act: Activity) => `Created subtask: "${act.metadata?.subtaskTitle}" (Parent: "${act.metadata?.taskTitle || act.taskId?.title || "Task"}")`
        };
      case "subtask_completed":
        return {
          icon: CheckCircle,
          color: "text-foreground border-border-custom bg-secondary-bg",
          text: (act: Activity) => `Completed subtask: "${act.metadata?.subtaskTitle}" (Parent: "${act.metadata?.taskTitle || act.taskId?.title || "Task"}")`
        };
      case "subtask_reopened":
        return {
          icon: Clock,
          color: "text-secondary-text border-border-custom bg-secondary-bg",
          text: (act: Activity) => `Reopened subtask: "${act.metadata?.subtaskTitle}" (Parent: "${act.metadata?.taskTitle || act.taskId?.title || "Task"}")`
        };
      case "subtask_deleted":
        return {
          icon: Trash2,
          color: "text-secondary-text border-border-custom bg-secondary-bg",
          text: (act: Activity) => `Deleted subtask: "${act.metadata?.subtaskTitle}" (Parent: "${act.metadata?.taskTitle || act.taskId?.title || "Task"}")`
        };
      case "subtask_due_date_changed":
        return {
          icon: Calendar,
          color: "text-secondary-text border-border-custom bg-secondary-bg",
          text: (act: Activity) => `Updated subtask deadline: "${act.metadata?.subtaskTitle}" to ${act.metadata?.newDueDate ? new Date(act.metadata.newDueDate).toLocaleDateString() : "No Date"} (Parent: "${act.metadata?.taskTitle || act.taskId?.title || "Task"}")`
        };
      case "focus_started":
        return {
          icon: Play,
          color: "text-foreground border-border-custom bg-hover-custom",
          text: (act: Activity) => act.metadata?.subtaskTitle
            ? `Started focusing on subtask: "${act.metadata.subtaskTitle}" (Parent: "${act.metadata.taskTitle || "Task"}") (${act.metadata.duration}m)`
            : `Started focus session on "${act.metadata?.taskTitle || "Task"}" (${act.metadata?.duration}m)`
        };
      case "focus_completed":
        return {
          icon: CheckSquare,
          color: "text-foreground border-border-custom bg-secondary-bg",
          text: (act: Activity) => act.metadata?.subtaskTitle
            ? `Completed focus session on subtask: "${act.metadata.subtaskTitle}" (Parent: "${act.metadata.taskTitle || "Task"}") (${act.metadata.duration}m)`
            : `Completed focus session on "${act.metadata?.taskTitle || "Task"}" (${act.metadata?.duration}m)`
        };
      case "focus_cancelled":
        return {
          icon: XOctagon,
          color: "text-secondary-text border-border-custom bg-secondary-bg",
          text: (act: Activity) => act.metadata?.subtaskTitle
            ? `Cancelled focus session on subtask: "${act.metadata.subtaskTitle}" (Parent: "${act.metadata.taskTitle || "Task"}")`
            : `Cancelled focus session on "${act.metadata?.taskTitle || "Task"}"`
        };
      default:
        return {
          icon: Clock,
          color: "text-secondary-text border-border-custom bg-secondary-bg",
          text: (act: Activity) => `Logged activity: "${act.action}"`
        };
    }
  };

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-xs text-secondary-text font-bold uppercase tracking-wider select-none">
        No recent activities logged
      </div>
    );
  }

  const grouped = groupActivitiesByDay(activities);

  return (
    <div className="space-y-6">
      {grouped.map((group, idx) => (
        <div key={idx} className="space-y-4">
          {/* Day Label Header */}
          <span className="text-[9px] font-bold text-secondary-text uppercase tracking-wider block select-none">
            {group.day}
          </span>

          {/* Timeline Feed items */}
          <div className="relative border-l border-border-custom ml-2 pl-5 space-y-4">
            {group.items.map((act) => {
              const config = getActivityConfig(act.action);
              const Icon = config.icon;
              return (
                <div key={act._id} className="relative text-xs leading-relaxed text-foreground text-left">
                  {/* Timeline circular absolute icon marker */}
                  <div className={`absolute -left-[28.5px] top-[2px] w-4 h-4 rounded-full border flex items-center justify-center shadow-3xs ${config.color}`}>
                    <Icon className="w-2.5 h-2.5 shrink-0" />
                  </div>
                  
                  <div className="flex justify-between items-start gap-4">
                    <span className="font-semibold text-foreground leading-snug">
                      {config.text(act)}
                    </span>
                    <span className="text-[9px] text-secondary-text font-bold whitespace-nowrap shrink-0 select-none">
                      {getRelativeTime(act.createdAt)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
