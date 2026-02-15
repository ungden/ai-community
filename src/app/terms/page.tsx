import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Điều khoản sử dụng',
  description: 'Điều khoản sử dụng dịch vụ Alex Le AI Community',
}

export default function TermsPage() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Điều khoản sử dụng</h1>
          <p className="text-gray-500 mb-8">Cập nhật lần cuối: Tháng 2, 2026</p>

          <div className="prose prose-gray max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Giới thiệu</h2>
              <p className="text-gray-600 leading-relaxed">
                Chào mừng bạn đến với Alex Le AI (&quot;Nền tảng&quot;). Bằng việc truy cập và sử dụng nền tảng, 
                bạn đồng ý tuân thủ các điều khoản và điều kiện được nêu trong tài liệu này. 
                Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng không sử dụng dịch vụ của chúng tôi.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Tài khoản người dùng</h2>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Bạn phải cung cấp thông tin chính xác khi đăng ký tài khoản.</li>
                <li>Bạn chịu trách nhiệm bảo mật thông tin đăng nhập của mình.</li>
                <li>Mỗi người chỉ được sở hữu một tài khoản.</li>
                <li>Bạn phải từ 16 tuổi trở lên để sử dụng nền tảng.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Nội dung và sở hữu trí tuệ</h2>
              <p className="text-gray-600 leading-relaxed">
                Tất cả nội dung trên nền tảng bao gồm bài viết, khóa học, hình ảnh và tài liệu 
                đều thuộc quyền sở hữu của Alex Le AI hoặc các tác giả tương ứng. 
                Bạn không được sao chép, phân phối hoặc sử dụng nội dung cho mục đích thương mại 
                mà không có sự cho phép bằng văn bản.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Nội dung do người dùng tạo</h2>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Bạn giữ quyền sở hữu nội dung bạn đăng tải.</li>
                <li>Bạn cấp cho chúng tôi giấy phép không độc quyền để hiển thị nội dung trên nền tảng.</li>
                <li>Nội dung không được vi phạm pháp luật, chứa thông tin sai lệch, hoặc xâm phạm quyền của người khác.</li>
                <li>Chúng tôi có quyền gỡ bỏ nội dung vi phạm mà không cần thông báo trước.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Gói đăng ký và thanh toán</h2>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Các gói đăng ký trả phí được tính theo tháng.</li>
                <li>Thanh toán qua chuyển khoản ngân hàng được xử lý tự động qua hệ thống Sepay.</li>
                <li>Bạn có thể hủy gói bất cứ lúc nào. Gói sẽ tiếp tục hoạt động cho đến hết kỳ thanh toán.</li>
                <li>Chính sách hoàn tiền: 7 ngày đầu tiên kể từ khi thanh toán.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Quy tắc cộng đồng</h2>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Tôn trọng các thành viên khác. Không sử dụng ngôn ngữ xúc phạm hoặc phân biệt đối xử.</li>
                <li>Không spam, quảng cáo trái phép hoặc đăng nội dung không liên quan.</li>
                <li>Không chia sẻ nội dung trả phí cho người ngoài nền tảng.</li>
                <li>Vi phạm nghiêm trọng có thể dẫn đến khóa tài khoản vĩnh viễn.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Giới hạn trách nhiệm</h2>
              <p className="text-gray-600 leading-relaxed">
                Nền tảng cung cấp nội dung giáo dục mang tính tham khảo. 
                Chúng tôi không chịu trách nhiệm về kết quả kinh doanh hoặc quyết định 
                cá nhân dựa trên nội dung trên nền tảng. Dịch vụ được cung cấp &quot;nguyên trạng&quot; 
                và chúng tôi không đảm bảo dịch vụ hoạt động liên tục không gián đoạn.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Thay đổi điều khoản</h2>
              <p className="text-gray-600 leading-relaxed">
                Chúng tôi có quyền thay đổi các điều khoản này bất cứ lúc nào. 
                Thay đổi sẽ có hiệu lực ngay khi được đăng tải trên nền tảng. 
                Việc tiếp tục sử dụng dịch vụ sau khi thay đổi đồng nghĩa với việc bạn chấp nhận điều khoản mới.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Liên hệ</h2>
              <p className="text-gray-600 leading-relaxed">
                Nếu bạn có câu hỏi về điều khoản sử dụng, vui lòng liên hệ qua email:{' '}
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
