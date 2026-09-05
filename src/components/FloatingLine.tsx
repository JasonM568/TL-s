'use client'

import { usePathname } from 'next/navigation'
import { FloatingLineButton } from './LineCta'

// 全站右下角固定的 LINE 加好友浮動按鈕。
// 排除：/admin（後台）、/articles/<slug>（文章頁自己渲染帶 variant 的版本，
// 由 ArticleView 掛上，才能在 server 端就印出對應主題的文案、不會載入後閃一下換字）。
export default function FloatingLine() {
  const pathname = usePathname()
  if (pathname?.startsWith('/admin')) return null
  if (pathname && /^\/articles\/.+/.test(pathname)) return null

  return <FloatingLineButton />
}
