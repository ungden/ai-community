'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Brain,
  Check,
  ArrowLeft,
  Crown,
  Zap,
  X,
  Copy,
  QrCode,
  Loader2,
  CheckCircle
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { vi } from '@/lib/translations'
import { useToast } from '@/components/Toast'

const BANK_NAME = process.env.NEXT_PUBLIC_BANK_NAME || ''
const BANK_ACCOUNT = process.env.NEXT_PUBLIC_BANK_ACCOUNT || ''
const BANK_ACCOUNT_NAME = process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME || ''
const isBankConfigured = !!(BANK_NAME && BANK_ACCOUNT && BANK_ACCOUNT_NAME)

const PLANS = {
  basic: {
    name: 'Basic',
    price: 199000,
    priceDisplay: '199.000đ',
    period: '/tháng',
    description: 'Cho người muốn học nghiêm túc',
    features: [
      'Tất cả bài viết',
      'Truy cập khóa học cơ bản',
      'Tải tài liệu PDF',
      'Hỗ trợ qua email',
      'Không quảng cáo',
    ],
  },
  premium: {
    name: 'Premium',
    price: 399000,
    priceDisplay: '399.000đ',
    period: '/tháng',
    description: 'Trải nghiệm đầy đủ nhất',
    features: [
      'Tất cả trong Basic',
      'Tất cả khóa học premium',
      'Case study độc quyền',
      'Hỗ trợ ưu tiên',
      'Webinar hàng tháng',
      'Certificate hoàn thành',
    ],
    popular: true,
  },
}

export default function PricingClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedPlan = searchParams.get('plan') as 'basic' | 'premium' | null
  
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null)
  const [profile, setProfile] = useState<{ subscription_tier: string } | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium' | null>(preselectedPlan)
  const [showPayment, setShowPayment] = useState(false)
  const [paymentRef, setPaymentRef] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkingPayment, setCheckingPayment] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const { showToast } = useToast()

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient()
      if (!supabase) return
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('subscription_tier')
          .eq('id', user.id)
          .single()
        setProfile(profile)
      }
    }
    fetchUser()
  }, [])

  const handleSelectPlan = async (plan: 'basic' | 'premium') => {
    if (!user) {
      router.push(`/auth/register?plan=${plan}`)
      return
    }

    setSelectedPlan(plan)
    setLoading(true)

    try {
      const supabase = createClient()
      if (!supabase) {
        setLoading(false)
        return
      }
      
      // Generate unique payment reference
      const ref = `AI${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`
      setPaymentRef(ref)

      // Create pending subscription
      const { error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          tier: plan,
          price: PLANS[plan].price,
          status: 'pending',
          payment_method: 'sepay',
          payment_ref: ref,
        } as never)

      if (error) {
        showToast('Không thể tạo đơn thanh toán. Vui lòng thử lại sau.', 'error')
        return
      }

      setShowPayment(true)
    } catch {
      showToast('Đã xảy ra lỗi. Vui lòng thử lại sau.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 2000)
  }

  const checkPaymentStatus = useCallback(async () => {
    setCheckingPayment(true)
    
    try {
      const supabase = createClient()
      if (!supabase) {
        setCheckingPayment(false)
        return
      }
      
      // Check subscription status
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('payment_ref', paymentRef)
        .single() as { data: { status: string } | null }

      if (subscription?.status === 'active') {
        setPaymentSuccess(true)
        
        // Refresh profile
        if (user) {
          const { data: updatedProfile } = await supabase
            .from('profiles')
            .select('subscription_tier')
            .eq('id', user.id)
            .single()
          setProfile(updatedProfile)
        }
      }
    } catch {
      showToast('Không thể kiểm tra trạng thái thanh toán. Vui lòng thử lại.', 'error')
    } finally {
      setCheckingPayment(false)
    }
  }, [paymentRef, user, showToast])

  // Auto-check payment status every 10 seconds when showing payment
  useEffect(() => {
    if (showPayment && !paymentSuccess) {
      const interval = setInterval(checkPaymentStatus, 10000)
      return () => clearInterval(interval)
    }
  }, [showPayment, paymentSuccess, checkPaymentStatus])

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-8">
        <motion.div
          className="max-w-md text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-3">
            {vi.payment.paymentSuccess}
          </h1>
          <p className="text-[var(--text-secondary)] mb-2">
            Bạn đã nâng cấp lên gói <span className="font-semibold text-[var(--text-primary)]">{PLANS[selectedPlan!].name}</span> thành công!
          </p>
          <p className="text-sm text-[var(--text-tertiary)] mb-8">
            Bây giờ bạn có thể truy cập tất cả nội dung {selectedPlan === 'premium' ? 'Premium' : 'Basic'}.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/community"
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              Bắt đầu khám phá
            </Link>
            <Link
              href="/profile"
              className="px-6 py-3 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-xl font-medium hover:bg-[var(--bg-tertiary)] transition-colors"
            >
              {vi.payment.viewSubscription}
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  if (showPayment && selectedPlan) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)]">
        {/* Header */}
        <header className="border-b border-[var(--border-light)]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setShowPayment(false)
                  setSelectedPlan(null)
                }}
                className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <ArrowLeft className="w-5 h-5" />
                Quay lại
              </button>
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* Payment Content */}
        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-8">
              {vi.payment.title}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Order Summary */}
              <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 border border-[var(--border-light)]">
                <h2 className="font-semibold text-[var(--text-primary)] mb-4">
                  {vi.payment.orderSummary}
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">{vi.payment.plan}</span>
                    <span className="font-medium text-[var(--text-primary)]">
                      {PLANS[selectedPlan].name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Thời hạn</span>
                    <span className="font-medium text-[var(--text-primary)]">1 tháng</span>
                  </div>
                  <div className="pt-3 border-t border-[var(--border-light)]">
                    <div className="flex justify-between">
                      <span className="font-semibold text-[var(--text-primary)]">{vi.payment.total}</span>
                      <span className="font-bold text-xl text-[var(--text-primary)]">
                        {PLANS[selectedPlan].priceDisplay}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Instructions */}
              <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 border border-[var(--border-light)]">
                <h2 className="font-semibold text-[var(--text-primary)] mb-4">
                  {vi.payment.transferInfo}
                </h2>
                
                {isBankConfigured ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-[var(--text-tertiary)]">{vi.payment.bankName}</label>
                      <div className="flex items-center justify-between mt-1 p-3 bg-[var(--bg-primary)] rounded-xl">
                        <span className="font-medium text-[var(--text-primary)]">
                          {BANK_NAME}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-[var(--text-tertiary)]">{vi.payment.accountNumber}</label>
                      <div className="flex items-center justify-between mt-1 p-3 bg-[var(--bg-primary)] rounded-xl">
                        <span className="font-mono font-medium text-[var(--text-primary)]">
                          {BANK_ACCOUNT}
                        </span>
                        <button
                          onClick={() => handleCopy(BANK_ACCOUNT, 'account')}
                          className="p-1.5 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors"
                        >
                          {copied === 'account' ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4 text-[var(--text-tertiary)]" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-[var(--text-tertiary)]">{vi.payment.accountName}</label>
                      <div className="flex items-center justify-between mt-1 p-3 bg-[var(--bg-primary)] rounded-xl">
                        <span className="font-medium text-[var(--text-primary)]">
                          {BANK_ACCOUNT_NAME}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-[var(--text-tertiary)]">{vi.payment.amount}</label>
                      <div className="flex items-center justify-between mt-1 p-3 bg-[var(--bg-primary)] rounded-xl">
                        <span className="font-bold text-[var(--text-primary)]">
                          {PLANS[selectedPlan].price.toLocaleString('vi-VN')} VND
                        </span>
                        <button
                          onClick={() => handleCopy(PLANS[selectedPlan].price.toString(), 'amount')}
                          className="p-1.5 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors"
                        >
                          {copied === 'amount' ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4 text-[var(--text-tertiary)]" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-[var(--text-tertiary)]">{vi.payment.transferContent}</label>
                      <div className="flex items-center justify-between mt-1 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                        <span className="font-mono font-bold text-blue-500">
                          {paymentRef}
                        </span>
                        <button
                          onClick={() => handleCopy(paymentRef, 'ref')}
                          className="p-1.5 hover:bg-blue-500/20 rounded-lg transition-colors"
                        >
                          {copied === 'ref' ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4 text-blue-500" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-red-500 mt-1">
                        * Quan trọng: Nhập đúng nội dung chuyển khoản để hệ thống tự động xác nhận
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto mb-4">
                      <Zap className="w-6 h-6 text-yellow-500" />
                    </div>
                    <p className="text-[var(--text-secondary)] font-medium mb-2">
                      Chưa cấu hình thanh toán
                    </p>
                    <p className="text-sm text-[var(--text-tertiary)]">
                      Vui lòng liên hệ admin để được hướng dẫn thanh toán.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* QR Code Section - only show when bank is configured */}
            {isBankConfigured && (
              <div className="mt-6 bg-[var(--bg-secondary)] rounded-2xl p-6 border border-[var(--border-light)] text-center">
                <h3 className="font-semibold text-[var(--text-primary)] mb-4">
                  {vi.payment.scanQR}
                </h3>
                <div className="w-48 h-48 bg-white rounded-xl mx-auto flex items-center justify-center">
                  <QrCode className="w-32 h-32 text-gray-300" />
                </div>
              </div>
            )}

            {/* Status Check */}
            <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-[var(--text-primary)]">
                    {vi.payment.waitingPayment}
                  </p>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">
                    {vi.payment.paymentNote}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={checkPaymentStatus}
              disabled={checkingPayment}
              className="mt-6 w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {checkingPayment ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang kiểm tra...
                </>
              ) : (
                'Tôi đã chuyển khoản'
              )}
            </button>
          </motion.div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="border-b border-[var(--border-light)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-[var(--text-primary)]">
                Alex Le AI
              </span>
            </Link>
            {user ? (
              <Link
                href="/community"
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                Quay lại
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Pricing Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">
            {vi.landing.pricing.title}
          </h1>
          <p className="text-lg text-[var(--text-secondary)]">
            {vi.landing.pricing.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <motion.div
            className="bg-[var(--bg-secondary)] rounded-2xl p-8 border border-[var(--border-light)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
              {vi.subscription.free.name}
            </h3>
            <p className="text-[var(--text-secondary)] mb-6">
              {vi.subscription.free.description}
            </p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-[var(--text-primary)]">0d</span>
              <span className="text-[var(--text-secondary)]"> /{vi.subscription.free.period}</span>
            </div>
            <ul className="space-y-3 mb-8">
              {vi.subscription.free.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-[var(--text-secondary)]">{feature}</span>
                </li>
              ))}
            </ul>
            {profile?.subscription_tier === 'free' ? (
              <div className="w-full py-3 text-center border border-green-500 text-green-500 rounded-xl font-medium">
                {vi.subscription.currentPlan}
              </div>
            ) : (
              <Link
                href="/auth/register"
                className="block w-full py-3 text-center border border-[var(--border-color)] rounded-xl font-medium text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
              >
                {vi.subscription.free.cta}
              </Link>
            )}
          </motion.div>

          {/* Basic Plan */}
          <motion.div
            className="bg-[var(--bg-secondary)] rounded-2xl p-8 border border-[var(--border-light)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
              {PLANS.basic.name}
            </h3>
            <p className="text-[var(--text-secondary)] mb-6">
              {PLANS.basic.description}
            </p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-[var(--text-primary)]">{PLANS.basic.priceDisplay}</span>
              <span className="text-[var(--text-secondary)]">{PLANS.basic.period}</span>
            </div>
            <ul className="space-y-3 mb-8">
              {PLANS.basic.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-[var(--text-secondary)]">{feature}</span>
                </li>
              ))}
            </ul>
            {profile?.subscription_tier === 'basic' ? (
              <div className="w-full py-3 text-center border border-green-500 text-green-500 rounded-xl font-medium">
                {vi.subscription.currentPlan}
              </div>
            ) : (
              <button
                onClick={() => handleSelectPlan('basic')}
                disabled={loading}
                className="w-full py-3 text-center bg-[var(--bg-tertiary)] rounded-xl font-medium text-[var(--text-primary)] hover:bg-[var(--bg-primary)] transition-colors disabled:opacity-50"
              >
                {loading && selectedPlan === 'basic' ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  vi.subscription.basic.cta
                )}
              </button>
            )}
          </motion.div>

          {/* Premium Plan */}
          <motion.div
            className="bg-gradient-to-b from-blue-500/10 to-purple-500/10 rounded-2xl p-8 border-2 border-blue-500/50 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium rounded-full">
              Phổ biến nhất
            </div>
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
              {PLANS.premium.name}
            </h3>
            <p className="text-[var(--text-secondary)] mb-6">
              {PLANS.premium.description}
            </p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-[var(--text-primary)]">{PLANS.premium.priceDisplay}</span>
              <span className="text-[var(--text-secondary)]">{PLANS.premium.period}</span>
            </div>
            <ul className="space-y-3 mb-8">
              {PLANS.premium.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-[var(--text-secondary)]">{feature}</span>
                </li>
              ))}
            </ul>
            {profile?.subscription_tier === 'premium' ? (
              <div className="w-full py-3 text-center border border-green-500 text-green-500 rounded-xl font-medium flex items-center justify-center gap-2">
                <Crown className="w-5 h-5" />
                {vi.subscription.currentPlan}
              </div>
            ) : (
              <button
                onClick={() => handleSelectPlan('premium')}
                disabled={loading}
                className="w-full py-3 text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50"
              >
                {loading && selectedPlan === 'premium' ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  vi.subscription.premium.cta
                )}
              </button>
            )}
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-[var(--text-primary)] text-center mb-8">
            Câu hỏi thường gặp
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                q: 'Tôi có thể hủy gói bất cứ lúc nào không?',
                a: 'Có, bạn có thể hủy gói bất cứ lúc nào. Gói của bạn sẽ tiếp tục hoạt động cho đến hết thời hạn đã thanh toán.'
              },
              {
                q: 'Phương thức thanh toán nào được hỗ trợ?',
                a: 'Hiện tại chúng tôi hỗ trợ chuyển khoản ngân hàng qua Sepay. Hệ thống sẽ tự động xác nhận sau khi bạn chuyển khoản.'
              },
              {
                q: 'Tôi có thể đổi gói không?',
                a: 'Có, bạn có thể nâng cấp lên gói cao hơn bất cứ lúc nào. Phí sẽ được tính theo tỷ lệ thời gian còn lại.'
              },
              {
                q: 'Nếu tôi không hài lòng?',
                a: 'Chúng tôi có chính sách hoàn tiền trong 7 ngày đầu tiên nếu bạn không hài lòng với dịch vụ.'
              }
            ].map((faq, idx) => (
              <div key={idx} className="bg-[var(--bg-secondary)] rounded-xl p-6 border border-[var(--border-light)]">
                <h3 className="font-semibold text-[var(--text-primary)] mb-2">{faq.q}</h3>
                <p className="text-[var(--text-secondary)]">{faq.a}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  )
}
