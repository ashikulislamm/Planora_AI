import apiClient from "./axios";

export interface TaskPreviewDTO {
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "todo" | "in-progress" | "done";
  category: "work" | "personal" | "study" | "health";
  dueDate: string | null;
  dueTime: string | null;
  estimatedDuration: number | null;
  confidence: number;
  editable: boolean;
}

export interface ProjectPreviewSubtask {
  title: string;
  description?: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "todo" | "in-progress" | "done";
  dueDate: string | null;
  dueTime?: string | null;
  estimatedDuration: number | null;
  order: number;
  dependsOn: string[];
}

export interface ProjectPreviewDTO {
  parentTask: {
    title: string;
    description: string;
    priority: "low" | "medium" | "high" | "critical";
    category: "work" | "personal" | "study" | "health";
    status: "todo" | "in-progress" | "done";
    dueDate: string | null;
    estimatedDuration: number;
  };
  subtasks: ProjectPreviewSubtask[];
  summary: {
    totalSubtasks: number;
    estimatedHours: number;
    estimatedDays: number;
  };
}

/**
 * Generate a structured task preview from natural language input
 */
export const generateTaskPreview = async (message: string): Promise<TaskPreviewDTO> => {
  // Capture local browser timezone
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const response = await apiClient.post("/ai/copilot/task-preview", {
    message,
    timezone,
  });
  return response.data.data;
};

/**
 * Commit the user-approved (and possibly edited) task details to the database
 */
export const createTaskFromPreview = async (taskData: Partial<TaskPreviewDTO>): Promise<any> => {
  const response = await apiClient.post("/ai/copilot/task-create", taskData);
  return response.data.data;
};

/**
 * Generate project breakdown preview from natural language request
 */
export const generateProjectPreview = async (message: string): Promise<ProjectPreviewDTO> => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const response = await apiClient.post("/ai/copilot/project-preview", {
    message,
    timezone,
  });
  return response.data.data;
};

/**
 * Commit approved project plan (parent task and all subtasks) atomically to database
 */
export const createProjectFromPreview = async (projectData: Partial<ProjectPreviewDTO>): Promise<any> => {
  const response = await apiClient.post("/ai/copilot/project-create", projectData);
  return response.data.data;
};
