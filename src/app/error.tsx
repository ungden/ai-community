'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Optionally log to an error reporting service
  }, [error])

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center p-8">
      <div className="max-w-md text-center">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">!</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Có lỗi xảy ra
        </h2>
        <p className="text-gray-600 mb-6">
          Đã có sự cố khi tải trang này. Vui lòng thử lại.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-[#1877f2] text-white rounded-lg font-medium hover:bg-[#1664d9] transition-colors"
        >
          Thử lại
        </button>
      </div>
    </div>
  )
}
