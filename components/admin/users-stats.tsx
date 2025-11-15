import { Users, UserCheck, UserX, TrendingUp, ShoppingBag } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface UserStats {
  totalUsers: number
  activeUsers: number
  bannedUsers: number
  inactiveUsers: number
  totalRevenue: number
  avgOrderValue: number
  totalOrders: number
}

interface UsersStatsProps {
  stats: UserStats
  className?: string
}

export function UsersStats({ stats, className }: UsersStatsProps) {
  const statCards = [
    {
      title: "Tổng người dùng",
      value: stats.totalUsers.toLocaleString("vi-VN"),
      icon: Users,
      description: `${stats.activeUsers} hoạt động`,
      trend: "+12% so với tháng trước",
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/30"
    },
    {
      title: "Người dùng hoạt động", 
      value: stats.activeUsers.toLocaleString("vi-VN"),
      icon: UserCheck,
      description: `${((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}% tổng số`,
      trend: "+5% so với tháng trước",
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/30"
    },
    {
      title: "Người dùng bị cấm",
      value: stats.bannedUsers.toLocaleString("vi-VN"), 
      icon: UserX,
      description: `${((stats.bannedUsers / stats.totalUsers) * 100).toFixed(1)}% tổng số`,
      trend: "-2% so với tháng trước",
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-950/30"
    },
    {
      title: "Tổng doanh thu",
      value: `${stats.totalRevenue.toLocaleString("vi-VN")}₫`,
      icon: TrendingUp,
      description: `Từ ${stats.totalOrders.toLocaleString("vi-VN")} đơn hàng`,
      trend: "+18% so với tháng trước",
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/30"
    }
  ]

  return (
    <div className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-4", className)}>
      {statCards.map((stat, index) => {
        const IconComponent = stat.icon
        const isNegativeTrend = stat.trend.startsWith('-')
        
        return (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={cn("p-2 rounded-full", stat.bgColor)}>
                <IconComponent className={cn("h-4 w-4", stat.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-2xl font-bold">{stat.value}</div>
                
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                  <Badge 
                    variant={isNegativeTrend ? "destructive" : "default"}
                    className={cn(
                      "text-xs px-2 py-1",
                      isNegativeTrend 
                        ? "bg-red-100 text-red-700 border-red-200" 
                        : "bg-green-100 text-green-700 border-green-200"
                    )}
                  >
                    {stat.trend}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
      
      {/* Additional stats row */}
      <Card className="md:col-span-2 lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <ShoppingBag className="h-4 w-4" />
            Thống kê chi tiết
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Giá trị đơn hàng trung bình</p>
              <p className="text-xl font-bold text-primary">
                {stats.avgOrderValue.toLocaleString("vi-VN")}₫
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Người dùng không hoạt động</p>
              <p className="text-xl font-bold text-orange-600">
                {stats.inactiveUsers.toLocaleString("vi-VN")}
              </p>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-border">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.totalOrders}</p>
                <p className="text-xs text-muted-foreground">Tổng đơn hàng</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {((stats.activeUsers / stats.totalUsers) * 100).toFixed(0)}%
                </p>
                <p className="text-xs text-muted-foreground">Tỷ lệ hoạt động</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {(stats.totalOrders / stats.activeUsers).toFixed(1)}
                </p>
                <p className="text-xs text-muted-foreground">Đơn hàng/người</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}