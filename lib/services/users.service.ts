/**
 * Users Service
 * Handles all user-related API calls
 */


import { apiClient, PaginatedResponse } from "../api-client";
import { Address } from "./address.service";

export interface User {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  phoneNumber?: string;
  avatar?: string;
  role: "user" | "admin";
  status: "active" | "inactive" | "banned";
  emailVerified?: boolean;
  addresses?: Address[];
  totalOrders?: number;
  totalSpent?: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  phoneNumber?: string;
  avatar?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UserFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: User["role"];
  status?: User["status"];
  sortBy?: "createdAt" | "totalOrders" | "totalSpent";
  sortOrder?: "asc" | "desc";
}

export const usersService = {
  /**
   * Get paginated list of users (Admin only)
   */
  async getUsers(filters?: UserFilters): Promise<PaginatedResponse<User>> {
    return apiClient.get<PaginatedResponse<User>>("/users", filters);
  },

  /**
   * Get a single user by ID (Admin only)
   */
  async getUserById(id: string): Promise<User> {
    return apiClient.get<User>(`/users/${id}`);
  },

  /**
   * Get current user profile
   */
  async getMyProfile(): Promise<User> {
    return apiClient.get<User>("/users/me");
  },

  /**
   * Update current user profile
   */
  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    return apiClient.put<User>("/users/me", data);
  },

  /**
   * Change password
   */
  async changePassword(
    data: ChangePasswordRequest
  ): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>("/users/change-password", data);
  },

  /**
   * Upload avatar
   */
  async uploadAvatar(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append("avatar", file);
    return apiClient.upload<{ url: string }>("/users/upload-avatar", formData);
  },

  /**
   * Update user status (Admin only)
   */
  async updateUserStatus(id: string, status: User["status"]): Promise<User> {
    return apiClient.patch<User>(`/users/${id}/status`, { status });
  },

  /**
   * Update user role (Admin only)
   */
  async updateUserRole(id: string, role: User["role"]): Promise<User> {
    return apiClient.patch<User>(`/users/${id}/role`, { role });
  },

  /**
   * Get user statistics (Admin only)
   */
  async getUserStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    newUsersThisMonth: number;
    topSpenders: User[];
  }> {
    return apiClient.get("/users/stats");
  },
};
