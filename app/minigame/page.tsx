"use client"

import { useState } from "react"
import { SpinWheel } from "@/components/spin-wheel"
import { Confetti } from "@/components/confetti"
import { PrizeModal } from "@/components/prize-modal"
import { VoucherHistory } from "@/components/voucher-history"
import { BookOpen, Sparkles, Gift } from "lucide-react"

interface Prize {
  label: string
  value: string
}

interface Voucher {
  code: string
  label: string
  value: string
  date: string
}

export default function LuckySpinPage() {
  const [showConfetti, setShowConfetti] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [currentPrize, setCurrentPrize] = useState<Prize | null>(null)
  const [vouchers, setVouchers] = useState<Voucher[]>([])
  const [spinsRemaining, setSpinsRemaining] = useState(3)

  const handleSpinComplete = (prize: Prize) => {
    setCurrentPrize(prize)
    setShowConfetti(true)
    setShowModal(true)

    const newVoucher = {
      code: `BOOK${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      label: prize.label,
      value: prize.value,
      date: new Date().toLocaleDateString("vi-VN"),
    }
    setVouchers((prev) => [newVoucher, ...prev])
    setSpinsRemaining((prev) => Math.max(0, prev - 1))

    setTimeout(() => setShowConfetti(false), 4000)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setCurrentPrize(null)
  }

  return (
    <main className="min-h-screen bg-background">
      <Confetti active={showConfetti} />
      <PrizeModal open={showModal} onClose={handleCloseModal} prize={currentPrize} />

      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">BookStore</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Gift className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">
              Lượt quay: <span className="font-bold text-foreground">{spinsRemaining}</span>
            </span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Title section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            Sự kiện đặc biệt
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 text-balance">Vòng Quay May Mắn</h1>
          <p className="text-muted-foreground max-w-md mx-auto text-balance">
            Quay ngay để nhận voucher giảm giá hấp dẫn cho đơn hàng sách của bạn!
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Spin wheel section */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border">
              <div className="flex justify-center">
                <SpinWheel onSpinComplete={handleSpinComplete} />
              </div>

              {/* Instructions */}
              <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-muted rounded-xl">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Nhấn nút "Quay ngay"</p>
                </div>
                <div className="p-3 bg-muted rounded-xl">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Chờ vòng quay dừng</p>
                </div>
                <div className="p-3 bg-muted rounded-xl">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Nhận voucher ngay</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Prize info */}
            <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-foreground">
                <Gift className="h-5 w-5 text-primary" />
                Giải thưởng
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#9C27B0" }} />
                  <span className="text-foreground">Giảm 30% đơn hàng</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#4CAF50" }} />
                  <span className="text-foreground">Giảm 20% đơn hàng</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#F44336" }} />
                  <span className="text-foreground">Tặng 1 cuốn sách</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#FFC107" }} />
                  <span className="text-foreground">Voucher 50.000đ</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#2196F3" }} />
                  <span className="text-foreground">Miễn phí vận chuyển</span>
                </div>
              </div>
            </div>

            {/* Voucher history */}
            <VoucherHistory vouchers={vouchers} />
          </div>
        </div>
      </div>
    </main>
  )
}
