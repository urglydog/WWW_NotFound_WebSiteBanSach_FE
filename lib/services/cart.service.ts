/**
 * Cart Service
 * Handles all shopping cart-related API calls
 */

import { apiClient } from "../api-client"

export interface CartItem {
  id: string
  bookId: string
  bookTitle: string
  bookImage: string
  bookPrice: number
  bookDiscount?: number
  quantity: number
  subtotal: number
  inStock: boolean
  maxQuantity: number
}

export interface Cart {
  id: string
  userId: string
  items: CartItem[]
  itemsCount: number
  subtotal: number
  total: number
  updatedAt: string
}

export interface AddToCartRequest {
  bookId: string
  quantity: number
}

export interface UpdateCartItemRequest {
  quantity: number
}

export const cartService = {
  /**
   * Get current user's cart
   */
  async getCart(): Promise<Cart> {
    return apiClient.get<Cart>("/cart")
  },

  /**
   * Add item to cart
   */
  async addToCart(data: AddToCartRequest): Promise<Cart> {
    return apiClient.post<Cart>("/cart/items", data)
  },

  /**
   * Update cart item quantity
   */
  async updateCartItem(itemId: string, data: UpdateCartItemRequest): Promise<Cart> {
    return apiClient.put<Cart>(`/cart/items/${itemId}`, data)
  },

  /**
   * Remove item from cart
   */
  async removeCartItem(itemId: string): Promise<Cart> {
    return apiClient.delete<Cart>(`/cart/items/${itemId}`)
  },

  /**
   * Clear all items from cart
   */
  async clearCart(): Promise<void> {
    return apiClient.delete<void>("/cart")
  },

  /**
   * Sync cart with server (for guest to authenticated user conversion)
   */
  async syncCart(items: AddToCartRequest[]): Promise<Cart> {
    return apiClient.post<Cart>("/cart/sync", { items })
  },

  /**
   * Check cart items availability
   */
  async checkAvailability(): Promise<{
    available: boolean
    unavailableItems: string[]
    message?: string
  }> {
    return apiClient.get("/cart/check-availability")
  },
}
