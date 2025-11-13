"use client"

import { ResponsiveContainer, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from "recharts"
import { DollarSign, TrendingUp, Wallet, Receipt, CalendarRange, ArrowUpRight, ArrowDownRight } from "lucide-react"

const revenueByMonth = [
  { month: "Tháng 1", revenue: 120_000_000, orders: 320, avgOrderValue: 375_000 },
  { month: "Tháng 2", revenue: 138_000_000, orders: 342, avgOrderValue: 403_000 },
  { month: "Tháng 3", revenue: 156_500_000, orders: 368, avgOrderValue: 425_000 },
  { month: "Tháng 4", revenue: 171_200_000, orders: 394, avgOrderValue: 435_000 },
  { month: "Tháng 5", revenue: 185_400_000, orders: 410, avgOrderValue: 452_000 },
  { month: "Tháng 6", revenue: 198_900_000, orders: 432, avgOrderValue: 461_000 },
]

const revenueStreams = [
  { channel: "Website", value: 64 },
  { channel: "Ứng dụng mobile", value: 22 },
  { channel: "Sàn thương mại điện tử", value: 14 },
]

const categoryPerformance = [
  { category: "Kinh tế", revenue: 56_400_000, growth: 18 },
  { category: "Văn học", revenue: 42_300_000, growth: 12 },
  { category: "Tâm lý", revenue: 35_100_000, growth: 15 },
  { category: "Kỹ năng", revenue: 28_400_000, growth: 9 },
]

const weeklySnapshot = [
  { day: "T2", revenue: 14_500_000 },
  { day: "T3", revenue: 15_200_000 },
  { day: "T4", revenue: 18_300_000 },
  { day: "T5", revenue: 16_800_000 },
  { day: "T6", revenue: 19_700_000 },
  { day: "T7", revenue: 22_400_000 },
  { day: "CN", revenue: 20_100_000 },
]

const COLORS = ["#8b6914", "#d4a574", "#c9957e"]

const summaryCards = [
  {
    label: "Tổng doanh thu",
    value: "198.900.000₫",
    delta: "+7.3% so với tháng trước",
    trend: "up",
    icon: DollarSign,
    accent: "text-emerald-600",
  },
  {
    label: "Doanh thu thuần",
    value: "182.450.000₫",
    delta: "+6.1% so với tháng trước",
    trend: "up",
    icon: Wallet,
    accent: "text-blue-600",
  },
  {
    label: "Số đơn hàng",
    value: "432 đơn",
    delta: "+5.4% so với tháng trước",
    trend: "up",
    icon: Receipt,
    accent: "text-indigo-600",
  },
  {
    label: "Giá trị trung bình",
    value: "461.000₫",
    delta: "+2.1% so với tháng trước",
    trend: "up",
    icon: TrendingUp,
    accent: "text-orange-600",
  },
]

export default function AdminRevenuePage() {
  return (
    <div className="min-h-screen bg-muted/40">
      <div className="space-y-8 px-4 py-6 sm:p-6 lg:p-8">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Thống kê doanh thu</h1>
            <p className="text-muted-foreground mt-2">
              Theo dõi doanh thu đa kênh, hiệu suất danh mục và các chỉ số tài chính quan trọng.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-3 text-sm text-muted-foreground">
            <CalendarRange className="w-4 h-4" />
            <span>01/01/2024 - 30/06/2024</span>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {summaryCards.map((card) => {
            const TrendIcon = card.trend === "up" ? ArrowUpRight : ArrowDownRight
            return (
              <article key={card.label} className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground uppercase tracking-wide">{card.label}</p>
                    <p className="text-2xl font-semibold text-foreground mt-2">{card.value}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <card.icon className={`w-6 h-6 ${card.accent}`} />
                  </div>
                </div>
                <div className={`mt-4 inline-flex items-center gap-1 text-sm font-medium ${card.trend === "up" ? "text-emerald-600" : "text-rose-600"}`}>
                  <TrendIcon className="w-4 h-4" />
                  {card.delta}
                </div>
              </article>
            )
          })}
        </section>

        <section className="grid grid-cols-1 2xl:grid-cols-3 gap-8">
          <div className="2xl:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Doanh thu & đơn hàng theo tháng</h2>
                <p className="text-sm text-muted-foreground">So sánh tăng trưởng doanh thu và số đơn trong 6 tháng</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <ComposedRevenueChart />
            </ResponsiveContainer>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-foreground mb-6">Tỷ trọng doanh thu theo kênh</h2>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={revenueStreams}
                  cx="50%"
                  cy="50%"
                  outerRadius={95}
                  dataKey="value"
                  label={({ channel, value }) => `${channel}: ${value}%`}
                >
                  {revenueStreams.map((stream, index) => (
                    <Cell key={stream.channel} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Hiệu suất danh mục</h2>
                <p className="text-sm text-muted-foreground">Doanh thu và tăng trưởng theo danh mục sản phẩm chủ lực</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="text-left text-sm text-muted-foreground border-b border-border">
                    <th className="pb-3 font-medium">Danh mục</th>
                    <th className="pb-3 font-medium">Doanh thu</th>
                    <th className="pb-3 font-medium">Tăng trưởng</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryPerformance.map((item) => (
                    <tr key={item.category} className="border-b border-border/60 last:border-b-0">
                      <td className="py-3 pr-4 font-medium text-foreground">{item.category}</td>
                      <td className="py-3 pr-4 text-primary font-semibold">{item.revenue.toLocaleString("vi-VN")}₫</td>
                      <td className="py-3 pr-4 text-emerald-600 font-medium">+{item.growth}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-foreground mb-6">Doanh thu trong tuần</h2>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={weeklySnapshot}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="day" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" tickFormatter={(value) => `${value / 1_000_000}tr`} />
                <Tooltip formatter={(value: number) => `${value.toLocaleString("vi-VN")}₫`} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  fill="url(#revenueGradient)"
                  name="Doanh thu"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  )
}

function ComposedRevenueChart() {
  return (
    <BarChart data={revenueByMonth}>
      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
      <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
      <YAxis
        yAxisId="left"
        stroke="var(--color-muted-foreground)"
        tickFormatter={(value) => `${Math.round(value / 1_000_000)}tr`}
      />
      <YAxis yAxisId="right" orientation="right" stroke="var(--color-muted-foreground)" />
      <Tooltip
        formatter={(value: number, name) => {
          if (name === "Doanh thu") {
            return [`${value.toLocaleString("vi-VN")}₫`, name]
          }
          if (name === "Giá trị trung bình") {
            return [`${value.toLocaleString("vi-VN")}₫`, name]
          }
          return [value, name]
        }}
      />
      <Legend />
      <Bar yAxisId="left" dataKey="revenue" name="Doanh thu" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
      <Line
        yAxisId="right"
        type="monotone"
        dataKey="orders"
        name="Số đơn hàng"
        stroke="#82ca9d"
        strokeWidth={2}
        activeDot={{ r: 6 }}
      />
      <Line
        yAxisId="right"
        type="monotone"
        dataKey="avgOrderValue"
        name="Giá trị trung bình"
        stroke="#d97706"
        strokeWidth={2}
        strokeDasharray="5 5"
      />
    </BarChart>
  )
}

