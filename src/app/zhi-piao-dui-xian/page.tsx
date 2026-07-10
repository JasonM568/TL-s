import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_URL, SITE_NAME } from '@/lib/site'

export const metadata: Metadata = {
  title: '支票兌現 | 支票快速換現金，當日撥款',
  description: '支票兌現服務，即期或遠期支票皆可評估，審核彈性、費率透明、最快當日撥款。了解支票兌現條件、費用與申請流程，立即免費諮詢。',
  keywords: ['支票兌現', '支票換現金', '支票兌換現金', '票據兌現', '支票現金'],
  alternates: { canonical: `${SITE_URL}/zhi-piao-dui-xian` },
}

const conditions = [
  '企業或商號持有之商業支票（即期或遠期）',
  '支票發票人具備一定信用條件，無拒絕往來紀錄',
  '票面金額達最低門檻（依實際情況評估）',
  '公司登記在案，負責人身分可驗證',
]

const features = [
  { icon: '⚡', title: '當日到帳', desc: '資料齊全、審核通過後最快當日完成撥款' },
  { icon: '📋', title: '文件簡便', desc: '基本公司文件加支票即可申請，無需複雜財務報表' },
  { icon: '💯', title: '費率透明', desc: '事前明列手續費，合約白紙黑字，無隱藏費用' },
  { icon: '🔐', title: '保密安全', desc: '嚴格保護客戶資料，所有交易完全保密處理' },
]

const comparisons = [
  {
    item: '審核時間',
    bank: '1～2 週',
    us: '最快當日',
  },
  {
    item: '所需文件',
    bank: '財報、稅單、擔保品',
    us: '公司文件 + 支票',
  },
  {
    item: '信用要求',
    bank: '嚴格（聯徵紀錄）',
    us: '彈性評估',
  },
  {
    item: '適用票種',
    bank: '限銀行核准票',
    us: '即期 / 遠期皆可',
  },
  {
    item: '諮詢費用',
    bank: '免費',
    us: '免費',
  },
]

const faqs = [
  {
    q: '支票兌現和支票貼現有什麼不同？',
    a: '兩者都是將支票換取現金，差異在於範圍與用語：支票兌現泛指所有將支票轉換為現金的行為，包含即期票到期兌領及遠期票提前換現；支票貼現（票貼）特指遠期支票提前以折扣金額換現。實務上服務內容高度重疊，我們都可以協助評估。',
  },
  {
    q: '即期支票和遠期支票都可以兌現嗎？',
    a: '即期支票原則上可至銀行直接兌領；遠期支票則需透過支票兌現或票貼服務提前取現。若您的銀行帳戶有問題、或需要更快速的資金，即期票也可來電諮詢，我們提供靈活的評估方案。',
  },
  {
    q: '支票兌現的費用怎麼計算？',
    a: '費用依支票金額、票期長短（遠期票）及發票人信用狀況綜合計算，一般以手續費方式一次收取。即期票依服務內容另行評估。建議填寫諮詢表單或來電，我們提供免費個別報價。',
  },
  {
    q: '支票兌現需要哪些文件？',
    a: '基本文件：公司設立相關文件（公司登記證或商業登記抄本）、負責人身分證正本、欲兌現之支票正本。部分情況可能需要公司大小章，詳細清單由專員確認。',
  },
  {
    q: '支票兌現後如果支票跳票怎麼辦？',
    a: '支票兌現後若到期遭退票，依合約由持票人（申請方）承擔票款追索責任。辦理前我們會協助評估支票品質，降低跳票風險。建議選擇信用良好的發票人支票進行兌現。',
  },
]

export default function ZhiPiaoDuiXianPage() {
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
            name: '如何申請支票兌現',
            description: '支票兌現申請完整流程，從初步諮詢到取得現金，最快當日完成',
            totalTime: 'P1D',
            estimatedCost: {
              '@type': 'MonetaryAmount',
              currency: 'TWD',
              description: '諮詢免費；手續費依支票金額與票期評估後報價',
            },
            step: [
              { '@type': 'HowToStep', position: 1, name: '聯繫諮詢', text: '電話或填寫線上表單，說明支票金額、票種與票期，取得初步評估。' },
              { '@type': 'HowToStep', position: 2, name: '準備文件', text: '備妥公司登記文件、負責人身分證件及欲兌現的支票正本。' },
              { '@type': 'HowToStep', position: 3, name: '審核報價', text: '專業人員審核支票及文件，提供正式手續費報價與合約條件。' },
              { '@type': 'HowToStep', position: 4, name: '簽約撥款', text: '雙方確認條件後簽署合約，完成後資金快速匯入指定帳戶。' },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: '首頁', item: SITE_URL },
              { '@type': 'ListItem', position: 2, name: '支票兌現', item: `${SITE_URL}/zhi-piao-dui-xian` },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FinancialProduct',
            '@id': `${SITE_URL}/zhi-piao-dui-xian#service`,
            name: '支票兌現',
            description: '即期或遠期支票皆可申請兌現，費率透明、審核彈性，最快當日撥款。',
            category: '票據融資',
            provider: { '@type': 'Organization', '@id': `${SITE_URL}/#organization`, name: SITE_NAME },
            areaServed: { '@type': 'Country', name: '台灣' },
            offers: {
              '@type': 'Offer',
              priceCurrency: 'TWD',
              description: '手續費依支票金額、票期與發票人信用綜合評估，諮詢免費',
            },
          }),
        }}
      />

      {/* Hero */}
      <section style={{ backgroundColor: '#0D2B5E' }} className="text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <nav className="text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-white">首頁</Link>
            <span className="mx-2">/</span>
            <span className="text-white">支票兌現</span>
          </nav>
          <h1 className="text-4xl font-bold mb-4">支票兌現</h1>
          <p className="text-xl text-gray-200 mb-6">支票快速換現金，審核彈性、當日到帳</p>
          <p className="text-gray-300 leading-relaxed max-w-2xl">
            不論是即期支票或遠期支票，黃璽理財提供彈性的支票兌現評估服務。
            文件簡便、費率透明，資料齊全最快當日撥款，協助企業解決急迫的資金需求。
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link
              href="/contact"
              className="inline-block px-8 py-3 rounded font-bold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#C9922A' }}
            >
              免費諮詢
            </Link>
            <Link
              href="/fei-lv-ji-suan"
              className="inline-block px-8 py-3 rounded font-bold border-2 border-white text-white hover:bg-white hover:text-[#0D2B5E] transition-colors"
            >
              費率試算
            </Link>
          </div>
        </div>
      </section>

      {/* 快速摘要（AEO） */}
      <section className="px-4 py-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div role="note" className="border-l-4 pl-5 py-5 rounded-r-xl bg-[#F0F4FF]" style={{ borderColor: '#0D2B5E' }}>
            <p className="text-xs font-bold text-[#0D2B5E] uppercase tracking-widest mb-2">快速摘要</p>
            <p className="text-gray-800 leading-relaxed">
              <strong>支票兌現</strong>是指將持有的支票（即期或遠期）轉換為現金的服務。
              申請只需公司登記文件、負責人身分證及支票正本，審核通過後最快當日撥款。
              手續費依票面金額、票種及發票人信用綜合評估，諮詢完全免費。
              與銀行相比，民間支票兌現服務審核更彈性，適合急需資金或不符合銀行條件的企業。
            </p>
          </div>
        </div>
      </section>

      {/* What is it */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold text-[#0D2B5E] mb-6">什麼是支票兌現？</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  <strong className="text-gray-800">支票兌現</strong>泛指將支票轉換為現金的所有方式，
                  包含即期支票到期日前後的兌領，以及遠期支票在票期未到前的提前換現（又稱支票貼現）。
                </p>
                <p>
                  對企業而言，收到客戶開立的遠期支票後，往往需要等待 30 到 180 天才能入帳。
                  透過支票兌現服務，可不必等待，立即取得現金，解決資金周轉缺口。
                </p>
                <p>
                  黃璽理財的支票兌現服務針對中小企業設計，審核條件彈性、
                  流程簡便，不需要繁複的財務報表，只要支票品質良好即可申請評估。
                </p>
              </div>
              <div className="mt-6 space-y-2">
                <p className="text-sm text-gray-500">延伸閱讀：</p>
                <Link href="/zhi-piao-tie-xian" className="block text-sm text-[#0D2B5E] hover:underline">→ 支票貼現（遠期支票換現金）</Link>
                <Link href="/zhi-piao-dai-kuan" className="block text-sm text-[#0D2B5E] hover:underline">→ 支票貸款（以支票為擔保借款）</Link>
              </div>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h3 className="font-bold text-[#0D2B5E] text-lg mb-6">支票兌現試算範例</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">支票票面金額</span>
                  <span className="font-bold">$500,000</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">票種</span>
                  <span className="font-bold">遠期支票（60 天）</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">月費率（示範）</span>
                  <span className="font-bold">1.5%</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">手續費</span>
                  <span className="font-bold text-red-500">- $15,000</span>
                </div>
                <div className="flex justify-between py-3 bg-[#F0F4FF] rounded px-3">
                  <span className="font-bold text-[#0D2B5E]">實際取得現金</span>
                  <span className="font-bold text-[#0D2B5E] text-lg">$485,000</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-4">※ 以上為示範數字，實際費率依評估結果為準</p>
            </div>
          </div>
        </div>
      </section>

      {/* Conditions */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-[#0D2B5E] mb-8 text-center">申請條件</h2>
          <div className="max-w-2xl mx-auto">
            <div className="space-y-3">
              {conditions.map((c) => (
                <div key={c} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <span className="text-green-500 font-bold mt-0.5">✓</span>
                  <span className="text-gray-700">{c}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-6 text-center">
              不確定是否符合條件？歡迎免費諮詢，專員提供個別評估。
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

      {/* Process */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-[#0D2B5E] mb-10 text-center">辦理流程</h2>
          <div className="space-y-4">
            {[
              { n: '1', t: '聯繫諮詢', d: '電話或填寫線上表單，說明支票金額、票種（即期/遠期）與票期，取得初步評估。' },
              { n: '2', t: '準備文件', d: '備妥公司登記文件、負責人身分證件及欲兌現的支票正本。' },
              { n: '3', t: '審核報價', d: '專業人員審核支票與相關文件，提供正式手續費報價與合約條件。' },
              { n: '4', t: '簽約撥款', d: '雙方確認條件後簽署合約，完成後資金快速匯入指定帳戶，最快當日到帳。' },
            ].map((s) => (
              <div key={s.n} className="flex gap-4 items-start p-6 bg-gray-50 rounded-xl">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0"
                  style={{ backgroundColor: '#0D2B5E' }}
                >
                  {s.n}
                </div>
                <div>
                  <h3 className="font-bold text-[#0D2B5E] mb-1">{s.t}</h3>
                  <p className="text-gray-600 text-sm">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-[#0D2B5E] mb-8 text-center">支票兌現 vs 銀行兌現</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm bg-white rounded-xl shadow-sm overflow-hidden">
              <thead>
                <tr style={{ backgroundColor: '#0D2B5E' }} className="text-white">
                  <th className="px-6 py-4 text-left">比較項目</th>
                  <th className="px-6 py-4 text-center">銀行</th>
                  <th className="px-6 py-4 text-center" style={{ color: '#C9922A' }}>黃璽理財</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((row, i) => (
                  <tr key={row.item} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 font-medium text-gray-700">{row.item}</td>
                    <td className="px-6 py-4 text-center text-gray-500">{row.bank}</td>
                    <td className="px-6 py-4 text-center font-semibold text-[#0D2B5E]">{row.us}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-[#0D2B5E] mb-8 text-center">支票兌現常見問題</h2>
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

      {/* Related services */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg font-bold text-[#0D2B5E] mb-6">相關服務</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link href="/zhi-piao-tie-xian" className="flex items-center gap-4 p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0" style={{ backgroundColor: '#0D2B5E' }}>貼</div>
              <div>
                <p className="font-bold text-[#0D2B5E]">支票貼現</p>
                <p className="text-xs text-gray-500">遠期支票提前換現，月費率 1.5%～3%</p>
              </div>
            </Link>
            <Link href="/zhi-piao-dai-kuan" className="flex items-center gap-4 p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0" style={{ backgroundColor: '#C9922A' }}>貸</div>
              <div>
                <p className="font-bold text-[#0D2B5E]">支票貸款</p>
                <p className="text-xs text-gray-500">以支票為擔保借款，額度更彈性</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: '#0D2B5E' }} className="py-16 px-4 text-white text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">立即諮詢支票兌現服務</h2>
          <p className="text-gray-300 mb-8">免費評估，專業顧問為您說明最適合的方案</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-block px-10 py-4 rounded font-bold text-white text-lg transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#C9922A' }}
            >
              免費諮詢
            </Link>
            <a
              href="tel:0982-697803"
              className="inline-block px-10 py-4 rounded font-bold border-2 border-white text-white hover:bg-white hover:text-[#0D2B5E] transition-colors text-lg"
            >
              直接來電
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
