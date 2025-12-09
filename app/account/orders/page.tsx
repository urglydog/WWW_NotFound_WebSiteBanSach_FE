"use client";

import { useAuth } from "@/lib/auth-context";
import {
  ordersService,
  OrderResponse,
  OrderStatus,
} from "@/lib/services/orders.service";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import {
  Package,
  ChevronRight,
  Loader2,
  Search,
  Filter,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";

export default function OrdersPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      fetchOrders();
    }
  }, [user, authLoading, router]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await ordersService.getMyOrders();
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  // Filter orders based on search criteria
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Search by order code
      const matchesSearch =
        searchQuery === "" ||
        (order.orderCode &&
          order.orderCode.toLowerCase().includes(searchQuery.toLowerCase())) ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by status
      const matchesStatus =
        selectedStatus === "all" || order.status === selectedStatus;

      // Filter by date range
      const orderDate = new Date(order.orderDate);
      const matchesStartDate = !startDate || orderDate >= new Date(startDate);
      const matchesEndDate = !endDate || orderDate <= new Date(endDate);

      return (
        matchesSearch && matchesStatus && matchesStartDate && matchesEndDate
      );
    });
  }, [orders, searchQuery, selectedStatus, startDate, endDate]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedStatus("all");
    setStartDate("");
    setEndDate("");
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedStatus !== "all" ||
    startDate !== "" ||
    endDate !== "";

  if (authLoading || loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) return null;

  const statusConfig: Record<string, { label: string; color: string }> = {
    PENDING: { label: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-700" },
    CONFIRMED: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-700" },
    PROCESSING: { label: "Đang chuẩn bị", color: "bg-blue-100 text-blue-700" },
    SHIPPED: { label: "Đang giao", color: "bg-purple-100 text-purple-700" },
    DELIVERED: { label: "Đã giao", color: "bg-green-100 text-green-700" },
    CANCELLED: { label: "Đã hủy", color: "bg-red-100 text-red-700" },
    COMPLETED: { label: "Hoàn thành", color: "bg-green-100 text-green-700" },
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Đơn hàng của tôi
            </h1>
            <p className="text-muted-foreground">
              Theo dõi trạng thái đơn hàng của bạn
            </p>
          </div>

          {/* Search and Filter Section */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Search by Order Code */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Tìm kiếm theo mã đơn hàng..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4"
                  />
                </div>

                {/* Filter Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Status Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Trạng thái
                    </label>
                    <Select
                      value={selectedStatus}
                      onValueChange={setSelectedStatus}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tất cả trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả trạng thái</SelectItem>
                        <SelectItem value="PENDING">Chờ xác nhận</SelectItem>
                        <SelectItem value="CONFIRMED">Đã xác nhận</SelectItem>
                        <SelectItem value="PROCESSING">
                          Đang chuẩn bị
                        </SelectItem>
                        <SelectItem value="SHIPPED">Đang giao</SelectItem>
                        <SelectItem value="DELIVERED">Đã giao</SelectItem>
                        <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
                        <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Start Date Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Từ ngày
                    </label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>

                  {/* End Date Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Đến ngày
                    </label>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>

                {/* Clear Filters Button */}
                {hasActiveFilters && (
                  <div className="flex items-center justify-between pt-2">
                    <p className="text-sm text-muted-foreground">
                      Tìm thấy {filteredOrders.length} đơn hàng
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearFilters}
                      className="gap-2"
                    >
                      <X className="h-4 w-4" />
                      Xóa bộ lọc
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package
                size={48}
                className="mx-auto text-muted-foreground mb-4 opacity-50"
              />
              <p className="text-muted-foreground mb-4">
                {hasActiveFilters
                  ? "Không tìm thấy đơn hàng phù hợp"
                  : "Chưa có đơn hàng nào"}
              </p>
              {!hasActiveFilters && (
                <Link href="/products">
                  <Button>Mua sắm ngay</Button>
                </Link>
              )}
              {hasActiveFilters && (
                <Button onClick={clearFilters} variant="outline">
                  Xóa bộ lọc
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const config = statusConfig[order.status] || {
                  label: order.status,
                  color: "bg-gray-100 text-gray-700",
                };
                return (
                  <Link
                    key={order.id}
                    href={`/account/orders/${order.id}`}
                    className="block"
                  >
                    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-lg text-foreground">
                            Đơn hàng #
                            {order.orderCode || order.id.substring(0, 8)}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.orderDate).toLocaleDateString(
                              "vi-VN"
                            )}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}
                        >
                          {config.label}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Số lượng sách
                          </p>
                          <p className="font-semibold text-foreground">
                            {order.items.length}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Tổng tiền
                          </p>
                          <p className="font-semibold text-primary text-lg">
                            {order.total.toLocaleString("vi-VN")}₫
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Phương thức thanh toán
                          </p>
                          <p className="font-semibold text-foreground">
                            {order.paymentMethod}
                          </p>
                        </div>
                      </div>

                      {/* Tracking number is not in OrderResponse yet, skipping */}

                      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                        <div className="flex items-center gap-2 text-primary">
                          <span className="text-sm font-medium">
                            Xem chi tiết
                          </span>
                          <ChevronRight size={16} />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
