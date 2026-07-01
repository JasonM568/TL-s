import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // 舊 WordPress 網址 301 轉址到新站對應頁面（保留 SEO 權重、避免使用者撲空）
  async redirects() {
    return [
      { source: '/blogs', destination: '/articles', permanent: true },
      { source: '/blog', destination: '/articles', permanent: true },
      { source: '/blogs/:slug*', destination: '/articles', permanent: true },
      {
        source: '/trade-bill-financing-boosting-your-cash-flow',
        destination: '/zhi-piao-tie-xian',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
