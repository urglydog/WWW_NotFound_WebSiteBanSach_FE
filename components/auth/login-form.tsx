"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"

export function LoginForm() {
  const [formData, setFormData] = useState({ identifier: "", password: "" })
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.identifier || !formData.password) {
      setError("Vui lòng điền đầy đủ thông tin")
      return
    }

    try {
      const authenticatedUser = await login(formData.identifier, formData.password)
      const isAdmin = typeof authenticatedUser.role === "string" && authenticatedUser.role.toUpperCase() === "ADMIN"
      router.push(isAdmin ? "/admin" : "/account")
    } catch (err) {
      if (err instanceof Error && err.message === "INVALID_CREDENTIALS") {
        setError("Sai tên đăng nhập/email hoặc mật khẩu. Vui lòng kiểm tra lại.")
      } else {
        setError("Đăng nhập thất bại. Vui lòng thử lại.")
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive text-destructive rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Email hoặc tên đăng nhập</label>
        <input
          type="text"
          value={formData.identifier}
          onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="admin hoặc admin@bookstore.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Mật khẩu</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
        {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Chưa có tài khoản?{" "}
        <Link href="/signup" className="text-primary hover:text-primary/80 font-medium">
          Đăng ký ngay
        </Link>
      </p>
    </form>
  )
}
