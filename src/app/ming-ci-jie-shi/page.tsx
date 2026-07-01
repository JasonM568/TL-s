import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_URL, SITE_NAME } from '@/lib/site'

export const metadata: Metadata = {
  title: '支票融資名詞解釋 | 票貼・遠期支票・退票完整詞彙表',
  description:
    '支票貼現、支票貸款相關金融術語完整解釋。包含票貼、遠期支票、即期支票、背書、退票、拒絕往來戶、發票人、持票人等常見詞彙，幫助企業理解票據融資基本概念。',
  keywords: ['支票貼現名詞', '票貼', '遠期支票', '退票', '背書', '發票人', '持票人', '拒絕往來戶', '票期', '票據融資'],
  alternates: { canonical: `${SITE_URL}/ming-ci-jie-shi` },
}

const glossaryPageUrl = `${SITE_URL}/ming-ci-jie-shi`

const terms = [
  {
    id: 'zhi-piao-tie-xian',
    name: '支票貼現',
    english: 'Check Discounting',
    alias: '票貼、票據貼現',
    definition:
      '持票人（企業）將尚未到期的遠期支票，以扣除手續費（貼水）後的金額提前換取現金的融資方式。企業不必等到支票到期日，即可取得資金，有效解決資金周轉問題。',
    related: '/zhi-piao-tie-xian',
    relatedLabel: '了解支票貼現服務',
  },
  {
    id: 'piao-tie',
    name: '票貼',
    english: 'Bill / Ticket Discounting',
    alias: '支票貼現的簡稱',
    definition:
      '「票貼」是「票據貼現」或「支票貼現」的簡稱，為業界常用俗稱。持票企業將遠期支票提前變現，俗稱「做票貼」。',
    related: '/zhi-piao-tie-xian',
    relatedLabel: '支票貼現服務',
  },
  {
    id: 'yuan-qi-zhi-piao',
    name: '遠期支票',
    english: 'Post-Dated Check / Forward Check',
    alias: '遠期票、遠票',
    definition:
      '支票上的發票日期為未來某一日期，持票人須等到該日期才能向銀行兌現的支票。企業在商業交易中常以遠期支票延後付款，票期通常為 30～180 天。支票貼現即是協助持有遠期支票的企業提前換取現金。',
    related: null,
    relatedLabel: '',
  },
  {
    id: 'ji-qi-zhi-piao',
    name: '即期支票',
    english: 'Sight Check / Demand Check',
    alias: '現票',
    definition:
      '發票日為當日或過去日期，可立即向銀行提示兌現的支票。與遠期支票相對，即期支票代表立即的付款義務，無需等待票期。',
    related: null,
    relatedLabel: '',
  },
  {
    id: 'zhi-piao-dai-kuan',
    name: '支票貸款',
    english: 'Check-Backed Loan',
    alias: '票據擔保貸款',
    definition:
      '以企業持有的支票作為擔保品向融資機構借款的方式。與支票貼現（直接兌現票面金額）不同，支票貸款可借金額有時可高於票面金額，並提供分期還款的彈性，適合需要較大資金或較長還款期的企業。',
    related: '/zhi-piao-dai-kuan',
    relatedLabel: '了解支票貸款服務',
  },
  {
    id: 'ben-piao',
    name: '本票',
    english: 'Promissory Note',
    alias: '本票、期票',
    definition:
      '由發票人承諾在指定日期支付特定金額給受款人的票據。與支票不同，本票的付款義務直接由發票人承擔，無需透過銀行。本票不適用於支票貼現服務。',
    related: '/articles/ben-piao-vs-zhi-piao',
    relatedLabel: '本票與支票的差別',
  },
  {
    id: 'bei-shu',
    name: '背書',
    english: 'Endorsement',
    alias: '票據背書',
    definition:
      '票據持有人在票背簽名，將票據轉讓給他人的行為。透過背書，票據的受款人可以轉移給第三方。若支票註記「禁止背書轉讓」，則該票只能由原受款人兌現，不得轉讓。',
    related: null,
    relatedLabel: '',
  },
  {
    id: 'tui-piao',
    name: '退票',
    english: 'Dishonored Check / Bounced Check',
    alias: '跳票',
    definition:
      '支票因帳戶餘額不足、發票人帳戶被凍結或其他原因，遭銀行拒絕兌付的情況，俗稱「跳票」。發票人退票記錄過多，可能被列為拒絕往來戶。退票紀錄會記錄於票據信用系統，影響商業往來。',
    related: '/articles/zhi-piao-tiao-piao-zen-me-ban',
    relatedLabel: '支票跳票怎麼辦',
  },
  {
    id: 'ju-jue-wang-lai-hu',
    name: '拒絕往來戶',
    english: 'Blacklisted Account',
    alias: '拒往戶',
    definition:
      '因支票退票達一定次數或金額（依票據法規定），被銀行公會列為停止票據業務往來的企業或個人。拒往戶無法再開立新支票，對企業商業信用影響重大。列入拒往後須清償票款並申請解除。',
    related: null,
    relatedLabel: '',
  },
  {
    id: 'fa-piao-ren',
    name: '發票人',
    english: 'Drawer',
    alias: '',
    definition:
      '開立支票的人或企業，即支票的出票方。發票人在支票上簽名並指示銀行付款。在支票貼現評估中，發票人的信用狀況是重要的審核依據——發票人信用良好，票據品質較佳、費率也相對較低。',
    related: null,
    relatedLabel: '',
  },
  {
    id: 'chi-piao-ren',
    name: '持票人',
    english: 'Holder',
    alias: '票據持有人',
    definition:
      '持有支票的人或企業，即票據的受款方或受讓方。持票人向融資機構申請支票貼現或支票貸款時，即以持票人身份辦理。持票人對票據有合法的兌現或轉讓權利。',
    related: null,
    relatedLabel: '',
  },
  {
    id: 'piao-qi',
    name: '票期',
    english: 'Check Tenor',
    alias: '票據期間',
    definition:
      '從支票發票日到到期日的期間，通常以天數或月數表示。支票貼現一般接受票期 30～180 天的遠期支票，票期越長，貼現手續費相對越高。超過 180 天的長票期需個別評估。',
    related: null,
    relatedLabel: '',
  },
  {
    id: 'yue-fei-lv',
    name: '月費率',
    english: 'Monthly Rate',
    alias: '月利率、月息',
    definition:
      '支票貼現計算手續費的常見方式，以票面金額乘以月費率再乘以票期月數。例如：票面金額 100 萬元、票期 3 個月、月費率 1.5%，手續費 = 100萬 × 1.5% × 3 = 45,000 元。市場常見月費率約在 1.5%～3% 之間，依案件條件而定。',
    related: null,
    relatedLabel: '',
  },
  {
    id: 'ke-piao',
    name: '客票',
    english: "Customer's Check",
    alias: '客戶票',
    definition:
      '企業向客戶（買方）收取的、由客戶開立的支票。相對於「自票」（企業自己開立的支票），客票的信用取決於客戶（發票人）的信用狀況。支票貼現通常以客票為主，因為客票代表外部的商業交易應收款。',
    related: null,
    relatedLabel: '',
  },
  {
    id: 'zi-piao',
    name: '自票',
    english: "Own Check",
    alias: '自己開立的支票',
    definition:
      '企業自行開立的支票。自票在申請支票貼現時，審核標準與客票不同，通常需要更嚴格的評估，因為自票兌付責任在企業本身。',
    related: null,
    relatedLabel: '',
  },
]

export default function MingCiJieShiPage() {
  const definedTermSetJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    '@id': `${glossaryPageUrl}#termset`,
    name: '支票融資名詞解釋',
    description: '支票貼現、支票貸款相關金融術語完整詞彙表，幫助企業理解票據融資的基本概念',
    url: glossaryPageUrl,
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    hasDefinedTerm: terms.map((t) => ({
      '@type': 'DefinedTerm',
      '@id': `${glossaryPageUrl}#${t.id}`,
      name: t.name,
      alternateName: t.alias || undefined,
      description: t.definition,
      inDefinedTermSet: `${glossaryPageUrl}#termset`,
    })),
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '首頁', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: '名詞解釋', item: glossaryPageUrl },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSetJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* Hero */}
      <section style={{ backgroundColor: '#0D2B5E' }} className="text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <nav className="text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-white">首頁</Link>
            <span className="mx-2">/</span>
            <span className="text-white">名詞解釋</span>
          </nav>
          <h1 className="text-4xl font-bold mb-4">支票融資名詞解釋</h1>
          <p className="text-gray-300 text-lg">
            票貼、遠期支票、退票⋯⋯一次搞懂票據融資的必備詞彙
          </p>
        </div>
      </section>

      {/* 快速摘要 */}
      <section className="px-4 py-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div role="note" className="border-l-4 pl-5 py-5 rounded-r-xl bg-[#F0F4FF]" style={{ borderColor: '#0D2B5E' }}>
            <p className="text-xs font-bold text-[#0D2B5E] uppercase tracking-widest mb-2">關於本頁</p>
            <p className="text-gray-800 leading-relaxed">
              本頁整理支票貼現（票貼）、支票貸款相關的常見金融術語，包含遠期支票、即期支票、背書、退票、拒絕往來戶、發票人、持票人、票期、月費率、客票等詞彙。
              點擊右側連結可進一步了解各服務詳情或閱讀相關文章。
            </p>
          </div>
        </div>
      </section>

      {/* Glossary Terms */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* 字母索引（依注音順序） */}
          <div className="flex flex-wrap gap-2 mb-10">
            {terms.map((t) => (
              <a
                key={t.id}
                href={`#${t.id}`}
                className="px-3 py-1 text-sm rounded-full border border-gray-200 text-[#0D2B5E] hover:border-[#C9922A] hover:text-[#C9922A] transition-colors"
              >
                {t.name}
              </a>
            ))}
          </div>

          <div className="space-y-10">
            {terms.map((t) => (
              <article key={t.id} id={t.id} className="scroll-mt-20 border-b border-gray-100 pb-10">
                <div className="flex flex-wrap items-baseline gap-3 mb-3">
                  <h2 className="text-2xl font-bold text-[#0D2B5E]">{t.name}</h2>
                  <span className="text-sm text-gray-400">{t.english}</span>
                  {t.alias && (
                    <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-500">
                      又稱：{t.alias}
                    </span>
                  )}
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">{t.definition}</p>
                {t.related && (
                  <Link
                    href={t.related}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-[#0D2B5E] hover:text-[#C9922A] transition-colors"
                  >
                    {t.relatedLabel} →
                  </Link>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: '#0D2B5E' }} className="py-16 px-4 text-white text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">有融資需求？立即免費諮詢</h2>
          <p className="text-gray-300 mb-8">
            了解名詞定義後，歡迎來電或填寫表單，專業顧問將為您評估最合適的融資方案
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-block px-8 py-3 rounded font-bold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#C9922A' }}
            >
              填寫諮詢表單
            </Link>
            <Link
              href="/faq"
              className="inline-block px-8 py-3 rounded font-bold text-white border border-white/40 hover:bg-white/10 transition-colors"
            >
              查看常見問題
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
