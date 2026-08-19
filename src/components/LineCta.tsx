'use client'

import Link from 'next/link'
import {
  LINE_ADD_URL,
  LINE_CTA_LABEL,
  LINE_CTA_HEADLINE,
  LINE_CTA_BODY,
  LINE_CTA_ASSURANCE,
} from '@/lib/site'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

/**
 * LINE 加好友點擊事件。GA4 事件名 `line_add_click`，
 * 以 `cta_location` 參數區分入口（floating / article_end / calculator_result / ...），
 * 才能判斷「是沒人點」還是「點了但沒完成加入」。
 */
export function trackLineClick(location: string) {
  window.gtag?.('event', 'line_add_click', { cta_location: location })
}

/** 有埋點的 LINE 連結。樣式由呼叫端決定，這裡只負責連結與追蹤。 */
export function LineLink({
  location,
  className,
  style,
  children,
  ariaLabel,
}: {
  location: string
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
  ariaLabel?: string
}) {
  return (
    <a
      href={LINE_ADD_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={className}
      style={style}
      onClick={() => trackLineClick(location)}
    >
      {children}
    </a>
  )
}

/**
 * 全站共用的 LINE 主要 CTA 區塊（深藍底、LINE 綠按鈕為主、表單為輔）。
 * 用於文章頁文末與費率試算頁。
 */
export default function LineCtaBlock({
  location,
  headline = LINE_CTA_HEADLINE,
  body = LINE_CTA_BODY,
  className = '',
}: {
  location: string
  headline?: string
  body?: string
  className?: string
}) {
  return (
    <div
      className={`rounded-xl p-8 text-center text-white ${className}`}
      style={{ backgroundColor: '#0D2B5E' }}
    >
      <h2 className="text-xl font-bold mb-3">{headline}</h2>
      <p className="text-gray-300 text-sm leading-relaxed mb-2 max-w-lg mx-auto">{body}</p>
      <p className="text-gray-400 text-xs mb-6">{LINE_CTA_ASSURANCE}</p>

      <LineLink
        location={location}
        className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-bold text-white transition-all hover:opacity-90 hover:shadow-lg"
        style={{ backgroundColor: '#06C755' }}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
          <path d="M12 2C6.48 2 2 5.64 2 10.13c0 4.02 3.55 7.39 8.35 8.03.33.07.77.22.88.5.1.25.07.64.03.89l-.14.85c-.04.25-.2.99.86.54 1.07-.45 5.76-3.39 7.86-5.81C21.4 14.4 22 12.36 22 10.13 22 5.64 17.52 2 12 2z" />
        </svg>
        {LINE_CTA_LABEL}
      </LineLink>

      <p className="mt-5 text-xs text-gray-400">
        不方便用 LINE？
        <Link href="/contact" className="text-gray-200 underline underline-offset-4 hover:text-white ml-1">
          改用表單諮詢
        </Link>
      </p>
    </div>
  )
}
