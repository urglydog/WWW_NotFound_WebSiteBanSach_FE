import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { Order } from "@/hooks/use-order-filters"

interface OrdersTableProps {
  orders: Order[]
  onOrderClick?: (orderId: string) => void
  className?: string
}

const statusBadgeStyles: Record<string, string> = {
  "Đang xử lý": "bg-yellow-100 text-yellow-700 border-yellow-200",
  "Đang giao": "bg-blue-100 text-blue-700 border-blue-200",
  "Đã giao": "bg-green-100 text-green-700 border-green-200",
  "Đã hủy": "bg-red-100 text-red-700 border-red-200",
}

export function OrdersTable({ 
  orders, 
  onOrderClick,
  className 
}: OrdersTableProps) {
  const handleOrderClick = (orderId: string) => {
    onOrderClick?.(orderId)
  }

  return (
    <div className={cn("border border-border rounded-2xl overflow-hidden", className)}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 bg-muted/40">
        <p className="text-sm text-muted-foreground">Danh sách đơn hàng gần đây</p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              Xem theo
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Theo ngày tạo</DropdownMenuItem>
            <DropdownMenuItem>Theo giá trị đơn</DropdownMenuItem>
            <DropdownMenuItem>Theo trạng thái</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ScrollArea className="h-[420px] sm:h-[500px] xl:h-[560px]">
        <div className="w-full overflow-x-auto">
          <table className="min-w-[720px] w-full">
            <thead className="text-left text-sm text-muted-foreground bg-muted/20">
              <tr>
                <th className="px-4 sm:px-6 py-3 font-medium">Mã đơn</th>
                <th className="px-4 sm:px-6 py-3 font-medium">Khách hàng</th>
                <th className="px-4 sm:px-6 py-3 font-medium hidden sm:table-cell">Liên hệ</th>
                <th className="px-4 sm:px-6 py-3 font-medium">Giá trị</th>
                <th className="px-4 sm:px-6 py-3 font-medium hidden md:table-cell">Ngày</th>
                <th className="px-4 sm:px-6 py-3 font-medium">Trạng thái</th>
                <th className="px-4 sm:px-6 py-3 font-medium text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-border/60 hover:bg-muted/40 transition">
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-primary text-sm">{order.id}</span>
                      <span className="text-xs text-muted-foreground truncate max-w-[120px] sm:max-w-none">
                        {order.address}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <p className="font-medium text-foreground text-sm">{order.customer}</p>
                    <p className="text-xs text-muted-foreground">{order.payment}</p>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-sm text-muted-foreground hidden sm:table-cell">
                    <p className="truncate max-w-[150px]">{order.email}</p>
                    <p>{order.phone}</p>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-sm font-semibold text-foreground">
                    <div className="flex flex-col">
                      <span>{order.total.toLocaleString("vi-VN")}₫</span>
                      <span className="text-xs text-muted-foreground">{order.items} sản phẩm</span>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-sm text-muted-foreground hidden md:table-cell">
                    {order.date}
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <Badge 
                      variant="secondary" 
                      className={`${statusBadgeStyles[order.status] ?? ""} border text-xs`}
                    >
                      {order.status}
                    </Badge>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleOrderClick(order.id)}
                      className="text-xs"
                    >
                      <span className="hidden sm:inline">Xem chi tiết</span>
                      <span className="inline sm:hidden">Chi tiết</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ScrollArea>
    </div>
  )
}