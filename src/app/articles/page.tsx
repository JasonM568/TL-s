import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllArticles } from '@/lib/articles'
import { SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: '知識專欄 | 支票貼現・支票貸款實用指南',
  description:
    '黃璽理財管理顧問知識專欄，提供支票貼現利率計算、申請文件、票據風險與企業資金周轉等實用文章，協助中小企業做出更好的融資決策。',
  keywords: ['支票貼現知識', '票貼教學', '企業融資文章', '支票貸款指南', '資金周轉'],
  alternates: { canonical: `${SITE_URL}/articles` },
}

const PER_PAGE = 12

// Category display order
const CATEGORY_ORDER = [
  '支票貼現',
  '支票貸款',
  '企業融資',
  '費率與成本',
  '申請教學',
  '票據知識',
  '風險管理',
  '知識入門',
]

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${y} 年 ${Number(m)} 月 ${Number(d)} 日`
}

function buildHref(page: number, category: string | null): string {
  const params = new URLSearchParams()
  if (category) params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const qs = params.toString()
  return `/articles${qs ? `?${qs}` : ''}`
}

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>
}) {
  const { page: pageParam, category: categoryParam } = await searchParams
  const allPosts = getAllArticles()

  // Collect unique categories in display order
  const categorySet = new Set(allPosts.map((p) => p.category))
  const categories = CATEGORY_ORDER.filter((c) => categorySet.has(c))

  // Validate & apply category filter
  const activeCategory = categoryParam && categories.includes(categoryParam) ? categoryParam : null
  const filteredPosts = activeCategory ? allPosts.filter((p) => p.category === activeCategory) : allPosts

  const totalPages = Math.ceil(filteredPosts.length / PER_PAGE) || 1
  const currentPage = Math.min(Math.max(Number(pageParam) || 1, 1), totalPages)
  const posts = filteredPosts.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)

  // Page range: show at most 5 page numbers centred on current
  const pageRange: number[] = []
  const rangeStart = Math.max(1, currentPage - 2)
  const rangeEnd = Math.min(totalPages, currentPage + 2)
  for (let i = rangeStart; i <= rangeEnd; i++) pageRange.push(i)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: '知識專欄',
            url: `${SITE_URL}/articles`,
            description: '支票貼現、支票貸款與企業融資的實用知識文章，協助中小企業做出更好的融資決策。',
            inLanguage: 'zh-TW',
            publisher: { '@type': 'Organization', '@id': `${SITE_URL}/#organization` },
            hasPart: allPosts.map((p) => ({
              '@type': 'Article',
              headline: p.h1,
              description: p.excerpt,
              url: `${SITE_URL}/articles/${p.slug}`,
              datePublished: p.date,
              dateModified: p.date,
              inLanguage: 'zh-TW',
              author: {
                '@type': 'Person',
                '@id': `${SITE_URL}/#author-${p.author === '理財顧問 張揚' ? 'zhang-yang' : 'li-cheng-xin'}`,
                name: p.author ?? '理財顧問 李誠信',
              },
              publisher: { '@type': 'Organization', '@id': `${SITE_URL}/#organization` },
            })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: '知識專欄文章列表',
            url: `${SITE_URL}/articles`,
            numberOfItems: allPosts.length,
            itemListElement: allPosts.map((p, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: p.h1,
              description: p.excerpt,
              url: `${SITE_URL}/articles/${p.slug}`,
            })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: '首頁', item: SITE_URL },
              { '@type': 'ListItem', position: 2, name: '知識專欄', item: `${SITE_URL}/articles` },
            ],
          }),
        }}
      />

      {/* Hero */}
      <section style={{ backgroundColor: '#0D2B5E' }} className="text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <nav className="text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-white">首頁</Link>
            <span className="mx-2">/</span>
            <span className="text-white">知識專欄</span>
          </nav>
          <h1 className="text-4xl font-bold mb-4">知識專欄</h1>
          <p className="text-gray-300 text-lg max-w-2xl">
            支票貼現、支票貸款與企業資金周轉的實用知識，
            幫助您在申請前先搞懂費率、文件與風險。
          </p>
          <p className="text-gray-400 text-sm mt-3">共 {allPosts.length} 篇文章</p>
        </div>
      </section>

      {/* Category filter tabs */}
      <section className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm px-4 py-3">
        <div className="max-w-5xl mx-auto overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            <Link
              href="/articles"
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                !activeCategory
                  ? 'text-white'
                  : 'border border-gray-200 text-gray-600 hover:border-[#0D2B5E] hover:text-[#0D2B5E]'
              }`}
              style={!activeCategory ? { backgroundColor: '#0D2B5E' } : undefined}
            >
              全部 ({allPosts.length})
            </Link>
            {categories.map((cat) => {
              const count = allPosts.filter((p) => p.category === cat).length
              const isActive = activeCategory === cat
              return (
                <Link
                  key={cat}
                  href={buildHref(1, cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? 'text-white'
                      : 'border border-gray-200 text-gray-600 hover:border-[#C9922A] hover:text-[#C9922A]'
                  }`}
                  style={isActive ? { backgroundColor: '#C9922A' } : undefined}
                  aria-current={isActive ? 'true' : undefined}
                >
                  {cat} ({count})
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Article list */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          {activeCategory && (
            <p className="text-sm text-gray-500 mb-6">
              顯示「<span className="font-semibold text-[#0D2B5E]">{activeCategory}</span>」分類，共 {filteredPosts.length} 篇
            </p>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="flex flex-col bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <Link href={`/articles/${post.slug}`} className="flex flex-col h-full p-6">
                  <div className="flex items-center gap-3 mb-3 text-xs">
                    <span
                      className="px-3 py-1 rounded-full font-medium text-white"
                      style={{ backgroundColor: '#C9922A' }}
                    >
                      {post.category}
                    </span>
                    <span className="text-gray-400">閱讀時間 約 {post.readingMinutes} 分鐘</span>
                  </div>
                  <h2 className="text-lg font-bold text-[#0D2B5E] mb-2 leading-snug">
                    {post.h1}
                  </h2>
                  <p className="text-gray-500 text-sm leading-relaxed flex-1">{post.excerpt}</p>
                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-50">
                    <time className="text-xs text-gray-400" dateTime={post.date}>
                      {formatDate(post.date)}
                    </time>
                    <span className="text-[#0D2B5E] text-sm font-semibold">閱讀全文 →</span>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav aria-label="文章分頁" className="flex items-center justify-center gap-2 mt-12">
              {currentPage > 1 && (
                <Link
                  href={buildHref(currentPage - 1, activeCategory)}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-[#0D2B5E] hover:bg-gray-50 transition-colors"
                >
                  ← 上一頁
                </Link>
              )}

              {rangeStart > 1 && (
                <>
                  <Link href={buildHref(1, activeCategory)} className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-[#0D2B5E] hover:bg-gray-50 transition-colors">1</Link>
                  {rangeStart > 2 && <span className="px-2 text-gray-400">…</span>}
                </>
              )}

              {pageRange.map((p) => (
                <Link
                  key={p}
                  href={buildHref(p, activeCategory)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    p === currentPage
                      ? 'text-white'
                      : 'border border-gray-200 text-[#0D2B5E] hover:bg-gray-50'
                  }`}
                  style={p === currentPage ? { backgroundColor: '#0D2B5E' } : undefined}
                  aria-current={p === currentPage ? 'page' : undefined}
                >
                  {p}
                </Link>
              ))}

              {rangeEnd < totalPages && (
                <>
                  {rangeEnd < totalPages - 1 && <span className="px-2 text-gray-400">…</span>}
                  <Link href={buildHref(totalPages, activeCategory)} className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-[#0D2B5E] hover:bg-gray-50 transition-colors">{totalPages}</Link>
                </>
              )}

              {currentPage < totalPages && (
                <Link
                  href={buildHref(currentPage + 1, activeCategory)}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-[#0D2B5E] hover:bg-gray-50 transition-colors"
                >
                  下一頁 →
                </Link>
              )}
            </nav>
          )}

          <p className="text-center text-xs text-gray-400 mt-4">
            第 {currentPage} 頁，共 {totalPages} 頁（{filteredPosts.length} 篇文章）
          </p>
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: '#0D2B5E' }} className="py-16 px-4 text-white text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">有資金周轉需求？</h2>
          <p className="text-gray-300 mb-8">看完文章仍有疑問，歡迎免費諮詢，專業顧問為您說明</p>
          <Link
            href="/contact"
            className="inline-block px-10 py-4 rounded font-bold text-white text-lg transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#C9922A' }}
          >
            免費諮詢
          </Link>
        </div>
      </section>
    </>
  )
}
