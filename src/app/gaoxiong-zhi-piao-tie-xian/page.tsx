import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_URL, SITE_NAME } from '@/lib/site'

export const metadata: Metadata = {
  title: '高雄支票貼現 | 在地辦理・當日撥款',
  description:
    '高雄支票貼現在地服務。辦公室位於新興區，服務高雄全區與台南、屏東企業。製造、營造、漁業客票皆可評估，當面核票、最快當日撥款。了解高雄辦票貼的流程、文件與費率。',
  keywords: ['高雄支票貼現', '高雄票貼', '高雄支票借款', '高雄客票貼現', '南部支票貼現'],
  alternates: { canonical: `${SITE_URL}/gaoxiong-zhi-piao-tie-xian` },
}

const districts = [
  '新興區', '前金區', '苓雅區', '鹽埕區', '三民區', '前鎮區', '鼓山區', '左營區',
  '楠梓區', '小港區', '鳳山區', '三多商圈一帶', '岡山區', '路竹區', '仁武區', '大寮區',
  '林園區', '大社區', '燕巢區', '橋頭區',
]

const industries = [
  {
    title: '螺絲扣件・金屬加工',
    area: '岡山、路竹、燕巢一帶',
    desc: '岡山螺絲聚落的外銷訂單多以 60～120 天期客票支付。接單旺季備料資金缺口大，客票貼現可在出貨後立即回收資金，不必等票期。',
  },
  {
    title: '鋼鐵・重工',
    area: '小港臨海工業區、前鎮',
    desc: '鋼材買賣的票期普遍偏長（90～180 天），單張票面金額也高。我們可評估大額單張或多張組合貼現，依發票人信用個別報價。',
  },
  {
    title: '石化中下游',
    area: '林園、大社、仁武',
    desc: '石化原料採購金額大、帳期固定，下游加工廠常面臨「原料要現金、出貨收遠期票」的落差，票貼是常見的周轉工具。',
  },
  {
    title: '營造・工程行',
    area: '高雄全區',
    desc: '工程款分期請款、業主開遠期票是營造業常態。工程票的評估重點在業主（發票人）信用與工程進度，我們熟悉營造業票據特性。',
  },
  {
    title: '遠洋漁業・水產加工',
    area: '前鎮漁港周邊',
    desc: '漁獲交易與加工出貨的收款週期長，出港前的整補資金需求集中。魚行、水產貿易商收到的客票可提前變現支應。',
  },
  {
    title: '批發零售・餐飲食品',
    area: '三民、鳳山、苓雅',
    desc: '食品原物料商、餐飲供應鏈收月結客票的比例高。小面額、多張數的支票也可以合併評估，不限單張大票。',
  },
]

const faqs = [
  {
    q: '在高雄辦支票貼現要本人到場嗎？',
    a: '首次辦理建議由負責人本人攜帶證件與支票到場核票、對保，這是保障雙方的必要程序，我們的辦公室位於高雄市新興區民權一路251號21樓。行動不便或時間無法配合者，可預約專員到府服務（高雄市區為主，台南、屏東可另約）。後續往來的老客戶，流程可以簡化。',
  },
  {
    q: '高雄的公司收到北部客戶開的支票，可以在高雄貼現嗎？',
    a: '可以。支票貼現看的是「發票人的信用」，與發票人所在縣市無關。台北、台中客戶開的支票，一樣在高雄完成核票與撥款，不需要跑回票據交換地區辦理。實務上南部企業收北部客票的情況非常普遍。',
  },
  {
    q: '高雄票貼的費率和台北一樣嗎？',
    a: '民間票貼費率主要由票期長短、票面金額與發票人信用決定，南北差異不大，常見月費率約 1.5%～3%。與其比較地區，更該比較的是業者是否事前把費率、手續費講清楚。我們提供書面報價，無隱藏費用。',
  },
  {
    q: '岡山、路竹的工廠比較遠，有需要每次都跑市區嗎？',
    a: '不用。首次對保完成後，後續案件可透過 LINE 官方帳號先傳支票照片初步評估，確認條件後再約時間完成交票程序，也可預約專員北高雄到府收件，減少往返時間。',
  },
  {
    q: '營造工程的業主票可以貼現嗎？',
    a: '可以評估。工程票的關鍵在發票人（業主或統包商）的票信與付款紀錄，我們會查詢票據信用資料再報價。已有退票紀錄或拒絕往來的發票人所開支票，原則上無法承作，會在評估階段就明確告知。',
  },
  {
    q: '高雄有很多當鋪也收票，找你們和找當鋪差在哪？',
    a: '當鋪收票通常以「質當」邏輯計價，利率上限雖受當鋪業法規範，但多數以短天期週轉為主。我們專營票據融資，以發票人信用評估、按票期計費，費率結構更接近銀行票貼，且流程文件透明。詳細比較可參考網站上的當鋪與票貼比較文章。',
  },
  {
    q: '台南、屏東的公司可以辦嗎？',
    a: '可以。我們以高雄為據點，服務範圍涵蓋台南與屏東。台南科技工業區、屏東農產加工業者的客票都可以評估，可先透過電話或 LINE 初步詢問，再安排到府或到辦公室辦理。',
  },
  {
    q: '最快多久可以拿到錢？',
    a: '文件與支票齊備的情況下，審核最快當日完成、當日撥款。影響速度的主要因素是發票人票信查詢與對保時間，建議先透過電話或 LINE 提供支票基本資訊（發票人、金額、票期），可以大幅縮短現場流程。',
  },
]

export default function GaoxiongZhiPiaoTieXianPage() {
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
              { '@type': 'ListItem', position: 3, name: '高雄支票貼現', item: `${SITE_URL}/gaoxiong-zhi-piao-tie-xian` },
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
            '@id': `${SITE_URL}/gaoxiong-zhi-piao-tie-xian#service`,
            name: '高雄支票貼現',
            description: '高雄在地支票貼現服務，服務高雄全區與台南、屏東企業，當面核票、最快當日撥款。',
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
            <span className="text-white">高雄支票貼現</span>
          </nav>
          <h1 className="text-4xl font-bold mb-4">高雄支票貼現</h1>
          <p className="text-xl text-gray-200 mb-6">在地辦公室當面核票，高雄、台南、屏東企業當日撥款</p>
          <p className="text-gray-300 leading-relaxed max-w-2xl">
            我們的辦公室就在高雄市新興區。南部企業辦支票貼現不必透過電話遠端議價、
            不必把支票寄到外縣市——當面核票、當面對保、條件講清楚再簽約，
            這是在地業者能給你的基本保障。
          </p>
        </div>
      </section>

      {/* 快速摘要（AEO） */}
      <section className="px-4 py-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div role="note" className="border-l-4 pl-5 py-5 rounded-r-xl bg-[#F0F4FF]" style={{ borderColor: '#0D2B5E' }}>
            <p className="text-xs font-bold text-[#0D2B5E] uppercase tracking-widest mb-2">快速摘要</p>
            <p className="text-gray-800 leading-relaxed">
              <strong>高雄支票貼現</strong>由黃璽理財管理顧問提供，辦公室位於高雄市新興區民權一路251號21樓，
              服務高雄全區及台南、屏東。企業持有的未到期客票（30～180 天）可提前變現，
              常見月費率約 1.5%～3%，首次辦理採當面核票與對保，文件齊備最快當日撥款。
              製造、營造、漁業、批發等各產業客票皆可評估。
            </p>
          </div>
        </div>
      </section>

      {/* 為什麼在地辦理 */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-[#0D2B5E] mb-6">為什麼高雄企業要找在地的票貼業者？</h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              <Link href="/zhi-piao-tie-xian" className="text-[#0D2B5E] underline underline-offset-2 font-medium">支票貼現</Link>
              是「一手交票、一手撥款」的交易，<strong className="text-gray-800">見面核票是整個流程中最關鍵的環節</strong>——
              支票是否為真、背書是否連續、發票人票信如何，都需要當面確認。
              遠端寄票給外縣市業者，等於把票據的實體控制權先交出去，風險全在持票人身上。
            </p>
            <p>
              在地辦理的另一個實際好處是速度：高雄市區到我們新興區辦公室核票、對保、撥款，
              一個上午可以走完的流程，跨縣市寄送至少多耗一到兩個工作天，
              對急著付貨款、發薪水的企業來說，這一兩天往往就是關鍵。
            </p>
            <p>
              我們也熟悉南部票據的實務生態：哪些產業的票期偏長、哪些發票人族群需要特別留意
              <Link href="/articles/piao-xin-cha-xun" className="text-[#0D2B5E] underline underline-offset-2 font-medium">票信查詢</Link>結果、
              工程票和貿易票的評估重點差在哪——這些判斷經驗直接影響報價的合理性與撥款速度。
            </p>
          </div>
        </div>
      </section>

      {/* 高雄產業票源 */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-[#0D2B5E] mb-3 text-center">高雄各產業的支票貼現需求</h2>
          <p className="text-gray-500 text-center mb-10 max-w-2xl mx-auto">
            高雄是製造業與重工業重鎮，客票支付文化根深蒂固。以下是我們常見的在地票源類型：
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((ind) => (
              <div key={ind.title} className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-bold text-[#0D2B5E] mb-1">{ind.title}</h3>
                <p className="text-xs text-[#C9922A] font-semibold mb-3">{ind.area}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{ind.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-8 text-center max-w-2xl mx-auto">
            不在上述產業？只要持有未到期的公司客票都可以評估，歡迎參考
            <Link href="/articles/ke-piao-tie-xian" className="text-[#0D2B5E] underline underline-offset-2 mx-1">客票貼現說明</Link>
            或直接來電詢問。
          </p>
        </div>
      </section>

      {/* 情境示例 */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-[#0D2B5E] mb-3 text-center">高雄企業常見的周轉情境</h2>
          <p className="text-xs text-gray-400 text-center mb-8">※ 以下為示意情境與試算，非特定客戶案例；實際條件依審核結果為準</p>
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-[#0D2B5E] mb-2">情境一：岡山扣件廠接到大單，備料資金不足</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                外銷訂單出貨後收到 90 天期客票 120 萬元，但下一批線材採購需要現金。
                以月費率 1.5% 試算，貼現手續費約 5.4 萬元，可先取得約 114.6 萬元投入備料，
                票到期兌現後結清。比放棄訂單或向地下錢莊短借，成本清楚可控。
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-[#0D2B5E] mb-2">情境二：鳳山工程行月底要發薪，工程款票還有 60 天</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                業主開立的 60 天期工程款支票 80 萬元，經查發票人票信正常。
                以月費率 2% 試算，手續費約 3.2 萬元，撥款約 76.8 萬元，
                當週完成發薪與材料款支付，避免延誤工進與勞資糾紛。
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-[#0D2B5E] mb-2">情境三：前鎮水產貿易商出港前整補，多張小票合併貼現</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                手上有 5 張魚行客票、票期 30～75 天不等、合計 95 萬元。
                多張支票可合併評估、分票計費，一次取得整補所需資金，
                不必逐張處理。多張票貼的作法可參考
                <Link href="/articles/duo-zhang-zhi-piao-tie-xian" className="text-[#0D2B5E] underline underline-offset-2 mx-1">多張支票同時貼現</Link>。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 服務地區 */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-[#0D2B5E] mb-6 text-center">服務地區</h2>
          <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
            高雄全市各行政區皆可服務，以下地區的企業與商號往來最為頻繁：
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {districts.map((d) => (
              <span key={d} className="px-4 py-2 bg-gray-50 rounded-full text-sm text-gray-600 border border-gray-100">
                {d}
              </span>
            ))}
          </div>
          <p className="text-gray-600 text-center text-sm">
            台南市（含台南科技工業區、永康、仁德）與屏東縣（屏東市、內埔、萬丹）企業亦可辦理，
            歡迎另洽<Link href="/gaoxiong-piao-tie" className="text-[#0D2B5E] underline underline-offset-2 mx-1">高雄票貼服務說明</Link>。
          </p>
        </div>
      </section>

      {/* 面談方式 */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-[#0D2B5E] mb-8 text-center">怎麼找到我們・怎麼辦理</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl mb-4">🏢</div>
              <h3 className="font-bold text-[#0D2B5E] mb-2">到辦公室辦理</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                高雄市新興區民權一路251號21樓。位於市中心商辦大樓，
                周邊有多處收費停車場，搭乘大眾運輸也方便到達。
                建議先來電預約，減少等候時間。
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl mb-4">🚗</div>
              <h3 className="font-bold text-[#0D2B5E] mb-2">預約到府服務</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                高雄市區可預約專員到府核票、收件；北高雄（岡山、路竹）、
                台南、屏東地區可另約時間。適合工廠走不開的負責人。
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl mb-4">💬</div>
              <h3 className="font-bold text-[#0D2B5E] mb-2">LINE 先行評估</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                加入 LINE 官方帳號，先傳支票基本資訊（發票人、金額、票期）
                做初步評估與報價，確認條件再見面完成程序，最省時間。
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-8 text-center">
            辦理流程與所需文件與一般支票貼現相同，詳見
            <Link href="/zhi-piao-tie-xian" className="text-[#0D2B5E] underline underline-offset-2 mx-1">支票貼現服務說明</Link>與
            <Link href="/articles/zhi-piao-tie-xian-shen-qing-wen-jian" className="text-[#0D2B5E] underline underline-offset-2 mx-1">申請文件清單</Link>。
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-[#0D2B5E] mb-8 text-center">高雄支票貼現常見問題</h2>
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
            更多票據知識：
            <Link href="/articles/zhi-piao-tie-xian-li-lv" className="text-[#0D2B5E] underline underline-offset-2 mx-1">費率怎麼算</Link>・
            <Link href="/articles/dang-pu-vs-zhi-piao-tie-xian" className="text-[#0D2B5E] underline underline-offset-2 mx-1">當鋪 vs 票貼</Link>・
            <Link href="/articles/he-fa-piao-tie-ye-zhe" className="text-[#0D2B5E] underline underline-offset-2 mx-1">如何辨識合法業者</Link>
          </p>
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: '#0D2B5E' }} className="py-16 px-4 text-white text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">高雄在地諮詢，當面把條件講清楚</h2>
          <p className="text-gray-300 mb-8">電話、LINE 或親臨辦公室，免費評估您手上的支票</p>
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
