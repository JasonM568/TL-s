import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { isAuthed } from '@/lib/auth'
import { listDbArticles, type DbArticleRow } from '@/lib/articles-db'
import { saveSchedule, publishNow, unpublish, removeArticle } from './actions'

export const metadata: Metadata = {
  title: '文章排程',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

// 顯示徽章：scheduled 再依 publish_at vs now 分「排程中 / 已發布」
function statusInfo(r: DbArticleRow): { label: string; style: string } {
  if (r.status === 'draft') return { label: '草稿', style: 'bg-gray-100 text-gray-500' }
  if (r.status === 'archived') return { label: '已下架', style: 'bg-red-100 text-red-600' }
  // scheduled
  const live = r.publish_at != null && new Date(r.publish_at).getTime() <= Date.now()
  return live
    ? { label: '已發布', style: 'bg-green-100 text-green-700' }
    : { label: '排程中', style: 'bg-blue-100 text-blue-700' }
}

function formatTime(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('zh-TW', {
    timeZone: 'Asia/Taipei',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

// ISO → datetime-local 預設值（yyyy-MM-ddTHH:mm，台灣牆鐘）
function toLocalInput(iso: string | null): string {
  if (!iso) return ''
  const p = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Taipei',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date(iso))
  const g = (t: string) => p.find((x) => x.type === t)!.value
  return `${g('year')}-${g('month')}-${g('day')}T${g('hour')}:${g('minute')}`
}

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: 'draft', label: '草稿（不發布）' },
  { value: 'scheduled', label: '排程/發布' },
  { value: 'archived', label: '下架' },
]

export default async function AdminArticlesPage() {
  if (!(await isAuthed())) redirect('/admin/login')

  const rows = await listDbArticles()
  const liveCount = rows.filter(
    (r) => r.status === 'scheduled' && r.publish_at != null && new Date(r.publish_at).getTime() <= Date.now(),
  ).length

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0D2B5E]">文章排程</h1>
          <p className="text-gray-400 text-sm mt-1">
            共 {rows.length} 篇
            {liveCount > 0 && <span className="ml-2 text-green-600 font-medium">· {liveCount} 篇已發布</span>}
          </p>
        </div>
        <Link
          href="/admin"
          className="text-sm text-gray-500 hover:text-[#0D2B5E] border border-gray-200 rounded-lg px-4 py-2 transition-colors"
        >
          ← 諮詢名單
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-16 text-center text-gray-400 leading-7">
          目前佇列是空的。
          <br />
          用 <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">node scripts/seed-articles.mjs</code>{' '}
          把 Claude 產出的草稿匯入後，會顯示在這裡供排程。
        </div>
      ) : (
        <div className="space-y-4">
          {rows.map((r) => {
            const info = statusInfo(r)
            return (
              <div key={r.id} className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
                {/* 標題列 */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${info.style}`}>
                        {info.label}
                      </span>
                      <span className="text-xs text-gray-400">順序 {r.sort_order}</span>
                      <span className="text-xs text-gray-400">發布時間：{formatTime(r.publish_at)}</span>
                    </div>
                    <h2 className="font-bold text-[#0D2B5E] leading-snug">{r.h1}</h2>
                    <p className="text-xs text-gray-400 mt-1">
                      /articles/{r.slug} · {r.category}
                    </p>
                  </div>
                  {info.label === '已發布' && (
                    <a
                      href={`/articles/${r.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-[#0D2B5E] hover:underline shrink-0"
                    >
                      預覽 →
                    </a>
                  )}
                </div>

                {/* 排程表單 */}
                <form
                  action={saveSchedule}
                  className="flex flex-wrap items-end gap-3 border-t border-gray-50 pt-4"
                >
                  <input type="hidden" name="id" value={r.id} />
                  <input type="hidden" name="slug" value={r.slug} />
                  <label className="text-xs text-gray-500">
                    <span className="block mb-1">狀態</span>
                    <select
                      name="status"
                      defaultValue={r.status}
                      className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-[#0D2B5E]"
                    >
                      {STATUS_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="text-xs text-gray-500">
                    <span className="block mb-1">發布時間</span>
                    <input
                      type="datetime-local"
                      name="publish_at"
                      defaultValue={toLocalInput(r.publish_at)}
                      className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-[#0D2B5E]"
                    />
                  </label>
                  <label className="text-xs text-gray-500">
                    <span className="block mb-1">順序</span>
                    <input
                      type="number"
                      name="sort_order"
                      defaultValue={r.sort_order}
                      className="w-20 text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-[#0D2B5E]"
                    />
                  </label>
                  <button
                    className="text-sm text-white rounded-lg px-4 py-2 font-medium transition-opacity hover:opacity-90"
                    style={{ backgroundColor: '#0D2B5E' }}
                  >
                    儲存排程
                  </button>
                </form>

                {/* 快速動作 */}
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <form action={publishNow}>
                    <input type="hidden" name="id" value={r.id} />
                    <input type="hidden" name="slug" value={r.slug} />
                    <input type="hidden" name="sort_order" value={r.sort_order} />
                    <button className="text-xs text-white rounded-lg px-3 py-1.5 font-medium transition-opacity hover:opacity-90" style={{ backgroundColor: '#C9922A' }}>
                      立即發布
                    </button>
                  </form>
                  <form action={unpublish}>
                    <input type="hidden" name="id" value={r.id} />
                    <input type="hidden" name="slug" value={r.slug} />
                    <button className="text-xs text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 font-medium hover:bg-gray-50 transition-colors">
                      下架
                    </button>
                  </form>
                  <form action={removeArticle}>
                    <input type="hidden" name="id" value={r.id} />
                    <input type="hidden" name="slug" value={r.slug} />
                    <button className="text-xs text-red-500 border border-red-200 rounded-lg px-3 py-1.5 font-medium hover:bg-red-50 transition-colors">
                      刪除
                    </button>
                  </form>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
