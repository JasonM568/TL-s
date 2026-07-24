// Block[] → Markdown 純文字轉換（供 llms-full.txt 等機器友善輸出使用）
import type { Article, Block } from './articles'
import { SITE_URL } from './site'

function blockToMarkdown(b: Block): string {
  switch (b.type) {
    case 'p':
      return b.text
    case 'h2':
      return `## ${b.text}`
    case 'h3':
      return `### ${b.text}`
    case 'ul':
      return b.items.map((i) => `- ${i}`).join('\n')
    case 'ol':
      return b.items.map((i, n) => `${n + 1}. ${i}`).join('\n')
    case 'callout':
      return `> ${b.text}`
    case 'related':
      return `→ [${b.label}](${SITE_URL}${b.href})：${b.note}`
  }
}

export function articleToMarkdown(a: Article): string {
  const body = a.content.map(blockToMarkdown).join('\n\n')
  const faqs = a.faqs?.length
    ? '\n\n## 常見問題\n\n' + a.faqs.map((f) => `**Q：${f.q}**\n\nA：${f.a}`).join('\n\n')
    : ''
  return `${body}${faqs}`
}
