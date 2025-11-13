"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { FcGoogle } from "react-icons/fc"

export function LoginForm() {
  const [formData, setFormData] = useState({ identifier: "", password: "" })
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isGoogleScriptLoaded, setIsGoogleScriptLoaded] = useState(false)
  const [isGoogleButtonReady, setIsGoogleButtonReady] = useState(false)
  const [googleError, setGoogleError] = useState("")
  const googleButtonRef = useRef<HTMLDivElement>(null)
  const googleButtonRenderedRef = useRef(false)
  const { login, loginWithGoogle, isLoading } = useAuth()
  const router = useRouter()
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

  const resetError = () => {
    if (error) {
      setError("")
    }
  }

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

  const handleGoogleCredential = useCallback(
    async (response: google.accounts.id.CredentialResponse) => {
      const credential = response?.credential
      if (!credential) {
        setError("Không thể xác thực bằng Google. Vui lòng thử lại.")
        return
      }

      try {
        resetError()
        const authenticatedUser = await loginWithGoogle(credential)
        const isAdmin = typeof authenticatedUser.role === "string" && authenticatedUser.role.toUpperCase() === "ADMIN"
        router.push(isAdmin ? "/admin" : "/account")
      } catch (err) {
        if (err instanceof Error) {
          switch (err.message) {
            case "GOOGLE_SIGNIN_UNCONFIGURED":
              setError("Google Sign-In chưa được cấu hình. Vui lòng liên hệ quản trị viên.")
              break
            case "GOOGLE_SIGNIN_EMAIL_REQUIRED":
              setError("Google không cung cấp email. Vui lòng chọn tài khoản khác.")
              break
            case "GOOGLE_SIGNIN_EMAIL_NOT_VERIFIED":
              setError("Email Google chưa được xác minh. Vui lòng kiểm tra lại.")
              break
            case "GOOGLE_SIGNIN_CREDENTIAL_MISSING":
            case "GOOGLE_SIGNIN_INVALID_TOKEN":
              setError("Thông tin xác thực Google không hợp lệ. Vui lòng thử lại.")
              break
            default:
              setError("Đăng nhập Google thất bại. Vui lòng thử lại.")
          }
        } else {
          setError("Đăng nhập Google thất bại. Vui lòng thử lại.")
        }
      }
    },
    [loginWithGoogle, resetError, router]
  )

  useEffect(() => {
    if (!googleClientId) {
      setGoogleError("Google Sign-In chưa được cấu hình. Vui lòng liên hệ quản trị viên.")
      return
    }

    if (typeof window === "undefined") return

    const existingScript = document.getElementById("google-client-script")
    if (existingScript) {
      setIsGoogleScriptLoaded(true)
      return
    }

    const script = document.createElement("script")
    script.src = "https://accounts.google.com/gsi/client"
    script.async = true
    script.defer = true
    script.id = "google-client-script"
    script.onload = () => {
      setIsGoogleScriptLoaded(true)
      setGoogleError("")
    }
    script.onerror = () => {
      setGoogleError("Không thể tải Google Sign-In. Vui lòng thử lại sau.")
    }
    document.head.appendChild(script)
  }, [googleClientId])

  useEffect(() => {
    if (!isGoogleScriptLoaded || !googleClientId || googleButtonRenderedRef.current) {
      return
    }

    const google = window.google
    if (!google?.accounts?.id) {
      setGoogleError("Không thể khởi tạo Google Sign-In. Vui lòng thử lại.")
      return
    }

    if (!googleButtonRef.current) {
      return
    }

    google.accounts.id.initialize({
      client_id: googleClientId,
      callback: handleGoogleCredential,
      auto_select: false,
      context: "signin",
    })

    google.accounts.id.renderButton(googleButtonRef.current, {
      theme: "outline",
      size: "large",
      width: "100%",
      text: "signin_with",
      shape: "rectangular",
    })
    googleButtonRenderedRef.current = true
    setIsGoogleButtonReady(true)
    google.accounts.id.prompt()
  }, [googleClientId, handleGoogleCredential, isGoogleScriptLoaded])

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

      <div className="space-y-3">
        <div className="flex items-center gap-3 text-xs uppercase text-muted-foreground">
          <span className="h-px w-full bg-border" />
          <span>Hoặc</span>
          <span className="h-px w-full bg-border" />
        </div>
        <div ref={googleButtonRef} className="flex justify-center">
          {!isGoogleButtonReady && (
            <Button type="button" variant="outline" className="w-full" disabled>
              <span className="flex w-full items-center justify-center gap-2">
                <FcGoogle className="h-5 w-5" />
                <span>{googleError ? "Google Sign-In chưa sẵn sàng" : "Đang khởi tạo Google..."}</span>
              </span>
            </Button>
          )}
        </div>
        {googleError && <p className="text-xs text-destructive text-center">{googleError}</p>}
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Chưa có tài khoản?{" "}
        <Link href="/signup" className="text-primary hover:text-primary/80 font-medium">
          Đăng ký ngay
        </Link>
      </p>
    </form>
  )
}
