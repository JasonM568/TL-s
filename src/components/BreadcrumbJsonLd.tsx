import { SITE_URL } from '@/lib/site'

// BreadcrumbList JSON-LD：服務頁/聯絡頁共用（文章頁另有自己的三層結構）
export default function BreadcrumbJsonLd({ name, path }: { name: string; path: string }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '首頁', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name, item: `${SITE_URL}${path}` },
    ],
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
