import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // ⚠️ 一般爬蟲（含 Googlebot）不可封鎖 /_next/：那是全站的 CSS 與 JS，
      // Google 官方明講不要擋，擋了 Googlebot 算繪時只會看到沒有樣式的頁面。
      // 2026-08-25 GSC「遭到 robots.txt 封鎖」實測就是這個原因，且每次部署
      // chunk 都帶新的 ?dpl= 部署 ID，同一支檔案會不斷產生新網址、數量只增不減。
      { userAgent: '*', allow: '/', disallow: ['/admin', '/api'] },
      // 明確允許主要 AI 答案引擎爬蟲（只爬 HTML 頁面，不爬 JS bundle）。
      // 這些具名群組不受上面 '*' 影響——robots.txt 只套用最相符的那一組，
      // 所以 AI 爬蟲仍然擋 /_next/（省 crawl budget），只有 Googlebot 放行。
      { userAgent: 'GPTBot', allow: '/', disallow: ['/_next/'] },
      { userAgent: 'ChatGPT-User', allow: '/', disallow: ['/_next/'] },
      { userAgent: 'OAI-SearchBot', allow: '/', disallow: ['/_next/'] },
      { userAgent: 'ClaudeBot', allow: '/', disallow: ['/_next/'] },
      { userAgent: 'anthropic-ai', allow: '/', disallow: ['/_next/'] },
      { userAgent: 'PerplexityBot', allow: '/', disallow: ['/_next/'] },
      { userAgent: 'Google-Extended', allow: '/', disallow: ['/_next/'] },
      { userAgent: 'CCBot', allow: '/', disallow: ['/_next/'] },
      { userAgent: 'cohere-ai', allow: '/', disallow: ['/_next/'] },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
