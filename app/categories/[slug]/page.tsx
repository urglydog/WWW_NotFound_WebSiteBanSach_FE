import { notFound } from "next/navigation"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ProductCard } from "@/components/products/product-card"
import { categories, mockBooks } from "@/lib/mock-data"
import { matchBySlug, slugify } from "@/lib/utils"

interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>
}

export function generateStaticParams() {
  return categories.map((category) => ({ slug: slugify(category) }))
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)
  const categoryName = matchBySlug(decodedSlug, categories)

  if (!categoryName) {
    notFound()
  }

  const books = mockBooks.filter((book) => book.category === categoryName)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="border-b border-border bg-muted/50">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <h1 className="mb-3 text-3xl font-bold text-foreground">{categoryName}</h1>
            <p className="max-w-2xl text-muted-foreground">
              {books.length > 0
                ? `Tìm thấy ${books.length} tựa sách thuộc danh mục ${categoryName.toLowerCase()}.`
                : `Chưa có sách nào trong danh mục ${categoryName.toLowerCase()} – quay lại sau nhé!`}
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {books.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {books.map((book) => (
                <ProductCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border p-10 text-center text-muted-foreground">
              Chúng tôi đang cập nhật thêm sách cho danh mục này.
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}

