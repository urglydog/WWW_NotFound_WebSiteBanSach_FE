"use client"

import { UserLayout } from "@/components/layout/user-layout"
import { Card, Row, Col, Button, Rate, Spin } from "antd"
import Link from "next/link"
import { useEffect, useState } from "react"
import type { Book } from "@/lib/types"

const mockBooks: Book[] = [
  {
    id: 1,
    title: "Những đứa con lạc",
    isbn: "978-1234567890",
    price: 89000,
    discountPrice: 69000,
    stockQuantity: 50,
    publishDate: "2020-05-15",
    description: "Tiểu thuyết kinh điển",
    status: "AVAILABLE",
    imageUrl: "/psychology-book.jpg",
    categoryId: 1,
    authorId: 1,
    rating: 4.8,
    reviews: 234,
  },
  {
    id: 2,
    title: "Cách Đắc Nhân Tâm",
    isbn: "978-0987654321",
    price: 99000,
    discountPrice: 79000,
    stockQuantity: 120,
    publishDate: "2019-03-20",
    description: "Cuốn sách nổi tiếng thế giới",
    status: "AVAILABLE",
    imageUrl: "/abstract-book-cover.png",
    categoryId: 3,
    authorId: 3,
    rating: 4.9,
    reviews: 456,
  },
  {
    id: 3,
    title: "Kinh tế vi mô cơ bản",
    isbn: "978-1111111111",
    price: 129000,
    discountPrice: 99000,
    stockQuantity: 30,
    publishDate: "2021-06-10",
    description: "Giáo trình kinh tế",
    status: "AVAILABLE",
    imageUrl: "/economics-book.png",
    categoryId: 2,
    authorId: 2,
    rating: 4.5,
    reviews: 120,
  },
  {
    id: 4,
    title: "Phương pháp KonMari",
    isbn: "978-2222222222",
    price: 85000,
    discountPrice: 65000,
    stockQuantity: 80,
    publishDate: "2021-01-15",
    description: "Phương pháp sắp xếp",
    status: "AVAILABLE",
    imageUrl: "/vietnamese-literature.jpg",
    categoryId: 4,
    authorId: 4,
    rating: 4.7,
    reviews: 340,
  },
]

export default function Home() {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(false)
  }, [])

  const BookCard = ({ book }: { book: Book }) => (
    <Link href={`/products/${book.id}`} className="no-underline">
      <Card
        hoverable
        cover={
          <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
            <img src={book.imageUrl || "/placeholder.svg"} alt={book.title} className="w-full h-full object-cover" />
          </div>
        }
        className="h-full"
      >
        <div className="flex flex-col justify-between h-full">
          <div>
            <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">{book.title}</h3>
            <div className="flex items-center gap-1 mb-2">
              <Rate value={book.rating} disabled allowHalf />
              <span className="text-sm text-gray-500">({book.reviews})</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-red-600">{book.discountPrice.toLocaleString()} đ</span>
              <span className="text-sm text-gray-400 line-through">{book.price.toLocaleString()} đ</span>
            </div>
            <Button type="primary" block>
              Xem chi tiết
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  )

  return (
    <UserLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-400 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold">Khám phá thế giới sách đầy màu sắc</h1>
              <p className="text-lg opacity-90">
                Hàng triệu cuốn sách được chọn lọc cẩn thận, giao hàng nhanh, dịch vụ tốt nhất
              </p>
              <Link href="/products">
                <Button type="primary" size="large" className="bg-white text-blue-600">
                  Mua sắm ngay
                </Button>
              </Link>
            </div>
            <div className="text-center">
              <div className="text-6xl">📚</div>
            </div>
          </div>
        </div>
      </section>

      {/* Bestsellers Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Sách bán chạy nhất</h2>
          <p className="text-gray-600">Những cuốn sách được yêu thích nhất hiện tại</p>
        </div>

        <Spin spinning={loading}>
          <Row gutter={[16, 16]}>
            {mockBooks.map((book) => (
              <Col key={book.id} xs={12} sm={12} md={6} lg={6}>
                <BookCard book={book} />
              </Col>
            ))}
          </Row>
        </Spin>
      </section>

      {/* Categories Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold mb-2">Danh mục phổ biến</h2>
            <p className="text-gray-600">Duyệt qua các danh mục sách yêu thích</p>
          </div>

          <Row gutter={[16, 16]}>
            {["Văn học", "Kinh tế", "Tâm lý học", "Kỹ năng"].map((category) => (
              <Col key={category} xs={12} sm={12} md={6} lg={6}>
                <Card
                  hoverable
                  className="text-center"
                  cover={<div className="bg-blue-100 h-32 flex items-center justify-center text-4xl">📖</div>}
                >
                  <h3 className="font-semibold text-lg">{category}</h3>
                  <p className="text-gray-600 text-sm">Khám phá {category}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>
    </UserLayout>
  )
}
