"use client"

import { useState } from "react"
import { Search, Trash2 } from 'lucide-react'

const mockUsers = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    email: "a@example.com",
    phone: "0123456789",
    orders: 5,
    totalSpent: 2500000,
    joinDate: "2024-01-15",
  },
  {
    id: "2",
    name: "Trần Thị B",
    email: "b@example.com",
    phone: "0987654321",
    orders: 3,
    totalSpent: 1800000,
    joinDate: "2024-02-20",
  },
  {
    id: "3",
    name: "Phạm Văn C",
    email: "c@example.com",
    phone: "0912345678",
    orders: 8,
    totalSpent: 4200000,
    joinDate: "2024-03-10",
  },
  {
    id: "4",
    name: "Lê Thị D",
    email: "d@example.com",
    phone: "0945678901",
    orders: 2,
    totalSpent: 950000,
    joinDate: "2024-04-05",
  },
]

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="space-y-4 px-3 py-4 sm:space-y-6 sm:px-6 sm:py-6 lg:px-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Quản lý người dùng</h1>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Theo dõi hồ sơ khách hàng, lịch sử mua hàng và trạng thái hoạt động.
          </p>
        </div>

        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-4 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary sm:text-base"
          />
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground sm:px-6 sm:py-4">Tên</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground sm:px-6 sm:py-4">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground sm:px-6 sm:py-4">Điện thoại</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground sm:px-6 sm:py-4">Đơn hàng</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground sm:px-6 sm:py-4">Tổng chi tiêu</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground sm:px-6 sm:py-4">Ngày tham gia</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground sm:px-6 sm:py-4">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-border transition hover:bg-muted/50">
                  <td className="px-4 py-3 font-medium text-foreground sm:px-6 sm:py-4">{user.name}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground sm:px-6 sm:py-4">{user.email}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground sm:px-6 sm:py-4">{user.phone}</td>
                  <td className="px-4 py-3 text-sm text-foreground sm:px-6 sm:py-4">{user.orders}</td>
                  <td className="px-4 py-3 font-semibold text-primary sm:px-6 sm:py-4">{user.totalSpent.toLocaleString("vi-VN")}₫</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground sm:px-6 sm:py-4">{user.joinDate}</td>
                  <td className="px-4 py-3 sm:px-6 sm:py-4">
                    <button className="rounded-lg p-2 text-destructive transition hover:bg-muted">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 lg:hidden">
          {filteredUsers.map((user) => (
            <div key={user.id} className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <button className="text-destructive transition hover:bg-muted rounded p-1">
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-muted-foreground">Điện thoại</p>
                    <p className="font-medium text-foreground">{user.phone}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Đơn hàng</p>
                    <p className="font-medium text-foreground">{user.orders}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Tổng chi tiêu</p>
                    <p className="font-semibold text-primary">{user.totalSpent.toLocaleString("vi-VN")}₫</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Tham gia</p>
                    <p className="font-medium text-foreground text-xs">{user.joinDate}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground sm:text-sm">Hiển thị {filteredUsers.length} người dùng</p>
      </div>
    </div>
  )
}
