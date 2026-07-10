import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllArticles, getArticleBySlug, getAllSlugs, articleAuthor } from '@/lib/articles-source'
import { SITE_URL, SITE_NAME } from '@/lib/site'
import ArticleView from './ArticleView'

// ISR + 動態參數：DB 排程文章到點後首次造訪即時渲染（免重新部署）
export const revalidate = 120
export const dynamicParams = true

// 靜態產生所有（目前可見的）文章頁
export async function generateStaticParams() {
  return (await getAllSlugs()).map((slug) => ({ slug }))
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
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

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) notFound()

  const url = `${SITE_URL}/articles/${article.slug}`
  // 相關文章：同分類優先，補到 3 篇
  const related = (await getAllArticles())
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
    author: {
      '@type': 'Person',
      '@id': `https://huangxi.tw/#author-${articleAuthor(article) === '理財顧問 張揚' ? 'zhang-yang' : 'li-cheng-xin'}`,
      name: articleAuthor(article),
    },
    publisher: { '@type': 'Organization', '@id': 'https://huangxi.tw/#organization', name: SITE_NAME },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  }

  const faqJsonLd = article.faqs && article.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: article.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  } : null

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
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      <ArticleView article={article} related={related} />
    </>
  )
}
