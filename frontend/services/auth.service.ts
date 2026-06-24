import apiClient from "./axios";

export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const authService = {
  /**
   * Register a new user
   */
  async register(data: any): Promise<ApiResponse<{ user: User }>> {
    const response = await apiClient.post<ApiResponse<{ user: User }>>("/auth/register", data);
    return response.data;
  },

  /**
   * Login an existing user
   */
  async login(data: any): Promise<ApiResponse<{ user: User }>> {
    const response = await apiClient.post<ApiResponse<{ user: User }>>("/auth/login", data);
    return response.data;
  },

  /**
   * Logout user
   */
  async logout(): Promise<ApiResponse<null>> {
    const response = await apiClient.post<ApiResponse<null>>("/auth/logout");
    return response.data;
  },

  /**
   * Get current authenticated user details
   */
  async getMe(): Promise<ApiResponse<{ user: User }>> {
    const response = await apiClient.get<ApiResponse<{ user: User }>>("/auth/me");
    return response.data;
  },

  /**
   * Update name & email profile details
   */
  async updateProfile(data: { name: string; email: string }): Promise<ApiResponse<{ user: User }>> {
    const response = await apiClient.patch<ApiResponse<{ user: User }>>("/auth/profile", data);
    return response.data;
  },

  /**
   * Update user password
   */
  async updatePassword(data: any): Promise<ApiResponse<null>> {
    const response = await apiClient.patch<ApiResponse<null>>("/auth/password", data);
    return response.data;
  },

  /**
   * Delete user account
   */
  async deleteAccount(): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>("/auth/delete");
    return response.data;
  },
};
