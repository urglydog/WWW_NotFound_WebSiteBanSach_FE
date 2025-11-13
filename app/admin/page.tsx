"use client"

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { BookOpenCheck, ShoppingCart, Users, DollarSign, TrendingUp, Target } from "lucide-react"
import { mockBooks } from "@/lib/mock-data"

const salesData = [
  { month: "Tháng 1", sales: 4000, orders: 24, customers: 16 },
  { month: "Tháng 2", sales: 3000, orders: 18, customers: 12 },
  { month: "Tháng 3", sales: 2000, orders: 22, customers: 15 },
  { month: "Tháng 4", sales: 2780, orders: 39, customers: 28 },
  { month: "Tháng 5", sales: 1890, orders: 28, customers: 20 },
  { month: "Tháng 6", sales: 2390, orders: 34, customers: 24 },
]

const categoryData = [
  { name: "Văn học", value: 35 },
  { name: "Kinh tế", value: 25 },
  { name: "Tâm lý", value: 20 },
  { name: "Khác", value: 20 },
]

const COLORS = ["#8b6914", "#d4a574", "#c9957e", "#a68a64"]

const stats = [
  { label: "Tổng doanh thu", value: "250.000.000₫", delta: "+12% so với tháng trước", icon: DollarSign, color: "text-green-600" },
  { label: "Đơn hàng", value: "1.234", delta: "+4.5% so với tháng trước", icon: ShoppingCart, color: "text-blue-600" },
  { label: "Sách trong kho", value: "856", delta: "92 sản phẩm sắp hết hàng", icon: BookOpenCheck, color: "text-purple-600" },
  { label: "Khách hàng hoạt động", value: "5.678", delta: "+320 người dùng mới", icon: Users, color: "text-orange-600" },
]

const recentOrders = [
  { id: "ORD-08214", customer: "Nguyễn Thị Hoa", total: 560000, date: "12/11/2024", status: "Đang giao" },
  { id: "ORD-08213", customer: "Trần Văn Bình", total: 320000, date: "12/11/2024", status: "Đã giao" },
  { id: "ORD-08212", customer: "Lê Quốc Phong", total: 180000, date: "11/11/2024", status: "Đang xử lý" },
  { id: "ORD-08211", customer: "Phạm Mỹ Linh", total: 940000, date: "11/11/2024", status: "Đã giao" },
]

const performanceGoals = [
  { label: "Tỷ lệ chuyển đổi", value: "3.8%", target: "Mục tiêu: 4.5%", icon: TrendingUp },
  { label: "Tỷ lệ hài lòng", value: "92%", target: "Mục tiêu: ≥ 90%", icon: Target },
]

const statusClass: Record<string, string> = {
  "Đang xử lý": "bg-yellow-100 text-yellow-700",
  "Đang giao": "bg-blue-100 text-blue-700",
  "Đã giao": "bg-green-100 text-green-700",
}

export default function AdminDashboard() {
  const topBooks = mockBooks.slice(0, 5)

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tổng quan kinh doanh</h1>
          <p className="text-muted-foreground mt-2">
            Theo dõi hiệu suất bán hàng, tình trạng kho sách và các số liệu quan trọng khác.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-muted-foreground text-sm font-medium uppercase tracking-wide">{stat.label}</h3>
                  <p className="text-2xl font-bold text-foreground mt-2">{stat.value}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{stat.delta}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 2xl:grid-cols-3 gap-8">
          {/* Sales Chart */}
          <div className="2xl:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Doanh thu & đơn hàng</h2>
                <p className="text-sm text-muted-foreground">Số liệu 6 tháng gần nhất</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="var(--color-primary)" strokeWidth={2} name="Doanh thu" />
                <Line type="monotone" dataKey="orders" stroke="#82ca9d" strokeWidth={2} name="Đơn hàng" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Category Chart */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-foreground mb-6">Danh mục bán chạy</h2>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Orders Chart */}
          <div className="xl:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Đơn hàng theo tháng</h2>
                <p className="text-sm text-muted-foreground">So sánh tăng trưởng đơn hàng theo từng tháng</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="var(--color-primary)" name="Đơn hàng" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Performance goals */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
            <h2 className="text-xl font-semibold text-foreground">Mục tiêu hiệu suất</h2>
            <div className="space-y-4">
              {performanceGoals.map((goal) => (
                <div key={goal.label} className="flex items-start gap-4 rounded-xl border border-border/60 p-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <goal.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{goal.label}</p>
                    <p className="text-xl font-semibold text-foreground mt-1">{goal.value}</p>
                    <p className="text-sm text-muted-foreground mt-1">{goal.target}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-8">
          {/* Top books */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-foreground mb-6">Sách bán chạy</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="text-left text-sm text-muted-foreground border-b border-border">
                    <th className="pb-3 font-medium">Sách</th>
                    <th className="pb-3 font-medium">Tác giả</th>
                    <th className="pb-3 font-medium">Danh mục</th>
                    <th className="pb-3 font-medium text-right">Giá</th>
                  </tr>
                </thead>
                <tbody>
                  {topBooks.map((book) => (
                    <tr key={book.id} className="border-b border-border/60 last:border-b-0">
                      <td className="py-3 pr-4">
                        <p className="font-medium text-foreground">{book.title}</p>
                        <p className="text-sm text-muted-foreground">Đánh giá {book.rating}★ · {book.reviews} lượt</p>
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground">{book.author}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{book.category}</td>
                      <td className="py-3 text-right font-semibold text-primary">
                        {book.price.toLocaleString("vi-VN")}₫
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent orders */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-foreground mb-6">Đơn hàng gần đây</h2>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border border-border/60 rounded-xl p-4"
                >
                  <div>
                    <p className="text-sm text-muted-foreground">Mã đơn</p>
                    <p className="font-semibold text-foreground">{order.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Khách hàng</p>
                    <p className="font-medium text-foreground">{order.customer}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>{order.date}</p>
                    <p className="font-semibold text-foreground">
                      {order.total.toLocaleString("vi-VN")}₫
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      statusClass[order.status] ?? "bg-muted text-foreground"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
