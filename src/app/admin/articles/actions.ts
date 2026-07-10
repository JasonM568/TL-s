'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { isAuthed } from '@/lib/auth'
import {
  updateDbArticleSchedule,
  deleteDbArticle,
  type ArticleStatus,
} from '@/lib/articles-db'

// datetime-local（台灣牆鐘）→ ISO。台灣固定 UTC+8、無日光節約，直接補 +08:00。
function twLocalToIso(v: string): string | null {
  if (!v) return null
  return new Date(`${v}:00+08:00`).toISOString()
}

// 讓變更即時反映到前台（立即發布/下架當下生效）
function refresh(slug?: string) {
  revalidatePath('/admin/articles')
  revalidatePath('/articles')
  revalidatePath('/sitemap.xml')
  if (slug) revalidatePath(`/articles/${slug}`)
}

// 儲存排程：設定狀態 / 發布時間 / 順序
export async function saveSchedule(formData: FormData) {
  if (!(await isAuthed())) redirect('/admin/login')
  const id = (formData.get('id') || '').toString()
  const slug = (formData.get('slug') || '').toString()
  const status = (formData.get('status') || 'draft').toString() as ArticleStatus
  const publishAt = twLocalToIso((formData.get('publish_at') || '').toString())
  const sortOrder = Number(formData.get('sort_order') || 0)
  if (id) {
    // 若選 scheduled 卻沒填時間，退回 draft 避免 DB check 擋下
    const finalStatus: ArticleStatus =
      status === 'scheduled' && !publishAt ? 'draft' : status
    await updateDbArticleSchedule(id, finalStatus, publishAt, sortOrder)
    refresh(slug)
  }
  redirect('/admin/articles')
}

// 立即發布：狀態=scheduled、publish_at=now
export async function publishNow(formData: FormData) {
  if (!(await isAuthed())) redirect('/admin/login')
  const id = (formData.get('id') || '').toString()
  const slug = (formData.get('slug') || '').toString()
  const sortOrder = Number(formData.get('sort_order') || 0)
  if (id) {
    await updateDbArticleSchedule(id, 'scheduled', new Date().toISOString(), sortOrder)
    refresh(slug)
  }
  redirect('/admin/articles')
}

// 下架：狀態=archived
export async function unpublish(formData: FormData) {
  if (!(await isAuthed())) redirect('/admin/login')
  const id = (formData.get('id') || '').toString()
  const slug = (formData.get('slug') || '').toString()
  if (id) {
    await updateDbArticleSchedule(id, 'archived', null, 0)
    refresh(slug)
  }
  redirect('/admin/articles')
}

// 刪除
export async function removeArticle(formData: FormData) {
  if (!(await isAuthed())) redirect('/admin/login')
  const id = (formData.get('id') || '').toString()
  const slug = (formData.get('slug') || '').toString()
  if (id) {
    await deleteDbArticle(id)
    refresh(slug)
  }
  redirect('/admin/articles')
}
