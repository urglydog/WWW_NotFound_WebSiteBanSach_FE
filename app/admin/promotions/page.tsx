"use client"

import { useState } from "react"
import { usePromotionFilters } from "@/hooks/use-promotion-filters"
import { 
  PromotionsPageHeader,
  PromotionsStats,
  PromotionsFilterSection,
  PromotionsTable,
  PromotionFormModal
} from "@/components/admin"
import { toast } from "sonner"

// Mock data - Developer có thể thay thế bằng API call
const mockPromotions = [
  { 
    id: 1, 
    name: "Giảm 10% sách văn học", 
    code: "VANHOCDISCOUNT10", 
    discount: 10, 
    active: true,
    startDate: "2024-11-01",
    endDate: "2024-12-31",
    usageLimit: 100
  },
  { 
    id: 2, 
    name: "Giảm 20% đơn trên 500k", 
    code: "SALE20LARGE", 
    discount: 20, 
    active: true,
    startDate: "2024-11-15",
    endDate: "2024-11-30",
    usageLimit: 50
  },
]

export default function PromotionsPage() {
  const { 
    filteredPromotions, 
    filterState, 
    statusOptions, 
    stats,
    filterActions, 
    promotionActions 
  } = usePromotionFilters(mockPromotions)
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPromotion, setEditingPromotion] = useState<any>(null)

  // Handler functions - có thể assign cho từng developer khác nhau
  const handleAddPromotion = () => {
    // Developer A: Implement add promotion logic
    setEditingPromotion(null)
    setIsModalOpen(true)
  }

  const handleEditPromotion = (promotion: any) => {
    // Developer B: Implement edit promotion logic
    setEditingPromotion(promotion)
    setIsModalOpen(true)
  }

  const handleDeletePromotion = (id: number) => {
    // Developer C: Implement delete promotion logic
    promotionActions.deletePromotion(id)
    toast.success("Xóa khuyến mãi thành công!")
  }

  const handleTogglePromotion = (id: number) => {
    // Developer D: Implement toggle promotion logic
    promotionActions.togglePromotion(id)
    toast.success("Cập nhật trạng thái thành công!")
  }

  const handleSubmitForm = (promotion: any) => {
    // Developer E: Implement form submission logic
    if (editingPromotion) {
      promotionActions.updatePromotion(editingPromotion.id, promotion)
      toast.success("Cập nhật khuyến mãi thành công!")
    } else {
      promotionActions.addPromotion(promotion)
      toast.success("Thêm khuyến mãi thành công!")
    }
  }

  const handleExportData = () => {
    // Developer F: Implement export data logic
    console.log('Export promotions data')
  }

  const handleSettings = () => {
    // Developer G: Implement settings logic
    console.log('Open promotions settings')
  }

  const handleAdvancedFilter = () => {
    // Developer H: Implement advanced filter logic
    console.log('Open advanced filter')
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="space-y-6 sm:space-y-8 px-4 py-6 sm:p-6 lg:p-8">
        
        <PromotionsPageHeader 
          onAddPromotion={handleAddPromotion}
          onExportData={handleExportData}
          onSettings={handleSettings}
        />

        <PromotionsStats stats={stats} />

        <PromotionsFilterSection
          filterState={filterState}
          actions={filterActions}
          statusOptions={statusOptions}
          filteredCount={filteredPromotions.length}
          totalCount={mockPromotions.length}
          onAdvancedFilter={handleAdvancedFilter}
        />

        <PromotionsTable 
          promotions={filteredPromotions}
          onEdit={handleEditPromotion}
          onDelete={handleDeletePromotion}
          onToggle={handleTogglePromotion}
        />

        <PromotionFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmitForm}
          onUpdate={handleSubmitForm}
          editingPromotion={editingPromotion}
        />

      </div>
    </div>
  )
}
