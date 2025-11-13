"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { LogOut, User, ShoppingBag, Heart, Settings } from "lucide-react"
import { useState } from "react"

export default function AccountPage() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("profile")

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
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">Bạn chưa đăng nhập</p>
            <Link href="/login">
              <Button>Đăng nhập ngay</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-card border border-border rounded-lg p-6 sticky top-20">
                {/* User Info */}
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
                    {(user.fullName?.charAt(0) ?? user.email?.charAt(0) ?? "?").toUpperCase()}
                  </div>
                  <h2 className="font-bold text-foreground">{user.fullName ?? "Khách hàng BookSphere"}</h2>
                  <p className="text-sm text-muted-foreground">{user.email ?? "Không có email"}</p>
                </div>

                {/* Menu */}
                <nav className="space-y-2 mb-6">
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-2 transition ${
                      activeTab === "profile" ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <User size={18} />
                    Thông tin cá nhân
                  </button>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-2 transition ${
                      activeTab === "orders" ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <ShoppingBag size={18} />
                    Đơn hàng
                  </button>
                  <button
                    onClick={() => setActiveTab("wishlist")}
                    className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-2 transition ${
                      activeTab === "wishlist" ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <Heart size={18} />
                    Danh sách yêu thích
                  </button>
                  <button
                    onClick={() => setActiveTab("settings")}
                    className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-2 transition ${
                      activeTab === "settings" ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <Settings size={18} />
                    Cài đặt
                  </button>
                </nav>

                <Button variant="outline" className="w-full bg-transparent" onClick={handleLogout}>
                  <LogOut size={18} className="mr-2" />
                  Đăng xuất
                </Button>
              </div>
            </div>

            {/* Main Content */}
            <div className="md:col-span-3">
              {activeTab === "profile" && (
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-foreground mb-6">Thông tin cá nhân</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">Họ và tên</label>
                      <p className="text-foreground font-medium">{user.fullName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
                      <p className="text-foreground font-medium">{user.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">Ngày tạo tài khoản</label>
                      <p className="text-foreground font-medium">
                        {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                    <Button className="mt-4">Chỉnh sửa thông tin</Button>
                  </div>
                </div>
              )}

              {activeTab === "orders" && (
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-foreground mb-6">Đơn hàng của tôi</h2>
                  <div className="text-center py-12">
                    <ShoppingBag size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
                    <p className="text-muted-foreground">Chưa có đơn hàng nào</p>
                  </div>
                </div>
              )}

              {activeTab === "wishlist" && (
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-foreground mb-6">Danh sách yêu thích</h2>
                  <div className="text-center py-12">
                    <Heart size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
                    <p className="text-muted-foreground">Danh sách yêu thích trống</p>
                  </div>
                </div>
              )}

              {activeTab === "settings" && (
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-foreground mb-6">Cài đặt</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">Thông báo email</p>
                        <p className="text-sm text-muted-foreground">Nhận thông báo về đơn hàng và khuyến mãi</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-5 h-5" />
                    </div>
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">Nhận SMS</p>
                        <p className="text-sm text-muted-foreground">Nhận thông báo qua SMS</p>
                      </div>
                      <input type="checkbox" className="w-5 h-5" />
                    </div>
                    <Button className="mt-4">Lưu thay đổi</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
