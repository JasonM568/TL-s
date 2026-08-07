import type { NextConfig } from 'next'
import { legacyRedirects } from './src/lib/legacy-redirects'

const nextConfig: NextConfig = {
  // 舊 WordPress 網址 301 轉址到新站對應頁面（保留 SEO 權重、避免使用者撲空）
  async redirects() {
    return [
      // www 統一 301 到主網域，避免同內容雙網址分散權重
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.huangxi.tw' }],
        destination: 'https://huangxi.tw/:path*',
        permanent: true,
      },
      { source: '/blogs', destination: '/articles', permanent: true },
      { source: '/blog', destination: '/articles', permanent: true },
      { source: '/blogs/:slug*', destination: '/articles', permanent: true },
      {
        source: '/trade-bill-financing-boosting-your-cash-flow',
        destination: '/zhi-piao-tie-xian',
        permanent: true,
      },
      // 其餘 126 條舊 WordPress 網址（GSC 實測仍有曝光者）→ 對應主題頁
      ...legacyRedirects,
    ]
  },
  // 金融類網站信任面加分項：資安檢測工具與企業客戶 IT 稽核會查驗
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
}

export default nextConfig
