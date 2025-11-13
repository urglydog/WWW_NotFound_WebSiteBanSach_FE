"use client"

import { useState, useMemo } from "react"
import { mockBooks } from "@/lib/mock-data"
import { Search, X, TrendingUp } from "lucide-react"
import Link from "next/link"

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const results = useMemo(() => {
    if (!searchTerm.trim()) {
      return []
    }
    const term = searchTerm.toLowerCase()
    return mockBooks.filter(
      (book) =>
        book.title.toLowerCase().includes(term) ||
        book.author.toLowerCase().includes(term) ||
        book.category.toLowerCase().includes(term),
    )
  }, [searchTerm])

  const popularSearches = ["Văn học", "Kinh tế", "Tâm lý học", "Công nghệ"]

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
        <div className="bg-background rounded-lg shadow-2xl w-full max-w-2xl mx-4">
          {/* Search Input */}
          <div className="relative p-4 border-b border-border">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm sách, tác giả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
              className="w-full pl-12 pr-10 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={onClose}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={20} />
            </button>
          </div>

          {/* Results or Popular */}
          <div className="max-h-96 overflow-y-auto">
            {searchTerm.trim() ? (
              <>
                {results.length > 0 ? (
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-3 font-semibold">
                      Tìm thấy {results.length} kết quả
                    </p>
                    <div className="space-y-2">
                      {results.map((book) => (
                        <Link key={book.id} href={`/products/${book.id}`} onClick={onClose}>
                          <div className="flex gap-3 p-3 rounded-lg hover:bg-muted transition cursor-pointer">
                            <div className="w-12 h-16 bg-muted rounded flex-shrink-0 flex items-center justify-center">
                              📚
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground truncate">{book.title}</p>
                              <p className="text-sm text-muted-foreground">{book.author}</p>
                              <p className="text-sm text-primary font-semibold">
                                {book.price.toLocaleString("vi-VN")}₫
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    <p>Không tìm thấy sách nào phù hợp</p>
                    <p className="text-sm mt-2">Hãy thử tìm kiếm với từ khác</p>
                  </div>
                )}
              </>
            ) : (
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4 text-foreground">
                  <TrendingUp size={18} />
                  <p className="font-semibold">Tìm kiếm phổ biến</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((search) => (
                    <button
                      key={search}
                      onClick={() => setSearchTerm(search)}
                      className="px-3 py-1.5 bg-muted hover:bg-muted/80 text-foreground rounded-full text-sm font-medium transition"
                    >
                      {search}
                    </button>
                  ))}
                </div>

                <div className="mt-8">
                  <p className="font-semibold text-foreground mb-3">Gợi ý cho bạn</p>
                  <div className="grid grid-cols-2 gap-3">
                    {mockBooks.slice(0, 4).map((book) => (
                      <Link
                        key={book.id}
                        href={`/products/${book.id}`}
                        onClick={onClose}
                        className="p-3 bg-muted rounded-lg hover:bg-muted/80 transition cursor-pointer"
                      >
                        <div className="text-center">
                          <p className="text-2xl mb-2">📚</p>
                          <p className="text-xs font-medium text-foreground line-clamp-2">{book.title}</p>
                          <p className="text-xs text-primary font-semibold mt-1">
                            {book.price.toLocaleString("vi-VN")}₫
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
