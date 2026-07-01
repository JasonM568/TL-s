import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '企業貸款・企業融資 | 中小企業資金週轉方案',
  description:
    '企業貸款、企業融資專業諮詢，協助中小企業取得營運週轉資金。信用貸款、擔保貸款、票據融資多元管道評估。若您手上有客戶支票，更能透過支票貼現、支票貸款快速取得資金。免費評估、費率透明。',
  keywords: ['企業貸款', '企業融資', '中小企業貸款', '公司貸款', '營運資金貸款', '企業週轉金', '企業資金週轉'],
}

const types = [
  {
    icon: '📝',
    title: '信用貸款',
    desc: '以企業與負責人信用為基礎，免擔保品即可申請，適合快速取得營運週轉資金。',
    highlight: false,
  },
  {
    icon: '🏢',
    title: '擔保貸款',
    desc: '以不動產、設備等作為擔保，可取得較高額度與較優條件，適合較大額的資金需求。',
    highlight: false,
  },
  {
    icon: '⚡',
    title: '票據融資（支票貼現／支票貸款）',
    desc: '手上有客戶開立的支票，即可透過支票貼現或支票貸款快速取得資金，最快當日撥款——這是最快的企業週轉方式。',
    highlight: true,
  },
  {
    icon: '📊',
    title: '應收帳款融資',
    desc: '以尚未收回的貨款（應收帳款）為基礎取得資金，加速現金回收，適合帳期較長的企業。',
    highlight: false,
  },
]

const conditions = [
  '公司登記在案之企業或商號',
  '營業達一定期間（依方案而定）',
  '負責人信用狀況正常',
  '具備基本還款能力',
]

const features = [
  { icon: '🎯', title: '多元方案', desc: '依企業實際狀況媒合最合適的融資管道，不綁單一產品' },
  { icon: '⚡', title: '有票加速', desc: '持有客戶支票者，可透過票據融資最快當日取得資金' },
  { icon: '💯', title: '費率透明', desc: '事前清楚說明所有費用與條件，無隱藏收費' },
  { icon: '🤝', title: '專人評估', desc: '一對一免費諮詢，量身規劃企業資金策略' },
]

const faqs = [
  {
    q: '企業貸款和企業融資有什麼不同？',
    a: '「企業融資」是廣義的說法，泛指企業取得資金的各種方式，包含銀行貸款、票據融資、應收帳款融資等；「企業貸款」則是其中一種——以借款形式取得資金並依約還款。我們協助企業評估最適合的融資方式，不限單一產品。',
  },
  {
    q: '公司成立多久才能申請企業貸款？',
    a: '不同方案對營業期間的要求不同。部分票據融資（如支票貼現）更看重支票與發票人信用，對公司成立時間較有彈性。建議來電說明您的狀況，我們會評估最合適的管道。',
  },
  {
    q: '沒有不動產可以申請企業貸款嗎？',
    a: '可以。除了不動產擔保貸款外，還有信用貸款、票據融資、應收帳款融資等免不動產擔保的方式。若您手上有客戶開立的支票，票據融資往往是最快的選擇。',
  },
  {
    q: '手上有客戶支票，適合哪種企業融資？',
    a: '若您持有客戶開立的遠期支票，透過支票貼現可提前把票變現、或以支票貸款作為擔保取得資金，通常是所有企業融資方式中最快、審核最有彈性的一種，最快當日即可撥款。',
  },
  {
    q: '申請企業貸款需要準備哪些文件？',
    a: '基本包含公司登記文件、負責人身分證明；依方案不同可能需要財務資料、擔保品文件或支票正本。實際文件清單請洽詢專員，我們提供免費評估。',
  },
]

export default function QiYeDaiKuanPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.q,
              acceptedAnswer: { '@type': 'Answer', text: faq.a },
            })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: '中小企業如何申請企業貸款或企業融資',
            description: '企業取得營運資金的完整評估流程，協助選擇最合適的融資管道',
            totalTime: 'P3D',
            step: [
              { '@type': 'HowToStep', position: 1, name: '免費諮詢', text: '說明企業狀況與資金需求，專業顧問評估適合的融資管道。' },
              { '@type': 'HowToStep', position: 2, name: '方案確認', text: '依企業資產、信用、持票狀況，決定信用貸款、擔保貸款或票據融資方案。' },
              { '@type': 'HowToStep', position: 3, name: '文件準備', text: '依所選方案準備公司文件、財務資料或支票等必要文件。' },
              { '@type': 'HowToStep', position: 4, name: '審核撥款', text: '完成審核後簽署合約，資金依約定方式撥入指定帳戶。' },
            ],
          }),
        }}
      />

      {/* Hero */}
      <section style={{ backgroundColor: '#0E4D52' }} className="text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <nav className="text-sm text-teal-200/80 mb-6">
            <Link href="/" className="hover:text-white">首頁</Link>
            <span className="mx-2">/</span>
            <span className="text-white">企業貸款</span>
          </nav>
          <h1 className="text-4xl font-bold mb-4">企業貸款・企業融資</h1>
          <p className="text-xl text-teal-100 mb-6">中小企業資金週轉，多元管道一次評估</p>
          <p className="text-teal-100 leading-relaxed max-w-2xl">
            企業營運、備料、擴張都需要資金。我們協助中小企業評估最合適的企業融資方式；
            若您手上有客戶開立的支票，更能透過票據融資快速取得週轉資金。
          </p>
        </div>
      </section>

      {/* 快速摘要（AEO：AI 答案引擎優先抽取） */}
      <section className="px-4 py-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div role="note" className="border-l-4 pl-5 py-5 rounded-r-xl bg-[#F0F9F8]" style={{ borderColor: '#0E4D52' }}>
            <p className="text-xs font-bold text-[#0E4D52] uppercase tracking-widest mb-2">快速摘要</p>
            <p className="text-gray-800 leading-relaxed">
              <strong>企業貸款</strong>與<strong>企業融資</strong>是中小企業取得營運資金的主要方式，包含信用貸款、擔保貸款、票據融資（支票貼現／支票貸款）及應收帳款融資等管道。
              其中若企業手上有客戶開立的遠期支票，透過票據融資可最快當日撥款，是所有方式中速度最快的選擇。
              申請前建議免費諮詢，由專業顧問依企業狀況媒合最合適的融資方案。
            </p>
          </div>
        </div>
      </section>

      {/* What is it */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-2xl font-bold text-[#0D2B5E] mb-6">什麼是企業貸款與企業融資？</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  <strong className="text-gray-800">企業融資</strong>是企業取得營運資金的統稱，
                  涵蓋銀行貸款、票據融資、應收帳款融資等多種方式；
                  <strong className="text-gray-800">企業貸款</strong>則是其中最常見的一種，
                  以借款方式取得資金、再依約還款。
                </p>
                <p>
                  中小企業常見的資金需求包括：接單後的備料付款、員工薪資、設備採購，
                  或客戶票期拉長造成的現金流缺口。選對融資方式，能讓企業週轉更順、成本更低。
                </p>
                <p>
                  我們不綁單一產品，而是依您的企業狀況、手上資源與資金急迫程度，
                  媒合最合適的企業融資方案。
                </p>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-[#0D2B5E] text-lg mb-4">適合尋求企業貸款的情況</h3>
              <div className="space-y-3">
                {[
                  '接了訂單需要先備料、付款',
                  '客戶票期太長，現金週轉吃緊',
                  '需要資金採購設備、擴充產能',
                  '銀行流程太慢或條件不符，需要更快的管道',
                  '手上有客戶支票，想加速變現',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 p-3 bg-teal-50 rounded-lg">
                    <span className="text-teal-600 font-bold mt-0.5">✓</span>
                    <span className="text-gray-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Types */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-[#0D2B5E] mb-3 text-center">常見的企業融資管道</h2>
          <p className="text-gray-500 text-center mb-10">依企業狀況選對工具，週轉更有效率</p>
          <div className="grid sm:grid-cols-2 gap-6">
            {types.map((t) => (
              <div
                key={t.title}
                className={`rounded-xl p-6 border ${
                  t.highlight
                    ? 'bg-[#F0F9F8] border-[#0E4D52]/30 shadow-sm'
                    : 'bg-white border-gray-100 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{t.icon}</span>
                  <h3 className="font-bold text-[#0D2B5E]">{t.title}</h3>
                  {t.highlight && (
                    <span className="text-xs text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: '#0E4D52' }}>
                      最快
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-sell to check services */}
      <section className="py-16 px-4" style={{ backgroundColor: '#0D2B5E' }}>
        <div className="max-w-4xl mx-auto text-center text-white">
          <p className="text-[#F5C842] font-semibold text-sm mb-3 tracking-widest">手上有客戶支票嗎？</p>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">有支票，就有最快的企業週轉方式</h2>
          <p className="text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto">
            比起一般企業貸款，若您持有客戶開立的支票，透過支票貼現或支票貸款，
            審核更彈性、速度更快，最快當日就能取得資金。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/zhi-piao-tie-xian"
              className="inline-block px-8 py-4 rounded font-bold text-white text-lg transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#C9922A' }}
            >
              了解支票貼現 →
            </Link>
            <Link
              href="/zhi-piao-dai-kuan"
              className="inline-block px-8 py-4 rounded font-bold text-white text-lg border border-white/40 hover:bg-white/10 transition-colors"
            >
              了解支票貸款 →
            </Link>
          </div>
        </div>
      </section>

      {/* Conditions */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-[#0D2B5E] mb-8 text-center">基本申請條件</h2>
          <div className="max-w-2xl mx-auto space-y-3">
            {conditions.map((c) => (
              <div key={c} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <span className="text-teal-600 font-bold mt-0.5">✓</span>
                <span className="text-gray-700">{c}</span>
              </div>
            ))}
            <p className="text-sm text-gray-500 mt-6 text-center">
              不確定是否符合條件？歡迎免費諮詢，我們依您的狀況提供個別評估。
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-[#0D2B5E] mb-10 text-center">服務特色</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-xl p-6 text-center shadow-sm">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-[#0D2B5E] mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-[#0D2B5E] mb-8 text-center">企業貸款常見問題</h2>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <details key={faq.q} className="group bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer font-semibold text-[#0D2B5E] hover:bg-gray-50">
                  {faq.q}
                  <span className="ml-4 text-[#C9922A] group-open:rotate-45 transition-transform shrink-0">+</span>
                </summary>
                <div className="px-6 pb-6 text-gray-600 text-sm leading-relaxed">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: '#0E4D52' }} className="py-16 px-4 text-white text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">尋找最適合的企業融資方案</h2>
          <p className="text-teal-100 mb-8">免費評估，專業顧問為您分析最合適的資金管道</p>
          <Link
            href="/contact"
            className="inline-block px-10 py-4 rounded font-bold text-white text-lg transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#C9922A' }}
          >
            立即免費諮詢
          </Link>
        </div>
      </section>
    </>
  )
}
