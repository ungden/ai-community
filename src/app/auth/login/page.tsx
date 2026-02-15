'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGoogleLogin = async () => {
    setError(null)
    setLoading('google')
    try {
      const supabase = createClient()
      if (!supabase) {
        setError('Hệ thống chưa được cấu hình. Vui lòng liên hệ quản trị viên.')
        setLoading(null)
        return
      }
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) {
        setError(error.message === 'Unsupported provider: provider is not enabled' 
          ? 'Đăng nhập Google chưa được kích hoạt. Vui lòng liên hệ quản trị viên.'
          : `Lỗi đăng nhập: ${error.message}`)
        setLoading(null)
      }
    } catch {
      setError('Có lỗi xảy ra. Vui lòng thử lại.')
      setLoading(null)
    }
  }

  const handleFacebookLogin = async () => {
    setError(null)
    setLoading('facebook')
    try {
      const supabase = createClient()
      if (!supabase) {
        setError('Hệ thống chưa được cấu hình. Vui lòng liên hệ quản trị viên.')
        setLoading(null)
        return
      }
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) {
        setError(error.message === 'Unsupported provider: provider is not enabled'
          ? 'Đăng nhập Facebook chưa được kích hoạt. Vui lòng liên hệ quản trị viên.'
          : `Lỗi đăng nhập: ${error.message}`)
        setLoading(null)
      }
    } catch {
      setError('Có lỗi xảy ra. Vui lòng thử lại.')
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex">
      {/* Left Side - Simple login */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div 
          className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-12 h-12 rounded-xl bg-[#1877f2] flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
          </Link>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Đăng nhập
          </h1>
          <p className="text-gray-500 mb-8">
            Chào mừng bạn quay lại!
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Social Login Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleGoogleLogin}
              disabled={loading !== null}
              className="w-full py-3 px-4 bg-white border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading === 'google' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Tiếp tục với Google
                </>
              )}
            </button>

            <button
              onClick={handleFacebookLogin}
              disabled={loading !== null}
              className="w-full py-3 px-4 bg-[#1877f2] rounded-xl font-medium text-white hover:bg-[#166fe5] transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading === 'facebook' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Tiếp tục với Facebook
                </>
              )}
            </button>
          </div>

          <p className="mt-8 text-sm text-gray-500">
            Chưa có tài khoản?{' '}
            <Link href="/auth/register" className="text-[#1877f2] hover:underline font-medium">
              Đăng ký miễn phí
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side - Blue panel */}
      <div className="hidden lg:flex flex-1 bg-[#1877f2] items-center justify-center p-12">
        <div className="max-w-md">
          <h2 className="text-4xl font-bold text-white mb-6">
            Cập nhật kiến thức AI mỗi ngày
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Tham gia cùng hàng nghìn người đang học và ứng dụng AI vào công việc.
          </p>
          <ul className="space-y-4">
            <li className="flex items-center gap-4 text-white">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-lg">📚</span>
              </div>
              <span className="text-lg">Case study thực tế từ người đi làm</span>
            </li>
            <li className="flex items-center gap-4 text-white">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-lg">📝</span>
              </div>
              <span className="text-lg">Templates và prompts sẵn có</span>
            </li>
            <li className="flex items-center gap-4 text-white">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-lg">🎥</span>
              </div>
              <span className="text-lg">Live Q&A hàng tuần</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
