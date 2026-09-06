import Link from 'next/link'
import { Fragment } from 'react'
import { articleAuthor, type Article, type Block } from '@/lib/articles-source'
import LineCtaBlock, { InlineLineCta, FloatingLineButton } from '@/components/LineCta'
import DiscountCalculator from '@/components/DiscountCalculator'
import { ctaVariantFor, shouldEmbedCalculator } from '@/lib/cta-offers'

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${y} 年 ${Number(m)} 月 ${Number(d)} 日`
}

/**
 * 文中 CTA 的插入點：文章中段、緊接在某個 h2 之前（落在章節縫隙，不切斷段落）。
 *
 * 為什麼要插這個：文末 CTA 只有讀到底的人看得到。GA4 平均停留 2 分 10 秒、
 * 文章多在 6 分鐘以上 —— 多數讀者根本沒捲到文末就走了。
 *
 * 回傳 null＝這篇不插（太短，文末 CTA 已經夠近）。
 */
function inlineCtaIndex(content: Block[]): number | null {
  if (content.length < 10) return null

  const target = Math.floor(content.length * 0.5)
  const window = Math.floor(content.length * 0.25)

  for (let d = 0; d <= window; d++) {
    for (const i of d === 0 ? [target] : [target - d, target + d]) {
      if (i <= 1 || i >= content.length - 1) continue
      if (content[i].type !== 'h2') continue
      // 前一塊已經是卡片（延伸閱讀／法規來源／重點框）就跳過，避免卡片連續堆疊
      const prev = content[i - 1].type
      if (prev === 'related' || prev === 'source' || prev === 'callout') continue
      return i
    }
  }
  return null
}

export function renderBlock(block: Block, i: number) {
  switch (block.type) {
    case 'h2':
      return (
        <h2 key={i} className="text-2xl font-bold text-[#0D2B5E] mt-10 mb-4">
          {block.text}
        </h2>
      )
    case 'h3':
      return (
        <h3 key={i} className="text-xl font-bold text-[#0D2B5E] mt-8 mb-3">
          {block.text}
        </h3>
      )
    case 'p':
      return (
        <p key={i} className="text-gray-700 leading-[1.8] md:leading-8 mb-5">
          {block.text}
        </p>
      )
    case 'ul':
      return (
        <ul key={i} className="list-disc pl-6 mb-6 space-y-2 text-gray-700 leading-[1.75] md:leading-7">
          {block.items.map((item, j) => (
            <li key={j}>{item}</li>
          ))}
        </ul>
      )
    case 'ol':
      return (
        <ol key={i} className="list-decimal pl-6 mb-6 space-y-2 text-gray-700 leading-[1.75] md:leading-7">
          {block.items.map((item, j) => (
            <li key={j}>{item}</li>
          ))}
        </ol>
      )
    case 'callout':
      return (
        <div
          key={i}
          className="my-6 border-l-4 pl-5 py-4 rounded-r-lg bg-[#F0F4FF] text-[#0D2B5E] leading-7"
          style={{ borderColor: '#C9922A' }}
        >
          {block.text}
        </div>
      )
    case 'related':
      return (
        <Link
          key={i}
          href={block.href}
          className="group my-6 flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-5 hover:border-[#C9922A] hover:shadow-sm transition-all"
        >
          <div>
            <p className="text-xs text-gray-400 mb-1">延伸閱讀</p>
            <p className="font-bold text-[#0D2B5E]">{block.label}</p>
            <p className="text-sm text-gray-500 mt-1">{block.note}</p>
          </div>
          <span className="text-[#C9922A] text-xl shrink-0 group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      )
    case 'source':
      return (
        <a
          key={i}
          href={block.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group my-6 flex items-start justify-between gap-4 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-5 hover:border-[#0D2B5E] hover:bg-white transition-all"
        >
          <div>
            <p className="text-xs text-gray-400 mb-1">法規依據・官方來源</p>
            <p className="font-bold text-[#0D2B5E] underline decoration-gray-300 underline-offset-4 group-hover:decoration-[#C9922A]">
              {block.label}
            </p>
            {block.note && <p className="text-sm text-gray-500 mt-1">{block.note}</p>}
          </div>
          <span className="text-gray-400 text-lg shrink-0 group-hover:text-[#C9922A] transition-colors">↗</span>
        </a>
      )
  }
}

type RelatedPost = Pick<Article, 'slug' | 'category' | 'h1' | 'excerpt'>

// 文章視覺主體（公開頁與後台預覽頁共用）。JSON-LD / metadata 留在各自的 page。
export default function ArticleView({
  article,
  related,
}: {
  article: Article
  related: RelatedPost[]
}) {
  // CTA 誘因依文章主題自動切換（見 lib/cta-offers.ts），新文章不必手動指定
  const ctaVariant = ctaVariantFor(article)
  const inlineAt = inlineCtaIndex(article.content)
  // 談錢／票期的文章，中段直接給工具而不是給連結。
  // /fei-lv-ji-suan 一個月 0 瀏覽——使用者不會離開落地頁，工具得搬進來。
  const embedCalculator = shouldEmbedCalculator(article)

  return (
    <>
      {/* Hero */}
      <section style={{ backgroundColor: '#0D2B5E' }} className="text-white py-8 md:py-14 px-4">
        <div className="max-w-3xl mx-auto">
          <nav className="text-sm text-gray-400 mb-4 md:mb-6">
            <Link href="/" className="hover:text-white">首頁</Link>
            <span className="mx-2">/</span>
            <Link href="/articles" className="hover:text-white">知識專欄</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{article.category}</span>
          </nav>
          <div className="flex items-center gap-3 mb-3 md:mb-4 text-xs">
            <span
              className="px-3 py-1 rounded-full font-medium text-white"
              style={{ backgroundColor: '#C9922A' }}
            >
              {article.category}
            </span>
            <time className="text-gray-300" dateTime={article.date}>
              {formatDate(article.date)}
            </time>
            <span className="text-gray-400">・約 {article.readingMinutes} 分鐘</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold leading-snug">{article.h1}</h1>
          <p className="text-sm text-gray-300 mt-3 md:mt-4">作者：{articleAuthor(article)}</p>
        </div>
      </section>

      {/* 快速摘要（AEO Quick Answer box） */}
      <section className="px-4 py-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div role="note" className="border-l-4 pl-5 py-4 rounded-r-xl bg-[#F0F4FF]" style={{ borderColor: '#0D2B5E' }}>
            <p className="text-xs font-bold text-[#0D2B5E] uppercase tracking-widest mb-1">快速摘要</p>
            <p className="text-gray-800 leading-relaxed text-sm">{article.excerpt}</p>
          </div>
        </div>
      </section>

      {/* Body */}
      <article className="py-10 px-4">
        <div className="max-w-3xl mx-auto">
          {/* 手機專屬早期 CTA。手機平均參與僅 22 秒（約看完摘要就走），
              而文中 CTA 在 50% 處＝手機第 8 屏（全篇 15.6 屏），那群人到不了。
              桌機平均 66 秒、全篇只有 8.1 屏，不需要這個，故 md 以上隱藏。 */}
          <div className="md:hidden">
            <InlineLineCta location="article_top_mobile" variant={ctaVariant} className="!mt-0" />
          </div>
          {article.content.map((block, i) => (
            // Fragment 不產生 DOM 節點，段落間距與原本完全相同
            <Fragment key={i}>
              {i === inlineAt &&
                (embedCalculator ? (
                  <DiscountCalculator
                    compact
                    location="calculator_article"
                    variant={ctaVariant}
                  />
                ) : (
                  <InlineLineCta location="article_inline" variant={ctaVariant} />
                ))}
              {renderBlock(block, i)}
            </Fragment>
          ))}

          {/* 文章 FAQ */}
          {article.faqs && article.faqs.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-bold text-[#0D2B5E] mb-5">常見問題</h2>
              <div className="space-y-3">
                {article.faqs.map((faq, i) => (
                  <details key={i} className="group bg-gray-50 border border-gray-100 rounded-xl overflow-hidden">
                    <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-[#0D2B5E] hover:bg-gray-100 text-sm">
                      {faq.q}
                      <span className="ml-4 text-[#C9922A] group-open:rotate-45 transition-transform shrink-0">+</span>
                    </summary>
                    <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed">{faq.a}</div>
                  </details>
                ))}
              </div>
            </div>
          )}

          {/* 免責 */}
          <div className="mt-10 pt-6 border-t border-gray-100 text-xs text-gray-400 leading-6">
            本文僅供一般資訊參考，不構成任何融資建議。實際條件與費率依個別評估結果為準。
          </div>

          {/* 文末 CTA：LINE 為主、表單為輔（文章頁是全站主要落地點） */}
          <LineCtaBlock location="article_end" variant={ctaVariant} className="mt-10" />
        </div>
      </article>

      {/* 浮動 LINE 鈕：文章頁改用帶 variant 的版本，全站版 FloatingLine 已排除 /articles/<slug> */}
      <FloatingLineButton variant={ctaVariant} />

      {/* Related */}
      {related.length > 0 && (
        <section className="py-14 px-4 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-[#0D2B5E] mb-8 text-center">延伸閱讀</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((post) => (
                <Link
                  key={post.slug}
                  href={`/articles/${post.slug}`}
                  className="flex flex-col bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
                >
                  <span className="text-xs text-[#C9922A] font-medium mb-2">{post.category}</span>
                  <h3 className="font-bold text-[#0D2B5E] mb-2 leading-snug">{post.h1}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed flex-1">{post.excerpt}</p>
                  <span className="text-[#0D2B5E] text-sm font-semibold mt-4">閱讀全文 →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
