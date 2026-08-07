import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_URL, SITE_NAME } from '@/lib/site'

export const metadata: Metadata = {
  title: '支票貸款 | 支票擔保企業融資',
  description: '支票貸款服務，以企業持有支票作為擔保，取得所需資金。額度彈性、審核快速。了解支票貸款條件、流程，立即免費諮詢。',
  alternates: { canonical: `${SITE_URL}/zhi-piao-dai-kuan` },
}

const compareItems = [
  { item: '適用對象', ticketLoan: '需要較大額度融資', ticketDiscount: '急需票面金額現金' },
  { item: '資金來源', ticketLoan: '以支票擔保借款', ticketDiscount: '支票票面金額折現' },
  { item: '可借金額', ticketLoan: '可高於票面金額', ticketDiscount: '約票面金額85-98%' },
  { item: '還款方式', ticketLoan: '彈性分期還款', ticketDiscount: '票期到期一次清償' },
  { item: '適合情境', ticketLoan: '需要更高資金靈活度', ticketDiscount: '單純換取票面現金' },
]

const repaymentModes = [
  {
    title: '到期一次清償',
    desc: '借款期間只繳利息，本金於約定到期日一次還清。適合已確定有一筆資金會進來（工程尾款、季節性營收）、只是時間差的企業。',
  },
  {
    title: '分期攤還',
    desc: '本金加利息按月分期，每月負擔固定、現金流好預估。適合資金需求較大、需要拉長還款期間的營運投資。',
  },
  {
    title: '隨借隨還',
    desc: '約定額度內動用多少算多少利息，資金回籠隨時可提前清償、不收提前清償違約金。適合資金需求波動大的買賣業。',
  },
]

const faqs = [
  {
    q: '支票貸款和支票貼現有什麼差別？',
    a: '支票貸款是以支票作為擔保品向我們借款，可借金額有時可高於票面金額，並有彈性的還款方式，支票所有權仍在你手上。支票貼現則是把支票背書轉讓、直接換成現金，取得金額為扣除手續費後的票面金額，票到期兌現交易即結束。要更高額度與還款彈性選貸款，要單純快速變現選貼現。',
  },
  {
    q: '支票貸款的利率是多少？',
    a: '利率依借款金額、還款期限、擔保支票品質（發票人信用、票期）綜合評估，一般月息約 1.5%～3% 起。我們堅持費率透明，簽約前書面說明所有費用，沒有開辦費、帳管費等隱藏名目。',
  },
  {
    q: '支票貸款需要額外擔保品嗎？',
    a: '以支票為主要擔保。若借款金額明顯高於票面金額，可能需要輔助條件（如本票、共同借款人），會在評估階段一次講清楚，不會事後追加。',
  },
  {
    q: '支票貸款最多可以借多少錢？',
    a: '額度依擔保支票金額、發票人信用與企業還款能力綜合評估。以客票品質良好的案件而言，可貸金額有機會達票面金額的八成到超過票面，實際額度以審核為準。',
  },
  {
    q: '還款方式可以選嗎？',
    a: '可以。到期一次清償、按月分期攤還、額度內隨借隨還三種模式都可以談，依你的現金流型態選擇。提前清償不收違約金。詳細比較見支票貸款還款方式說明。',
  },
  {
    q: '支票貸款期間，支票到期了怎麼辦？',
    a: '兩種處理：一是支票兌現後直接抵償借款本金，二是換票續作（以新的客票替換到期票）。哪種方式適合，簽約時會依你的資金規劃先約定好。',
  },
  {
    q: '公司信用有瑕疵，還能辦支票貸款嗎？',
    a: '可以評估。支票貸款看重的是擔保支票的發票人信用，持票公司自身的信用瑕疵不必然是障礙，但可能影響額度與利率。建議直接提供支票資訊讓我們評估，不用先預設辦不過。',
  },
  {
    q: '個人可以辦支票貸款嗎？',
    a: '以公司與行號為主要服務對象。個人持有公司開立的支票（如接案貨款票）想變現，較適合走支票貼現，可參考個人支票兌現說明或來電詢問。',
  },
  {
    q: '高雄以外的企業可以辦嗎？',
    a: '可以。我們據點在高雄市新興區，服務高雄、台南、屏東企業，首次辦理需完成當面對保。其他縣市可先電話評估再安排。',
  },
]

export default function ZhiPiaoDaiKuanPage() {
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
            name: '如何申請支票貸款',
            description: '支票貸款申請完整流程，以支票作為擔保品取得所需資金',
            totalTime: 'P2D',
            estimatedCost: {
              '@type': 'MonetaryAmount',
              currency: 'TWD',
              description: '諮詢免費；利率依借款金額、還款期限、擔保品品質綜合評估',
            },
            step: [
              { '@type': 'HowToStep', position: 1, name: '初步諮詢', text: '說明資金需求及持有支票情況，取得初步融資評估。' },
              { '@type': 'HowToStep', position: 2, name: '文件準備', text: '公司登記文件、財務相關資料、擔保支票等基本文件。' },
              { '@type': 'HowToStep', position: 3, name: '信用評估', text: '評估企業信用狀況與還款能力，確定貸款額度與條件。' },
              { '@type': 'HowToStep', position: 4, name: '簽約動撥', text: '雙方確認貸款條件後簽署合約，資金撥入指定帳戶。' },
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
              { '@type': 'ListItem', position: 2, name: '支票貸款', item: `${SITE_URL}/zhi-piao-dai-kuan` },
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
            '@id': `${SITE_URL}/zhi-piao-dai-kuan#service`,
            name: '支票貸款',
            description: '以企業持有支票作為擔保，取得所需融資資金。額度彈性、審核快速，提供分期還款方案。',
            category: '票據融資',
            provider: { '@type': 'Organization', '@id': `${SITE_URL}/#organization`, name: SITE_NAME },
            areaServed: { '@type': 'Country', name: '台灣' },
            offers: {
              '@type': 'Offer',
              priceCurrency: 'TWD',
              description: '費率依借款金額、還款期限、擔保品品質綜合評估，諮詢免費',
            },
          }),
        }}
      />

      {/* Hero */}
      <section style={{ backgroundColor: '#1B5E20' }} className="text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <nav className="text-sm text-gray-300 mb-6">
            <Link href="/" className="hover:text-white">首頁</Link>
            <span className="mx-2">/</span>
            <span className="text-white">支票貸款</span>
          </nav>
          <h1 className="text-4xl font-bold mb-4">支票貸款</h1>
          <p className="text-xl text-green-100 mb-6">以支票擔保，取得更高額度的企業融資</p>
          <p className="text-green-100 leading-relaxed max-w-2xl">
            不同於支票貼現，支票貸款以您持有的支票作為擔保品，取得所需資金，
            提供更彈性的還款方式，協助企業進行更長期的資金規劃。
          </p>
        </div>
      </section>

      {/* 快速摘要（AEO：AI 答案引擎優先抽取） */}
      <section className="px-4 py-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div role="note" className="border-l-4 pl-5 py-5 rounded-r-xl bg-[#F0F9F2]" style={{ borderColor: '#1B5E20' }}>
            <p className="text-xs font-bold text-[#1B5E20] uppercase tracking-widest mb-2">快速摘要</p>
            <p className="text-gray-800 leading-relaxed">
              <strong>支票貸款</strong>是以企業持有的支票作為擔保品向融資機構借款的方式，可借金額可高於票面金額，並提供分期還款的彈性。
              與支票貼現（直接兌現票面金額）不同，支票貸款更適合需要較大資金或希望保留現金流彈性的企業。
              審核通過後資金快速到位，適合中小企業短期至中期的資金需求規劃。
            </p>
          </div>
        </div>
      </section>

      {/* What is it */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-2xl font-bold text-[#0D2B5E] mb-6">什麼是支票貸款？</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  <strong className="text-gray-800">支票貸款</strong>是以企業持有的支票作為擔保品，
                  向融資機構借款的融資方式。與支票貼現不同，支票貸款的借款金額可以超過票面金額，
                  並提供分期還款的彈性。
                </p>
                <p>
                  適合需要較大資金或希望保留更多現金流彈性的企業。當您需要的資金超過現有支票票面金額，
                  或希望以分期方式還款，支票貸款是更合適的選擇。
                </p>
                <p>
                  透過支票貸款，企業可以在不出售支票的情況下，以支票的信用基礎取得資金，
                  對企業的財務彈性有更大的幫助。基礎概念可先讀
                  <Link href="/articles/zhi-piao-dai-kuan-shi-shen-me" className="text-[#0D2B5E] underline underline-offset-2 mx-1">支票貸款是什麼</Link>，
                  申請門檻詳見
                  <Link href="/articles/zhi-piao-jie-kuan-tiao-jian" className="text-[#0D2B5E] underline underline-offset-2 mx-1">支票借款條件</Link>。
                </p>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-[#0D2B5E] text-lg mb-4">支票貸款適合您嗎？</h3>
              <div className="space-y-3">
                {[
                  '需要資金超過現有支票票面金額',
                  '希望以分期方式還款，減輕一次性壓力',
                  '需要保留支票以備其他用途',
                  '企業有穩定還款能力但需要短期資金',
                  '進行設備採購、原料備貨等營運投資',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <span className="text-green-600 font-bold mt-0.5">✓</span>
                    <span className="text-gray-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compare */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-[#0D2B5E] mb-8 text-center">支票貸款 vs 支票貼現 比較</h2>
          <div className="overflow-x-auto rounded-xl shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: '#0D2B5E' }} className="text-white">
                  <th className="p-4 text-left">比較項目</th>
                  <th className="p-4 text-center">支票貸款</th>
                  <th className="p-4 text-center">支票貼現</th>
                </tr>
              </thead>
              <tbody>
                {compareItems.map((row, i) => (
                  <tr key={row.item} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-4 font-medium text-gray-700">{row.item}</td>
                    <td className="p-4 text-center text-gray-600">{row.ticketLoan}</td>
                    <td className="p-4 text-center text-gray-600">{row.ticketDiscount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-center text-sm text-gray-500 mt-6">
            不確定哪種方案最適合？可先讀
            <Link href="/articles/dui-xian-vs-jie-kuan" className="text-[#0D2B5E] underline underline-offset-2 mx-1">兌現與借款的差異</Link>、
            <Link href="/articles/piao-tie-vs-xin-dai" className="text-[#0D2B5E] underline underline-offset-2 mx-1">票貼與信貸比較</Link>，或
            <Link href="/contact" className="text-[#0D2B5E] font-semibold ml-1 hover:underline">
              免費諮詢專員為您分析
            </Link>
          </p>
        </div>
      </section>

      {/* 還款方式 */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-[#0D2B5E] mb-3 text-center">三種還款方式，配合你的現金流</h2>
          <p className="text-gray-500 text-center mb-10 max-w-2xl mx-auto">
            支票貸款與貼現最大的差異就在還款彈性。簽約前選定模式，期間內照表操課，不會中途變更條件。
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {repaymentModes.map((m) => (
              <div key={m.title} className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-[#1B5E20] mb-3">{m.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-8 text-center">
            利率的計算邏輯見
            <Link href="/articles/zhi-piao-dai-kuan-li-lv" className="text-[#0D2B5E] underline underline-offset-2 mx-1">支票貸款利率說明</Link>，
            還款規劃細節見
            <Link href="/articles/zhi-piao-dai-kuan-huan-kuan" className="text-[#0D2B5E] underline underline-offset-2 mx-1">還款方式完整比較</Link>。
          </p>
        </div>
      </section>

      {/* 情境示例 */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-[#0D2B5E] mb-3 text-center">什麼時候選貸款、不選貼現？</h2>
          <p className="text-xs text-gray-400 text-center mb-8">※ 以下為示意情境與試算，非特定客戶案例；實際條件依審核結果為準</p>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-bold text-[#0D2B5E] mb-2">情境一：需要的資金比票面金額多</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                手上有 100 萬客票，但設備採購需要 150 萬。單純貼現最多拿回票面扣手續費，
                不夠就要另外想辦法；支票貸款則以這張票為主擔保、搭配企業還款能力評估，
                有機會一次取得所需額度，之後按月分期攤還。
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-bold text-[#0D2B5E] mb-2">情境二：票還想留著，但短期缺現金</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                有些企業的客票要留著到期存入自家帳戶（例如已對供應商承諾以該票轉付）。
                支票貸款不需要轉讓支票所有權，以票的信用基礎借款，
                到期後照原規劃使用票款，同時解決眼前的資金缺口。
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-bold text-[#0D2B5E] mb-2">情境三：資金需求會分批發生</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                接到大單要分三批備料，每批間隔一個月。選「隨借隨還」模式，
                核定總額度後分批動用、動用多少算多少利息，
                比一次貼現全部票款、讓資金閒置在帳上更省成本。
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-8 text-center">
            高雄、台南、屏東企業可利用
            <Link href="/gaoxiong-zhi-piao-tie-xian" className="text-[#0D2B5E] underline underline-offset-2 mx-1">高雄在地服務</Link>
            當面討論方案組合。
          </p>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-[#0D2B5E] mb-10 text-center">申請流程</h2>
          <div className="space-y-4">
            {[
              { n: '1', t: '初步諮詢', d: '說明資金需求及持有支票情況，取得初步融資評估。' },
              { n: '2', t: '文件準備', d: '公司登記文件、財務相關資料、擔保支票等基本文件。' },
              { n: '3', t: '信用評估', d: '評估企業信用狀況與還款能力，確定貸款額度與條件。' },
              { n: '4', t: '簽約動撥', d: '雙方確認貸款條件後簽署合約，資金撥入指定帳戶。' },
            ].map((s) => (
              <div key={s.n} className="flex gap-4 items-start p-6 bg-white rounded-xl shadow-sm">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0"
                  style={{ backgroundColor: '#1B5E20' }}
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

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-[#0D2B5E] mb-8 text-center">支票貸款常見問題</h2>
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
      <section style={{ backgroundColor: '#0D2B5E' }} className="py-16 px-4 text-white text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">了解支票貸款方案</h2>
          <p className="text-gray-300 mb-8">專業顧問分析最適合您企業的融資策略</p>
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
