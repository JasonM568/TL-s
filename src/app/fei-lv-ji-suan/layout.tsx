import type { Metadata } from 'next'
import { SITE_URL, SITE_NAME } from '@/lib/site'

export const metadata: Metadata = {
  title: '支票貼現費率試算 | 即時計算手續費與到手金額',
  description: '免費支票貼現費率計算工具。輸入票面金額、票期天數與月費率，即時試算手續費與實際到手金額，幫助您在申請前掌握貼現成本。',
  keywords: ['支票貼現試算', '支票貼現費用計算', '票貼費率計算', '支票貼現月費率', '貼現費用試算', '支票貼現計算機'],
  alternates: { canonical: `${SITE_URL}/fei-lv-ji-suan` },
}

const webAppJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '支票貼現費率試算工具',
  url: `${SITE_URL}/fei-lv-ji-suan`,
  description: '輸入票面金額、票期天數與月費率，即時計算支票貼現手續費與實際到手金額',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'TWD' },
  featureList: ['即時費率試算', '支援自定義月費率', '計算手續費與到手金額', '免費使用'],
  provider: {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
  },
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: '首頁', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: '支票貼現費率試算', item: `${SITE_URL}/fei-lv-ji-suan` },
  ],
}

export default function FeiLvJiSuanLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {children}
    </>
  )
}
