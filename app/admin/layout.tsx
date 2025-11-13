"use client"

import { AdminSidebar } from "@/components/admin/sidebar"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, type ReactNode } from "react"

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return

    if (!user) {
      router.replace("/login")
      return
    }

    if (typeof user.role === "string" && user.role.toUpperCase() !== "ADMIN") {
      router.replace("/")
    }
  }, [isLoading, router, user])

  if (isLoading || !user || (typeof user.role === "string" && user.role.toUpperCase() !== "ADMIN")) {
    return null
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar onLogout={handleLogout} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
