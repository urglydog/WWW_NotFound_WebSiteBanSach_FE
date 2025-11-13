"use client"

import Link from "next/link"
import { LayoutDashboard, BookOpen, ShoppingCart, Users, Settings, LogOut, BarChart3 } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface AdminSidebarProps {
  onLogout: () => void
}

export function AdminSidebar({ onLogout }: AdminSidebarProps) {
  const pathname = usePathname()

  const menuItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Quản lý sản phẩm", href: "/admin/books", icon: BookOpen },
    { label: "Quản lý đơn hàng", href: "/admin/orders", icon: ShoppingCart },
    { label: "Thống kê doanh thu", href: "/admin/revenue", icon: BarChart3 },
    { label: "Người dùng", href: "/admin/users", icon: Users },
    { label: "Cài đặt", href: "/admin/settings", icon: Settings },
  ]

  return (
    <div className="w-64 bg-primary text-primary-foreground min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-primary-foreground/20">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
            <span className="text-xl">📚</span>
          </div>
          <span className="font-bold text-lg">Quản lý</span>
        </Link>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition",
              pathname === item.href ? "bg-primary-foreground/20" : "hover:bg-primary-foreground/10",
            )}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-primary-foreground/20">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-foreground/10 transition"
        >
          <LogOut size={20} />
          <span className="font-medium">Đăng xuất</span>
        </button>
      </div>
    </div>
  )
}
