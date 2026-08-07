import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_URL, SITE_NAME } from '@/lib/site'

export const metadata: Metadata = {
  title: '支票貼現 | 遠期支票快速換現金',
  description: '支票貼現服務，持有遠期支票無需等到期日，立即換取現金。費率透明、審核快速、當日可撥款。了解支票貼現條件、費率與申請流程。',
  alternates: { canonical: `${SITE_URL}/zhi-piao-tie-xian` },
}

const conditions = [
  '公司登記在案之企業或商號',
  '持有未到期之遠期支票（一般為30～180天）',
  '支票發票人具備一定信用條件',
  '票面金額達最低門檻（依實際情況評估）',
]

const features = [
  { icon: '📄', title: '文件簡便', desc: '基本公司文件加支票即可申請，不需繁複資料' },
  { icon: '⚡', title: '快速到帳', desc: '審核通過後最快當日撥款，緊急資金需求也能解決' },
  { icon: '💯', title: '費率透明', desc: '事前清楚說明手續費，無任何隱藏費用' },
  { icon: '🔐', title: '保密處理', desc: '嚴格保護客戶資料，交易完全保密' },
]

const documents = [
  {
    title: '公司設立登記文件（公司執照或商業登記證明）',
    why: '確認申請主體是合法登記的企業或商號，也是核對支票受款人與背書連續性的依據。',
  },
  {
    title: '負責人身分證正反面',
    why: '對保程序的必要文件，確認簽約人具代表權，保障雙方交易安全。',
  },
  {
    title: '欲貼現的支票正本',
    why: '需當面核驗票據真偽、記載是否齊全（日期、金額、簽章）、背書是否連續。影本僅供初步評估，撥款前一定要見正本。',
  },
  {
    title: '公司大小章',
    why: '簽署貼現合約與支票背書轉讓時使用。',
  },
  {
    title: '存摺封面（撥款帳戶）',
    why: '確認撥款帳戶為申請公司或負責人本人所有，避免款項流向第三人的糾紛。',
  },
]

const timeline = [
  {
    day: '第 1 天上午',
    title: '初步評估與報價',
    desc: '透過電話或 LINE 提供支票資訊（發票人、金額、票期），我們查詢發票人票信後回覆可承作與否及報價區間。這一步不用出門、完全免費。',
  },
  {
    day: '第 1 天下午',
    title: '當面核票與對保',
    desc: '攜帶文件與支票正本到辦公室（或約定到府），核驗票據、確認條件、簽署合約。全程約 30～60 分鐘。',
  },
  {
    day: '第 1～2 天',
    title: '撥款',
    desc: '合約完成後撥款至指定帳戶。上午完成對保者多可當日撥款；下午較晚完成者最遲隔一個工作天入帳。',
  },
  {
    day: '票期到期日',
    title: '提示兌現、交易結束',
    desc: '支票由我們提示兌現，兌現成功即結案。條件在簽約時已一次講清楚，到期不會再收取其他費用。',
  },
]

const canDo = [
  '公司或商號收受的國內客票（30～180 天票期）',
  '單張大額支票，或多張小額支票合併貼現',
  '外縣市發票人開立的支票（發票人信用正常即可）',
  '劃線支票、禁止背書轉讓支票（依票據記載個別評估）',
  '持票人公司自身信用有瑕疵，但客票發票人信用正常',
]

const cannotDo = [
  '發票人已有退票紀錄或列為拒絕往來戶的支票',
  '票據記載不齊全（未填日期、金額塗改未簽章確認）',
  '來源無法說明的支票（無交易憑證、非商業往來取得）',
  '個人開給個人、無商業交易背景的人情票',
  '已超過提示期限或即將到期數日的支票（直接提示即可，不需貼現）',
]

const compareRows = [
  { item: '審核時間', bank: '3～7 個工作天', pawn: '當日', us: '最快當日' },
  { item: '審核重點', bank: '申請公司財報、往來信用', pawn: '票面與質當價值', us: '發票人票信為主' },
  { item: '費率水準', bank: '年利率最低', pawn: '依當舖業法計息', us: '月費率 1.5%～3%' },
  { item: '文件要求', bank: '財報、401 報表等多項', pawn: '較簡便', us: '登記文件＋證件＋支票' },
  { item: '適合情境', bank: '不急用、信用條件好', pawn: '極短期小額', us: '一週內需資金的中小企業' },
]

const faqs = [
  {
    q: '支票貼現和銀行票貼有什麼差別？',
    a: '銀行票貼審核的是「申請公司」的財報與信用，門檻高、需 3～7 個工作天；民間支票貼現審核的是「發票人」的票信，門檻彈性、最快當日撥款。銀行利率較低，適合不急用且信用條件好的公司；民間票貼適合需要速度、或銀行額度已滿的中小企業。',
  },
  {
    q: '什麼票可以做支票貼現？',
    a: '一般商業客票（含即期及遠期支票）皆可評估，票期通常在30～180天內。劃線支票、禁止背書轉讓支票依票據記載個別評估。發票人有退票紀錄或拒絕往來的支票無法承作。',
  },
  {
    q: '支票貼現的費率怎麼計算？',
    a: '以月費率計算，常見區間 1.5%～3%。計算式：手續費 = 票面金額 × 月費率 × 票期月數。例如 100 萬、90 天（3 個月）的票，月費率 1.5% 時手續費為 4.5 萬，實拿 95.5 萬。實際費率依發票人信用、票期、金額評估。',
  },
  {
    q: '支票貼現需要哪些文件？',
    a: '五項：公司登記文件、負責人身分證、支票正本、公司大小章、撥款帳戶存摺封面。文件齊備當日即可完成對保與撥款。',
  },
  {
    q: '遠期支票幾個月都可以貼現嗎？',
    a: '一般接受30～180天的遠期支票，超過180天的長票期支票需個別評估。票期越長，貼現手續費總額相對較高（按月計費）。',
  },
  {
    q: '公司自己信用不好，還能貼現客票嗎？',
    a: '可以評估。支票貼現的核心是「發票人」的信用，不是持票人。你的公司即使有貸款遲繳或信用瑕疵，只要手上客票的發票人票信正常，仍然可以辦理。這也是票貼與一般信用貸款最大的差異。',
  },
  {
    q: '貼現後支票跳票了，誰承擔？',
    a: '依票據法，背書人對支票負擔保責任，若發票人到期跳票，我們會先行使票據追索權向發票人求償，持票人（背書人）依合約與票據法仍有償還義務。這是所有票貼交易的法定架構，簽約前我們會把跳票處理方式白紙黑字寫清楚。',
  },
  {
    q: '當天真的拿得到錢嗎？',
    a: '可以，前提是三件事在當天完成：發票人票信查詢無異常、文件與支票正本齊備、上午完成對保。建議前一天先透過 LINE 或電話提供支票資訊做初步評估，隔天上午對保，最快中午前撥款。',
  },
  {
    q: '高雄以外的公司可以辦嗎？',
    a: '可以。我們據點在高雄，服務範圍涵蓋台南、屏東，其他縣市企業可先電話評估再安排辦理方式。南部企業請參考高雄支票貼現在地服務說明。',
  },
]

export default function ZhiPiaoTieXianPage() {
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
            name: '如何申請支票貼現',
            description: '支票貼現申請完整流程，從初步諮詢到取得資金，最快當日完成',
            totalTime: 'P1D',
            estimatedCost: {
              '@type': 'MonetaryAmount',
              currency: 'TWD',
              description: '諮詢免費；手續費依票面金額與票期計算，月費率由評估結果決定',
            },
            step: [
              { '@type': 'HowToStep', position: 1, name: '聯繫諮詢', text: '電話或填寫線上表單，說明支票金額與票期，取得初步評估。' },
              { '@type': 'HowToStep', position: 2, name: '準備文件', text: '準備公司登記文件、負責人身分證件及欲貼現的支票。' },
              { '@type': 'HowToStep', position: 3, name: '審核評估', text: '專業人員審核支票及相關文件，提供正式報價與合約條件。' },
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
              { '@type': 'ListItem', position: 2, name: '支票貼現', item: `${SITE_URL}/zhi-piao-tie-xian` },
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
            '@id': `${SITE_URL}/zhi-piao-tie-xian#service`,
            name: '支票貼現',
            description: '持有遠期支票的企業，提前換取現金。費率透明、審核快速，最快當日撥款。',
            category: '票據融資',
            provider: { '@type': 'Organization', '@id': `${SITE_URL}/#organization`, name: SITE_NAME },
            areaServed: { '@type': 'Country', name: '台灣' },
            offers: {
              '@type': 'Offer',
              priceCurrency: 'TWD',
              description: '月費率 1.5%～3%，依票面金額、票期、發票人信用綜合評估，諮詢免費',
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
            <span className="text-white">支票貼現</span>
          </nav>
          <h1 className="text-4xl font-bold mb-4">支票貼現</h1>
          <p className="text-xl text-gray-200 mb-6">遠期支票不必等到期日，立即換現金</p>
          <p className="text-gray-300 leading-relaxed max-w-2xl">
            持有遠期支票的企業，無需等待票期到期，即可透過支票貼現服務提前取得現金，
            有效解決企業資金周轉問題，把握商業機會。
          </p>
        </div>
      </section>

      {/* 快速摘要（AEO：AI 答案引擎優先抽取） */}
      <section className="px-4 py-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div role="note" className="border-l-4 pl-5 py-5 rounded-r-xl bg-[#F0F4FF]" style={{ borderColor: '#0D2B5E' }}>
            <p className="text-xs font-bold text-[#0D2B5E] uppercase tracking-widest mb-2">快速摘要</p>
            <p className="text-gray-800 leading-relaxed">
              <strong>支票貼現</strong>（又稱票貼）是企業將未到期的遠期支票，以扣除手續費後的金額提前換取現金的融資方式。
              申請只需公司登記文件、負責人身分證及支票，審核通過後最快當日撥款。
              費率依票面金額、票期與發票人信用計算，常見月費率約 1.5%～3%，適合急需資金周轉的中小企業。
            </p>
          </div>
        </div>
      </section>

      {/* What is it */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold text-[#0D2B5E] mb-6">什麼是支票貼現？</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  <strong className="text-gray-800">支票貼現</strong>（又稱票貼）是一種企業短期融資方式：
                  持票人將尚未到期的遠期支票，以扣除一定手續費後的金額，提前換取現金。
                </p>
                <p>
                  舉例來說，若您持有一張三個月後才到期、面額100萬的支票，
                  透過支票貼現服務，可以不必等待三個月，立即取得約95～98萬的現金
                  （實際金額依手續費計算而定）。
                </p>
                <p>
                  這對於有急迫資金需求的企業而言，是快速、靈活的融資解決方案，
                  廣泛應用於製造業、貿易商、建設公司等各類型企業。
                  更完整的基礎說明可參考
                  <Link href="/articles/zhi-piao-tie-xian-shi-shen-me" className="text-[#0D2B5E] underline underline-offset-2 mx-1">支票貼現是什麼</Link>，
                  高雄、台南、屏東的企業另有
                  <Link href="/gaoxiong-zhi-piao-tie-xian" className="text-[#0D2B5E] underline underline-offset-2 mx-1">高雄在地服務</Link>。
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h3 className="font-bold text-[#0D2B5E] text-lg mb-6">支票貼現範例試算</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">支票票面金額</span>
                  <span className="font-bold">$1,000,000</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">票期</span>
                  <span className="font-bold">90 天</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">月費率（示範）</span>
                  <span className="font-bold">1.5%</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">手續費</span>
                  <span className="font-bold text-red-500">- $45,000</span>
                </div>
                <div className="flex justify-between py-3 bg-[#F0F4FF] rounded px-3">
                  <span className="font-bold text-[#0D2B5E]">實際取得現金</span>
                  <span className="font-bold text-[#0D2B5E] text-lg">$955,000</span>
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
              不確定是否符合條件？歡迎來電免費諮詢，我們提供個別評估服務。
              申請前也可先閱讀
              <Link href="/articles/di-yi-ci-piao-tie" className="text-[#0D2B5E] underline underline-offset-2 mx-1">第一次辦票貼須知</Link>。
            </p>
          </div>
        </div>
      </section>

      {/* 必備文件 */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-[#0D2B5E] mb-3 text-center">必備文件清單（以及為什麼需要）</h2>
          <p className="text-gray-500 text-center mb-8 max-w-2xl mx-auto">
            每一份文件都有它的用途——正派的票貼交易不會要求你提供與交易無關的資料，
            也不會少了這些程序就撥款。
          </p>
          <div className="space-y-3">
            {documents.map((d, i) => (
              <div key={d.title} className="bg-white rounded-xl p-5 shadow-sm flex gap-4 items-start">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shrink-0 text-sm"
                  style={{ backgroundColor: '#C9922A' }}
                >
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">{d.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{d.why}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-6 text-center">
            詳細的文件準備細節見
            <Link href="/articles/zhi-piao-tie-xian-shen-qing-wen-jian" className="text-[#0D2B5E] underline underline-offset-2 mx-1">支票貼現申請文件完整說明</Link>。
          </p>
        </div>
      </section>

      {/* 可辦與不可辦 */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-[#0D2B5E] mb-3 text-center">哪些票可以辦、哪些我們不承作</h2>
          <p className="text-gray-500 text-center mb-10 max-w-2xl mx-auto">
            把「不承作」的情況先講清楚，是我們與來路不明業者最大的差別——
            什麼票都收的，通常才是你該提防的。
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 rounded-xl p-6 border border-green-100">
              <h3 className="font-bold text-green-800 mb-4">✅ 可以評估承作</h3>
              <ul className="space-y-3">
                {canDo.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-green-500 font-bold mt-0.5 shrink-0">✓</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-50 rounded-xl p-6 border border-red-100">
              <h3 className="font-bold text-red-800 mb-4">✕ 原則上不承作</h3>
              <ul className="space-y-3">
                {cannotDo.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-red-400 font-bold mt-0.5 shrink-0">✕</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-8 text-center">
            發票人票信怎麼查、退票紀錄的影響，見
            <Link href="/articles/piao-xin-cha-xun" className="text-[#0D2B5E] underline underline-offset-2 mx-1">票信查詢教學</Link>與
            <Link href="/articles/tui-piao-ji-lu" className="text-[#0D2B5E] underline underline-offset-2 mx-1">退票紀錄說明</Link>。
          </p>
        </div>
      </section>

      {/* 三方比較 */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-[#0D2B5E] mb-10 text-center">銀行票貼・當鋪收票・本公司比較</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-sm text-sm">
              <thead>
                <tr style={{ backgroundColor: '#0D2B5E' }} className="text-white">
                  <th className="p-4 text-left font-bold">比較項目</th>
                  <th className="p-4 text-left font-bold">銀行票貼</th>
                  <th className="p-4 text-left font-bold">當鋪收票</th>
                  <th className="p-4 text-left font-bold" style={{ backgroundColor: '#C9922A' }}>本公司</th>
                </tr>
              </thead>
              <tbody>
                {compareRows.map((row, i) => (
                  <tr key={row.item} className={i % 2 === 1 ? 'bg-gray-50' : ''}>
                    <td className="p-4 font-semibold text-[#0D2B5E]">{row.item}</td>
                    <td className="p-4 text-gray-600">{row.bank}</td>
                    <td className="p-4 text-gray-600">{row.pawn}</td>
                    <td className="p-4 text-gray-800 font-medium bg-[#FFF9EE]">{row.us}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-500 mt-6 text-center">
            延伸比較：
            <Link href="/articles/zhi-piao-tie-xian-vs-yin-hang-piao-tie" className="text-[#0D2B5E] underline underline-offset-2 mx-1">民間 vs 銀行票貼</Link>・
            <Link href="/articles/dang-pu-vs-zhi-piao-tie-xian" className="text-[#0D2B5E] underline underline-offset-2 mx-1">當鋪 vs 專業票貼</Link>
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
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

      {/* 時程表 */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-[#0D2B5E] mb-3 text-center">從諮詢到撥款的實際時程</h2>
          <p className="text-gray-500 text-center mb-10 max-w-2xl mx-auto">
            「最快當日撥款」不是話術，而是流程設計的結果。以下是文件齊備情況下的標準時程：
          </p>
          <div className="space-y-4">
            {timeline.map((s) => (
              <div key={s.day} className="flex gap-4 items-start p-6 bg-white rounded-xl shadow-sm">
                <div
                  className="px-3 py-2 rounded-lg text-white font-bold shrink-0 text-xs text-center min-w-[90px]"
                  style={{ backgroundColor: '#0D2B5E' }}
                >
                  {s.day}
                </div>
                <div>
                  <h3 className="font-bold text-[#0D2B5E] mb-1">{s.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-6 text-center">
            想先估算成本？用
            <Link href="/fei-lv-ji-suan" className="text-[#0D2B5E] underline underline-offset-2 mx-1">費率試算工具</Link>
            輸入票面金額與票期即可試算，或參考
            <Link href="/articles/zhi-piao-tie-xian-li-lv" className="text-[#0D2B5E] underline underline-offset-2 mx-1">費率計算完整說明</Link>。
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-[#0D2B5E] mb-8 text-center">支票貼現常見問題</h2>
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
          <h2 className="text-2xl font-bold mb-4">立即諮詢支票貼現服務</h2>
          <p className="text-gray-300 mb-8">免費評估，專業顧問為您說明最適合的方案</p>
          <Link
            href="/contact"
            className="inline-block px-10 py-4 rounded font-bold text-white text-lg transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#C9922A' }}
          >
            免費諮詢
          </Link>
        </div>
      </section>
    </>
  )
}
