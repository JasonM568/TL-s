'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'

// GA4 評估 ID（公開值，可用環境變數覆寫）
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-XG4CMC7JYE'

export default function GoogleAnalytics() {
  const pathname = usePathname()

  if (!GA_ID) return null
  // 後台操作（登入、排程佇列、草稿預覽）不是網站流量，計入會污染來源報表。
  if (pathname?.startsWith('/admin')) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  )
}
