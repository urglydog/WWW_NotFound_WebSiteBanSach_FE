"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface User {
  id: string
  email: string
  fullName: string
  role: "ADMIN" | "CUSTOMER" | string
  username?: string
  phone?: string
  avatar?: string
  createdAt: string
}

function decodeGoogleCredential(credential: string) {
  const parts = credential.split(".")
  if (parts.length < 2) {
    throw new Error("GOOGLE_SIGNIN_INVALID_TOKEN")
  }

  const base64 = parts[1]
  const normalized = base64.replace(/-/g, "+").replace(/_/g, "/")
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=")
  const decoded = atob(padded)

  try {
    return JSON.parse(decoded)
  } catch {
    throw new Error("GOOGLE_SIGNIN_INVALID_TOKEN")
  }
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (identifier: string, password: string) => Promise<User>
  signup: (email: string, password: string, fullName: string) => Promise<User>
  loginWithGoogle: (credential: string) => Promise<User>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Simulate checking if user is logged in on mount
  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (stored) {
      try {
        const parsedUser = JSON.parse(stored) as Partial<User>
        if (parsedUser && typeof parsedUser === "object") {
          setUser({
            id: parsedUser.id ?? "",
            email: parsedUser.email ?? "",
            fullName: parsedUser.fullName ?? "",
            role: parsedUser.role ?? "CUSTOMER",
            username: parsedUser.username,
            phone: parsedUser.phone,
            avatar: parsedUser.avatar,
            createdAt: parsedUser.createdAt ?? new Date().toISOString(),
          })
        }
      } catch {
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (identifier: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      const normalizedIdentifier = identifier.trim().toLowerCase()
      const normalizedPassword = password.trim()
      if (!normalizedIdentifier || !normalizedPassword) {
        throw new Error("INVALID_CREDENTIALS")
      }

      const response = await fetch("/db.json")
      if (!response.ok) {
        throw new Error("FAILED_TO_FETCH_USERS")
      }

      const data = await response.json()
      const users = Array.isArray(data?.users) ? data.users : []

      const matchedUser = users.find((user: any) => {
        if (!user) return false
        const email = typeof user.email === "string" ? user.email.trim().toLowerCase() : ""
        const username = typeof user.username === "string" ? user.username.trim().toLowerCase() : ""
        return normalizedIdentifier === email || normalizedIdentifier === username
      })

      if (!matchedUser) {
        throw new Error("INVALID_CREDENTIALS")
      }

      const storedPassword = typeof matchedUser.password === "string" ? matchedUser.password.trim() : ""
      if (storedPassword !== normalizedPassword) {
        throw new Error("INVALID_CREDENTIALS")
      }

      const role = typeof matchedUser.role === "string" ? matchedUser.role.toUpperCase() : "CUSTOMER"

      const authenticatedUser: User = {
        id: String(matchedUser.id ?? ""),
        email: matchedUser.email ?? "",
        fullName: matchedUser.fullName ?? matchedUser.username ?? matchedUser.email?.split("@")[0] ?? "",
        role,
        username: matchedUser.username,
        phone: matchedUser.phone,
        avatar: matchedUser.avatar,
        createdAt: new Date().toISOString(),
      }

      setUser(authenticatedUser)
      localStorage.setItem("user", JSON.stringify(authenticatedUser))
      return authenticatedUser
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithGoogle = async (credential: string) => {
    if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
      throw new Error("GOOGLE_SIGNIN_UNCONFIGURED")
    }

    if (!credential) {
      throw new Error("GOOGLE_SIGNIN_CREDENTIAL_MISSING")
    }

    setIsLoading(true)
    try {
      const payload = decodeGoogleCredential(credential)
      const email = typeof payload?.email === "string" ? payload.email : ""
      const emailVerified = typeof payload?.email_verified === "boolean" ? payload.email_verified : true

      if (!email) {
        throw new Error("GOOGLE_SIGNIN_EMAIL_REQUIRED")
      }

      if (!emailVerified) {
        throw new Error("GOOGLE_SIGNIN_EMAIL_NOT_VERIFIED")
      }

      let matchedUser: any = null
      try {
        const response = await fetch("/db.json")
        if (response.ok) {
          const data = await response.json()
          const users = Array.isArray(data?.users) ? data.users : []
          matchedUser = users.find((user: any) => {
            if (!user?.email) return false
            return String(user.email).trim().toLowerCase() === email.trim().toLowerCase()
          })
        }
      } catch {
        // Ignore fetch errors; fallback to Google payload
      }

      const role = typeof matchedUser?.role === "string" ? matchedUser.role.toUpperCase() : "CUSTOMER"
      const fullName =
        typeof payload?.name === "string" && payload.name
          ? payload.name
          : typeof matchedUser?.fullName === "string" && matchedUser.fullName
            ? matchedUser.fullName
            : email.split("@")[0] ?? ""

      const authenticatedUser: User = {
        id: String(matchedUser?.id ?? payload?.sub ?? crypto.randomUUID()),
        email,
        fullName,
        role,
        username: matchedUser?.username ?? (typeof payload?.given_name === "string" ? payload.given_name : undefined),
        phone: matchedUser?.phone,
        avatar: typeof payload?.picture === "string" ? payload.picture : matchedUser?.avatar,
        createdAt: new Date().toISOString(),
      }

      setUser(authenticatedUser)
      localStorage.setItem("user", JSON.stringify(authenticatedUser))
      return authenticatedUser
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (email: string, password: string, fullName: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        fullName,
        role: "CUSTOMER",
        createdAt: new Date().toISOString(),
      }

      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))
      return mockUser
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        loginWithGoogle,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
