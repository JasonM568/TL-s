import type { Metadata } from 'next'
import { login } from '../actions'

export const metadata: Metadata = {
  title: '管理登入',
  robots: { index: false, follow: false },
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-gray-50">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-2xl font-bold text-[#0D2B5E] mb-1 text-center">後台登入</h1>
          <p className="text-gray-400 text-sm text-center mb-8">黃璽理財管理顧問 · 諮詢名單管理</p>

          <form action={login} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">管理密碼</label>
              <input
                name="password"
                type="password"
                required
                autoFocus
                placeholder="請輸入管理密碼"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0D2B5E] transition-colors"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 rounded-lg px-4 py-3">
                密碼錯誤，請重新輸入
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-lg font-bold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#0D2B5E' }}
            >
              登入
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
