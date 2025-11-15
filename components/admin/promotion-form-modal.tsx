import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import type { Promotion } from "@/hooks/use-promotion-filters"

interface PromotionFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (promotion: Omit<Promotion, 'id'>) => void
  onUpdate?: (promotion: Partial<Promotion>) => void
  editingPromotion?: Promotion | null
}

export function PromotionFormModal({
  isOpen,
  onClose,
  onSubmit,
  onUpdate,
  editingPromotion
}: PromotionFormModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    discount: 10,
    active: true,
    startDate: "",
    endDate: "",
    usageLimit: 0,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Reset form when modal opens/closes or editing changes
  useEffect(() => {
    if (isOpen) {
      if (editingPromotion) {
        setFormData({
          name: editingPromotion.name,
          code: editingPromotion.code,
          discount: editingPromotion.discount,
          active: editingPromotion.active,
          startDate: editingPromotion.startDate || "",
          endDate: editingPromotion.endDate || "",
          usageLimit: editingPromotion.usageLimit || 0,
        })
      } else {
        setFormData({
          name: "",
          code: "",
          discount: 10,
          active: true,
          startDate: "",
          endDate: "",
          usageLimit: 0,
        })
      }
      setErrors({})
    }
  }, [isOpen, editingPromotion])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Tên khuyến mãi là bắt buộc"
    }

    if (!formData.code.trim()) {
      newErrors.code = "Mã khuyến mãi là bắt buộc"
    } else if (formData.code.length < 3) {
      newErrors.code = "Mã khuyến mãi phải có ít nhất 3 ký tự"
    }

    if (formData.discount < 1 || formData.discount > 100) {
      newErrors.discount = "Giảm giá phải từ 1% đến 100%"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    if (editingPromotion && onUpdate) {
      onUpdate(formData)
    } else {
      onSubmit(formData)
    }
    
    onClose()
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingPromotion ? "Chỉnh sửa khuyến mãi" : "Thêm khuyến mãi mới"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Tên khuyến mãi */}
          <div className="space-y-2">
            <Label htmlFor="name">Tên khuyến mãi *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="VD: Giảm 20% cho đơn hàng đầu tiên"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Mã khuyến mãi */}
          <div className="space-y-2">
            <Label htmlFor="code">Mã khuyến mãi *</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => handleInputChange("code", e.target.value.toUpperCase())}
              placeholder="VD: WELCOME20"
              className={errors.code ? "border-red-500" : ""}
            />
            {errors.code && (
              <p className="text-sm text-red-500">{errors.code}</p>
            )}
          </div>

          {/* Giảm giá */}
          <div className="space-y-3">
            <Label>Giảm giá: {formData.discount}%</Label>
            <Slider
              value={[formData.discount]}
              onValueChange={(value) => handleInputChange("discount", value[0])}
              max={100}
              min={1}
              step={1}
              className="w-full"
            />
            {errors.discount && (
              <p className="text-sm text-red-500">{errors.discount}</p>
            )}
          </div>

          {/* Giới hạn sử dụng */}
          <div className="space-y-2">
            <Label htmlFor="usageLimit">Giới hạn sử dụng (0 = không giới hạn)</Label>
            <Input
              id="usageLimit"
              type="number"
              min="0"
              value={formData.usageLimit}
              onChange={(e) => handleInputChange("usageLimit", parseInt(e.target.value) || 0)}
            />
          </div>

          {/* Ngày bắt đầu và kết thúc */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Ngày bắt đầu</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Ngày kết thúc</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
              />
            </div>
          </div>

          {/* Trạng thái */}
          <div className="flex items-center justify-between">
            <Label htmlFor="active">Kích hoạt khuyến mãi</Label>
            <Switch
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) => handleInputChange("active", checked)}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSubmit}>
            {editingPromotion ? "Cập nhật" : "Thêm mới"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}