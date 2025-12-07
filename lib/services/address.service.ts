/**
 * Address Service
 * Handles all user address-related API calls
 */

import { apiClient } from "../api-client"

export interface Address {
  id: string
  recipientName: string
  phoneNumber: string
  street: string
  ward: string
  district: string
  province: string
  latitude: number
  longitude: number
  provinceId: number
  districtId: number
  wardCode: string
}

export interface CreateAddressRequest {
  recipientName: string
  phoneNumber: string
  street: string
  ward: string
  district: string
  province: string
  latitude: string
  longitude: string
  provinceId: number
  districtId: number
  wardCode: string
}

export interface UpdateAddressRequest {
  recipientName: string
  phoneNumber: string
  street: string
  ward: string
  district: string
  province: string
  latitude: string
  longitude: string
  provinceId: number
  districtId: number
  wardCode: string
}

export const addressService = {
  /**
   * Get all user addresses
   */
  async getUserAddresses(): Promise<Address[]> {
    try {
      const response = await apiClient.get<Address[]>("/addresses/user")
      console.log("[Address Service] Get user addresses:", response)
      return response
    } catch (error) {
      console.error("[Address Service] Error getting addresses:", error)
      throw error
    }
  },

  /**
   * Create a new address
   */
  async createAddress(data: CreateAddressRequest): Promise<Address> {
    try {
      console.log("[Address Service] Creating address:", data)
      const response = await apiClient.post<Address>("/addresses", data)
      console.log("[Address Service] Address created:", response)
      return response
    } catch (error) {
      console.error("[Address Service] Error creating address:", error)
      throw error
    }
  },

  /**
   * Update an existing address
   */
  async updateAddress(addressId: string, data: UpdateAddressRequest): Promise<Address> {
    try {
      console.log("[Address Service] Updating address:", addressId, data)
      const response = await apiClient.put<Address>(`/addresses/${addressId}`, data)
      console.log("[Address Service] Address updated:", response)
      return response
    } catch (error) {
      console.error("[Address Service] Error updating address:", error)
      throw error
    }
  },

  /**
   * Delete an address
   */
  async deleteAddress(addressId: string): Promise<void> {
    try {
      console.log("[Address Service] Deleting address:", addressId)
      await apiClient.delete<void>(`/addresses/${addressId}`)
      console.log("[Address Service] Address deleted successfully")
    } catch (error) {
      console.error("[Address Service] Error deleting address:", error)
      throw error
    }
  },

  /**
   * Get a single address by ID
   */
  async getAddressById(addressId: string): Promise<Address> {
    try {
      const addresses = await this.getUserAddresses()
      const address = addresses.find(addr => addr.id === addressId)
      if (!address) {
        throw new Error("Address not found")
      }
      return address
    } catch (error) {
      console.error("[Address Service] Error getting address by ID:", error)
      throw error
    }
  },
}
