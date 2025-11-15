"use client"

import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { X, Trash2 } from "lucide-react"

export function CartSidebar() {
  const { state, dispatch } = useCart()

  const total = state.items.reduce((sum, item) => sum + item.book.price * item.quantity, 0)

  return (
    <>
      {/* Overlay */}
      {state.isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => dispatch({ type: "CLOSE_CART" })} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-background border-l border-border z-50 transform transition-transform duration-300 flex flex-col ${
          state.isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">Giỏ hàng</h2>
          <button onClick={() => dispatch({ type: "CLOSE_CART" })} className="p-2 hover:bg-muted rounded-lg transition">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {state.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <span className="text-4xl mb-3">🛒</span>
              <p className="text-muted-foreground">Giỏ hàng của bạn trống</p>
              <p className="text-sm text-muted-foreground mt-2">Thêm sách để bắt đầu mua sắm</p>
            </div>
          ) : (
            <div className="space-y-4">
              {state.items.map((item) => (
                <div key={item.book.id} className="flex gap-4 pb-4 border-b border-border">
                  {/* Image */}
                  <div className="w-16 h-24 bg-muted rounded shrink-0 flex items-center justify-center">
                    <img
                      src={item.book.image || "/placeholder.svg"}
                      alt={item.book.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.book.id}`}
                      className="font-semibold text-foreground hover:text-primary transition line-clamp-2"
                    >
                      {item.book.title}
                    </Link>
                    <p className="text-sm text-muted-foreground mb-2">{item.book.author}</p>
                    <p className="font-semibold text-primary">{item.book.price.toLocaleString("vi-VN")}₫</p>

                    {/* Quantity & Remove */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-border rounded">
                        <button
                          onClick={() =>
                            dispatch({
                              type: "UPDATE_QUANTITY",
                              payload: { id: item.book.id, quantity: item.quantity - 1 },
                            })
                          }
                          className="px-2 py-1 hover:bg-muted"
                        >
                          −
                        </button>
                        <span className="px-3 py-1 text-sm">{item.quantity}</span>
                        <button
                          onClick={() =>
                            dispatch({
                              type: "UPDATE_QUANTITY",
                              payload: { id: item.book.id, quantity: item.quantity + 1 },
                            })
                          }
                          className="px-2 py-1 hover:bg-muted"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => dispatch({ type: "REMOVE_ITEM", payload: item.book.id })}
                        className="p-1 hover:text-destructive transition ml-auto"
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

        {/* Footer */}
        {state.items.length > 0 && (
          <div className="border-t border-border p-6 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tạm tính:</span>
                <span className="font-semibold">{total.toLocaleString("vi-VN")}₫</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Vận chuyển:</span>
                <span className="font-semibold">Miễn phí</span>
              </div>
            </div>
            <div className="border-t border-border pt-4 flex justify-between">
              <span className="font-bold">Tổng cộng:</span>
              <span className="font-bold text-lg text-primary">{total.toLocaleString("vi-VN")}₫</span>
            </div>
            <Link href="/checkout" className="block">
              <Button className="w-full bg-primary hover:bg-primary/90">Thanh toán</Button>
            </Link>
            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={() => dispatch({ type: "CLOSE_CART" })}
            >
              Tiếp tục mua sắm
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
