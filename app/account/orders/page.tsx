"use client"

import { useAuth } from "@/lib/auth-context"
import { useOrder } from "@/lib/order-context"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Package, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"

export default function OrdersPage() {
  const { user, isLoading } = useAuth()
  const { getUserOrders } = useOrder()
  const router = useRouter()

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Đang tải...</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (!user) {
    router.push("/login")
    return null
  }

  const orders = getUserOrders(user.id)

  const statusConfig = {
    pending: { label: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-700" },
    processing: { label: "Đang chuẩn bị", color: "bg-blue-100 text-blue-700" },
    shipped: { label: "Đang giao", color: "bg-purple-100 text-purple-700" },
    delivered: { label: "Đã giao", color: "bg-green-100 text-green-700" },
    cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-700" },
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
                const config = statusConfig[order.status]
                return (
                  <Link key={order.id} href={`/account/orders/${order.id}`}>
                    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition cursor-pointer">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-lg text-foreground">{order.id}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString("vi-VN")}
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
                            {order.paymentMethod === "cod" ? "Thanh toán khi nhận" : "Chuyển khoản"}
                          </p>
                        </div>
                      </div>

                      {order.trackingNumber && (
                        <div className="pt-4 border-t border-border">
                          <p className="text-sm text-muted-foreground">
                            Mã vận đơn: <span className="font-semibold text-foreground">{order.trackingNumber}</span>
                          </p>
                        </div>
                      )}

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
