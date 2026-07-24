// llms-full.txt：全部已發布文章的完整純文字版（llmstxt.org 慣例）
// 與 /articles/* 頁面內容一致，僅為機器友善格式。
import { getAllArticles, articleAuthor } from '@/lib/articles-source'
import { articleToMarkdown } from '@/lib/article-markdown'
import { SITE_URL, SITE_NAME } from '@/lib/site'

export const revalidate = 120

export async function GET() {
  const articles = await getAllArticles()

  const parts = articles.map((a) => {
    const meta = [
      `# ${a.h1}`,
      '',
      `來源：${SITE_URL}/articles/${a.slug}`,
      `作者：${articleAuthor(a)}（${SITE_NAME}）`,
      `發布：${a.date}${a.updated ? `（更新：${a.updated}）` : ''}`,
      `摘要：${a.description}`,
      '',
    ].join('\n')
    return meta + articleToMarkdown(a)
  })

  return new Response(parts.join('\n\n---\n\n') + '\n', {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  })
}
