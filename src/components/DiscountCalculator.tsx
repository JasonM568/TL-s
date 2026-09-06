'use client'

import { useEffect, useRef, useState } from 'react'
import { LineLink } from './LineCta'
import { LINE_CTA_ASSURANCE } from '@/lib/site'
import type { CtaVariant } from '@/lib/cta-offers'

/**
 * 支票貼現費率試算。頁面版（/fei-lv-ji-suan）與文章嵌入版共用同一份公式。
 *
 * 為什麼要抽成元件：2026-09-06 GA4 盤查發現 /fei-lv-ji-suan 一整個月
 * **0 次瀏覽**——不是工具沒用，是它在另一頁而沒人會離開落地頁
 * （全站頁/次 1.05、非文章頁只佔 1.6% 的 pageviews）。
 * 文章頁是唯一會被看見的介面，所以工具要「搬進去」而不是「連過去」。
 */

function formatTWD(n: number): string {
  return new Intl.NumberFormat('zh-TW').format(Math.round(n))
}

const RATE_PRESETS = ['1.0', '1.5', '2.0', '2.5', '3.0']

export default function DiscountCalculator({
  compact = false,
  location,
  variant,
  className = '',
}: {
  /** true＝文章內嵌版（體積小、不搶戲）；false＝獨立頁版 */
  compact?: boolean
  /** GA4 cta_location，用來分辨頁面版與文章版的成效 */
  location: string
  variant?: CtaVariant
  className?: string
}) {
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

  // 曝光：工具捲進畫面
  const boxRef = useRef<HTMLDivElement>(null)
  const viewSent = useRef(false)
  useEffect(() => {
    const el = boxRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      (es) => {
        for (const e of es) {
          if (!e.isIntersecting || viewSent.current) continue
          viewSent.current = true
          window.gtag?.('event', 'cta_view', {
            cta_location: location,
            ...(variant ? { cta_variant: variant } : {}),
          })
          io.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [location, variant])

  // 真的算出結果＝全站意圖最高的訊號，單獨記一個事件。
  // 只送一次，避免使用者微調數字時灌爆。
  const calcSent = useRef(false)
  useEffect(() => {
    if (!hasResult || calcSent.current) return
    calcSent.current = true
    window.gtag?.('event', 'calculator_result', {
      cta_location: location,
      ...(variant ? { cta_variant: variant } : {}),
    })
  }, [hasResult, location, variant])

  const inputClass =
    'w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 bg-white focus:outline-none focus:border-[#0D2B5E] focus:ring-1 focus:ring-[#0D2B5E]'

  return (
    <div
      ref={boxRef}
      className={
        compact
          ? `my-10 rounded-2xl border border-[#0D2B5E]/12 bg-[#F7F9FF] p-6 ${className}`
          : `bg-white border border-gray-100 rounded-2xl shadow-sm p-8 ${className}`
      }
    >
      {compact ? (
        <>
          <p className="text-xs font-bold uppercase tracking-widest text-[#C9922A] mb-1">
            就地試算・不用離開這頁
          </p>
          <h2 className="text-lg font-bold text-[#0D2B5E] mb-1">這張票貼現，實際能拿多少？</h2>
          <p className="text-sm text-gray-500 mb-5">
            填票面金額與票期，立刻算出手續費與到手金額。
          </p>
        </>
      ) : (
        <h2 className="text-xl font-bold text-[#0D2B5E] mb-6">費用試算</h2>
      )}

      <div className={compact ? 'grid gap-4 sm:grid-cols-2' : 'space-y-5'}>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            票面金額（新台幣）
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">NT$</span>
            <input
              type="number"
              inputMode="numeric"
              min="0"
              step="10000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="例如：1000000"
              className={`${inputClass} pl-12`}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">票期（天數）</label>
          <input
            type="number"
            inputMode="numeric"
            min="1"
            max="365"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            placeholder="例如：90（3 個月）"
            className={inputClass}
          />
          {!compact && (
            <p className="text-xs text-gray-400 mt-1">
              常見票期：30 天（1 月）、60 天（2 月）、90 天（3 月）、180 天（6 月）
            </p>
          )}
        </div>

        <div className={compact ? 'sm:col-span-2' : ''}>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">月費率（%）</label>
          {/* 精簡版用等寬五格，手機一行放得下；完整版才允許換行 */}
          <div className={compact ? 'grid grid-cols-5 gap-1.5' : 'flex flex-wrap gap-2 mb-2'}>
            {RATE_PRESETS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setMonthlyRate(r)}
                className={`rounded text-sm font-medium transition-colors ${
                  compact ? 'py-2' : 'px-3 py-1.5'
                } ${monthlyRate === r ? 'text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                style={monthlyRate === r ? { backgroundColor: '#0D2B5E' } : {}}
              >
                {r}%
              </button>
            ))}
          </div>
          {/* 精簡版不給自由輸入框：1%～3% 已涵蓋市場區間，
              多一個顯示同一個值的欄位在手機上只是佔掉一整行還讓人困惑 */}
          {!compact && (
            <input
              type="number"
              inputMode="decimal"
              min="0.1"
              max="5"
              step="0.1"
              value={monthlyRate}
              onChange={(e) => setMonthlyRate(e.target.value)}
              className={inputClass}
            />
          )}
        </div>
      </div>

      {hasResult && (
        <div className="mt-6 rounded-xl p-6" style={{ backgroundColor: compact ? '#FFFFFF' : '#F0F4FF' }}>
          <h3 className="text-sm font-bold text-[#0D2B5E] uppercase tracking-wider mb-4">試算結果</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">票面金額</span>
              <span className="font-semibold text-gray-900">NT$ {formatTWD(amountNum)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">票期</span>
              <span className="font-semibold text-gray-900">
                {daysNum} 天（約 {months.toFixed(1)} 個月）
              </span>
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
                <span className="text-xl font-bold" style={{ color: '#C9922A' }}>
                  NT$ {formatTWD(received)}
                </span>
              </div>
            </div>
          </div>

          {/* 算完當下＝全站意圖最高的瞬間，就地承接 */}
          <div className="mt-6 pt-5 border-t border-[#0D2B5E]/10">
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              這是用<strong className="text-gray-800">你自己輸入的費率</strong>算的。實際費率取決於發票人票信——
              加 LINE 傳一張支票照片，我們<strong className="text-gray-800">免費幫你查發票人的票信紀錄</strong>，
              並回覆這張票的實際報價區間。
            </p>
            <LineLink
              location={location}
              variant={variant}
              className="flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-full font-bold text-white transition-all hover:opacity-90 hover:shadow-lg"
              style={{ backgroundColor: '#06C755' }}
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.48 2 2 5.64 2 10.13c0 4.02 3.55 7.39 8.35 8.03.33.07.77.22.88.5.1.25.07.64.03.89l-.14.85c-.04.25-.2.99.86.54 1.07-.45 5.76-3.39 7.86-5.81C21.4 14.4 22 12.36 22 10.13 22 5.64 17.52 2 12 2z" />
              </svg>
              取得這張票的實際報價
            </LineLink>
            <p className="text-center text-xs text-gray-400 mt-3">{LINE_CTA_ASSURANCE}</p>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-400 mt-5 leading-5">
        本試算以月費率 × 票期月數計算，實際費率依個別案件評估（發票人信用、票面金額、公司往來紀錄）而定。
      </p>
    </div>
  )
}
