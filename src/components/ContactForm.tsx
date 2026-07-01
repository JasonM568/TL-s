'use client'

import { useState } from 'react'

type Status = 'idle' | 'submitting' | 'success' | 'error'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')

    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())

    try {
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok || !json.ok) {
        throw new Error(json.error || '送出失敗')
      }
      // GA4 轉換事件
      window.gtag?.('event', 'generate_lead', {
        service: (data.service as string) || 'unknown',
      })
      setStatus('success')
      form.reset()
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : '送出失敗，請稍後再試')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-xl border border-green-100 bg-green-50 p-8 text-center">
        <div className="text-4xl mb-4">✅</div>
        <h3 className="text-xl font-bold text-[#0D2B5E] mb-2">諮詢已送出！</h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          我們已收到您的諮詢，顧問將在 1 個工作日內與您聯繫。
          <br />
          如有急件，歡迎直接來電。
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-6 text-sm text-[#0D2B5E] font-semibold hover:underline"
        >
          再填一筆
        </button>
      </div>
    )
  }

  const inputClass =
    'w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0D2B5E] transition-colors'

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          公司名稱 <span className="text-red-500">*</span>
        </label>
        <input name="company" type="text" required placeholder="請輸入公司或商號名稱" className={inputClass} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          聯絡人姓名 <span className="text-red-500">*</span>
        </label>
        <input name="name" type="text" required placeholder="請輸入姓名" className={inputClass} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          聯絡電話 <span className="text-red-500">*</span>
        </label>
        <input name="phone" type="tel" required placeholder="請輸入手機或市話" className={inputClass} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">洽詢服務</label>
        <select name="service" className={`${inputClass} bg-white`} defaultValue="">
          <option value="">請選擇服務項目</option>
          <option value="tie-xian">支票貼現</option>
          <option value="dai-kuan">支票貸款</option>
          <option value="other">其他融資諮詢</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">需求金額（約）</label>
        <select name="amount" className={`${inputClass} bg-white`} defaultValue="">
          <option value="">請選擇</option>
          <option>50萬以下</option>
          <option>50～100萬</option>
          <option>100～300萬</option>
          <option>300～500萬</option>
          <option>500萬以上</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">備註說明</label>
        <textarea
          name="note"
          rows={4}
          placeholder="請描述您的資金需求或其他問題..."
          className={`${inputClass} resize-none`}
        />
      </div>

      {status === 'error' && (
        <p className="text-sm text-red-500 bg-red-50 rounded-lg px-4 py-3">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full py-4 rounded-lg font-bold text-white text-lg transition-opacity hover:opacity-90 disabled:opacity-60"
        style={{ backgroundColor: '#C9922A' }}
      >
        {status === 'submitting' ? '送出中…' : '送出諮詢申請'}
      </button>
      <p className="text-xs text-gray-400 text-center">
        送出即代表您同意我們聯繫您提供服務資訊。我們嚴格保護您的個人資料。
      </p>
    </form>
  )
}
