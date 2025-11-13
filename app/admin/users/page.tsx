"use client"

import { useState } from "react"
import { Search, Trash2 } from "lucide-react"

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
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground">Quản lý người dùng</h1>
      </div>

      {/* Search */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
        <input
          type="text"
          placeholder="Tìm kiếm người dùng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Tên</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Điện thoại</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Đơn hàng</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Tổng chi tiêu</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Ngày tham gia</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b border-border hover:bg-muted/50 transition">
                <td className="px-6 py-4 font-medium text-foreground">{user.name}</td>
                <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                <td className="px-6 py-4 text-muted-foreground">{user.phone}</td>
                <td className="px-6 py-4 text-foreground">{user.orders}</td>
                <td className="px-6 py-4 font-semibold text-primary">{user.totalSpent.toLocaleString("vi-VN")}₫</td>
                <td className="px-6 py-4 text-muted-foreground">{user.joinDate}</td>
                <td className="px-6 py-4">
                  <button className="p-2 hover:bg-muted rounded-lg transition text-destructive">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">Hiển thị {filteredUsers.length} người dùng</p>
    </div>
  )
}
