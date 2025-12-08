"use client"

import type React from "react"

import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MapPin, CreditCard, Loader2, Plus, Edit2, Trash2, CheckCircle2 } from "lucide-react"
import { addressService, AddressResponse } from "@/lib/services/address.service"
import { ordersService, CheckoutRequest } from "@/lib/services/orders.service"
import { toast } from "sonner"

export default function CheckoutPage() {
  const { cart, clearCart, loading } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  // Address State
  const [addresses, setAddresses] = useState<AddressResponse[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false)
  const [isCreatingNew, setIsCreatingNew] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "", // Email is usually from user profile, but keeping it here if needed for guest checkout logic (though we require login)
    phone: "",
    address: "",
    city: "",
    district: "",
    ward: "",
  })
  const [paymentMethod, setPaymentMethod] = useState("COD")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch addresses on mount
  useEffect(() => {
    if (user) {
      fetchAddresses()
    }
  }, [user])

  // Redirect if cart is empty
  useEffect(() => {
    if (!loading && (!cart || !cart.items || cart.items.length === 0)) {
      // Optional: redirect or just show empty state
    }
  }, [cart, loading])

  const fetchAddresses = async () => {
    try {
      setIsLoadingAddresses(true)
      const data = await addressService.getUserAddresses()
      setAddresses(data)
      // Select the first address by default if none selected
      if (data.length > 0 && !selectedAddressId) {
        setSelectedAddressId(data[0].id)
      }
    } catch (error) {
      console.error("Failed to fetch addresses:", error)
      toast.error("Không thể tải danh sách địa chỉ")
    } finally {
      setIsLoadingAddresses(false)
    }
  }

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: user?.email || "",
      phone: "",
      address: "",
      city: "",
      district: "",
      ward: "",
    })
    setIsCreatingNew(false)
    setEditingAddressId(null)
  }

  const handleEditAddress = (address: AddressResponse) => {
    setFormData({
      fullName: address.recipientName,
      email: user?.email || "",
      phone: address.phoneNumber,
      address: address.street,
      city: address.province,
      district: address.district,
      ward: address.ward,
    })
    setEditingAddressId(address.id)
    setIsCreatingNew(false)
  }

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) return

    try {
      await addressService.deleteAddress(id)
      toast.success("Đã xóa địa chỉ")
      fetchAddresses()
      if (selectedAddressId === id) {
        setSelectedAddressId(null)
      }
    } catch (error) {
      console.error("Failed to delete address:", error)
      toast.error("Không thể xóa địa chỉ")
    }
  }

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const addressData = {
        recipientName: formData.fullName,
        phoneNumber: formData.phone,
        street: formData.address,
        ward: formData.ward,
        district: formData.district,
        province: formData.city,
        provinceId: 202, // Dummy value
        districtId: 1454, // Dummy value
        wardCode: "20314", // Dummy value
        latitude: 0,
        longitude: 0
      }

      if (editingAddressId) {
        await addressService.updateAddress(editingAddressId, addressData)
        toast.success("Cập nhật địa chỉ thành công")
      } else {
        const newAddress = await addressService.createAddress(addressData)
        toast.success("Thêm địa chỉ mới thành công")
        setSelectedAddressId(newAddress.id)
      }

      await fetchAddresses()
      resetForm()
    } catch (error: any) {
      console.error("Address submit error:", error)
      toast.error(error.message || "Có lỗi xảy ra khi lưu địa chỉ")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để thanh toán")
      router.push("/login?redirect=/checkout")
      return
    }

    if (!selectedAddressId) {
      toast.error("Vui lòng chọn địa chỉ giao hàng")
      return
    }

    setIsSubmitting(true)

    try {
      const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : "http://localhost:3000"

      const checkoutRequest: CheckoutRequest = {
        addressId: selectedAddressId,
        paymentMethod: paymentMethod,
        note: "",
        bookIds: items.map(item => item.bookId),
        redirectUrl: `${origin}/payment/momo/return`
      }

      console.log("Checkout Request Data:", checkoutRequest)

      if (paymentMethod === "COD") {
        const order = await ordersService.checkout(checkoutRequest)
        toast.success("Đặt hàng thành công!")
        await clearCart()
        router.push(`/account/orders/${order.id}`)
      } else if (paymentMethod === "VNPay") {
        const response = await ordersService.checkoutVNPay(checkoutRequest)
        if (response.paymentUrl) {
          window.location.href = response.paymentUrl
        } else {
          toast.error("Không thể tạo link thanh toán VNPay")
        }
      } else if (paymentMethod === "ZaloPay") {
        const response = await ordersService.checkoutZaloPay(checkoutRequest)
        if (response.paymentUrl) {
          window.location.href = response.paymentUrl
        } else {
          toast.error("Không thể tạo link thanh toán ZaloPay")
        }
      } else if (paymentMethod === "MoMo") {
        const response = await ordersService.checkoutMoMo(checkoutRequest)
        if (response.paymentUrl) {
          window.location.href = response.paymentUrl
        } else {
          toast.error("Không thể tạo link thanh toán MoMo")
        }
      }
    } catch (error: any) {
      console.error("Checkout error:", error)
      toast.error(error.message || "Có lỗi xảy ra khi thanh toán")
    } finally {
      setIsSubmitting(false)
    }
  }

  const items = cart?.items || []
  const subtotal = cart?.totalPrice || 0
  const shipping = 0
  const total = subtotal + shipping

  if (!loading && items.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">Giỏ hàng trống. Quay lại để thêm sách.</p>
            <Link href="/products">
              <Button>Quay lại cửa hàng</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
          <h1 className="mb-8 text-3xl font-bold text-foreground">Thanh toán</h1>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left Column: Address & Payment */}
            <div className="lg:col-span-2 space-y-8">

              {/* Address Section */}
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="flex items-center gap-2 text-xl font-bold text-foreground">
                    <MapPin size={20} />
                    Thông tin giao hàng
                  </h2>
                  {!isCreatingNew && !editingAddressId && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        resetForm()
                        setIsCreatingNew(true)
                      }}
                    >
                      <Plus size={16} className="mr-2" />
                      Thêm địa chỉ mới
                    </Button>
                  )}
                </div>

                {/* Address List */}
                {!isCreatingNew && !editingAddressId && (
                  <div className="space-y-4">
                    {isLoadingAddresses ? (
                      <div className="flex justify-center py-4">
                        <Loader2 className="animate-spin" />
                      </div>
                    ) : addresses.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        Bạn chưa có địa chỉ nào. Vui lòng thêm địa chỉ mới.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4">
                        {addresses.map((addr) => (
                          <div
                            key={addr.id}
                            className={`relative rounded-lg border p-4 cursor-pointer transition-all ${selectedAddressId === addr.id
                              ? "border-primary bg-primary/5 ring-1 ring-primary"
                              : "border-border hover:border-primary/50"
                              }`}
                            onClick={() => setSelectedAddressId(addr.id)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex gap-3">
                                <div className={`mt-1 h-4 w-4 rounded-full border flex items-center justify-center ${selectedAddressId === addr.id ? "border-primary" : "border-muted-foreground"
                                  }`}>
                                  {selectedAddressId === addr.id && (
                                    <div className="h-2 w-2 rounded-full bg-primary" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-semibold text-foreground">{addr.recipientName} <span className="font-normal text-muted-foreground">| {addr.phoneNumber}</span></p>
                                  <p className="text-sm text-muted-foreground mt-1">{addr.street}</p>
                                  <p className="text-sm text-muted-foreground">{addr.ward}, {addr.district}, {addr.province}</p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleEditAddress(addr)
                                  }}
                                  className="p-2 text-muted-foreground hover:text-primary hover:bg-muted rounded-full transition"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDeleteAddress(addr.id)
                                  }}
                                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-muted rounded-full transition"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Address Form (Create/Edit) */}
                {(isCreatingNew || editingAddressId) && (
                  <form onSubmit={handleAddressSubmit} className="space-y-4 mt-4 border-t border-border pt-4">
                    <h3 className="font-semibold text-foreground">
                      {editingAddressId ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
                    </h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <input
                        type="text"
                        placeholder="Họ và tên"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary sm:col-span-2"
                        required
                      />
                      <input
                        type="tel"
                        placeholder="Số điện thoại"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary sm:col-span-2"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Tỉnh/Thành phố"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Quận/Huyện"
                        value={formData.district}
                        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                        className="px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Phường/Xã"
                        value={formData.ward}
                        onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                        className="px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                      <textarea
                        placeholder="Địa chỉ chi tiết (Số nhà, đường phố...)"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="resize-none rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary sm:col-span-2"
                        rows={3}
                        required
                      />
                    </div>
                    <div className="flex gap-3 justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={resetForm}
                        disabled={isSubmitting}
                      >
                        Hủy
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : "Lưu địa chỉ"}
                      </Button>
                    </div>
                  </form>
                )}
              </div>

              {/* Payment Method */}
              <div className="rounded-lg border border-border bg-card p-6">
                <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground">
                  <CreditCard size={20} />
                  Phương thức thanh toán
                </h2>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted transition">
                    <input
                      type="radio"
                      name="payment"
                      value="COD"
                      checked={paymentMethod === "COD"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4"
                    />
                    <div>
                      <p className="font-semibold text-foreground">Thanh toán khi nhận hàng (COD)</p>
                      <p className="text-sm text-muted-foreground">Thanh toán bằng tiền mặt khi nhận đơn hàng</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted transition">
                    <input
                      type="radio"
                      name="payment"
                      value="VNPay"
                      checked={paymentMethod === "VNPay"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4"
                    />
                    <div>
                      <p className="font-semibold text-foreground">VNPay</p>
                      <p className="text-sm text-muted-foreground">Thanh toán qua ví VNPay</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted transition">
                    <input
                      type="radio"
                      name="payment"
                      value="ZaloPay"
                      checked={paymentMethod === "ZaloPay"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4"
                    />
                    <div>
                      <p className="font-semibold text-foreground">ZaloPay</p>
                      <p className="text-sm text-muted-foreground">Thanh toán qua ví ZaloPay</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted transition">
                    <input
                      type="radio"
                      name="payment"
                      value="MoMo"
                      checked={paymentMethod === "MoMo"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4"
                    />
                    <div>
                      <p className="font-semibold text-foreground">MoMo</p>
                      <p className="text-sm text-muted-foreground">Thanh toán qua ví MoMo</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/cart" className="flex-1">
                  <Button variant="outline" className="w-full bg-transparent">
                    Quay lại giỏ hàng
                  </Button>
                </Link>
                <Button
                  onClick={handleCheckout}
                  className="flex-1 bg-primary hover:bg-primary/90"
                  disabled={isSubmitting || !selectedAddressId || isCreatingNew || !!editingAddressId}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : "Hoàn tất đơn hàng"}
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-lg border border-border bg-muted/50 p-6">
                <h2 className="mb-4 text-lg font-bold text-foreground">Đơn hàng của bạn</h2>

                <div className="mb-4 max-h-80 space-y-3 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.bookId} className="flex items-start justify-between gap-4 text-sm">
                      <span className="flex-1 text-muted-foreground">
                        {item.bookTitle} x {item.quantity}
                      </span>
                      <span className="whitespace-nowrap font-medium">
                        {(item.bookPrice * item.quantity).toLocaleString("vi-VN")}₫
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mb-4 space-y-3 border-t border-border pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Tạm tính:</span>
                    <span className="font-medium">{subtotal.toLocaleString("vi-VN")}₫</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Vận chuyển:</span>
                    <span className="font-medium text-accent">Miễn phí</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-border pt-4">
                  <span className="font-bold">Tổng cộng:</span>
                  <span className="font-bold text-lg text-primary">{total.toLocaleString("vi-VN")}₫</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
