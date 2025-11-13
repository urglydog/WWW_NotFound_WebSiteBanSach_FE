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

      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/75">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-lg font-bold text-primary-foreground">📚</span>
              </div>
              <span className="hidden text-lg font-semibold text-foreground sm:inline md:text-xl">
                Nhà Sách Online
              </span>
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
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setSearchOpen(true)}
                className="rounded-lg p-2 transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Tìm kiếm"
              >
                <Search className="h-5 w-5" />
              </button>
              <button
                onClick={() => dispatch({ type: "TOGGLE_CART" })}
                className="relative rounded-lg p-2 transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Mở giỏ hàng"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User dropdown or login button */}
              {user ? (
                <Link
                  href="/account"
                  className="flex items-center gap-2 rounded-lg p-2 transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden text-sm font-medium sm:inline">{user.fullName}</span>
                </Link>
              ) : (
                <Link href="/login">
                  <Button variant="outline" size="sm" className="hidden bg-transparent sm:inline-flex">
                    Đăng nhập
                  </Button>
                </Link>
              )}

              {/* Mobile menu button */}
              <button
                className="rounded-lg p-2 transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
                aria-label="Mở menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <nav className="flex flex-col gap-2 pb-4 md:hidden">
              <Link
                href="/products"
                className="rounded-lg px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
                onClick={() => setMobileMenuOpen(false)}
              >
                Cửa hàng
              </Link>
              <Link
                href="/categories"
                className="rounded-lg px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
                onClick={() => setMobileMenuOpen(false)}
              >
                Danh mục
              </Link>
              <Link
                href="/about"
                className="rounded-lg px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
                onClick={() => setMobileMenuOpen(false)}
              >
                Về chúng tôi
              </Link>
              {user ? (
                <Link
                  href="/account"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Tài khoản
                </Link>
              ) : (
                <Link href="/login" className="w-full" onClick={() => setMobileMenuOpen(false)}>
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
