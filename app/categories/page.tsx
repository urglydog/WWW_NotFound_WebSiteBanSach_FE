import Link from "next/link"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { categories, mockBooks } from "@/lib/mock-data"
import { slugify } from "@/lib/utils"
import { ArrowRight } from "lucide-react"

const categorySummaries = categories.map((category) => {
  const books = mockBooks.filter((book) => book.category === category)
  const featuredBook = books[0]

  return {
    name: category,
    slug: slugify(category),
    count: books.length,
    featured: featuredBook
      ? {
          title: featuredBook.title,
          author: featuredBook.author,
          price: featuredBook.price.toLocaleString("vi-VN"),
        }
      : null,
  }
})

export default function CategoriesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="border-b border-border bg-muted/50">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <h1 className="mb-3 text-3xl font-bold text-foreground">Danh mục sách</h1>
            <p className="max-w-2xl text-muted-foreground">
              Khám phá những danh mục sách nổi bật cùng các gợi ý nhanh để bạn bắt đầu hành trình đọc sách của mình.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categorySummaries.map((category) => (
              <Card key={category.slug} className="transition hover:border-primary">
                <CardHeader>
                  <CardTitle>{category.name}</CardTitle>
                  <CardDescription>
                    {category.count > 0 ? `${category.count} tựa sách` : "Chưa có sách trong danh mục này"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {category.featured ? (
                    <div className="space-y-2 rounded-lg border border-dashed border-border p-4">
                      <p className="text-sm uppercase text-muted-foreground">Gợi ý nổi bật</p>
                      <h3 className="font-semibold text-foreground">{category.featured.title}</h3>
                      <p className="text-sm text-muted-foreground">Tác giả: {category.featured.author}</p>
                      <p className="font-medium text-primary">{category.featured.price}₫</p>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
                      Chúng tôi đang cập nhật thêm sách cho danh mục này.
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Link
                    href={`/categories/${category.slug}`}
                    className="flex items-center gap-2 font-medium text-primary hover:text-primary/80"
                  >
                    Khám phá danh mục
                    <ArrowRight size={16} />
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

