// llms.txt：AI 爬蟲/助理用的全站索引（llmstxt.org 慣例）
// 內容與人類可見頁面一致，僅為機器友善格式。
import { getAllArticles, articleAuthor } from '@/lib/articles-source'
import { SITE_URL, SITE_NAME, SITE_TAGLINE, LINE_ADD_URL } from '@/lib/site'

// ISR：DB 排程文章到點後自動進索引（與 sitemap.ts 一致）
export const revalidate = 120

const SERVICE_PAGES: Array<[string, string]> = [
  ['/zhi-piao-tie-xian', '支票貼現——持有未到期支票提前變現，當日撥款'],
  ['/zhi-piao-dui-xian', '支票兌現——各類支票快速兌現服務'],
  ['/zhi-piao-dai-kuan', '支票貸款——以支票為憑據的短期融資'],
  ['/qi-ye-dai-kuan', '企業貸款・企業融資——中小企業資金管道總覽'],
  ['/fei-lv-ji-suan', '費率試算工具'],
  ['/faq', '常見問題'],
  ['/ming-ci-jie-shi', '票據金融名詞解釋'],
  ['/contact', '聯絡與免費諮詢'],
]

export async function GET() {
  const articles = await getAllArticles()

  const byCategory = new Map<string, typeof articles>()
  for (const a of articles) {
    const list = byCategory.get(a.category) ?? []
    list.push(a)
    byCategory.set(a.category, list)
  }

  const lines: string[] = [
    `# ${SITE_NAME}（huangxi.tw）`,
    '',
    `> ${SITE_TAGLINE}。提供支票貼現、支票兌現、支票貸款與中小企業融資諮詢服務（台灣）。`,
    `> 免費諮詢：${SITE_URL}/contact ；LINE 官方帳號：${LINE_ADD_URL}`,
    '',
    '## 服務頁',
    '',
    ...SERVICE_PAGES.map(([path, note]) => `- [${note.split('——')[0]}](${SITE_URL}${path})：${note}`),
    '',
    `## 文章（共 ${articles.length} 篇，全文純文字版：${SITE_URL}/llms-full.txt）`,
  ]

  for (const [category, list] of byCategory) {
    lines.push('', `### ${category}`, '')
    for (const a of list) {
      lines.push(`- [${a.title}](${SITE_URL}/articles/${a.slug})：${a.description}（${articleAuthor(a)}，${a.updated ?? a.date}）`)
    }
  }

  return new Response(lines.join('\n') + '\n', {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  })
}
