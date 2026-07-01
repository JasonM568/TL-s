import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllArticles, getArticleBySlug, getAllSlugs, articleAuthor, type Block } from '@/lib/articles'
import { SITE_URL, SITE_NAME } from '@/lib/site'

// 靜態產生所有文章頁
export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) return {}

  const url = `${SITE_URL}/articles/${article.slug}`
  return {
    title: article.title,
    description: article.description,
    keywords: article.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.description,
      url,
      publishedTime: article.date,
      modifiedTime: article.updated ?? article.date,
    },
  }
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${y} 年 ${Number(m)} 月 ${Number(d)} 日`
}

function renderBlock(block: Block, i: number) {
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
        <p key={i} className="text-gray-700 leading-8 mb-5">
          {block.text}
        </p>
      )
    case 'ul':
      return (
        <ul key={i} className="list-disc pl-6 mb-6 space-y-2 text-gray-700 leading-7">
          {block.items.map((item, j) => (
            <li key={j}>{item}</li>
          ))}
        </ul>
      )
    case 'ol':
      return (
        <ol key={i} className="list-decimal pl-6 mb-6 space-y-2 text-gray-700 leading-7">
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
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) notFound()

  const url = `${SITE_URL}/articles/${article.slug}`
  // 相關文章：同分類優先，補到 3 篇
  const related = getAllArticles()
    .filter((a) => a.slug !== article.slug)
    .sort((a) => (a.category === article.category ? -1 : 1))
    .slice(0, 3)

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.h1,
    description: article.description,
    keywords: article.keywords.join(', '),
    datePublished: article.date,
    dateModified: article.updated ?? article.date,
    author: { '@type': 'Person', name: articleAuthor(article) },
    publisher: { '@type': 'Organization', name: SITE_NAME },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '首頁', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: '知識專欄', item: `${SITE_URL}/articles` },
      { '@type': 'ListItem', position: 3, name: article.h1, item: url },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Hero */}
      <section style={{ backgroundColor: '#0D2B5E' }} className="text-white py-14 px-4">
        <div className="max-w-3xl mx-auto">
          <nav className="text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-white">首頁</Link>
            <span className="mx-2">/</span>
            <Link href="/articles" className="hover:text-white">知識專欄</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{article.category}</span>
          </nav>
          <div className="flex items-center gap-3 mb-4 text-xs">
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
          <p className="text-sm text-gray-300 mt-4">作者：{articleAuthor(article)}</p>
        </div>
      </section>

      {/* Body */}
      <article className="py-14 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-lg text-gray-500 leading-8 mb-8 pb-8 border-b border-gray-100">
            {article.excerpt}
          </p>
          {article.content.map(renderBlock)}

          {/* 免責 */}
          <div className="mt-10 pt-6 border-t border-gray-100 text-xs text-gray-400 leading-6">
            本文僅供一般資訊參考，不構成任何融資建議。實際條件與費率依個別評估結果為準。
          </div>

          {/* 文末 CTA */}
          <div
            className="mt-10 rounded-xl p-8 text-center text-white"
            style={{ backgroundColor: '#0D2B5E' }}
          >
            <h2 className="text-xl font-bold mb-3">需要進一步的協助嗎？</h2>
            <p className="text-gray-300 text-sm mb-6">
              提供免費初步評估，專業顧問一對一為您說明最適合的方案
            </p>
            <Link
              href="/contact"
              className="inline-block px-8 py-3 rounded font-bold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#C9922A' }}
            >
              免費諮詢
            </Link>
          </div>
        </div>
      </article>

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
