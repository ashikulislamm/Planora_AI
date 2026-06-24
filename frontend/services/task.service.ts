import apiClient from "./axios";
import { ApiResponse } from "./auth.service";

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export const taskService = {
  /**
   * Fetch all tasks created by the logged-in user
   */
  async getTasks(): Promise<ApiResponse<Task[]>> {
    const response = await apiClient.get<ApiResponse<Task[]>>("/tasks");
    return response.data;
  },

  /**
   * Fetch details of a single task
   */
  async getTask(id: string): Promise<ApiResponse<Task>> {
    const response = await apiClient.get<ApiResponse<Task>>(`/tasks/${id}`);
    return response.data;
  },

  /**
   * Create a new task
   */
  async createTask(data: { title: string; description: string; status?: string }): Promise<ApiResponse<Task>> {
    const response = await apiClient.post<ApiResponse<Task>>("/tasks", data);
    return response.data;
  },

  /**
   * Update task details (title, description, status)
   */
  async updateTask(id: string, data: Partial<Omit<Task, "_id" | "userId" | "createdAt" | "updatedAt">>): Promise<ApiResponse<Task>> {
    const response = await apiClient.patch<ApiResponse<Task>>(`/tasks/${id}`, data);
    return response.data;
  },

  /**
   * Delete task
   */
  async deleteTask(id: string): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>(`/tasks/${id}`);
    return response.data;
  },
};
