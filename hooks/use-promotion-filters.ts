import { useMemo, useState, useEffect } from "react"
import { promotionsService, type Promotion } from "@/lib/services/promotions.service"
import { toast } from "sonner"

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

export function usePromotionFilters() {
  // Promotions state
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 0,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  })

  // Fetch promotions from API
  useEffect(() => {
    loadPromotions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only load once on mount

  const loadPromotions = async (page: number = 0, size: number = 10) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await promotionsService.getPromotions({
        page: page,
        size: size,
      })
      setPromotions(response.data)
      setPagination({
        page: response.page,
        pageSize: response.pageSize,
        totalItems: response.totalItems,
        totalPages: response.totalPages,
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Không thể tải danh sách khuyến mãi"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const changePage = (newPage: number) => {
    loadPromotions(newPage, pagination.pageSize)
  }

  const changePageSize = (newSize: number) => {
    loadPromotions(0, newSize)
  }

  // Filter state
  const [searchTerm, setSearchTerm] = useState("")
  const [activeStatus, setActiveStatus] = useState("Tất cả")
  const [discountRange, setDiscountRange] = useState<[number, number]>([0, 100])
  
  // Sort state
  const [sortBy, setSortBy] = useState<"code" | "startDate" | "discount" | null>(null)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  
  // Client-side pagination state (for filtered results)
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 5

  // Status options
  const statusOptions = useMemo(() => 
    ["Tất cả", "Đang hoạt động", "Tạm dừng", "Đã hết hạn"], []
  )

  // Filtered and sorted promotions
  const filteredPromotions = useMemo(() => {
    let filtered = promotions.filter((promotion) => {
      const matchesSearch =
        promotion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        promotion.code.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus =
        activeStatus === "Tất cả" ||
        (activeStatus === "Đang hoạt động" && promotion.status === "ACTIVE") ||
        (activeStatus === "Tạm dừng" && promotion.status === "INACTIVE") ||
        (activeStatus === "Đã hết hạn" && promotion.status === "EXPIRED")
      
      const matchesDiscount = 
        promotion.discount >= discountRange[0] && 
        promotion.discount <= discountRange[1]

      return matchesSearch && matchesStatus && matchesDiscount
    })
    
    // Apply sorting
    if (sortBy) {
      filtered = [...filtered].sort((a, b) => {
        let comparison = 0
        switch (sortBy) {
          case "code":
            comparison = a.code.localeCompare(b.code)
            break
          case "startDate":
            comparison = new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
            break
          case "discount":
            comparison = a.discount - b.discount
            break
        }
        return sortOrder === "asc" ? comparison : -comparison
      })
    }
    
    return filtered
  }, [searchTerm, activeStatus, discountRange, promotions, sortBy, sortOrder])
  
  // Paginated promotions
  const paginatedPromotions = useMemo(() => {
    const startIndex = currentPage * itemsPerPage
    return filteredPromotions.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredPromotions, currentPage, itemsPerPage])
  
  const totalPages = Math.ceil(filteredPromotions.length / itemsPerPage)

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("")
    setActiveStatus("Tất cả")
    setDiscountRange([0, 100])
    setSortBy(null)
    setSortOrder("asc")
    setCurrentPage(0)
  }
  
  // Handle sort
  const handleSort = (column: "code" | "startDate" | "discount") => {
    if (sortBy === column) {
      // Toggle sort order if clicking same column
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      // Set new sort column
      setSortBy(column)
      setSortOrder("asc")
    }
    setCurrentPage(0) // Reset to first page when sorting
  }

  // Promotion actions
  const addPromotion = async (promotion: Omit<Promotion, "id" | "status" | "usageCount">) => {
    try {
      const newPromotion = await promotionsService.createPromotion({
        code: promotion.code,
        name: promotion.name,
        description: promotion.description,
        discountPercent: promotion.discount,
        startDate: promotion.startDate,
        endDate: promotion.endDate,
        usageLimit: promotion.usageLimit,
        applicableBookIds: promotion.applicableBookIds,
      })
      toast.success("Thêm khuyến mãi thành công!")
      await loadPromotions()
      return newPromotion
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Không thể thêm khuyến mãi"
      toast.error(errorMessage)
      throw err
    }
  }

  const updatePromotion = async (id: string, updatedPromotion: Partial<Promotion>) => {
    try {
      const updateData: any = {}
      if (updatedPromotion.name) updateData.name = updatedPromotion.name
      if (updatedPromotion.code) updateData.code = updatedPromotion.code
      if (updatedPromotion.description !== undefined) updateData.description = updatedPromotion.description
      if (updatedPromotion.discount !== undefined) updateData.discountPercent = updatedPromotion.discount
      if (updatedPromotion.startDate) updateData.startDate = updatedPromotion.startDate
      if (updatedPromotion.endDate) updateData.endDate = updatedPromotion.endDate
      if (updatedPromotion.usageLimit !== undefined) updateData.usageLimit = updatedPromotion.usageLimit
      if (updatedPromotion.applicableBookIds) updateData.applicableBookIds = updatedPromotion.applicableBookIds

      await promotionsService.updatePromotion(id, updateData)
      toast.success("Cập nhật khuyến mãi thành công!")
      await loadPromotions()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Không thể cập nhật khuyến mãi"
      toast.error(errorMessage)
      throw err
    }
  }

  const deletePromotion = async (id: string) => {
    try {
      await promotionsService.deletePromotion(id)
      toast.success("Xóa khuyến mãi thành công!")
      await loadPromotions()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Không thể xóa khuyến mãi"
      toast.error(errorMessage)
      throw err
    }
  }

  const togglePromotion = async (id: string, currentStatus: "ACTIVE" | "INACTIVE" | "EXPIRED", isUpcoming?: boolean) => {
    try {
      // Không cho phép toggle nếu đã EXPIRED
      if (currentStatus === "EXPIRED") {
        toast.error("Không thể thay đổi trạng thái khuyến mãi đã hết hạn")
        return
      }
      
      // Không cho phép toggle nếu chưa đến ngày có hiệu lực
      if (isUpcoming) {
        toast.error("Khuyến mãi chưa đến ngày có hiệu lực. Vui lòng chờ hoặc chỉnh sửa ngày áp dụng trong phần chỉnh sửa.")
        return
      }
      
      const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE"
      await promotionsService.updatePromotionStatus(id, newStatus)
      toast.success("Cập nhật trạng thái thành công!")
      await loadPromotions()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Không thể cập nhật trạng thái"
      toast.error(errorMessage)
      throw err
    }
  }

  // Statistics
  const stats = useMemo(() => ({
    total: promotions.length,
    active: promotions.filter(p => p.status === "ACTIVE").length,
    inactive: promotions.filter(p => p.status === "INACTIVE").length,
    expired: promotions.filter(p => p.status === "EXPIRED").length,
    averageDiscount: promotions.length > 0 
      ? Math.round(promotions.reduce((sum, p) => sum + p.discount, 0) / promotions.length)
      : 0
  }), [promotions])

  return {
    promotions,
    filteredPromotions: paginatedPromotions, // Return paginated results
    allFilteredPromotions: filteredPromotions, // All filtered results for count
    filterState: {
      searchTerm,
      activeStatus,
      discountRange,
    },
    sortState: {
      sortBy,
      sortOrder,
    },
    paginationState: {
      currentPage,
      itemsPerPage,
      totalPages,
      totalItems: filteredPromotions.length,
    },
    statusOptions,
    stats,
    isLoading,
    error,
    pagination,
    filterActions: {
      setSearchTerm,
      setActiveStatus,
      setDiscountRange,
      resetFilters,
    },
    sortActions: {
      handleSort,
    },
    paginationActions: {
      setCurrentPage,
      goToPage: (page: number) => setCurrentPage(Math.max(0, Math.min(page, totalPages - 1))),
      nextPage: () => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1)),
      prevPage: () => setCurrentPage(prev => Math.max(prev - 1, 0)),
    },
    promotionActions: {
      addPromotion,
      updatePromotion,
      deletePromotion,
      togglePromotion,
    },
    refreshPromotions: () => loadPromotions(pagination.page, pagination.pageSize),
    changePage,
    changePageSize,
  }
}