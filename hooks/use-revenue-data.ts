import { useMemo, useState } from "react"
import { DollarSign, TrendingUp, Wallet, Receipt, ArrowUpRight, ArrowDownRight } from "lucide-react"

export interface RevenueByMonth {
  month: string
  revenue: number
  orders: number
  avgOrderValue: number
}

export interface RevenueStream {
  channel: string
  value: number
}

export interface CategoryPerformance {
  category: string
  revenue: number
  growth: number
}

export interface WeeklySnapshot {
  day: string
  revenue: number
}

export interface SummaryCard {
  label: string
  value: string
  delta: string
  trend: "up" | "down"
  icon: any
  accent: string
}

export interface DateRange {
  startDate: string
  endDate: string
}

export function useRevenueData() {
  // Date range state
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: "01/01/2024",
    endDate: "30/06/2024"
  })

  // Mock data - Developer có thể thay thế bằng API calls
  const revenueByMonth: RevenueByMonth[] = useMemo(() => [
    { month: "Tháng 1", revenue: 120_000_000, orders: 320, avgOrderValue: 375_000 },
    { month: "Tháng 2", revenue: 138_000_000, orders: 342, avgOrderValue: 403_000 },
    { month: "Tháng 3", revenue: 156_500_000, orders: 368, avgOrderValue: 425_000 },
    { month: "Tháng 4", revenue: 171_200_000, orders: 394, avgOrderValue: 435_000 },
    { month: "Tháng 5", revenue: 185_400_000, orders: 410, avgOrderValue: 452_000 },
    { month: "Tháng 6", revenue: 198_900_000, orders: 432, avgOrderValue: 461_000 },
  ], [])

  const revenueStreams: RevenueStream[] = useMemo(() => [
    { channel: "Website", value: 64 },
    { channel: "Ứng dụng mobile", value: 22 },
    { channel: "Sàn thương mại điện tử", value: 14 },
  ], [])

  const categoryPerformance: CategoryPerformance[] = useMemo(() => [
    { category: "Kinh tế", revenue: 56_400_000, growth: 18 },
    { category: "Văn học", revenue: 42_300_000, growth: 12 },
    { category: "Tâm lý", revenue: 35_100_000, growth: 15 },
    { category: "Kỹ năng", revenue: 28_400_000, growth: 9 },
  ], [])

  const weeklySnapshot: WeeklySnapshot[] = useMemo(() => [
    { day: "T2", revenue: 14_500_000 },
    { day: "T3", revenue: 15_200_000 },
    { day: "T4", revenue: 18_300_000 },
    { day: "T5", revenue: 16_800_000 },
    { day: "T6", revenue: 19_700_000 },
    { day: "T7", revenue: 22_400_000 },
    { day: "CN", revenue: 20_100_000 },
  ], [])

  // Calculated summary cards
  const summaryCards: SummaryCard[] = useMemo(() => [
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
  ], [])

  // Chart colors
  const chartColors = useMemo(() => ["#8b6914", "#d4a574", "#c9957e"], [])

  // Actions
  const updateDateRange = (newRange: DateRange) => {
    setDateRange(newRange)
    // Here you would trigger API call to fetch new data
  }

  const exportRevenueData = () => {
    // Developer có thể implement export logic
    console.log("Exporting revenue data for:", dateRange)
  }

  const refreshData = () => {
    // Developer có thể implement refresh logic
    console.log("Refreshing revenue data")
  }

  return {
    // Data
    revenueByMonth,
    revenueStreams,
    categoryPerformance,
    weeklySnapshot,
    summaryCards,
    dateRange,
    chartColors,
    
    // Actions
    updateDateRange,
    exportRevenueData,
    refreshData,
  }
}