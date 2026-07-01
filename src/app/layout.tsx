import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import FloatingLine from '@/components/FloatingLine'
import { SITE_URL } from '@/lib/site'

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
        <Header />
        <main>{children}</main>
        <Footer />
        <FloatingLine />
        <GoogleAnalytics />
      </body>
    </html>
  )
}
