import type { Metadata } from 'next'
import Link from 'next/link'
import ContactForm from '@/components/ContactForm'
import { LINE_ADD_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: '聯絡我們 | 免費諮詢支票貸款・支票貼現',
  description: '立即聯絡黃璽理財管理顧問，免費諮詢支票貼現、支票貸款服務。電話：0982-691803，週一至週五 09:00-18:00。',
}

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section style={{ backgroundColor: '#0D2B5E' }} className="text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <nav className="text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-white">首頁</Link>
            <span className="mx-2">/</span>
            <span className="text-white">聯絡我們</span>
          </nav>
          <h1 className="text-4xl font-bold mb-4">聯絡我們</h1>
          <p className="text-gray-300 text-lg">免費諮詢，專業顧問為您規劃最適方案</p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-[#0D2B5E] mb-6">填寫諮詢表單</h2>
              <p className="text-gray-500 text-sm mb-8">
                留下您的聯絡資料，顧問將在 1 個工作日內與您聯繫（不收諮詢費）
              </p>
              <ContactForm />
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-[#0D2B5E] mb-6">直接聯絡</h2>

              <div className="space-y-6">
                <a href="tel:0982-691803" className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <span className="text-2xl">📞</span>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">電話諮詢</h3>
                    <p className="text-[#0D2B5E] font-bold text-lg">0982-691803</p>
                    <p className="text-gray-500 text-sm mt-1">週一至週五 09:00 – 18:00</p>
                  </div>
                </a>

                <a
                  href={LINE_ADD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-5 rounded-xl transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#06C755' }}
                >
                  <span className="text-2xl">💬</span>
                  <div>
                    <h3 className="font-bold text-white mb-1">LINE 線上諮詢</h3>
                    <p className="text-white font-bold text-lg">加入好友即時諮詢</p>
                    <p className="text-white/80 text-sm mt-1">點此加入 LINE 官方帳號</p>
                  </div>
                </a>

                <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl">
                  <span className="text-2xl">✉️</span>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">Email</h3>
                    <a href="mailto:service@huangxi.tw" className="text-[#0D2B5E] font-bold hover:underline">service@huangxi.tw</a>
                    <p className="text-gray-500 text-sm mt-1">1個工作日內回覆</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl">
                  <span className="text-2xl">📍</span>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">公司地址</h3>
                    <p className="text-gray-700">高雄市新興區民權一路251號21樓</p>
                    <p className="text-gray-500 text-sm mt-1">建議來訪前先預約</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 rounded-xl" style={{ backgroundColor: '#F0F4FF' }}>
                <h3 className="font-bold text-[#0D2B5E] mb-3">免費諮詢承諾</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2"><span className="text-green-500">✓</span> 不收任何諮詢費用</li>
                  <li className="flex items-center gap-2"><span className="text-green-500">✓</span> 1個工作日內回覆</li>
                  <li className="flex items-center gap-2"><span className="text-green-500">✓</span> 嚴格保密您的資料</li>
                  <li className="flex items-center gap-2"><span className="text-green-500">✓</span> 量身規劃融資方案</li>
                  <li className="flex items-center gap-2"><span className="text-green-500">✓</span> 費用清楚說明，不強迫</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
