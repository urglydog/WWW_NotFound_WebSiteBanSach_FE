"use client"

import { useAuth } from "@/lib/auth-context"
import { ordersService, OrderResponse, OrderStatus } from "@/lib/services/orders.service"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Package, ChevronRight, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function OrdersPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<OrderResponse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
      return
    }

    if (user) {
      fetchOrders()
    }
  }, [user, authLoading, router])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const data = await ordersService.getMyOrders()
      setOrders(data)
    } catch (error) {
      console.error("Failed to fetch orders:", error)
      toast.error("Không thể tải danh sách đơn hàng")
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    )
  }

  if (!user) return null

  const statusConfig: Record<string, { label: string; color: string }> = {
    PENDING: { label: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-700" },
    CONFIRMED: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-700" },
    PROCESSING: { label: "Đang chuẩn bị", color: "bg-blue-100 text-blue-700" },
    SHIPPED: { label: "Đang giao", color: "bg-purple-100 text-purple-700" },
    DELIVERED: { label: "Đã giao", color: "bg-green-100 text-green-700" },
    CANCELLED: { label: "Đã hủy", color: "bg-red-100 text-red-700" },
    COMPLETED: { label: "Hoàn thành", color: "bg-green-100 text-green-700" },
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Đơn hàng của tôi</h1>
            <p className="text-muted-foreground">Theo dõi trạng thái đơn hàng của bạn</p>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <Package size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground mb-4">Chưa có đơn hàng nào</p>
              <Link href="/products">
                <Button>Mua sắm ngay</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const config = statusConfig[order.status] || { label: order.status, color: "bg-gray-100 text-gray-700" }
                return (
                  <Link key={order.id} href={`/account/orders/${order.id}`}>
                    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition cursor-pointer">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-lg text-foreground">Đơn hàng #{order.orderCode || order.id.substring(0, 8)}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.orderDate).toLocaleDateString("vi-VN")}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
                          {config.label}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Số lượng sách</p>
                          <p className="font-semibold text-foreground">{order.items.length}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Tổng tiền</p>
                          <p className="font-semibold text-primary text-lg">{order.total.toLocaleString("vi-VN")}₫</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Phương thức thanh toán</p>
                          <p className="font-semibold text-foreground">
                            {order.paymentMethod}
                          </p>
                        </div>
                      </div>

                      {/* Tracking number is not in OrderResponse yet, skipping */}

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-primary">
                          <span className="text-sm font-medium">Xem chi tiết</span>
                          <ChevronRight size={16} />
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
