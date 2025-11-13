"use client"

import { useMemo, useState } from "react"
import { mockBooks } from "@/lib/mock-data"
import Image from "next/image"
import { Plus, Search, Filter, Edit, Trash2, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Slider } from "@/components/ui/slider"

const availabilityFilters = [
  { label: "Tất cả", value: "all" },
  { label: "Còn hàng", value: "in-stock" },
  { label: "Hết hàng", value: "out-of-stock" },
]

export default function AdminBooksPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeAvailability, setActiveAvailability] = useState("all")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 400000])

  const categories = useMemo(() => {
    const unique = new Set(mockBooks.map((book) => book.category))
    return ["Tất cả", ...Array.from(unique)]
  }, [])

  const [activeCategory, setActiveCategory] = useState("Tất cả")

  const filteredBooks = useMemo(() => {
    return mockBooks.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesAvailability =
        activeAvailability === "all" ||
        (activeAvailability === "in-stock" && book.inStock) ||
        (activeAvailability === "out-of-stock" && !book.inStock)
      const matchesCategory = activeCategory === "Tất cả" || book.category === activeCategory
      const matchesPrice = book.price >= priceRange[0] && book.price <= priceRange[1]

      return matchesSearch && matchesAvailability && matchesCategory && matchesPrice
    })
  }, [searchTerm, activeAvailability, activeCategory, priceRange])

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Quản lý sách</h1>
            <p className="text-muted-foreground mt-2">
              Quản lý tồn kho, cập nhật thông tin sách và theo dõi hiệu suất bán hàng.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Lưu bộ lọc
            </Button>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Thêm sách mới
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Tìm kiếm theo tên sách, tác giả..."
                className="pl-10 pr-4 py-2"
              />
            </div>

            <ToggleGroup type="single" value={activeAvailability} onValueChange={(value) => value && setActiveAvailability(value)}>
              {availabilityFilters.map((filter) => (
                <ToggleGroupItem key={filter.value} value={filter.value} className="px-4">
                  {filter.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>

            <div className="space-y-2 w-full lg:w-64">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Khoảng giá</span>
                <span>
                  {priceRange[0].toLocaleString("vi-VN")}₫ - {priceRange[1].toLocaleString("vi-VN")}₫
                </span>
              </div>
              <Slider
                value={priceRange}
                onValueChange={(value) => setPriceRange(value as [number, number])}
                min={0}
                max={400000}
                step={10000}
              />
            </div>
          </div>

          <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value)}>
            <TabsList className="w-full justify-start overflow-x-auto">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/60">
              <p className="text-sm text-muted-foreground">Hiển thị {filteredBooks.length} / {mockBooks.length} sách</p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Xuất danh sách</DropdownMenuItem>
                  <DropdownMenuItem>In bảng kiểm kê</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <ScrollArea className="h-[560px]">
              <table className="w-full">
                <thead className="bg-muted/40 text-left text-sm text-muted-foreground">
                  <tr>
                    <th className="px-6 py-3 font-medium">Sách</th>
                    <th className="px-6 py-3 font-medium">Tác giả</th>
                    <th className="px-6 py-3 font-medium">Danh mục</th>
                    <th className="px-6 py-3 font-medium text-right">Giá bán</th>
                    <th className="px-6 py-3 font-medium text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBooks.map((book) => (
                    <tr key={book.id} className="border-t border-border/60 hover:bg-muted/40 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-14 w-10 overflow-hidden rounded">
                            <Image src={book.image} alt={book.title} fill className="object-cover" sizes="40px" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{book.title}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{book.reviews} lượt đánh giá</span>
                              {book.discount && (
                                <Badge variant="secondary" className="bg-primary/10 text-primary">
                                  -{book.discount}%
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{book.author}</td>
                      <td className="px-6 py-4 text-muted-foreground">{book.category}</td>
                      <td className="px-6 py-4 text-right font-semibold text-primary">
                        {book.price.toLocaleString("vi-VN")}₫
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end items-center gap-2">
                          <Badge variant={book.inStock ? "outline" : "destructive"} className="px-3">
                            {book.inStock ? "Còn hàng" : "Hết hàng"}
                          </Badge>
                          <Button variant="ghost" size="icon" className="text-primary hover:text-primary">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ScrollArea>
          </div>

          <div className="space-y-8">
            <div className="bg-card border border-border rounded-2xl shadow-sm p-6 space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Thống kê nhanh</h2>
                <p className="text-sm text-muted-foreground">Trạng thái kho và hiệu suất bán sách.</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Sách đang bán</span>
                  <span className="font-semibold text-foreground">
                    {mockBooks.filter((book) => book.inStock).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Sách sắp hết hàng</span>
                  <span className="font-semibold text-orange-500">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Doanh thu trung bình / sách</span>
                  <span className="font-semibold text-foreground">356.000₫</span>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl shadow-sm p-6 space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Tác giả nổi bật</h2>
                <p className="text-sm text-muted-foreground">Đóng góp doanh thu cao nhất tuần này.</p>
              </div>
              <div className="space-y-4">
                {mockBooks.slice(0, 4).map((book) => (
                  <div key={book.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{book.author}</p>
                      <p className="text-sm text-muted-foreground">{book.title}</p>
                    </div>
                    <Badge variant="secondary">{book.price.toLocaleString("vi-VN")}₫</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

