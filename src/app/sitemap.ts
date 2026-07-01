import type { MetadataRoute } from 'next'
import { getAllArticles } from '@/lib/articles'
import { SITE_URL } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/zhi-piao-tie-xian`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/zhi-piao-dai-kuan`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/zhi-piao-dui-xian`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/qi-ye-dai-kuan`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/articles`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/faq`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/ming-ci-jie-shi`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/fei-lv-ji-suan`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.6 },
  ]

  const articlePages: MetadataRoute.Sitemap = getAllArticles().map((a) => ({
    url: `${SITE_URL}/articles/${a.slug}`,
    lastModified: new Date(a.updated ?? a.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticPages, ...articlePages]
}
