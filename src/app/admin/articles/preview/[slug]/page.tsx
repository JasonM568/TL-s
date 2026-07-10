import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { isAuthed } from '@/lib/auth'
import { getDbRowBySlug, rowToArticle } from '@/lib/articles-db'
import { getAllArticles } from '@/lib/articles-source'
import ArticleView from '@/app/articles/[slug]/ArticleView'

export const metadata: Metadata = {
  title: '文章預覽',
  robots: { index: false, follow: false },
}

// 後台預覽一律即時、不快取（要看到最新草稿內容）
export const dynamic = 'force-dynamic'

function statusLabel(status: string, publishAt: string | null): string {
  if (status === 'draft') return '草稿'
  if (status === 'archived') return '已下架'
  const live = publishAt != null && new Date(publishAt).getTime() <= Date.now()
  return live ? '已發布' : '排程中'
}

function formatTime(iso: string | null): string {
  if (!iso) return '未設定'
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

type Props = { params: Promise<{ slug: string }> }

export default async function ArticlePreviewPage({ params }: Props) {
  if (!(await isAuthed())) redirect('/admin/login')

  const { slug } = await params
  const row = await getDbRowBySlug(slug)
  if (!row) notFound()

  const article = rowToArticle(row)

  // 相關文章：以目前公開文章為準（同分類優先，補到 3 篇）
  const related = (await getAllArticles())
    .filter((a) => a.slug !== article.slug)
    .sort((a) => (a.category === article.category ? -1 : 1))
    .slice(0, 3)

  return (
    <>
      {/* 預覽模式橫幅 */}
      <div className="sticky top-0 z-20 bg-[#C9922A] text-white text-sm">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
          <span className="font-medium">
            🔒 預覽模式（未公開）· 狀態：{statusLabel(row.status, row.publish_at)} · 發布時間：{formatTime(row.publish_at)}
          </span>
          <Link href="/admin/articles" className="underline underline-offset-2 hover:opacity-90 shrink-0">
            ← 返回文章排程
          </Link>
        </div>
      </div>

      <ArticleView article={article} related={related} />
    </>
  )
}
