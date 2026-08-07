// sitemap.xml：改用 route handler（與 llms.txt 同模式）。
// 原 app/sitemap.ts 的 metadata route 在正式站上 ISR 未生效，
// sitemap 凍結在 build 時間點，導致 DB 排程新文章進不了索引。
// lastmod 只寫真實內容日期，不用 build 當下時間充數。
import { getAllArticles } from '@/lib/articles-source'
import { SITE_URL } from '@/lib/site'

// ISR：DB 排程文章到點後自動進 sitemap（與 llms.txt 一致）
export const revalidate = 120

type Entry = {
  url: string
  lastmod?: string
  changefreq: string
  priority: string
}

const STATIC_PAGES: Entry[] = [
  { url: SITE_URL, changefreq: 'weekly', priority: '1' },
  { url: `${SITE_URL}/zhi-piao-tie-xian`, changefreq: 'monthly', priority: '0.9' },
  { url: `${SITE_URL}/zhi-piao-dai-kuan`, changefreq: 'monthly', priority: '0.9' },
  { url: `${SITE_URL}/zhi-piao-dui-xian`, changefreq: 'monthly', priority: '0.9' },
  { url: `${SITE_URL}/qi-ye-dai-kuan`, changefreq: 'monthly', priority: '0.9' },
  { url: `${SITE_URL}/gaoxiong-zhi-piao-tie-xian`, changefreq: 'monthly', priority: '0.9' },
  { url: `${SITE_URL}/gaoxiong-piao-tie`, changefreq: 'monthly', priority: '0.9' },
  { url: `${SITE_URL}/articles`, changefreq: 'weekly', priority: '0.8' },
  { url: `${SITE_URL}/faq`, changefreq: 'monthly', priority: '0.7' },
  { url: `${SITE_URL}/ming-ci-jie-shi`, changefreq: 'monthly', priority: '0.7' },
  { url: `${SITE_URL}/fei-lv-ji-suan`, changefreq: 'monthly', priority: '0.7' },
  { url: `${SITE_URL}/contact`, changefreq: 'yearly', priority: '0.6' },
]

function urlXml({ url, lastmod, changefreq, priority }: Entry): string {
  return [
    '<url>',
    `<loc>${url}</loc>`,
    ...(lastmod ? [`<lastmod>${lastmod}</lastmod>`] : []),
    `<changefreq>${changefreq}</changefreq>`,
    `<priority>${priority}</priority>`,
    '</url>',
  ].join('\n')
}

export async function GET() {
  const articles = await getAllArticles()

  // /articles 列表頁的 lastmod = 最新一篇文章日期
  const latest = articles
    .map((a) => a.updated ?? a.date)
    .sort()
    .at(-1)

  const staticEntries = STATIC_PAGES.map((p) =>
    p.url === `${SITE_URL}/articles` ? { ...p, lastmod: latest } : p
  )

  const articleEntries: Entry[] = articles.map((a) => ({
    url: `${SITE_URL}/articles/${a.slug}`,
    lastmod: a.updated ?? a.date,
    changefreq: 'monthly',
    priority: '0.7',
  }))

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...staticEntries.map(urlXml),
    ...articleEntries.map(urlXml),
    '</urlset>',
  ].join('\n')

  return new Response(xml + '\n', {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  })
}
