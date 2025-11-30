/**
 * Promotions Service
 * Handles all promotion/discount-related API calls
 */

import { apiClient, PaginatedResponse } from "../api-client"

export interface Promotion {
  id: string
  code: string
  name: string
  description?: string
  type: "percentage" | "fixed_amount" | "free_shipping"
  value: number
  minOrderValue?: number
  maxDiscount?: number
  usageLimit?: number
  usageCount: number
  isActive: boolean
  startDate: string
  endDate: string
  applicableCategories?: string[]
  applicableBooks?: string[]
  createdAt: string
  updatedAt: string
}

export interface CreatePromotionRequest {
  code: string
  name: string
  description?: string
  type: Promotion["type"]
  value: number
  minOrderValue?: number
  maxDiscount?: number
  usageLimit?: number
  isActive?: boolean
  startDate: string
  endDate: string
  applicableCategories?: string[]
  applicableBooks?: string[]
}

export interface PromotionFilters {
  page?: number
  pageSize?: number
  search?: string
  type?: Promotion["type"]
  isActive?: boolean
  sortBy?: "createdAt" | "usageCount" | "endDate"
  sortOrder?: "asc" | "desc"
}

export const promotionsService = {
  /**
   * Get paginated list of promotions (Admin only)
   */
  async getPromotions(filters?: PromotionFilters): Promise<PaginatedResponse<Promotion>> {
    return apiClient.get<PaginatedResponse<Promotion>>("/promotions", filters)
  },

  /**
   * Get active promotions
   */
  async getActivePromotions(): Promise<Promotion[]> {
    return apiClient.get<Promotion[]>("/promotions/active")
  },

  /**
   * Get a single promotion by ID
   */
  async getPromotionById(id: string): Promise<Promotion> {
    return apiClient.get<Promotion>(`/promotions/${id}`)
  },

  /**
   * Validate a promotion code
   */
  async validatePromotion(code: string, orderTotal: number): Promise<{
    valid: boolean
    promotion?: Promotion
    discount: number
    message?: string
  }> {
    return apiClient.post("/promotions/validate", { code, orderTotal })
  },

  /**
   * Create a new promotion (Admin only)
   */
  async createPromotion(data: CreatePromotionRequest): Promise<Promotion> {
    return apiClient.post<Promotion>("/promotions", data)
  },

  /**
   * Update a promotion (Admin only)
   */
  async updatePromotion(id: string, data: Partial<CreatePromotionRequest>): Promise<Promotion> {
    return apiClient.put<Promotion>(`/promotions/${id}`, data)
  },

  /**
   * Delete a promotion (Admin only)
   */
  async deletePromotion(id: string): Promise<void> {
    return apiClient.delete<void>(`/promotions/${id}`)
  },

  /**
   * Toggle promotion status (Admin only)
   */
  async togglePromotionStatus(id: string): Promise<Promotion> {
    return apiClient.patch<Promotion>(`/promotions/${id}/toggle-status`, {})
  },

  /**
   * Get promotion statistics (Admin only)
   */
  async getPromotionStats(): Promise<{
    totalPromotions: number
    activePromotions: number
    totalUsage: number
    totalDiscount: number
  }> {
    return apiClient.get("/promotions/stats")
  },
}
