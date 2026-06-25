"use client";

import React from "react";

export const Skeleton: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`animate-pulse bg-neutral-200 rounded ${className}`} />
  );
};

export const StatSkeleton: React.FC = () => {
  return (
    <div className="p-5 bg-white border border-border-custom rounded-lg flex flex-col gap-2">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-3.5 w-28" />
    </div>
  );
};

export const TaskItemSkeleton: React.FC = () => {
  return (
    <div className="p-4 bg-white border border-border-custom rounded-lg flex items-center justify-between">
      <div className="flex flex-col gap-2 w-2/3">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-64" />
      </div>
      <div className="flex items-center gap-3">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
    </div>
  );
};

export const TaskListSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-3">
      <TaskItemSkeleton />
      <TaskItemSkeleton />
      <TaskItemSkeleton />
    </div>
  );
};

export const ProfileSkeleton: React.FC = () => {
  return (
    <div className="p-6 bg-white border border-border-custom rounded-xl flex flex-col items-center gap-4 text-center">
      <Skeleton className="w-20 h-20 rounded-full" />
      <div className="flex flex-col items-center gap-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-3 w-44" />
      </div>
      <div className="w-full border-t border-border-custom pt-4 flex justify-around">
        <div className="flex flex-col items-center gap-1.5">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-6 w-8" />
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-6 w-8" />
        </div>
      </div>
    </div>
  );
};

export const DashboardPageSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-9 w-28" />
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatSkeleton />
        <StatSkeleton />
        <StatSkeleton />
        <StatSkeleton />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-24" />
            <div className="flex gap-1">
              <Skeleton className="h-8 w-12 rounded" />
              <Skeleton className="h-8 w-12 rounded" />
              <Skeleton className="h-8 w-12 rounded" />
            </div>
          </div>
          <TaskListSkeleton />
        </div>
        
        <div className="space-y-4">
          <Skeleton className="h-6 w-28" />
          <div className="p-4 border border-border-custom rounded-lg space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <Skeleton className="h-2 w-full rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};
export const SubtaskSkeleton: React.FC = () => {
  return (
    <div className="flex items-center gap-2 p-2">
      <Skeleton className="h-3 w-4" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
};
