"use client"

import Image from "next/image"
import { Edit, Trash2, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Book {
  id: string
  title: string
  author: string
  category: string
  price: number
  inStock: boolean
  reviews: number
  discount?: number
  image: string
}

interface BooksTableProps {
  books: Book[]
  className?: string
}

export function BooksTable({ books, className }: BooksTableProps) {
  return (
    <div className={`bg-card border border-border rounded-lg md:rounded-xl shadow-sm overflow-hidden ${className}`}>
      <div className="flex items-center justify-between px-3 py-3 sm:px-4 md:px-6 border-b border-border/60">
        <p className="text-xs text-muted-foreground">
          Hiển thị <span className="font-semibold">{books.length}</span> sách
        </p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Xuất danh sách</DropdownMenuItem>
            <DropdownMenuItem>In bảng kiểm kê</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block">
        <ScrollArea className="h-[500px] lg:h-[600px]">
          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full border-collapse">
              <thead className="bg-muted/40 text-left text-xs sm:text-sm text-muted-foreground sticky top-0">
                <tr>
                  <th className="px-3 sm:px-4 md:px-6 py-3 font-medium">Sách</th>
                  <th className="px-3 sm:px-4 md:px-6 py-3 font-medium">Tác giả</th>
                  <th className="px-3 sm:px-4 md:px-6 py-3 font-medium">Danh mục</th>
                  <th className="px-3 sm:px-4 md:px-6 py-3 font-medium text-right">Giá bán</th>
                  <th className="px-3 sm:px-4 md:px-6 py-3 font-medium text-right min-w-[140px]">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.id} className="border-t border-border/60 hover:bg-muted/40 transition">
                    <td className="px-3 sm:px-4 md:px-6 py-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="relative h-12 w-9 overflow-hidden rounded shrink-0">
                          <Image src={book.image || "/placeholder.svg"} alt={book.title} fill className="object-cover" sizes="36px" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-xs sm:text-sm text-foreground truncate">{book.title}</p>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <span>{book.reviews} đánh giá</span>
                            {book.discount && (
                              <Badge variant="secondary" className="bg-primary/10 text-primary text-xs px-1.5 py-0.5">
                                -{book.discount}%
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-4 text-xs sm:text-sm text-muted-foreground truncate">{book.author}</td>
                    <td className="px-3 sm:px-4 md:px-6 py-4 text-xs sm:text-sm text-muted-foreground">{book.category}</td>
                    <td className="px-3 sm:px-4 md:px-6 py-4 text-right font-semibold text-primary text-xs sm:text-sm">
                      {book.price.toLocaleString("vi-VN")}₫
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-4 min-w-[140px]">
                      <div className="flex justify-end items-center gap-1 sm:gap-2">
                        <Badge variant={book.inStock ? "outline" : "destructive"} className="px-2 py-0.5 text-xs">
                          {book.inStock ? "Còn hàng" : "Hết hàng"}
                        </Badge>
                        <Button variant="ghost" size="icon" className="w-8 h-8 text-primary hover:text-primary shrink-0">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="w-8 h-8 text-destructive hover:text-destructive shrink-0">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollArea>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden px-3 pb-3 space-y-3 sm:px-4 sm:pb-4 sm:space-y-3">
        {books.map((book) => (
          <div
            key={book.id}
            className="rounded-lg border border-border/60 bg-card p-3 sm:p-4 shadow-sm space-y-2.5"
          >
            <div className="flex gap-3">
              <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded">
                <Image src={book.image || "/placeholder.svg"} alt={book.title} fill className="object-cover" sizes="56px" />
              </div>
              <div className="flex-1 space-y-1.5 min-w-0">
                <div>
                  <h3 className="text-sm font-semibold text-foreground line-clamp-2">{book.title}</h3>
                  <p className="text-xs text-muted-foreground truncate">{book.author}</p>
                </div>
                <div className="flex flex-wrap items-center gap-1 text-xs">
                  <Badge variant="secondary" className="bg-muted text-foreground text-xs">
                    {book.category}
                  </Badge>
                  {book.discount && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                      -{book.discount}%
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-sm sm:text-base font-semibold text-primary">
                    {book.price.toLocaleString("vi-VN")}₫
                  </span>
                  <Badge variant={book.inStock ? "outline" : "destructive"} className="px-2 py-0.5 text-xs">
                    {book.inStock ? "Còn hàng" : "Hết"}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button size="sm" variant="outline" className="w-full gap-1 text-xs h-8">
                <Edit className="w-3 h-3" />
                <span>Chỉnh sửa</span>
              </Button>
              <Button size="sm" variant="destructive" className="w-full gap-1 text-xs h-8">
                <Trash2 className="w-3 h-3" />
                <span>Xóa</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}