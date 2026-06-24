"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, User, Mail, ShieldAlert, Award } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { taskService } from "../../../services/task.service";
import { ProfileSkeleton } from "../../../components/shared/Loader";

export default function ProfilePage() {
  const { user } = useAuth();

  // Fetch tasks to get real count stats for this user
  const { data: response, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await taskService.getTasks();
      return res.data;
    },
  });

  const tasks = response || [];

  if (!user) return null;

  // Generate initials for large avatar
  const getInitials = (name: string) => {
    const names = name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "done").length;
  const inProgressTasks = tasks.filter((t) => t.status === "in-progress").length;

  const creationDate = new Date(user.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6 max-w-2xl mx-auto text-left selection:bg-neutral-100 selection:text-foreground">
      {/* Header */}
      <div className="border-b border-border-custom pb-4 select-none">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          My Profile
        </h2>
        <p className="text-xs text-secondary-text mt-0.5 leading-none">
          Overview of your account information and stats
        </p>
      </div>

      {isLoading ? (
        <ProfileSkeleton />
      ) : (
        <div className="space-y-6">
          {/* Avatar and Primary Details Card */}
          <div className="p-6 bg-white border border-border-custom rounded-xl flex flex-col sm:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-full border border-border-custom bg-secondary-bg flex items-center justify-center text-xl font-bold text-foreground select-none shrink-0">
              {getInitials(user.name)}
            </div>
            
            <div className="space-y-1.5 text-center sm:text-left min-w-0 flex-1">
              <h3 className="text-base font-bold text-foreground tracking-tight truncate">
                {user.name}
              </h3>
              <p className="text-xs text-secondary-text truncate flex items-center justify-center sm:justify-start gap-1.5 select-all">
                <Mail className="w-3.5 h-3.5 shrink-0 text-secondary-text" />
                <span>{user.email}</span>
              </p>
              <p className="text-xs text-secondary-text flex items-center justify-center sm:justify-start gap-1.5 select-none pt-0.5">
                <Calendar className="w-3.5 h-3.5 shrink-0 text-secondary-text" />
                <span>Member since {creationDate}</span>
              </p>
            </div>
          </div>

          {/* Account Overview Stats Grid */}
          <div className="grid grid-cols-3 gap-4 select-none">
            {[
              { label: "Total Tasks", value: totalTasks, icon: User, color: "text-foreground" },
              { label: "Completed", value: completedTasks, icon: Award, color: "text-foreground" },
              { label: "In Progress", value: inProgressTasks, icon: ShieldAlert, color: "text-foreground" },
            ].map((stat, idx) => (
              <div key={idx} className="p-4 bg-secondary-bg border border-border-custom rounded-lg text-center flex flex-col items-center gap-1.5">
                <span className="text-xs font-bold text-secondary-text uppercase tracking-wider">
                  {stat.label}
                </span>
                <span className="text-xl font-bold tracking-tight text-foreground">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>

          {/* Detailed metadata */}
          <div className="p-5 border border-border-custom rounded-lg space-y-4 bg-white select-none">
            <h4 className="text-xs font-bold text-foreground tracking-tight uppercase border-b border-border-custom pb-2">
              System Information
            </h4>
            
            <div className="space-y-3 text-xs leading-none">
              <div className="flex justify-between">
                <span className="text-secondary-text font-medium">User Identifier</span>
                <span className="text-foreground font-semibold select-all font-mono">{user._id}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
