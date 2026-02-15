import { Suspense } from 'react'
import PricingClient from './PricingClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bảng giá',
  description: 'Chọn gói phù hợp để truy cập đầy đủ nội dung AI Community',
}

function PricingFallback() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
      <div className="animate-pulse text-[var(--text-tertiary)]">Đang tải...</div>
    </div>
  )
}

export default function PricingPage() {
  return (
    <Suspense fallback={<PricingFallback />}>
      <PricingClient />
    </Suspense>
  )
}
