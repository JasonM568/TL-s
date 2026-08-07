'use client'

import Link from 'next/link'
import { useState } from 'react'

function formatTWD(n: number): string {
  return new Intl.NumberFormat('zh-TW').format(Math.round(n))
}

export default function FeiLvJiSuanPage() {
  const [amount, setAmount] = useState('')
  const [days, setDays] = useState('')
  const [monthlyRate, setMonthlyRate] = useState('1.5')

  const amountNum = parseFloat(amount.replace(/,/g, '')) || 0
  const daysNum = parseInt(days) || 0
  const rateNum = parseFloat(monthlyRate) || 0

  const months = daysNum / 30
  const fee = amountNum * (rateNum / 100) * months
  const received = amountNum - fee
  const hasResult = amountNum > 0 && daysNum > 0 && rateNum > 0

  return (
    <>
      {/* Hero */}
      <section style={{ backgroundColor: '#0D2B5E' }} className="text-white py-14 px-4">
        <div className="max-w-3xl mx-auto">
          <nav className="text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-white">首頁</Link>
            <span className="mx-2">/</span>
            <span className="text-white">支票貼現費率試算</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold leading-snug">支票貼現費率試算</h1>
          <p className="text-gray-300 mt-4 text-sm">
            輸入票面金額、票期天數與月費率，即時計算手續費與實際到手金額
          </p>
        </div>
      </section>

      {/* Quick summary */}
      <section className="px-4 py-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div role="note" className="border-l-4 pl-5 py-4 rounded-r-xl bg-[#F0F4FF]" style={{ borderColor: '#0D2B5E' }}>
            <p className="text-xs font-bold text-[#0D2B5E] uppercase tracking-widest mb-1">關於本工具</p>
            <p className="text-gray-800 leading-relaxed text-sm">
              支票貼現手續費 ＝ 票面金額 × 月費率 × 票期月數。月費率因案件條件而異，市場常見約 1%～3%。本試算結果僅供參考，實際費率依個別評估為準。
            </p>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section className="py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
            <h2 className="text-xl font-bold text-[#0D2B5E] mb-6">費用試算</h2>

            <div className="space-y-5">
              {/* 票面金額 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  票面金額（新台幣）
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">NT$</span>
                  <input
                    type="number"
                    min="0"
                    step="10000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="例如：1000000"
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-[#0D2B5E] focus:ring-1 focus:ring-[#0D2B5E]"
                  />
                </div>
              </div>

              {/* 票期 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  票期（天數）
                </label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  placeholder="例如：90（3 個月）"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-[#0D2B5E] focus:ring-1 focus:ring-[#0D2B5E]"
                />
                <p className="text-xs text-gray-400 mt-1">常見票期：30 天（1 月）、60 天（2 月）、90 天（3 月）、180 天（6 月）</p>
              </div>

              {/* 月費率 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  月費率（%）
                </label>
                <div className="flex gap-2 mb-2">
                  {['1.0', '1.5', '2.0', '2.5', '3.0'].map((r) => (
                    <button
                      key={r}
                      onClick={() => setMonthlyRate(r)}
                      className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                        monthlyRate === r
                          ? 'text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      style={monthlyRate === r ? { backgroundColor: '#0D2B5E' } : {}}
                    >
                      {r}%
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min="0.1"
                  max="5"
                  step="0.1"
                  value={monthlyRate}
                  onChange={(e) => setMonthlyRate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-[#0D2B5E] focus:ring-1 focus:ring-[#0D2B5E]"
                />
              </div>
            </div>

            {/* Result */}
            {hasResult && (
              <div className="mt-8 rounded-xl p-6" style={{ backgroundColor: '#F0F4FF' }}>
                <h3 className="text-sm font-bold text-[#0D2B5E] uppercase tracking-wider mb-4">試算結果</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">票面金額</span>
                    <span className="font-semibold text-gray-900">NT$ {formatTWD(amountNum)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">票期</span>
                    <span className="font-semibold text-gray-900">{daysNum} 天（約 {months.toFixed(1)} 個月）</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">月費率</span>
                    <span className="font-semibold text-gray-900">{rateNum}%</span>
                  </div>
                  <div className="border-t border-[#0D2B5E]/10 pt-3 mt-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">貼現手續費</span>
                      <span className="font-semibold text-red-600">－ NT$ {formatTWD(fee)}</span>
                    </div>
                    <div className="flex justify-between mt-3">
                      <span className="font-bold text-[#0D2B5E]">實際到手金額</span>
                      <span className="text-xl font-bold" style={{ color: '#C9922A' }}>NT$ {formatTWD(received)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <p className="text-xs text-gray-400 mt-5 leading-5">
              本試算以月費率 × 票期月數計算，實際費率依個別案件評估（發票人信用、票面金額、公司往來紀錄）而定。
            </p>
          </div>

          {/* 計算邏輯說明 */}
          <div className="mt-10 bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
            <h2 className="text-xl font-bold text-[#0D2B5E] mb-4">貼現手續費是怎麼算出來的？</h2>
            <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
              <p>
                支票貼現的本質是「用時間換現金」：你提前拿到票款，業者承擔等待票期與兌現的風險，
                手續費（俗稱貼現息）就是這段時間的資金成本。計算只有一條公式：
              </p>
              <div className="bg-[#F0F4FF] rounded-xl p-5 text-center font-bold text-[#0D2B5E]">
                手續費 ＝ 票面金額 × 月費率 × 票期月數（票期天數 ÷ 30）
              </div>
              <p>
                <strong className="text-gray-800">到手金額 ＝ 票面金額 − 手續費</strong>。
                注意三個實務細節：一、票期以「今天到支票發票日（到期日）」的實際天數計算，
                不是整月起跳；二、月費率是「月」費率，換算年利率要乘以 12，
                比較不同管道成本時務必統一單位；三、正派業者的報價就是這條公式算出來的數字，
                若簽約時多出「開辦費」「帳管費」「保證金」等名目，請提高警覺。
              </p>
              <p>
                費率高低由三個因素決定，影響力依序是：
                <strong className="text-gray-800">發票人信用</strong>（票信正常與否、過往兌現紀錄）、
                <strong className="text-gray-800">票期長短</strong>（越長風險越高）、
                <strong className="text-gray-800">票面金額</strong>（大額票單位成本較低）。
                這也是為什麼同一家公司的兩張票，報價可能不同。
              </p>
            </div>
          </div>

          {/* 三種情境實例 */}
          <div className="mt-8 bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
            <h2 className="text-xl font-bold text-[#0D2B5E] mb-6">三種常見情境試算</h2>
            <div className="space-y-5">
              <div className="border-l-4 pl-4 py-1" style={{ borderColor: '#C9922A' }}>
                <h3 className="font-bold text-gray-800 text-sm mb-1">情境一：短票期、大金額（貿易貨款）</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  票面 200 萬、票期 45 天、月費率 1.5%。
                  手續費 = 200 萬 × 1.5% × 1.5 個月 = 4.5 萬，<strong className="text-gray-800">到手約 195.5 萬</strong>。
                  短票期的總成本低，是最划算的貼現情境。
                </p>
              </div>
              <div className="border-l-4 pl-4 py-1" style={{ borderColor: '#C9922A' }}>
                <h3 className="font-bold text-gray-800 text-sm mb-1">情境二：標準票期（製造業客票）</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  票面 100 萬、票期 90 天、月費率 2%。
                  手續費 = 100 萬 × 2% × 3 個月 = 6 萬，<strong className="text-gray-800">到手約 94 萬</strong>。
                  90 天是台灣商業票據最常見的票期，此區間的報價競爭也最透明。
                </p>
              </div>
              <div className="border-l-4 pl-4 py-1" style={{ borderColor: '#C9922A' }}>
                <h3 className="font-bold text-gray-800 text-sm mb-1">情境三：長票期（工程尾款票）</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  票面 150 萬、票期 180 天、月費率 2.5%。
                  手續費 = 150 萬 × 2.5% × 6 個月 = 22.5 萬，<strong className="text-gray-800">到手約 127.5 萬</strong>。
                  長票期手續費總額明顯偏高，建議評估「部分貼現」——只貼現在需要的金額，
                  其餘票款等到期兌現，降低整體成本。
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-5">※ 以上為公式示範，非報價；實際費率依個別案件評估結果為準。</p>
          </div>

          {/* 市場行情 */}
          <div className="mt-8 bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
            <h2 className="text-xl font-bold text-[#0D2B5E] mb-4">目前市場費率區間參考</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-100 text-left text-gray-500">
                    <th className="py-3 pr-4 font-semibold">管道</th>
                    <th className="py-3 pr-4 font-semibold">常見費率水準</th>
                    <th className="py-3 font-semibold">備註</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  <tr className="border-b border-gray-50">
                    <td className="py-3 pr-4 font-medium text-gray-800">銀行票貼</td>
                    <td className="py-3 pr-4">年利率約 3%～8%</td>
                    <td className="py-3">成本最低，但需財報審查、額度受限、3～7 個工作天</td>
                  </tr>
                  <tr className="border-b border-gray-50">
                    <td className="py-3 pr-4 font-medium text-gray-800">民間票貼</td>
                    <td className="py-3 pr-4">月費率約 1.5%～3%</td>
                    <td className="py-3">看發票人信用，最快當日撥款；本公司屬此類</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium text-gray-800">當鋪收票</td>
                    <td className="py-3 pr-4">依當舖業法計息</td>
                    <td className="py-3">以質當邏輯計價，多為極短期小額週轉</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mt-4">
              提醒：費率不是唯一的比較基準。「報價是否書面、有無隱藏費用、是否當面核票對保」
              這些交易安全因素，比差零點幾個百分點的費率更重要。
              管道差異的完整比較見
              <Link href="/gaoxiong-piao-tie" className="text-[#0D2B5E] underline underline-offset-2 mx-1">高雄票貼管道指南</Link>，
              行情變化見
              <Link href="/articles/piao-tie-li-lv-hang-qing" className="text-[#0D2B5E] underline underline-offset-2 mx-1">票貼利率行情</Link>。
            </p>
          </div>

          {/* CTA */}
          <div className="mt-8 rounded-xl p-8 text-center text-white" style={{ backgroundColor: '#0D2B5E' }}>
            <h2 className="text-lg font-bold mb-2">想知道您的票實際費率？</h2>
            <p className="text-gray-300 text-sm mb-5">
              提供票面金額與到期日，專業顧問免費為您評估最低費率
            </p>
            <Link
              href="/contact"
              className="inline-block px-8 py-3 rounded font-bold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#C9922A' }}
            >
              免費獲取報價
            </Link>
          </div>

          {/* Related articles */}
          <div className="mt-8 space-y-3">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">延伸閱讀</h3>
            <Link
              href="/articles/zhi-piao-tie-xian-li-lv"
              className="block bg-white border border-gray-100 rounded-xl p-5 hover:border-[#C9922A] hover:shadow-sm transition-all"
            >
              <p className="font-bold text-[#0D2B5E] text-sm">支票貼現利率怎麼算？費率計算與試算完整說明</p>
              <p className="text-xs text-gray-500 mt-1">了解費率計算公式與影響因素</p>
            </Link>
            <Link
              href="/articles/zhi-piao-dai-kuan-li-lv"
              className="block bg-white border border-gray-100 rounded-xl p-5 hover:border-[#C9922A] hover:shadow-sm transition-all"
            >
              <p className="font-bold text-[#0D2B5E] text-sm">支票貸款利率與額度：影響因素完整說明</p>
              <p className="text-xs text-gray-500 mt-1">月費率大概多少？額度如何決定？</p>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
