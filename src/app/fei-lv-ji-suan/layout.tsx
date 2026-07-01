import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: '支票貼現費率試算 | 即時計算手續費與到手金額',
  description: '免費支票貼現費率計算工具。輸入票面金額、票期天數與月費率，即時試算手續費與實際到手金額，幫助您在申請前掌握貼現成本。',
  keywords: ['支票貼現試算', '支票貼現費用計算', '票貼費率計算', '支票貼現月費率', '貼現費用試算', '支票貼現計算機'],
  alternates: { canonical: `${SITE_URL}/fei-lv-ji-suan` },
}

export default function FeiLvJiSuanLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
