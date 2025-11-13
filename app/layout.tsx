import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { CartProvider } from "@/lib/cart-context"
import { AuthProvider } from "@/lib/auth-context"
import { OrderProvider } from "@/lib/order-context"
import { CartSidebar } from "@/components/cart/cart-sidebar"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Nhà Sách Online - Khám Phá Thế Giới Sách",
  description:
    "Nhà sách online hàng đầu Việt Nam. Mua sách, truyện, tạp chí với giá tốt nhất. Giao hàng nhanh, dịch vụ tốt.",
  generator: "v0.app",
  icons: {
    icon: [{ url: "/icon" }],
    apple: [{ url: "/icon" }],
    shortcut: [{ url: "/icon" }],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <body className={`font-sans antialiased`}>
        <AuthProvider>
          <OrderProvider>
            <CartProvider>
              {children}
              <CartSidebar />
            </CartProvider>
          </OrderProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
