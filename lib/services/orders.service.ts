/**
 * Orders Service
 * Handles all order-related API calls
 */

import { apiClient, PaginatedResponse } from "../api-client"

export interface OrderItem {
  id: string
  bookId: string
  bookTitle: string
  bookImage: string
  quantity: number
  price: number
  discount?: number
  subtotal: number
}

export interface Order {
  id: string
  userId: string
  orderNumber: string
  status: "pending" | "processing" | "confirmed" | "shipping" | "delivered" | "cancelled"
  channel: "online" | "store" | "phone"
  items: OrderItem[]
  subtotal: number
  shippingFee: number
  discount: number
  total: number
  paymentMethod: "cod" | "credit_card" | "momo" | "vnpay" | "bank_transfer"
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  shippingAddress: {
    fullName: string
    phoneNumber: string
    address: string
    city: string
    district: string
    ward: string
  }
  note?: string
  createdAt: string
  updatedAt: string
}

export interface CreateOrderRequest {
  items: {
    bookId: string
    quantity: number
  }[]
  shippingAddress: Order["shippingAddress"]
  paymentMethod: Order["paymentMethod"]
  note?: string
  promotionCode?: string
}

export interface UpdateOrderStatusRequest {
  status: Order["status"]
  note?: string
}

export interface OrderFilters {
  page?: number
  pageSize?: number
  status?: Order["status"]
  channel?: Order["channel"]
  paymentStatus?: Order["paymentStatus"]
  search?: string
  startDate?: string
  endDate?: string
  sortBy?: "createdAt" | "total"
  sortOrder?: "asc" | "desc"
}

export const ordersService = {
  /**
   * Get paginated list of orders with filters
   */
  async getOrders(filters?: OrderFilters): Promise<PaginatedResponse<Order>> {
    return apiClient.get<PaginatedResponse<Order>>("/orders", filters)
  },

  /**
   * Get a single order by ID
   */
  async getOrderById(id: string): Promise<Order> {
    return apiClient.get<Order>(`/orders/${id}`)
  },

  /**
   * Get current user's orders
   */
  async getMyOrders(filters?: Omit<OrderFilters, "search">): Promise<PaginatedResponse<Order>> {
    return apiClient.get<PaginatedResponse<Order>>("/orders/my-orders", filters)
  },

  /**
   * Create a new order
   */
  async createOrder(data: CreateOrderRequest): Promise<Order> {
    return apiClient.post<Order>("/orders", data)
  },

  /**
   * Update order status (Admin only)
   */
  async updateOrderStatus(id: string, data: UpdateOrderStatusRequest): Promise<Order> {
    return apiClient.patch<Order>(`/orders/${id}/status`, data)
  },

  /**
   * Cancel an order
   */
  async cancelOrder(id: string, reason?: string): Promise<Order> {
    return apiClient.patch<Order>(`/orders/${id}/cancel`, { reason })
  },

  /**
   * Get order statistics (Admin only)
   */
  async getOrderStats(startDate?: string, endDate?: string): Promise<{
    totalOrders: number
    totalRevenue: number
    pendingOrders: number
    completedOrders: number
    cancelledOrders: number
    averageOrderValue: number
  }> {
    return apiClient.get("/orders/stats", { startDate, endDate })
  },

  /**
   * Validate promotion code
   */
  async validatePromotion(code: string, total: number): Promise<{
    valid: boolean
    discount: number
    message?: string
  }> {
    return apiClient.post("/orders/validate-promotion", { code, total })
  },
}
