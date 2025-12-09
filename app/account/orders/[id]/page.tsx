"use client"

import { useAuth } from "@/lib/auth-context"
import { ordersService, OrderResponse } from "@/lib/services/orders.service"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft, Printer, Download, Loader2 } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

const statusSteps = [
  { key: "PENDING", label: "Chờ xác nhận" },
  { key: "CONFIRMED", label: "Đã xác nhận" },
  { key: "PROCESSING", label: "Đang chuẩn bị" },
  { key: "SHIPPED", label: "Đang giao" },
  { key: "DELIVERED", label: "Đã giao" },
]

export default function OrderDetailPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const [order, setOrder] = useState<OrderResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
      return
    }

    if (user && params?.id) {
      fetchOrder()
    }
  }, [user, authLoading, router, params?.id])

  const fetchOrder = async () => {
    try {
      setLoading(true)
      const data = await ordersService.getOrderById(params.id as string)
      setOrder(data)
    } catch (error) {
      console.error("Failed to fetch order:", error)
      toast.error("Không thể tải thông tin đơn hàng")
      router.push("/account/orders")
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = async () => {
    try {
      const html2canvas = (await import("html2canvas")).default
      const { jsPDF } = await import("jspdf")

      // Create an iframe to isolate the print content from Tailwind's global styles
      const iframe = document.createElement("iframe")
      iframe.style.position = "fixed"
      iframe.style.left = "-10000px"
      iframe.style.top = "0"
      iframe.style.width = "210mm" // A4 width
      iframe.style.minHeight = "297mm" // A4 height
      iframe.style.border = "none"
      document.body.appendChild(iframe)

      const doc = iframe.contentWindow?.document
      if (!doc) {
        document.body.removeChild(iframe)
        return
      }

      // Write pure HTML/CSS content into the iframe
      // No external stylesheets are included, so no Tailwind interference
      doc.open()
      doc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              background: #ffffff; 
              color: #000000; 
              margin: 20px;
              padding: 20px;
            }
            .header { border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
            .section { margin-bottom: 30px; }
            .section-title { font-size: 18px; border-bottom: 1px solid #ccc; padding-bottom: 10px; margin-bottom: 15px; font-weight: bold; }
            table { width: 100%; border-collapse: collapse; }
            th { padding: 10px; border-bottom: 1px solid #ddd; text-align: left; background-color: #f5f5f5; font-weight: bold; }
            td { padding: 10px; border-bottom: 1px solid #eee; }
            .text-right { text-align: right; }
            .total-row { border-top: 2px solid #000; margin-top: 10px; padding-top: 10px; font-weight: bold; font-size: 16px; display: flex; justify-content: space-between; }
            .summary { float: right; width: 300px; }
            .clear { clear: both; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin: 0; font-size: 24px;">Đơn hàng #${order?.orderCode || order?.id}</h1>
            <p style="margin: 5px 0 0 0; color: #666;">Ngày đặt: ${new Date(order?.orderDate || "").toLocaleDateString("vi-VN")}</p>
          </div>

          <div class="section">
            <div class="section-title">Địa chỉ giao hàng</div>
            <p style="margin: 5px 0;"><strong>${order?.recipientName}</strong></p>
            <p style="margin: 5px 0;">${order?.shippingAddress}</p>
            <p style="margin: 5px 0;">SĐT: ${order?.recipientPhone}</p>
          </div>

          <div class="section">
            <div class="section-title">Chi tiết đơn hàng</div>
            <table>
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th class="text-right">Số lượng</th>
                  <th class="text-right">Đơn giá</th>
                </tr>
              </thead>
              <tbody>
                ${order?.items.map(item => `
                  <tr>
                    <td>
                      <div style="font-weight: bold;">${item.bookTitle}</div>
                      <div style="font-size: 12px; color: #666;">ISBN: ${item.bookIsbn}</div>
                    </td>
                    <td class="text-right">${item.quantity}</td>
                    <td class="text-right">${item.unitPrice.toLocaleString("vi-VN")}₫</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div>
            <div class="summary">
               <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span>Tạm tính:</span>
                <span style="font-weight: bold;">${order?.subtotal.toLocaleString("vi-VN")}₫</span>
              </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                 <span>Vận chuyển:</span>
                 <span>${order?.shippingFee === 0 ? "Miễn phí" : `${order?.shippingFee.toLocaleString("vi-VN")}₫`}</span>
               </div>
              <div class="total-row">
                <span>Tổng cộng:</span>
                <span style="color: #d00;">${order?.total.toLocaleString("vi-VN")}₫</span>
              </div>
               <div style="margin-top: 20px; text-align: right; font-size: 12px; color: #666;">
                PTTT: ${order?.paymentMethod}
              </div>
            </div>
            <div class="clear"></div>
          </div>
        </body>
        </html>
      `)
      doc.close()

      // Give the iframe a moment to render content/fonts
      await new Promise(resolve => setTimeout(resolve, 500))

      const canvas = await html2canvas(doc.body, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      })

      document.body.removeChild(iframe)

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)
      pdf.save(`Order-${order?.orderCode}.pdf`)

      toast.success("Đã tải xuống đơn hàng")
    } catch (error) {
      console.error("Download failed:", error)
      toast.error("Không thể tải xuống đơn hàng")
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-4">
              <Link href="/account/orders" className="no-print">
                <button className="p-2 hover:bg-muted rounded-lg transition">
                  <ChevronLeft size={20} />
                </button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Đơn hàng #{order.orderCode || order.id.substring(0, 8)}</h1>
                <p className="text-muted-foreground">{new Date(order.orderDate).toLocaleDateString("vi-VN")}</p>
              </div>
            </div>
            <div className="flex gap-2 no-print">
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer size={18} className="mr-2" />
                In đơn hàng
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download size={18} className="mr-2" />
                Tải PDF
              </Button>
            </div>
          </div>

          <div id="order-content">
            {/* Status Timeline - Hide on print if desired, or keep */}
            <div className="bg-card border border-border rounded-lg p-6 mb-8 no-print">
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
                    <p className="font-semibold text-foreground">{order.recipientName}</p>
                    <p>{order.shippingAddress}</p>
                    <p>Điện thoại: {order.recipientPhone}</p>
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
                      <span className="font-medium text-accent">
                        {order.shippingFee === 0 ? "Miễn phí" : `${order.shippingFee.toLocaleString("vi-VN")}₫`}
                      </span>
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
        </div>
      </main>

      <Footer />
    </div>
  )
}
