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
        <section className="bg-gradient-to-br from-secondary to-background py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight text-balance">
                  Khám phá thế giới sách đầy màu sắc
                </h1>
                <p className="text-lg text-muted-foreground max-w-md">
                  Tìm kiếm những cuốn sách yêu thích của bạn từ hàng triệu đầu sách được chọn lọc cẩn thận.
                </p>
                <div className="flex gap-4">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Mua sắm ngay
                  </Button>
                  <Button size="lg" variant="outline">
                    Khám phá thêm
                  </Button>
                </div>
              </div>
              <div className="aspect-square bg-muted rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <span className="text-6xl">📚</span>
                  <p className="mt-4 text-muted-foreground">Hình ảnh sách nổi bật</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recommendations */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Danh mục phổ biến</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Duyệt qua các danh mục sách được yêu thích nhất của chúng tôi
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {["Văn học", "Kinh tế", "Tâm lý học"].map((category, i) => (
                <Link key={i} href={`/categories/${category.toLowerCase()}`}>
                  <div className="group cursor-pointer">
                    <div className="aspect-square bg-muted rounded-lg mb-4 overflow-hidden">
                      <div className="w-full h-full flex items-center justify-center group-hover:bg-secondary transition">
                        <span className="text-5xl">📖</span>
                      </div>
                    </div>
                    <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition">
                      {category}
                    </h3>
                    <p className="text-sm text-muted-foreground">Khám phá {category.toLowerCase()}</p>
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
