import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_URL, SITE_NAME } from '@/lib/site'

export const metadata: Metadata = {
  title: '高雄票貼 | 銀行、當鋪、民間業者怎麼選',
  description:
    '高雄票貼完整指南：銀行票貼、當鋪收票、民間票貼業者三種管道的差異比較、費率行情與挑選原則。黃璽理財位於高雄新興區，在地辦理、當面核票，服務高雄、台南、屏東中小企業。',
  keywords: ['高雄票貼', '高雄票貼推薦', '高雄支票借錢', '高雄民間票貼', '票貼高雄'],
  alternates: { canonical: `${SITE_URL}/gaoxiong-piao-tie` },
}

const compareRows = [
  { item: '審核速度', bank: '3～7 個工作天', pawn: '快，多可當日', us: '最快當日核撥' },
  { item: '審核重點', bank: '申請企業的財報與信用', pawn: '以質當品邏輯看票', us: '發票人票信為主，持票人條件為輔' },
  { item: '費率結構', bank: '年利率最低，但門檻高', pawn: '依當舖業法計息，多為短期週轉', us: '月費率約 1.5%～3%，按票期計算' },
  { item: '適合對象', bank: '財報健全、往來紀錄佳的公司', pawn: '極短期、小額急用', us: '中小企業、行號，重視速度與透明' },
  { item: '所需文件', bank: '財報、401、往來明細等', pawn: '相對簡單', us: '公司登記文件＋負責人證件＋支票' },
  { item: '額度彈性', bank: '受授信額度限制', pawn: '單店資金規模有限', us: '單張大票、多張小票皆可評估' },
]

const faqs = [
  {
    q: '「票貼」和「支票貼現」是同一件事嗎？',
    a: '是的。「票貼」是「支票貼現」的通俗簡稱，指持票人把未到期的遠期支票，以扣除手續費後的金額提前換成現金。南部生意人習慣講「軋票」「調票」，指的多半也是同一類需求。完整說明可參考支票貼現是什麼一文。',
  },
  {
    q: '高雄票貼行情大概多少？',
    a: '民間票貼常見月費率約 1.5%～3%，實際數字由三個因素決定：發票人信用（最重要）、票期長短、票面金額。銀行票貼年利率較低但審核門檻高、速度慢。若有業者報出遠低於行情的數字，反而要提高警覺，可能有隱藏費用或其他問題。',
  },
  {
    q: '在高雄怎麼判斷票貼業者合不合法？',
    a: '三個基本檢查：一、有公司登記、有實體辦公室，而不是只有一支電話；二、費率、手續費在簽約前白紙黑字講清楚；三、不要求你先付「開辦費」「保證金」才撥款。我們的辦公室位於高雄市新興區民權一路251號21樓，歡迎當面洽談。詳細辨識方法見合法票貼業者怎麼找。',
  },
  {
    q: '個人收到的支票也可以在高雄辦票貼嗎？',
    a: '可以評估。雖然票貼以公司客票為大宗，個人持有的公司票（例如接案收到的貨款票）也可以辦理，重點同樣是發票人的票信狀況。個人支票兌現的細節可參考個人支票兌現說明。',
  },
  {
    q: '票期還有半年的票，高雄有人收嗎？',
    a: '一般承作 30～180 天票期，180 天內的票我們都可以評估。票期越長、手續費總額越高（按月計費），建議把長票期的資金成本算清楚再決定貼現金額。快到期的支票則建議直接提示兌現即可，不需要貼現。',
  },
  {
    q: '公司在台南或屏東，可以找高雄的業者嗎？',
    a: '可以。高雄是南台灣票據融資的主要據點，台南、屏東的企業常態性到高雄辦理。我們也提供台南、屏東地區的預約到府服務，初步評估可先透過電話或 LINE 完成，不必專程跑一趟。',
  },
  {
    q: '跳票或拒絕往來紀錄會影響辦票貼嗎？',
    a: '要分角色看：如果是「發票人」有退票或拒往紀錄，該張支票原則上無法承作；如果是「持票人」（你的公司）自己有信用瑕疵，仍可以貼現手上信用正常的客票——因為票貼評估的核心是發票人。相關規則見退票紀錄的影響與拒絕往來戶自救。',
  },
]

export default function GaoxiongPiaoTiePage() {
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
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: '首頁', item: SITE_URL },
              { '@type': 'ListItem', position: 2, name: '支票貼現', item: `${SITE_URL}/zhi-piao-tie-xian` },
              { '@type': 'ListItem', position: 3, name: '高雄票貼', item: `${SITE_URL}/gaoxiong-piao-tie` },
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
            '@id': `${SITE_URL}/gaoxiong-piao-tie#service`,
            name: '高雄票貼',
            description: '高雄在地票貼服務與管道比較指南。銀行、當鋪、民間業者差異、行情與挑選原則。',
            category: '票據融資',
            provider: { '@id': `${SITE_URL}/#organization`, name: SITE_NAME },
            areaServed: [
              { '@type': 'City', name: '高雄市' },
              { '@type': 'City', name: '台南市' },
              { '@type': 'AdministrativeArea', name: '屏東縣' },
            ],
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
            <Link href="/zhi-piao-tie-xian" className="hover:text-white">支票貼現</Link>
            <span className="mx-2">/</span>
            <span className="text-white">高雄票貼</span>
          </nav>
          <h1 className="text-4xl font-bold mb-4">高雄票貼</h1>
          <p className="text-xl text-gray-200 mb-6">銀行、當鋪、民間業者，高雄辦票貼該怎麼選？</p>
          <p className="text-gray-300 leading-relaxed max-w-2xl">
            手上有客票、需要現金周轉的高雄企業主，通常有三條路：銀行票貼、當鋪收票、民間票貼業者。
            這一頁把三種管道的差異、行情與挑選原則講清楚，幫你在做決定前把功課做完。
          </p>
        </div>
      </section>

      {/* 快速摘要（AEO） */}
      <section className="px-4 py-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div role="note" className="border-l-4 pl-5 py-5 rounded-r-xl bg-[#F0F4FF]" style={{ borderColor: '#0D2B5E' }}>
            <p className="text-xs font-bold text-[#0D2B5E] uppercase tracking-widest mb-2">快速摘要</p>
            <p className="text-gray-800 leading-relaxed">
              <strong>高雄票貼</strong>有三種主要管道：銀行票貼利率最低但審核嚴格、需 3～7 個工作天；
              當鋪收票快但以短期質當邏輯計價；民間票貼業者以發票人信用評估、按票期計費，
              常見月費率 1.5%～3%，最快當日撥款。挑選重點是「有實體辦公室、費率事前講清楚、不預收費用」。
              黃璽理財管理顧問位於高雄市新興區，服務高雄、台南、屏東企業。
            </p>
          </div>
        </div>
      </section>

      {/* 三管道比較 */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-[#0D2B5E] mb-3 text-center">高雄辦票貼的三種管道比較</h2>
          <p className="text-gray-500 text-center mb-10 max-w-2xl mx-auto">
            沒有哪一種管道絕對最好，只有適不適合你現在的狀況。
          </p>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-sm text-sm">
              <thead>
                <tr style={{ backgroundColor: '#0D2B5E' }} className="text-white">
                  <th className="p-4 text-left font-bold">比較項目</th>
                  <th className="p-4 text-left font-bold">銀行票貼</th>
                  <th className="p-4 text-left font-bold">當鋪收票</th>
                  <th className="p-4 text-left font-bold" style={{ backgroundColor: '#C9922A' }}>民間票貼（本公司）</th>
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
            深入比較：
            <Link href="/articles/zhi-piao-tie-xian-vs-yin-hang-piao-tie" className="text-[#0D2B5E] underline underline-offset-2 mx-1">民間 vs 銀行票貼</Link>・
            <Link href="/articles/dang-pu-vs-zhi-piao-tie-xian" className="text-[#0D2B5E] underline underline-offset-2 mx-1">當鋪 vs 專業票貼</Link>
          </p>
        </div>
      </section>

      {/* 什麼情況適合哪條路 */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-[#0D2B5E] mb-8">什麼情況該走哪條路？誠實建議</h2>
          <div className="space-y-6 text-gray-600 leading-relaxed">
            <div>
              <h3 className="font-bold text-gray-800 mb-2">✅ 建議先問銀行的情況</h3>
              <p>
                公司成立多年、財報健全、與銀行往來紀錄良好，而且資金需求「不急」——
                票期還很長、提前一個月規劃就來得及，那銀行票貼的利率成本最低，值得等它的審核流程。
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-2">✅ 適合找民間票貼的情況</h3>
              <p>
                資金需求在一週內、銀行額度已滿或審核過不了、公司規模還小沒有漂亮財報，
                但手上的客票發票人信用正常——這是民間票貼最典型的服務對象。
                成本高於銀行、遠低於違約或錯失訂單的代價。
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-2">⚠️ 我們會直接勸退的情況</h3>
              <p>
                發票人已有退票或拒往紀錄的票（承作風險極高，正派業者都不會收）、
                來路不明的票、以及「貼現是為了以債養債」的情況——
                這種時候貼現只會讓資金缺口更大，我們會誠實說不適合，
                並建議先了解<Link href="/articles/zhi-piao-tie-xian-feng-xian" className="text-[#0D2B5E] underline underline-offset-2 mx-1">票貼的風險</Link>再做決定。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 在地優勢 */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-[#0D2B5E] mb-6">在高雄，我們怎麼做票貼？</h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              我們的辦公室在<strong className="text-gray-800">高雄市新興區民權一路251號21樓</strong>，
              市中心商辦大樓，不是路邊店面、也不是只有一支手機號碼的「電話業者」。
              首次辦理一律當面核票、對保，費率與手續費在簽約前書面報價。
            </p>
            <p>
              服務範圍以高雄為核心，涵蓋台南與屏東。北高雄的岡山、路竹工業區，
              南邊的小港、林園，以及台南科工區、屏東農產加工帶的企業，
              都可以透過 LINE 先做初步評估，再約到府或到辦公室完成程序。
              高雄在地產業的票源特性，我們整理在
              <Link href="/gaoxiong-zhi-piao-tie-xian" className="text-[#0D2B5E] underline underline-offset-2 mx-1">高雄支票貼現</Link>專頁。
            </p>
            <p>
              如果你想先自己算算看成本，可以用
              <Link href="/fei-lv-ji-suan" className="text-[#0D2B5E] underline underline-offset-2 mx-1">費率試算工具</Link>
              輸入票面金額與票期試算，或參考
              <Link href="/articles/piao-tie-li-lv-hang-qing" className="text-[#0D2B5E] underline underline-offset-2 mx-1">票貼利率行情</Link>。
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-[#0D2B5E] mb-8 text-center">高雄票貼常見問題</h2>
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
          <p className="text-sm text-gray-500 mt-8 text-center">
            延伸閱讀：
            <Link href="/articles/zhi-piao-tie-xian-shi-shen-me" className="text-[#0D2B5E] underline underline-offset-2 mx-1">支票貼現是什麼</Link>・
            <Link href="/articles/min-jian-piao-tie" className="text-[#0D2B5E] underline underline-offset-2 mx-1">民間票貼安全嗎</Link>・
            <Link href="/articles/ju-jue-wang-lai-hu" className="text-[#0D2B5E] underline underline-offset-2 mx-1">拒絕往來戶自救</Link>
          </p>
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: '#0D2B5E' }} className="py-16 px-4 text-white text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">高雄票貼免費諮詢</h2>
          <p className="text-gray-300 mb-8">當面核票、書面報價，不適合我們會直接說</p>
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
