/**
 * Categories Service
 * Handles all category-related API calls
 */

import { apiClient } from "../api-client"

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  booksCount: number
  isActive: boolean
  order: number
  createdAt: string
  updatedAt: string
}

export interface CreateCategoryRequest {
  name: string
  slug: string
  description?: string
  image?: string
  isActive?: boolean
  order?: number
}

export const categoriesService = {
  /**
   * Get all categories
   */
  async getCategories(includeInactive: boolean = false): Promise<Category[]> {
    return apiClient.get<Category[]>("/categories", { includeInactive })
  },

  /**
   * Get popular categories
   */
  async getPopularCategories(limit: number = 6): Promise<Category[]> {
    return apiClient.get<Category[]>("/categories/popular", { limit })
  },

  /**
   * Get a single category by ID
   */
  async getCategoryById(id: string): Promise<Category> {
    return apiClient.get<Category>(`/categories/${id}`)
  },

  /**
   * Get a category by slug
   */
  async getCategoryBySlug(slug: string): Promise<Category> {
    return apiClient.get<Category>(`/categories/slug/${slug}`)
  },

  /**
   * Create a new category (Admin only)
   */
  async createCategory(data: CreateCategoryRequest): Promise<Category> {
    return apiClient.post<Category>("/categories", data)
  },

  /**
   * Update a category (Admin only)
   */
  async updateCategory(id: string, data: Partial<CreateCategoryRequest>): Promise<Category> {
    return apiClient.put<Category>(`/categories/${id}`, data)
  },

  /**
   * Delete a category (Admin only)
   */
  async deleteCategory(id: string): Promise<void> {
    return apiClient.delete<void>(`/categories/${id}`)
  },

  /**
   * Get category statistics (Admin only)
   */
  async getCategoryStats(): Promise<{
    totalCategories: number
    activeCategories: number
    topCategories: Array<{
      id: string
      name: string
      booksCount: number
      revenue: number
    }>
  }> {
    return apiClient.get("/categories/stats")
  },
}
