/**
 * Books Service
 * Handles all book-related API calls
 */

import { apiClient, PaginatedResponse } from "../api-client"

export interface Book {
  id: string
  title: string
  author: string
  category: string
  categoryId: string
  price: number
  discount?: number
  description?: string
  publisher?: string
  publishDate?: string
  pages?: number
  language?: string
  isbn?: string
  inStock: boolean
  stockQuantity: number
  image: string
  images?: string[]
  reviews: number
  rating?: number
  sold?: number
  createdAt?: string
  updatedAt?: string
}

export interface CreateBookRequest {
  title: string
  author: string
  categoryId: string
  price: number
  discount?: number
  description?: string
  publisher?: string
  publishDate?: string
  pages?: number
  language?: string
  isbn?: string
  stockQuantity: number
  image: string
  images?: string[]
}

export interface UpdateBookRequest extends Partial<CreateBookRequest> {
  id: string
}

export interface BookFilters {
  page?: number
  pageSize?: number
  search?: string
  category?: string
  author?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  sortBy?: "title" | "price" | "createdAt" | "sold" | "rating"
  sortOrder?: "asc" | "desc"
}

export const booksService = {
  /**
   * Get paginated list of books with filters
   */
  async getBooks(filters?: BookFilters): Promise<PaginatedResponse<Book>> {
    return apiClient.get<PaginatedResponse<Book>>("/books", filters)
  },

  /**
   * Get a single book by ID
   */
  async getBookById(id: string): Promise<Book> {
    return apiClient.get<Book>(`/books/${id}`)
  },

  /**
   * Create a new book (Admin only)
   */
  async createBook(data: CreateBookRequest): Promise<Book> {
    return apiClient.post<Book>("/books", data)
  },

  /**
   * Update an existing book (Admin only)
   */
  async updateBook(id: string, data: Partial<CreateBookRequest>): Promise<Book> {
    return apiClient.put<Book>(`/books/${id}`, data)
  },

  /**
   * Delete a book (Admin only)
   */
  async deleteBook(id: string): Promise<void> {
    return apiClient.delete<void>(`/books/${id}`)
  },

  /**
   * Get featured/recommended books
   */
  async getFeaturedBooks(limit: number = 10): Promise<Book[]> {
    return apiClient.get<Book[]>("/books/featured", { limit })
  },

  /**
   * Get best-selling books
   */
  async getBestSellers(limit: number = 10): Promise<Book[]> {
    return apiClient.get<Book[]>("/books/best-sellers", { limit })
  },

  /**
   * Get new arrivals
   */
  async getNewArrivals(limit: number = 10): Promise<Book[]> {
    return apiClient.get<Book[]>("/books/new-arrivals", { limit })
  },

  /**
   * Search books by keyword
   */
  async searchBooks(keyword: string, filters?: Omit<BookFilters, "search">): Promise<PaginatedResponse<Book>> {
    return apiClient.get<PaginatedResponse<Book>>("/books/search", { search: keyword, ...filters })
  },

  /**
   * Upload book cover image
   */
  async uploadImage(file: File): Promise<{ url: string }> {
    const formData = new FormData()
    formData.append("image", file)
    return apiClient.upload<{ url: string }>("/books/upload-image", formData)
  },

  /**
   * Update book stock quantity (Admin only)
   */
  async updateStock(id: string, quantity: number): Promise<Book> {
    return apiClient.patch<Book>(`/books/${id}/stock`, { quantity })
  },
}
