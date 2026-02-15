import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Chính sách bảo mật',
  description: 'Chính sách bảo mật của Alex Le AI Community',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#1877f2] flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Alex Le AI</span>
            </Link>
            <Link href="/" className="text-gray-500 hover:text-gray-900 text-sm">
              Quay lại trang chủ
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-sm p-8 sm:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Chính sách bảo mật</h1>
          <p className="text-gray-500 mb-8">Cập nhật lần cuối: Tháng 2, 2026</p>

          <div className="prose prose-gray max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Thông tin chúng tôi thu thập</h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                Chúng tôi thu thập các loại thông tin sau khi bạn sử dụng nền tảng:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li><strong>Thông tin tài khoản:</strong> Tên, email, ảnh đại diện (từ Google/Facebook khi đăng nhập).</li>
                <li><strong>Thông tin hoạt động:</strong> Bài viết, bình luận, khóa học đã tham gia, điểm tích lũy.</li>
                <li><strong>Thông tin thanh toán:</strong> Lịch sử giao dịch, gói đăng ký (không lưu thông tin thẻ ngân hàng).</li>
                <li><strong>Thông tin kỹ thuật:</strong> Địa chỉ IP, trình duyệt, thiết bị truy cập (qua cookies).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Cách chúng tôi sử dụng thông tin</h2>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Cung cấp và cải thiện dịch vụ nền tảng.</li>
                <li>Xác thực danh tính và bảo mật tài khoản.</li>
                <li>Xử lý thanh toán và quản lý gói đăng ký.</li>
                <li>Gửi thông báo về cập nhật, sự kiện và nội dung mới (có thể tắt).</li>
                <li>Phân tích và cải thiện trải nghiệm người dùng.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Chia sẻ thông tin</h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                Chúng tôi <strong>không bán</strong> thông tin cá nhân của bạn. Thông tin chỉ được chia sẻ trong các trường hợp:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li><strong>Nhà cung cấp dịch vụ:</strong> Supabase (lưu trữ dữ liệu), Sepay (xử lý thanh toán), Google/Facebook (xác thực).</li>
                <li><strong>Yêu cầu pháp luật:</strong> Khi có yêu cầu hợp pháp từ cơ quan chức năng.</li>
                <li><strong>Thông tin công khai:</strong> Tên, ảnh đại diện và bài viết bạn đăng là nội dung công khai trên nền tảng.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Bảo mật dữ liệu</h2>
              <p className="text-gray-600 leading-relaxed">
                Chúng tôi áp dụng các biện pháp bảo mật tiêu chuẩn ngành bao gồm mã hóa SSL/TLS, 
                Row Level Security (RLS) trên cơ sở dữ liệu, và xác thực hai lớp cho tài khoản quản trị. 
                Tuy nhiên, không có phương thức truyền tải nào qua Internet là an toàn 100%.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Cookies</h2>
              <p className="text-gray-600 leading-relaxed">
                Chúng tôi sử dụng cookies cần thiết để duy trì phiên đăng nhập và ghi nhớ tùy chọn của bạn. 
                Không sử dụng cookies theo dõi từ bên thứ ba cho mục đích quảng cáo.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Quyền của bạn</h2>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li><strong>Truy cập:</strong> Bạn có quyền yêu cầu bản sao thông tin cá nhân chúng tôi lưu trữ.</li>
                <li><strong>Chỉnh sửa:</strong> Bạn có thể cập nhật thông tin qua trang hồ sơ cá nhân.</li>
                <li><strong>Xóa:</strong> Bạn có quyền yêu cầu xóa tài khoản và dữ liệu liên quan.</li>
                <li><strong>Từ chối:</strong> Bạn có thể tắt thông báo email bất cứ lúc nào.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Lưu trữ dữ liệu</h2>
              <p className="text-gray-600 leading-relaxed">
                Dữ liệu được lưu trữ trên máy chủ Supabase (AWS). 
                Chúng tôi lưu trữ dữ liệu trong suốt thời gian tài khoản hoạt động 
                và tối đa 30 ngày sau khi tài khoản bị xóa.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Thay đổi chính sách</h2>
              <p className="text-gray-600 leading-relaxed">
                Chúng tôi có thể cập nhật chính sách bảo mật này. 
                Thay đổi quan trọng sẽ được thông báo qua email hoặc thông báo trên nền tảng.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Liên hệ</h2>
              <p className="text-gray-600 leading-relaxed">
                Nếu bạn có câu hỏi về chính sách bảo mật, vui lòng liên hệ:{' '}
                <a href="mailto:hello@alexle.ai" className="text-[#1877f2] hover:underline">
                  hello@alexle.ai
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
