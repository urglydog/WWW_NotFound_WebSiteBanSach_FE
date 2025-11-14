"use client"

import { useMemo, useState } from "react"
import { Download, Search, Filter, Calendar, Truck, PackageCheck, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const mockOrders = [
  {
    id: "ORD-08214",
    customer: "Nguyễn Thị Hoa",
    email: "hoa.nguyen@example.com",
    phone: "0123 456 789",
    total: 560000,
    items: 4,
    date: "2024-11-12",
    status: "Đang giao",
    payment: "Đã thanh toán",
    address: "123 Nguyễn Huệ, Q.1, TP.HCM",
  },
  {
    id: "ORD-08213",
    customer: "Trần Văn Bình",
    email: "binh.tran@example.com",
    phone: "0987 654 321",
    total: 320000,
    items: 2,
    date: "2024-11-12",
    status: "Đã giao",
    payment: "Đã thanh toán",
    address: "45 Lý Thường Kiệt, Q.10, TP.HCM",
  },
  {
    id: "ORD-08212",
    customer: "Lê Quốc Phong",
    email: "phong.le@example.com",
    phone: "0901 234 567",
    total: 180000,
    items: 1,
    date: "2024-11-11",
    status: "Đang xử lý",
    payment: "Chờ thanh toán",
    address: "78 Trần Phú, Hà Đông, Hà Nội",
  },
  {
    id: "ORD-08211",
    customer: "Phạm Mỹ Linh",
    email: "linh.pham@example.com",
    phone: "0932 888 222",
    total: 940000,
    items: 5,
    date: "2024-11-11",
    status: "Đã giao",
    payment: "Đã thanh toán",
    address: "12 Võ Văn Tần, Q.3, TP.HCM",
  },
  {
    id: "ORD-08210",
    customer: "Đoàn Nhật Minh",
    email: "minh.doan@example.com",
    phone: "0911 222 333",
    total: 420000,
    items: 3,
    date: "2024-11-10",
    status: "Đang xử lý",
    payment: "Chờ thanh toán",
    address: "201 Điện Biên Phủ, Q.Bình Thạnh, TP.HCM",
  },
  {
    id: "ORD-08209",
    customer: "Hoàng Gia Hân",
    email: "han.hoang@example.com",
    phone: "0977 888 111",
    total: 265000,
    items: 2,
    date: "2024-11-09",
    status: "Đã hủy",
    payment: "Hoàn tiền",
    address: "56 Lê Lợi, Hội An, Quảng Nam",
  },
]

const statusOptions = ["Tất cả", "Đang xử lý", "Đang giao", "Đã giao", "Đã hủy"]

const statusBadgeStyles: Record<string, string> = {
  "Đang xử lý": "bg-yellow-100 text-yellow-700 border-yellow-200",
  "Đang giao": "bg-blue-100 text-blue-700 border-blue-200",
  "Đã giao": "bg-green-100 text-green-700 border-green-200",
  "Đã hủy": "bg-red-100 text-red-700 border-red-200",
}

const statHighlights = [
  { label: "Đơn hàng hôm nay", value: 42, change: "+8.4%", icon: PackageCheck, tone: "text-primary" },
  { label: "Đang giao", value: 16, change: "+2 vận đơn mới", icon: Truck, tone: "text-blue-600" },
  { label: "Chờ xử lý", value: 9, change: "Ưu tiên xử lý", icon: Clock, tone: "text-amber-600" },
]

export default function AdminOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeStatus, setActiveStatus] = useState("Tất cả")
  const [channel, setChannel] = useState("Tất cả kênh")

  const filteredOrders = useMemo(() => {
    return mockOrders.filter((order) => {
      const matchesSearch =
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = activeStatus === "Tất cả" || order.status === activeStatus
      const matchesChannel = channel === "Tất cả kênh" || channel === "Website"

      return matchesSearch && matchesStatus && matchesChannel
    })
  }, [searchTerm, activeStatus, channel])

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="space-y-8 px-4 py-6 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Quản lý đơn hàng</h1>
            <p className="text-muted-foreground mt-2">Theo dõi trạng thái xử lý và vận chuyển đơn hàng theo thời gian thực.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:self-end">
            <Button variant="outline" className="gap-2 sm:w-auto">
              <Calendar className="w-4 h-4" />
              Báo cáo theo ngày
            </Button>
            <Button className="gap-2 sm:w-auto">
              <Download className="w-4 h-4" />
              Xuất báo cáo
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {statHighlights.map((stat) => (
            <Card key={stat.label} className="border border-border/80 rounded-2xl shadow-sm bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.tone}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <p className="text-sm text-muted-foreground mt-2">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between xl:flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Tìm theo mã đơn, tên khách hàng..."
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="gap-2 sm:w-auto">
                <Filter className="w-4 h-4" />
                Bộ lọc nâng cao
              </Button>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end xl:flex-1 xl:justify-end">
              <Select value={channel} onValueChange={(value) => setChannel(value)}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Kênh bán" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tất cả kênh">Tất cả kênh</SelectItem>
                  <SelectItem value="Website">Website</SelectItem>
                  <SelectItem value="Cửa hàng">Cửa hàng</SelectItem>
                </SelectContent>
              </Select>
              <Tabs value={activeStatus} onValueChange={(value) => setActiveStatus(value)}>
                <TabsList className="w-full justify-start gap-1 overflow-x-auto rounded-lg border border-border/60 bg-muted/30 p-1">
                  {statusOptions.map((status) => (
                    <TabsTrigger key={status} value={status}>
                      {status}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className="border border-dashed border-border/80 rounded-xl p-4 text-sm text-muted-foreground flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span>
              Đang hiển thị <strong>{filteredOrders.length}</strong> trên tổng <strong>{mockOrders.length}</strong> đơn hàng.
            </span>
            <Button variant="ghost" size="sm" className="self-start sm:self-auto">
              Đặt lại bộ lọc
            </Button>
          </div>

          <div className="border border-border rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 bg-muted/40">
              <p className="text-sm text-muted-foreground">Danh sách đơn hàng gần đây</p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    Xem theo
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Theo ngày tạo</DropdownMenuItem>
                  <DropdownMenuItem>Theo giá trị đơn</DropdownMenuItem>
                  <DropdownMenuItem>Theo trạng thái</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <ScrollArea className="h-[420px] sm:h-[500px] xl:h-[560px]">
              <div className="w-full overflow-x-auto">
                <table className="min-w-[720px] w-full">
                  <thead className="text-left text-sm text-muted-foreground bg-muted/20">
                    <tr>
                      <th className="px-6 py-3 font-medium">Mã đơn</th>
                      <th className="px-6 py-3 font-medium">Khách hàng</th>
                      <th className="px-6 py-3 font-medium">Liên hệ</th>
                      <th className="px-6 py-3 font-medium">Giá trị</th>
                      <th className="px-6 py-3 font-medium">Ngày</th>
                      <th className="px-6 py-3 font-medium">Trạng thái</th>
                      <th className="px-6 py-3 font-medium text-right">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="border-t border-border/60 hover:bg-muted/40 transition">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-primary">{order.id}</span>
                            <span className="text-xs text-muted-foreground">{order.address}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-foreground">{order.customer}</p>
                          <p className="text-xs text-muted-foreground">{order.payment}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          <p>{order.email}</p>
                          <p>{order.phone}</p>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-foreground">
                          {order.total.toLocaleString("vi-VN")}₫
                          <span className="block text-xs text-muted-foreground">{order.items} sản phẩm</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{order.date}</td>
                        <td className="px-6 py-4">
                          <Badge variant="secondary" className={`${statusBadgeStyles[order.status] ?? ""} border`}>
                            {order.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button size="sm" variant="outline">
                            Xem chi tiết
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  )
}

