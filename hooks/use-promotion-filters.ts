import { useMemo, useState } from "react"

export interface Promotion {
  id: number
  name: string
  code: string
  discount: number
  active: boolean
  startDate?: string
  endDate?: string
  usageLimit?: number
  usageCount?: number
}

export interface PromotionFilterState {
  searchTerm: string
  activeStatus: string
  discountRange: [number, number]
}

export interface PromotionFilterActions {
  setSearchTerm: (value: string) => void
  setActiveStatus: (value: string) => void
  setDiscountRange: (range: [number, number]) => void
  resetFilters: () => void
}

export interface PromotionActions {
  addPromotion: (promotion: Omit<Promotion, 'id'>) => void
  updatePromotion: (id: number, promotion: Partial<Promotion>) => void
  deletePromotion: (id: number) => void
  togglePromotion: (id: number) => void
}

export function usePromotionFilters(initialPromotions: Promotion[]) {
  // Promotions state
  const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions)

  // Filter state
  const [searchTerm, setSearchTerm] = useState("")
  const [activeStatus, setActiveStatus] = useState("Tất cả")
  const [discountRange, setDiscountRange] = useState<[number, number]>([0, 100])

  // Status options
  const statusOptions = useMemo(() => 
    ["Tất cả", "Đang hoạt động", "Tạm dừng"], []
  )

  // Filtered promotions
  const filteredPromotions = useMemo(() => {
    return promotions.filter((promotion) => {
      const matchesSearch =
        promotion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        promotion.code.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus =
        activeStatus === "Tất cả" ||
        (activeStatus === "Đang hoạt động" && promotion.active) ||
        (activeStatus === "Tạm dừng" && !promotion.active)
      
      const matchesDiscount = 
        promotion.discount >= discountRange[0] && 
        promotion.discount <= discountRange[1]

      return matchesSearch && matchesStatus && matchesDiscount
    })
  }, [searchTerm, activeStatus, discountRange, promotions])

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("")
    setActiveStatus("Tất cả")
    setDiscountRange([0, 100])
  }

  // Promotion actions
  const addPromotion = (promotion: Omit<Promotion, 'id'>) => {
    const newId = Math.max(...promotions.map(p => p.id), 0) + 1
    setPromotions([...promotions, { ...promotion, id: newId }])
  }

  const updatePromotion = (id: number, updatedPromotion: Partial<Promotion>) => {
    setPromotions(promotions.map(p => 
      p.id === id ? { ...p, ...updatedPromotion } : p
    ))
  }

  const deletePromotion = (id: number) => {
    setPromotions(promotions.filter(p => p.id !== id))
  }

  const togglePromotion = (id: number) => {
    setPromotions(promotions.map(p => 
      p.id === id ? { ...p, active: !p.active } : p
    ))
  }

  // Statistics
  const stats = useMemo(() => ({
    total: promotions.length,
    active: promotions.filter(p => p.active).length,
    inactive: promotions.filter(p => !p.active).length,
    averageDiscount: promotions.length > 0 
      ? Math.round(promotions.reduce((sum, p) => sum + p.discount, 0) / promotions.length)
      : 0
  }), [promotions])

  return {
    promotions,
    filterState: {
      searchTerm,
      activeStatus,
      discountRange,
    },
    filteredPromotions,
    statusOptions,
    stats,
    filterActions: {
      setSearchTerm,
      setActiveStatus,
      setDiscountRange,
      resetFilters,
    },
    promotionActions: {
      addPromotion,
      updatePromotion,
      deletePromotion,
      togglePromotion,
    },
  }
}