"use client"

import { useOrderFilters } from "@/hooks/use-order-filters"
import { 
  OrdersPageHeader,
  OrdersStats,
  OrdersFilterSection,
  OrdersTable
} from "@/components/admin"

// Mock data - Developer có thể thay thế bằng API call
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

export default function AdminOrdersPage() {
  const { filterState, filteredOrders, statusOptions, channelOptions, actions } = useOrderFilters(mockOrders)

  // Handler functions - có thể assign cho từng developer khác nhau
  const handleExportReport = () => {
    // Developer A: Implement export report logic
    console.log('Export report')
  }

  const handleDateReport = () => {
    // Developer B: Implement date report logic  
    console.log('Date report')
  }

  const handleAdvancedFilter = () => {
    // Developer C: Implement advanced filter logic
    console.log('Advanced filter')
  }

  const handleOrderClick = (orderId: string) => {
    // Developer D: Implement order detail view logic
    console.log('Order detail:', orderId)
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="space-y-6 sm:space-y-8 px-4 py-6 sm:p-6 lg:p-8">
        
        <OrdersPageHeader 
          onExportReport={handleExportReport}
          onDateReport={handleDateReport}
        />

        <OrdersStats />

        <OrdersFilterSection
          filterState={filterState}
          actions={actions}
          statusOptions={statusOptions}
          channelOptions={channelOptions}
          filteredCount={filteredOrders.length}
          totalCount={mockOrders.length}
          onAdvancedFilter={handleAdvancedFilter}
        />

        <OrdersTable 
          orders={filteredOrders}
          onOrderClick={handleOrderClick}
        />

      </div>
    </div>
  )
}

