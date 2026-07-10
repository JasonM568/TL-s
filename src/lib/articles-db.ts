// DB 版文章存取層（排程佇列）
// 新文章走 Supabase huangxi_articles 表；沿用 getSupabase() + ADMIN_SECRET + rpc 模式（同 consultations.ts）。
// 前台其餘程式碼零改動——DB 列在此映射回既有 Article 型別。
import { getSupabase, ADMIN_SECRET } from './supabase'
import type { Article, Block } from './articles'

export type ArticleStatus = 'draft' | 'scheduled' | 'archived'

export type DbArticleRow = {
  id: string
  slug: string
  title: string
  h1: string
  description: string
  keywords: string[]
  category: string
  author: string | null
  reading_minutes: number
  excerpt: string
  content: Block[]
  updated_display: string | null
  status: ArticleStatus
  publish_at: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

// timestamptz(ISO) → yyyy-mm-dd（Asia/Taipei 牆鐘）
function twDate(iso: string): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Taipei',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date(iso))
  const g = (t: string) => parts.find((x) => x.type === t)!.value
  return `${g('year')}-${g('month')}-${g('day')}`
}

// DB 列 → 既有 Article 型別（顯示日期由 publish_at 推導＝上線日）
export function rowToArticle(r: DbArticleRow): Article {
  return {
    slug: r.slug,
    title: r.title,
    h1: r.h1,
    description: r.description,
    keywords: r.keywords ?? [],
    category: r.category,
    author: r.author ?? undefined,
    date: r.publish_at ? twDate(r.publish_at) : twDate(r.created_at),
    updated: r.updated_display ?? undefined,
    readingMinutes: r.reading_minutes,
    excerpt: r.excerpt,
    content: r.content ?? [],
  }
}

// 前台：只拿可見文章（definer 函式已過濾 status=scheduled 且 publish_at<=now）
export async function getPublicDbArticles(): Promise<Article[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase.rpc('huangxi_public_articles')
  if (error) throw new Error(error.message)
  return ((data ?? []) as DbArticleRow[]).map(rowToArticle)
}

// 後台：整個佇列（原始列，不映射）
export async function listDbArticles(): Promise<DbArticleRow[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase.rpc('huangxi_list_articles', {
    p_secret: ADMIN_SECRET,
  })
  if (error) throw new Error(error.message)
  return (data ?? []) as DbArticleRow[]
}

// Claude 灌稿：寫入預設 draft（on conflict 只更新內容，不動排程）
export async function upsertDbArticle(article: Partial<Article>): Promise<string> {
  const supabase = getSupabase()
  const { data, error } = await supabase.rpc('huangxi_upsert_article', {
    p_secret: ADMIN_SECRET,
    p_article: article,
  })
  if (error) throw new Error(error.message)
  return data as string
}

// 後台：更新排程（狀態 / 發布時間 / 順序）。publishAt 傳 null＝取消排程回草稿
export async function updateDbArticleSchedule(
  id: string,
  status: ArticleStatus,
  publishAt: string | null,
  sortOrder: number,
): Promise<void> {
  const supabase = getSupabase()
  const { error } = await supabase.rpc('huangxi_update_article_schedule', {
    p_secret: ADMIN_SECRET,
    p_id: id,
    p_status: status,
    p_publish_at: publishAt,
    p_sort_order: sortOrder,
  })
  if (error) throw new Error(error.message)
}

// 後台：刪除
export async function deleteDbArticle(id: string): Promise<void> {
  const supabase = getSupabase()
  const { error } = await supabase.rpc('huangxi_delete_article', {
    p_secret: ADMIN_SECRET,
    p_id: id,
  })
  if (error) throw new Error(error.message)
}
