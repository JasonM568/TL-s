import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { isAuthed } from '@/lib/auth'
import { listConsultations, serviceLabel, STATUS_LABELS } from '@/lib/consultations'
import { logout, updateStatus } from './actions'

export const metadata: Metadata = {
  title: '諮詢名單',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

const statusStyle: Record<string, string> = {
  new: 'bg-amber-100 text-amber-700',
  contacted: 'bg-blue-100 text-blue-700',
  done: 'bg-green-100 text-green-700',
  archived: 'bg-gray-100 text-gray-500',
}

function formatTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString('zh-TW', {
    timeZone: 'Asia/Taipei',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

export default async function AdminPage() {
  if (!(await isAuthed())) redirect('/admin/login')

  const rows = await listConsultations()
  const newCount = rows.filter((r) => r.status === 'new').length

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0D2B5E]">諮詢名單</h1>
          <p className="text-gray-400 text-sm mt-1">
            共 {rows.length} 筆
            {newCount > 0 && (
              <span className="ml-2 text-amber-600 font-medium">· {newCount} 筆待處理</span>
            )}
          </p>
        </div>
        <form action={logout}>
          <button className="text-sm text-gray-500 hover:text-[#0D2B5E] border border-gray-200 rounded-lg px-4 py-2 transition-colors">
            登出
          </button>
        </form>
      </div>

      {rows.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-16 text-center text-gray-400">
          目前還沒有任何諮詢。當有人填寫聯絡表單後，名單會顯示在這裡。
        </div>
      ) : (
        <div className="space-y-4">
          {rows.map((r) => (
            <div
              key={r.id}
              className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 md:flex md:items-start md:justify-between gap-6"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap mb-2">
                  <span className="font-bold text-[#0D2B5E] text-lg">{r.company}</span>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      statusStyle[r.status] ?? 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {STATUS_LABELS[r.status] ?? r.status}
                  </span>
                  <span className="text-xs text-gray-400">{formatTime(r.created_at)}</span>
                </div>
                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-1 text-sm">
                  <p>
                    <span className="text-gray-400">聯絡人：</span>
                    <span className="text-gray-800">{r.name}</span>
                  </p>
                  <p>
                    <span className="text-gray-400">電話：</span>
                    <a href={`tel:${r.phone}`} className="text-[#0D2B5E] font-medium hover:underline">
                      {r.phone}
                    </a>
                  </p>
                  <p>
                    <span className="text-gray-400">服務：</span>
                    <span className="text-gray-800">{serviceLabel(r.service)}</span>
                  </p>
                  <p>
                    <span className="text-gray-400">金額：</span>
                    <span className="text-gray-800">{r.amount || '—'}</span>
                  </p>
                </div>
                {r.note && (
                  <p className="text-sm text-gray-600 mt-2 bg-gray-50 rounded-lg px-3 py-2">
                    {r.note}
                  </p>
                )}
              </div>

              {/* 狀態更新 */}
              <form action={updateStatus} className="mt-4 md:mt-0 flex items-center gap-2 shrink-0">
                <input type="hidden" name="id" value={r.id} />
                <select
                  name="status"
                  defaultValue={r.status}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-[#0D2B5E]"
                >
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <button className="text-sm text-white rounded-lg px-4 py-2 font-medium transition-opacity hover:opacity-90" style={{ backgroundColor: '#0D2B5E' }}>
                  更新
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
