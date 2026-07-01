import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/api', '/_next/'] },
      // 明確允許主要 AI 答案引擎爬蟲（只爬 HTML 頁面，不爬 JS bundle）
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
