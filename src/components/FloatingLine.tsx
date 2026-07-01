'use client'

import { usePathname } from 'next/navigation'
import { LINE_ADD_URL } from '@/lib/site'

// 全站右下角固定的 LINE 加好友浮動按鈕（後台 /admin 不顯示）
export default function FloatingLine() {
  const pathname = usePathname()
  if (pathname?.startsWith('/admin')) return null

  return (
    <a
      href={LINE_ADD_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="加入 LINE 好友諮詢"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full px-4 py-3 md:px-5 text-white shadow-lg hover:shadow-xl hover:opacity-95 transition-all"
      style={{ backgroundColor: '#06C755' }}
    >
      <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true">
        <path d="M12 2C6.48 2 2 5.64 2 10.13c0 4.02 3.55 7.39 8.35 8.03.33.07.77.22.88.5.1.25.07.64.03.89l-.14.85c-.04.25-.2.99.86.54 1.07-.45 5.76-3.39 7.86-5.81C21.4 14.4 22 12.36 22 10.13 22 5.64 17.52 2 12 2zM8.09 12.42H6.4a.34.34 0 0 1-.34-.34V8.72a.34.34 0 0 1 .68 0v3.02h1.35a.34.34 0 0 1 0 .68zm1.36-.34a.34.34 0 0 1-.68 0V8.72a.34.34 0 0 1 .68 0v3.36zm4.24 0a.34.34 0 0 1-.24.32.34.34 0 0 1-.38-.12l-1.72-2.34v2.14a.34.34 0 0 1-.68 0V8.72a.34.34 0 0 1 .61-.2l1.73 2.35V8.72a.34.34 0 0 1 .68 0v3.36zm2.77-2.02a.34.34 0 0 1 0 .68h-1.35v.66h1.35a.34.34 0 0 1 0 .68h-1.69a.34.34 0 0 1-.34-.34V8.72a.34.34 0 0 1 .34-.34h1.69a.34.34 0 0 1 0 .68h-1.35v.66h1.35z" />
      </svg>
      <span className="font-bold text-sm hidden sm:block">LINE 諮詢</span>
    </a>
  )
}
