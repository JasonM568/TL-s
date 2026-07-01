import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import FloatingLine from '@/components/FloatingLine'
import { SITE_URL, SITE_NAME } from '@/lib/site'

const personJsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#author-li-cheng-xin`,
    name: '理財顧問 李誠信',
    jobTitle: '理財顧問',
    worksFor: { '@type': 'Organization', '@id': `${SITE_URL}/#organization`, name: SITE_NAME },
    knowsAbout: ['支票貼現', '支票貸款', '票據融資', '企業融資', '票貼', '遠期支票'],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#author-zhang-yang`,
    name: '理財顧問 張揚',
    jobTitle: '理財顧問',
    worksFor: { '@type': 'Organization', '@id': `${SITE_URL}/#organization`, name: SITE_NAME },
    knowsAbout: ['企業融資', '企業貸款', '中小企業貸款', '周轉金', '應收帳款融資'],
  },
]

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: '%s | 黃璽理財管理顧問',
    default: '黃璽理財管理顧問 | 支票貸款・支票貼現專家',
  },
  description: '專業企業融資服務，支票貼現、支票貸款快速審核，協助中小企業解決資金周轉問題。24小時諮詢，最快當日撥款。',
  keywords: ['支票貸款', '支票貼現', '企業融資', '票貼', '企業周轉金', '支票融資', '遠期支票貸款', '支票借款'],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: '黃璽理財管理顧問',
    title: '黃璽理財管理顧問 | 支票貸款・支票貼現專家',
    description: '專業企業融資服務，支票貼現、支票貸款快速審核，協助中小企業解決資金周轉問題。',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <body className="min-h-screen bg-white text-gray-900">
        {personJsonLd.map((person, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
          />
        ))}
        <Header />
        <main>{children}</main>
        <Footer />
        <FloatingLine />
        <GoogleAnalytics />
      </body>
    </html>
  )
}
