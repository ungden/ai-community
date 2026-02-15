import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center p-8">
      <div className="max-w-md text-center">
        <div className="text-8xl font-bold text-gray-200 mb-4">404</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Trang không tồn tại
        </h2>
        <p className="text-gray-600 mb-6">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-[#1877f2] text-white rounded-lg font-medium hover:bg-[#1664d9] transition-colors"
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  )
}
