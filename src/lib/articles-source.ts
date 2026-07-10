// 合併資料源：靜態 31 篇（恆為已發布）+ DB 佇列（僅可見文章）
// 前台一律改 import 自此檔。維持既有「date 新到舊」排序與 Article 型別。
// DB 讀取失敗 → 降級只回靜態文章（DB 掛掉不影響既有 SEO 頁）。
import { articles as staticArticles, type Article } from './articles'
import { getPublicDbArticles } from './articles-db'

export { articleAuthor, DEFAULT_AUTHOR } from './articles'
export type { Article, Block } from './articles'

async function mergedArticles(): Promise<Article[]> {
  let dbArticles: Article[] = []
  try {
    dbArticles = await getPublicDbArticles()
  } catch (e) {
    // 降級：DB 掛掉時仍回既有靜態文章
    console.error('[articles-source] DB 讀取失敗，僅回靜態文章', e)
  }
  // 靜態 slug 優先：DB 撞名者忽略，避免蓋掉已索引的靜態頁 URL
  const staticSlugs = new Set(staticArticles.map((a) => a.slug))
  const merged = [
    ...staticArticles,
    ...dbArticles.filter((a) => !staticSlugs.has(a.slug)),
  ]
  return merged.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export async function getAllArticles(): Promise<Article[]> {
  return mergedArticles()
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  return (await mergedArticles()).find((a) => a.slug === slug)
}

export async function getAllSlugs(): Promise<string[]> {
  return (await mergedArticles()).map((a) => a.slug)
}
