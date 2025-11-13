import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { RecommendationSection } from "@/components/recommendations/recommendation-section"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-linear-to-br from-secondary to-background py-16 sm:py-20 md:py-32">
          <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-10 md:gap-12 lg:grid-cols-2">
              <div className="space-y-6 text-center lg:text-left">
                <h1 className="text-4xl font-bold leading-tight text-foreground sm:text-5xl">
                  Khám phá thế giới sách đầy màu sắc
                </h1>
                <p className="mx-auto max-w-xl text-base text-muted-foreground sm:text-lg lg:mx-0">
                  Tìm kiếm những cuốn sách yêu thích của bạn từ hàng triệu đầu sách được chọn lọc cẩn thận.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
                  <Button size="lg" className="w-full bg-primary hover:bg-primary/90 sm:w-auto">
                    Mua sắm ngay
                  </Button>
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Khám phá thêm
                  </Button>
                </div>
              </div>
              <div className="order-first flex justify-center lg:order-last">
                <div className="flex aspect-square max-w-xs items-center justify-center rounded-2xl bg-muted sm:max-w-sm lg:max-w-md">
                  <div className="text-center">
                    <span className="text-5xl sm:text-6xl">📚</span>
                    <p className="mt-4 text-sm text-muted-foreground sm:text-base">Hình ảnh sách nổi bật</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recommendations */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <RecommendationSection
            title="Sách bán chạy nhất"
            description="Những cuốn sách được yêu thích nhất hiện tại"
            type="trending"
            limit={4}
          />

          <RecommendationSection
            title="Gợi ý cho bạn"
            description="Những sách được đánh giá cao nhất"
            type="recommendations"
            limit={4}
          />

          <RecommendationSection
            title="Sách văn học"
            description="Khám phá những tác phẩm văn học hay nhất"
            type="category"
            categoryFilter="Văn học"
            limit={4}
          />
        </div>

        {/* Featured Categories */}
        <section className="py-14 sm:py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center md:mb-12">
              <h2 className="mb-3 text-3xl font-bold text-foreground md:mb-4 md:text-4xl">Danh mục phổ biến</h2>
              <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">
                Duyệt qua các danh mục sách được yêu thích nhất của chúng tôi
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
              {["Văn học", "Kinh tế", "Tâm lý học"].map((category, i) => (
                <Link key={i} href={`/categories/${category.toLowerCase()}`}>
                  <div className="group cursor-pointer">
                    <div className="mb-4 aspect-square overflow-hidden rounded-lg bg-muted transition group-hover:shadow-lg">
                      <div className="flex h-full w-full items-center justify-center transition group-hover:bg-secondary">
                        <span className="text-4xl sm:text-5xl">📖</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground transition group-hover:text-primary">
                      {category}
                    </h3>
                    <p className="text-sm text-muted-foreground sm:text-base">Khám phá {category.toLowerCase()}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
