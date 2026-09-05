'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import {
  LINE_ADD_URL,
  LINE_CTA_LABEL,
  LINE_CTA_HEADLINE,
  LINE_CTA_BODY,
  LINE_CTA_ASSURANCE,
} from '@/lib/site'
import { CTA_OFFERS, type CtaVariant } from '@/lib/cta-offers'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

/**
 * LINE 加好友點擊事件。GA4 事件名 `line_add_click`，
 * 以 `cta_location` 參數區分入口（floating / article_end / article_inline / ...），
 * 以 `cta_variant` 區分誘因（piao-xin / tie-xian / tian-xie / zhou-zhuan），
 * 才能判斷「是沒人點」還是「點了但沒完成加入」、以及哪種誘因有效。
 */
export function trackLineClick(location: string, variant?: CtaVariant) {
  window.gtag?.('event', 'line_add_click', {
    cta_location: location,
    ...(variant ? { cta_variant: variant } : {}),
  })
}

/**
 * CTA 曝光事件 `cta_view`：CTA 真的捲進畫面才算一次，每次載入只送一次。
 *
 * 為什麼需要：只有點擊數的話，0.5% 的轉換率無法分辨是「沒人看到」還是「看到不想點」，
 * 兩者的解法完全相反（前者改位置、後者改文案）。有了曝光才能算 view→click 率。
 */
function useCtaImpression(location: string, variant?: CtaVariant) {
  const ref = useRef<HTMLDivElement>(null)
  const sent = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || sent.current) continue
          sent.current = true
          window.gtag?.('event', 'cta_view', {
            cta_location: location,
            ...(variant ? { cta_variant: variant } : {}),
          })
          io.disconnect()
        }
      },
      // 半個 CTA 進畫面才算看到，避免捲太快也被計為曝光
      { threshold: 0.5 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [location, variant])

  return ref
}

/** 有埋點的 LINE 連結。樣式由呼叫端決定，這裡只負責連結與追蹤。 */
export function LineLink({
  location,
  variant,
  className,
  style,
  children,
  ariaLabel,
}: {
  location: string
  variant?: CtaVariant
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
      onClick={() => trackLineClick(location, variant)}
    >
      {children}
    </a>
  )
}

function LineGlyph({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 5.64 2 10.13c0 4.02 3.55 7.39 8.35 8.03.33.07.77.22.88.5.1.25.07.64.03.89l-.14.85c-.04.25-.2.99.86.54 1.07-.45 5.76-3.39 7.86-5.81C21.4 14.4 22 12.36 22 10.13 22 5.64 17.52 2 12 2z" />
    </svg>
  )
}

/**
 * 全站共用的 LINE 主要 CTA 區塊（深藍底、LINE 綠按鈕為主、表單為輔）。
 * 用於文章頁文末與費率試算頁。
 *
 * 傳 `variant` 會依文章主題換掉整組文案（見 lib/cta-offers.ts）；
 * 不傳則沿用 site.ts 的全站預設文案（費率試算頁、聯絡頁走這條）。
 */
export default function LineCtaBlock({
  location,
  variant,
  headline,
  body,
  className = '',
}: {
  location: string
  variant?: CtaVariant
  headline?: string
  body?: string
  className?: string
}) {
  const offer = variant ? CTA_OFFERS[variant] : null
  const finalHeadline = headline ?? offer?.headline ?? LINE_CTA_HEADLINE
  const finalBody = body ?? offer?.body ?? LINE_CTA_BODY
  const finalAssurance = offer?.assurance ?? LINE_CTA_ASSURANCE
  const finalLabel = offer?.label ?? LINE_CTA_LABEL
  const ref = useCtaImpression(location, variant)

  return (
    <div
      ref={ref}
      className={`rounded-xl p-8 text-center text-white ${className}`}
      style={{ backgroundColor: '#0D2B5E' }}
    >
      <h2 className="text-xl font-bold mb-3">{finalHeadline}</h2>
      <p className="text-gray-300 text-sm leading-relaxed mb-2 max-w-lg mx-auto">{finalBody}</p>
      <p className="text-gray-400 text-xs mb-6">{finalAssurance}</p>

      <LineLink
        location={location}
        variant={variant}
        className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-bold text-white transition-all hover:opacity-90 hover:shadow-lg"
        style={{ backgroundColor: '#06C755' }}
      >
        <LineGlyph />
        {finalLabel}
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

/**
 * 文中版 CTA（淺色、單行、體積小）。
 *
 * 為什麼要有這個：文末 CTA 只有讀到底的人看得到，而 GA4 平均停留 2 分 10 秒、
 * 文章多為 6 分鐘以上，多數人在看到文末 CTA 前就離開了。
 * 樣式刻意做得比文末版低調，避免中途插一塊廣告打斷閱讀。
 */
export function InlineLineCta({
  location,
  variant,
  className = '',
}: {
  location: string
  variant: CtaVariant
  className?: string
}) {
  const offer = CTA_OFFERS[variant]
  const ref = useCtaImpression(location, variant)

  return (
    <div
      ref={ref}
      className={`my-8 flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl border-l-4 bg-[#F0F4FF] px-5 py-4 ${className}`}
      style={{ borderColor: '#C9922A' }}
    >
      <p className="flex-1 text-sm leading-relaxed text-[#0D2B5E]">{offer.inline}</p>
      <LineLink
        location={location}
        variant={variant}
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white transition-all hover:opacity-90 hover:shadow-md"
        style={{ backgroundColor: '#06C755' }}
      >
        <LineGlyph size={18} />
        {offer.label}
      </LineLink>
    </div>
  )
}

/**
 * 右下角浮動 LINE 按鈕的本體。全站版（FloatingLine）與文章頁版共用。
 *
 * 文章頁要吃 variant：浮動鈕是全程可見、曝光最高的 CTA，
 * 在「支票寫錯」的文章上掛「免費查票信」正是要修掉的錯配。
 */
export function FloatingLineButton({ variant }: { variant?: CtaVariant }) {
  const label = variant ? CTA_OFFERS[variant].label : LINE_CTA_LABEL

  return (
    <LineLink
      location={variant ? 'floating_article' : 'floating'}
      variant={variant}
      ariaLabel={`加入 LINE 官方帳號，${label}`}
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full px-4 py-3 md:px-5 text-white shadow-lg hover:shadow-xl hover:opacity-95 transition-all"
      style={{ backgroundColor: '#06C755' }}
    >
      <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true">
        <path d="M12 2C6.48 2 2 5.64 2 10.13c0 4.02 3.55 7.39 8.35 8.03.33.07.77.22.88.5.1.25.07.64.03.89l-.14.85c-.04.25-.2.99.86.54 1.07-.45 5.76-3.39 7.86-5.81C21.4 14.4 22 12.36 22 10.13 22 5.64 17.52 2 12 2zM8.09 12.42H6.4a.34.34 0 0 1-.34-.34V8.72a.34.34 0 0 1 .68 0v3.02h1.35a.34.34 0 0 1 0 .68zm1.36-.34a.34.34 0 0 1-.68 0V8.72a.34.34 0 0 1 .68 0v3.36zm4.24 0a.34.34 0 0 1-.24.32.34.34 0 0 1-.38-.12l-1.72-2.34v2.14a.34.34 0 0 1-.68 0V8.72a.34.34 0 0 1 .61-.2l1.73 2.35V8.72a.34.34 0 0 1 .68 0v3.36zm2.77-2.02a.34.34 0 0 1 0 .68h-1.35v.66h1.35a.34.34 0 0 1 0 .68h-1.69a.34.34 0 0 1-.34-.34V8.72a.34.34 0 0 1 .34-.34h1.69a.34.34 0 0 1 0 .68h-1.35v.66h1.35z" />
      </svg>
      {/* 手機也顯示文字：只有綠球等於沒有點擊理由 */}
      <span className="font-bold text-sm">{label}</span>
    </LineLink>
  )
}
