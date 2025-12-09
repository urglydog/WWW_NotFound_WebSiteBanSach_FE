"use client"

import { useState } from "react"
import Link from "next/link"
import { Gift, Sparkles, X } from "lucide-react"

import { SpinWheel } from "@/components/minigame/spin-wheel"
import { Confetti } from "@/components/minigame/confetti"
import { PrizeModal } from "@/components/minigame/prize-modal"
import { VoucherHistory } from "@/components/minigame/voucher-history"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

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

export function MiniGameChat() {
  const [isOpen, setIsOpen] = useState(false)
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
    <>
      <Confetti active={showConfetti} />
      <PrizeModal open={showModal} onClose={handleCloseModal} prize={currentPrize} />

      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
        {isOpen && (
          <div className="w-[360px] max-w-[calc(100vw-32px)] rounded-2xl border border-border bg-card shadow-2xl animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/60">
              <div className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Mini game</p>
                  <p className="text-xs text-muted-foreground">Quay để nhận voucher</p>
                </div>
              </div>
              <button
                aria-label="Đóng mini game"
                className="p-1 rounded-full hover:bg-muted text-muted-foreground"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground bg-muted rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span>Sự kiện Vòng quay may mắn</span>
                </div>
                <span>
                  Lượt: <span className="font-semibold text-foreground">{spinsRemaining}</span>
                </span>
              </div>

              <div className="flex justify-center">
                <div className="scale-75 origin-top">
                  <SpinWheel onSpinComplete={handleSpinComplete} />
                </div>
              </div>

              <Separator />

              <VoucherHistory vouchers={vouchers.slice(0, 3)} />

              <div className="flex gap-2">
                <Link href="/minigame" className="w-full">
                  <Button variant="outline" className="w-full">
                    Xem trang minigame
                  </Button>
                </Link>
                <Button
                  className="w-full bg-primary text-primary-foreground"
                  onClick={() => setIsOpen(false)}
                >
                  Đóng
                </Button>
              </div>
            </div>
          </div>
        )}

        <Button
          size="lg"
          className="rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <Gift className="h-5 w-5 mr-2" />
          Mini game
        </Button>
      </div>
    </>
  )
}

