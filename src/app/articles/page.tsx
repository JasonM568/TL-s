import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllArticles } from '@/lib/articles'
import { SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: '知識專欄 | 支票貼現・支票貸款實用指南',
  description:
    '泰誠企業融資知識專欄，提供支票貼現利率計算、申請文件、票據風險與企業資金周轉等實用文章，協助中小企業做出更好的融資決策。',
  keywords: ['支票貼現知識', '票貼教學', '企業融資文章', '支票貸款指南', '資金周轉'],
  alternates: { canonical: `${SITE_URL}/articles` },
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${y} 年 ${Number(m)} 月 ${Number(d)} 日`
}

export default function ArticlesPage() {
  const posts = getAllArticles()

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
            hasPart: posts.map((p) => ({
              '@type': 'Article',
              headline: p.h1,
              url: `${SITE_URL}/articles/${p.slug}`,
              datePublished: p.date,
            })),
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
        </div>
      </section>

      {/* Article list */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
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
