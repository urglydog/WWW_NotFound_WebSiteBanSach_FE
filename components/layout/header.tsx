"use client"

import Link from "next/link"
import { ShoppingCart, Search, Menu, X, User } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { SearchModal } from "@/components/search/search-modal"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { state, dispatch } = useCart()
  const { user } = useAuth()
  const cartCount = state.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <>
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <header className="border-b border-border bg-background sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">📚</span>
              </div>
              <span className="text-xl font-semibold text-foreground hidden sm:inline">Nhà Sách Online</span>
            </Link>

            {/* Navigation - Desktop */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/products" className="text-foreground hover:text-primary transition">
                Cửa hàng
              </Link>
              <Link href="/categories" className="text-foreground hover:text-primary transition">
                Danh mục
              </Link>
              <Link href="/about" className="text-foreground hover:text-primary transition">
                Về chúng tôi
              </Link>
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-4">
              <button onClick={() => setSearchOpen(true)} className="p-2 hover:bg-muted rounded-lg transition">
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={() => dispatch({ type: "TOGGLE_CART" })}
                className="p-2 hover:bg-muted rounded-lg transition relative"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User dropdown or login button */}
              {user ? (
                <Link href="/account" className="p-2 hover:bg-muted rounded-lg transition flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span className="hidden sm:inline text-sm font-medium">{user.fullName}</span>
                </Link>
              ) : (
                <Link href="/login">
                  <Button variant="outline" size="sm" className="hidden sm:inline-flex bg-transparent">
                    Đăng nhập
                  </Button>
                </Link>
              )}

              {/* Mobile menu button */}
              <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <nav className="md:hidden pb-4 flex flex-col gap-3">
              <Link href="/products" className="text-foreground hover:text-primary py-2">
                Cửa hàng
              </Link>
              <Link href="/categories" className="text-foreground hover:text-primary py-2">
                Danh mục
              </Link>
              <Link href="/about" className="text-foreground hover:text-primary py-2">
                Về chúng tôi
              </Link>
              {user ? (
                <Link href="/account" className="text-foreground hover:text-primary py-2">
                  Tài khoản
                </Link>
              ) : (
                <Link href="/login" className="w-full">
                  <Button className="w-full">Đăng nhập</Button>
                </Link>
              )}
            </nav>
          )}
        </div>
      </header>
    </>
  )
}
