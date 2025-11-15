import { Edit, Trash2, Play, Pause, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import type { Promotion } from "@/hooks/use-promotion-filters"

interface PromotionsTableProps {
  promotions: Promotion[]
  onEdit: (promotion: Promotion) => void
  onDelete: (id: number) => void
  onToggle: (id: number) => void
  className?: string
}

export function PromotionsTable({ 
  promotions, 
  onEdit, 
  onDelete, 
  onToggle,
  className 
}: PromotionsTableProps) {

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast.success("Đã copy mã khuyến mãi!")
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Không giới hạn"
    return new Date(dateString).toLocaleDateString("vi-VN")
  }

  return (
    <div className={cn("border border-border rounded-2xl overflow-hidden bg-card", className)}>
      <div className="px-6 py-4 border-b border-border/60 bg-muted/40">
        <h3 className="text-sm font-medium text-muted-foreground">
          Danh sách khuyến mãi ({promotions.length})
        </h3>
      </div>

      <ScrollArea className="h-[500px] xl:h-[600px]">
        <div className="w-full overflow-x-auto">
          <table className="min-w-[800px] w-full">
            <thead className="text-left text-sm text-muted-foreground bg-muted/20">
              <tr>
                <th className="px-4 sm:px-6 py-3 font-medium">ID</th>
                <th className="px-4 sm:px-6 py-3 font-medium">Thông tin</th>
                <th className="px-4 sm:px-6 py-3 font-medium">Mã khuyến mãi</th>
                <th className="px-4 sm:px-6 py-3 font-medium hidden md:table-cell">Thời gian</th>
                <th className="px-4 sm:px-6 py-3 font-medium">Giảm giá</th>
                <th className="px-4 sm:px-6 py-3 font-medium">Trạng thái</th>
                <th className="px-4 sm:px-6 py-3 font-medium text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {promotions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <p>Chưa có khuyến mãi nào</p>
                      <p className="text-sm">Thêm khuyến mãi đầu tiên để bắt đầu</p>
                    </div>
                  </td>
                </tr>
              ) : (
                promotions.map((promotion) => (
                  <tr key={promotion.id} className="border-t border-border/60 hover:bg-muted/40 transition">
                    <td className="px-4 sm:px-6 py-4">
                      <span className="font-mono text-sm text-muted-foreground">
                        #{promotion.id}
                      </span>
                    </td>
                    
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground text-sm">
                          {promotion.name}
                        </span>
                        {promotion.usageLimit && (
                          <span className="text-xs text-muted-foreground">
                            Giới hạn: {promotion.usageLimit} lần
                          </span>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-2">
                        <code className="px-2 py-1 bg-muted rounded text-xs font-mono">
                          {promotion.code}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyCode(promotion.code)}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                    
                    <td className="px-4 sm:px-6 py-4 text-sm text-muted-foreground hidden md:table-cell">
                      <div className="flex flex-col">
                        <span>Từ: {formatDate(promotion.startDate)}</span>
                        <span>Đến: {formatDate(promotion.endDate)}</span>
                      </div>
                    </td>
                    
                    <td className="px-4 sm:px-6 py-4">
                      <div className="text-center">
                        <span className="text-lg font-bold text-primary">
                          {promotion.discount}%
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-4 sm:px-6 py-4">
                      <Badge 
                        variant={promotion.active ? "default" : "secondary"}
                        className={promotion.active ? "bg-green-100 text-green-700 border-green-200" : "bg-gray-100 text-gray-700 border-gray-200"}
                      >
                        {promotion.active ? "Hoạt động" : "Tạm dừng"}
                      </Badge>
                    </td>
                    
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        {/* Toggle Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onToggle(promotion.id)}
                          className="h-8 w-8 p-0"
                          title={promotion.active ? "Tạm dừng" : "Kích hoạt"}
                        >
                          {promotion.active ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>

                        {/* Edit Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(promotion)}
                          className="h-8 w-8 p-0"
                          title="Chỉnh sửa"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        {/* Delete Button */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              title="Xóa"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                              <AlertDialogDescription>
                                Bạn có chắc chắn muốn xóa khuyến mãi "{promotion.name}"? 
                                Hành động này không thể hoàn tác.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => onDelete(promotion.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Xóa
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </ScrollArea>
    </div>
  )
}