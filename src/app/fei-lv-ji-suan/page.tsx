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
