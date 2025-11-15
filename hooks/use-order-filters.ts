import { useMemo, useState } from "react"

export interface Order {
  id: string
  customer: string
  email: string
  phone: string
  total: number
  items: number
  date: string
  status: string
  payment: string
  address: string
}

export interface OrderFilterState {
  searchTerm: string
  activeStatus: string
  channel: string
}

export interface OrderFilterActions {
  setSearchTerm: (value: string) => void
  setActiveStatus: (value: string) => void
  setChannel: (value: string) => void
  resetFilters: () => void
}

export function useOrderFilters(orders: Order[]) {
  // Filter state
  const [searchTerm, setSearchTerm] = useState("")
  const [activeStatus, setActiveStatus] = useState("Tất cả")
  const [channel, setChannel] = useState("Tất cả kênh")

  // Status options
  const statusOptions = useMemo(() => 
    ["Tất cả", "Đang xử lý", "Đang giao", "Đã giao", "Đã hủy"], []
  )

  // Channel options  
  const channelOptions = useMemo(() => 
    ["Tất cả kênh", "Website", "Cửa hàng"], []
  )

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = activeStatus === "Tất cả" || order.status === activeStatus
      const matchesChannel = channel === "Tất cả kênh" || channel === "Website"

      return matchesSearch && matchesStatus && matchesChannel
    })
  }, [searchTerm, activeStatus, channel, orders])

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("")
    setActiveStatus("Tất cả")
    setChannel("Tất cả kênh")
  }

  return {
    filterState: {
      searchTerm,
      activeStatus,
      channel,
    },
    filteredOrders,
    statusOptions,
    channelOptions,
    actions: {
      setSearchTerm,
      setActiveStatus,
      setChannel,
      resetFilters,
    },
  }
}