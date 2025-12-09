"use client"

import { useAuth } from "@/lib/auth-context"
import { ordersService, OrderResponse } from "@/lib/services/orders.service"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft, Printer, Download, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

const statusSteps = [
  { key: "PENDING", label: "Chờ xác nhận" },
  { key: "CONFIRMED", label: "Đã xác nhận" },
  { key: "PROCESSING", label: "Đang chuẩn bị" },
  { key: "SHIPPED", label: "Đang giao" },
  { key: "DELIVERED", label: "Đã giao" },
]

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [order, setOrder] = useState<OrderResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
      return
    }

    if (user) {
      fetchOrder()
    }
  }, [user, authLoading, router, params.id])

  const fetchOrder = async () => {
    try {
      setLoading(true)
      const data = await ordersService.getOrderById(params.id)
      setOrder(data)
    } catch (error) {
      console.error("Failed to fetch order:", error)
      toast.error("Không thể tải thông tin đơn hàng")
      router.push("/account/orders")
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

  if (!user || !order) return null

  const currentStepIndex = statusSteps.findIndex((step) => step.key === order.status)

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link href="/account/orders">
                <button className="p-2 hover:bg-muted rounded-lg transition">
                  <ChevronLeft size={20} />
                </button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Đơn hàng #{order.orderCode || order.id.substring(0, 8)}</h1>
                <p className="text-muted-foreground">{new Date(order.orderDate).toLocaleDateString("vi-VN")}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Printer size={18} className="mr-2" />
                In
              </Button>
              <Button variant="outline" size="sm">
                <Download size={18} className="mr-2" />
                Tải xuống
              </Button>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <h2 className="font-bold text-foreground mb-6">Trạng thái đơn hàng</h2>
            <div className="flex justify-between overflow-x-auto">
              {statusSteps.map((step, index) => (
                <div key={step.key} className="flex flex-col items-center flex-1 min-w-[80px]">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 transition ${index <= currentStepIndex
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                      }`}
                  >
                    {index + 1}
                  </div>
                  <p
                    className={`text-xs text-center font-medium ${index <= currentStepIndex ? "text-foreground" : "text-muted-foreground"
                      }`}
                  >
                    {step.label}
                  </p>
                  {index < statusSteps.length - 1 && (
                    <div className={`w-full h-1 mt-3 ${index < currentStepIndex ? "bg-primary" : "bg-muted"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Items */}
            <div className="lg:col-span-2">
              {/* Shipping Address */}
              <div className="bg-card border border-border rounded-lg p-6 mb-8">
                <h2 className="font-bold text-foreground mb-4">Địa chỉ giao hàng</h2>
                <div className="space-y-2 text-muted-foreground">
                  <p className="font-semibold text-foreground">{order.shippingAddress.recipientName}</p>
                  <p>{order.shippingAddress.street}</p>
                  <p>
                    {order.shippingAddress.ward}, {order.shippingAddress.district}, {order.shippingAddress.province}
                  </p>
                  <p>Điện thoại: {order.shippingAddress.phoneNumber}</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-card border border-border rounded-lg p-6 mb-8">
                <h2 className="font-bold text-foreground mb-4">Chi tiết đơn hàng</h2>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-3 border-b border-border last:border-0"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{item.bookTitle}</p>
                        <p className="text-sm text-muted-foreground">ISBN: {item.bookIsbn}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-foreground">{item.quantity}x</p>
                        <p className="text-primary font-semibold">
                          {item.unitPrice.toLocaleString("vi-VN")}₫
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tracking */}
              {/* Tracking number is not in OrderResponse yet, skipping */}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-muted/50 border border-border rounded-lg p-6 sticky top-20">
                <h2 className="font-bold text-foreground mb-4">Tóm tắt thanh toán</h2>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tạm tính:</span>
                    <span className="font-medium">{order.subtotal.toLocaleString("vi-VN")}₫</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vận chuyển:</span>
                    <span className="font-medium text-accent">Miễn phí</span>
                  </div>
                </div>
                <div className="border-t border-border pt-4 flex justify-between mb-6">
                  <span className="font-bold">Tổng cộng:</span>
                  <span className="font-bold text-lg text-primary">{order.total.toLocaleString("vi-VN")}₫</span>
                </div>

                <div className="space-y-2">
                  <div className="p-3 bg-background rounded-lg">
                    <p className="text-xs text-muted-foreground">Trạng thái thanh toán</p>
                    <p className="font-semibold text-foreground">
                      {order.paymentMethod}
                    </p>
                  </div>
                  {order.status === "DELIVERED" && (
                    <Link href="/products" className="block">
                      <Button className="w-full bg-primary hover:bg-primary/90">Tìm sách khác</Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
