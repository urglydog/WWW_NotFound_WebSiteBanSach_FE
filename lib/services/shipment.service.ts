/**
 * Shipment Service
 * Handles all shipment-related API calls (provinces, districts, wards)
 * Note: These endpoints don't require authentication
 */

import { apiClient } from "../api-client"

export interface Province {
  provinceId: number
  provinceName: string
  code: string | null
}

export interface District {
  districtId: number
  provinceId: number
  districtName: string
  supportType: number
}

export interface Ward {
  wardCode: string
  districtId: number
  wardName: string
  supportType: number
}

export interface CalculateShippingRequest {
  toDistrictId: number
  toWardCode: string
}

export interface CalculateShippingResponse {
  totalFee: number
  serviceFee: number
  insuranceFee: number
  estimatedDeliveryTime: string
  deliveryDays: number
}

export const shipmentService = {
  /**
   * Get all provinces
   */
  async getProvinces(): Promise<Province[]> {
    try {
      console.log("[Shipment Service] Getting provinces")
      const response = await apiClient.get<Province[]>("/shipment/customer/province")
      console.log("[Shipment Service] Provinces:", response)
      return response
    } catch (error) {
      console.error("[Shipment Service] Error getting provinces:", error)
      throw error
    }
  },

  /**
   * Get districts by province ID
   */
  async getDistricts(provinceId: number): Promise<District[]> {
    try {
      console.log("[Shipment Service] Getting districts for province:", provinceId)
      const response = await apiClient.get<District[]>(
        `/shipment/customer/district?provinceId=${provinceId}`
      )
      console.log("[Shipment Service] Districts:", response)
      return response
    } catch (error) {
      console.error("[Shipment Service] Error getting districts:", error)
      throw error
    }
  },

  /**
   * Get wards by district ID
   */
  async getWards(districtId: number): Promise<Ward[]> {
    try {
      console.log("[Shipment Service] Getting wards for district:", districtId)
      const response = await apiClient.get<Ward[]>(
        `/shipment/customer/ward?districtId=${districtId}`
      )
      console.log("[Shipment Service] Wards:", response)
      return response
    } catch (error) {
      console.error("[Shipment Service] Error getting wards:", error)
      throw error
    }
  },

  /**
   * Get full address name by IDs
   */
  async getFullAddress(
    provinceId: number,
    districtId: number,
    wardCode: string
  ): Promise<{
    province: string
    district: string
    ward: string
  }> {
    try {
      const [provinces, districts, wards] = await Promise.all([
        this.getProvinces(),
        this.getDistricts(provinceId),
        this.getWards(districtId),
      ])

      const province = provinces.find(p => p.provinceId === provinceId)
      const district = districts.find(d => d.districtId === districtId)
      const ward = wards.find(w => w.wardCode === wardCode)

      return {
        province: province?.provinceName || "",
        district: district?.districtName || "",
        ward: ward?.wardName || "",
      }
    } catch (error) {
      console.error("[Shipment Service] Error getting full address:", error)
      throw error
    }
  },

  /**
   * Calculate shipping fee
   */
  async calculateShippingFee(
    toDistrictId: number,
    toWardCode: string
  ): Promise<CalculateShippingResponse> {
    try {
      console.log("[Shipment Service] Calculating shipping fee for:", { toDistrictId, toWardCode })
      const response = await apiClient.post<CalculateShippingResponse>(
        "/shipment/customer/calculate",
        {
          toDistrictId,
          toWardCode,
        }
      )
      console.log("[Shipment Service] Shipping fee calculated:", response)
      return response
    } catch (error) {
      console.error("[Shipment Service] Error calculating shipping fee:", error)
      throw error
    }
  },
}
