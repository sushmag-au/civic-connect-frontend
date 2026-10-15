import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getNewsArticles, getNewsArticle, extractSlug } from '@/lib/drupal'

interface NewsPageProps {
  params: {
    slug: string
  }
}

export const revalidate = 60

export async function generateStaticParams() {
  const articles = await getNewsArticles()
  return articles.map((article) => ({
    slug: extractSlug(article.path.alias, article.id),
  }))
}

export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
  const article = await getNewsArticle(params.slug)

  if (!article) {
    return {
      title: 'Article Not Found',
      description: 'The requested news announcement could not be found.',
    }
  }

  return {
    title: article.title,
    description: article.body.summary,
    openGraph: {
      title: `${article.title} — Geelong Council News`,
      description: article.body.summary,
      type: 'article',
      publishedTime: article.created,
    },
  }
}

export default async function NewsDetailPage({ params }: NewsPageProps) {
  const article = await getNewsArticle(params.slug)

  if (!article) {
    notFound()
  }

  const allArticles = await getNewsArticles()
  const recentArticles = allArticles
    .filter((a) => a.id !== article.id)
    .slice(0, 3)

  const publishedDate = new Date(article.created).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <>
      <section
        style={{
          background: 'linear-gradient(135deg, #0F2347 0%, #1B3A6B 100%)',
          color: 'var(--color-white)',
          padding: '3.5rem 0',
          borderBottom: '4px solid var(--color-gold)',
        }}
        aria-labelledby="article-title"
      >
        <div className="container">
          <nav aria-label="Breadcrumb" style={{ marginBottom: '1.25rem' }}>
            <ol style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0, gap: '0.5rem', fontSize: '0.85rem' }}>
              <li>
                <Link href="/" style={{ color: '#CBD5E1' }}>Home</Link>
              </li>
              <li style={{ color: '#94A3B8' }}>/</li>
              <li>
                <Link href="/news" style={{ color: '#CBD5E1' }}>News</Link>
              </li>
              <li style={{ color: '#94A3B8' }}>/</li>
              <li style={{ color: 'var(--color-white)', fontWeight: 600 }} aria-current="page">
                {article.title}
              </li>
            </ol>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <span className="badge badge-gold">
              {article.field_news_category?.name || 'Council News'}
            </span>
            <time dateTime={article.created} style={{ color: '#CBD5E1', fontSize: '0.875rem' }}>
              Published: {publishedDate}
            </time>
          </div>

          <h1 id="article-title" style={{ color: 'var(--color-white)', fontSize: '2.4rem', maxWidth: '850px', marginBottom: '1rem' }}>
            {article.title}
          </h1>

          <p style={{ color: '#E2E8F0', fontSize: '1.15rem', maxWidth: '750px', margin: 0 }}>
            {article.body.summary}
          </p>
        </div>
      </section>

      <div className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
            <article style={{ minWidth: 0 }}>
              <div
                className="article-content"
                dangerouslySetInnerHTML={{ __html: article.body.value }}
              />

              <div
                style={{
                  marginTop: '3rem',
                  paddingTop: '1.5rem',
                  borderTop: '1px solid var(--color-border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <Link href="/news" className="btn btn-secondary btn-sm">
                  &larr; Back to all News Releases
                </Link>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  Media enquiries: media@geelongcity.vic.gov.au
                </span>
              </div>
            </article>

            {/* Sidebar for other news */}
            <aside aria-label="Other Recent Announcements" style={{ maxWidth: '380px', width: '100%', justifySelf: 'end' }}>
              <div className="sidebar-card">
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
                  More Council News
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {recentArticles.map((item) => {
                    const itemSlug = extractSlug(item.path.alias, item.id)
                    const itemDate = new Date(item.created).toLocaleDateString('en-AU', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })
                    return (
                      <div key={item.id}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                          {itemDate} &bull; {item.field_news_category?.name}
                        </span>
                        <Link
                          href={`/news/${itemSlug}`}
                          style={{
                            fontWeight: 600,
                            fontSize: '0.925rem',
                            color: 'var(--color-primary)',
                            lineHeight: 1.3,
                            display: 'block',
                          }}
                        >
                          {item.title}
                        </Link>
                      </div>
                    )
                  })}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}
