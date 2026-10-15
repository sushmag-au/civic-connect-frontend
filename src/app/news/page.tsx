import React from 'react'
import type { Metadata } from 'next'
import NewsCard from '@/components/NewsCard'
import { getNewsArticles, extractSlug } from '@/lib/drupal'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Council News & Media Releases',
  description:
    'Official news releases, infrastructure milestones, sustainability announcements, and community updates from the City of Greater Geelong.',
}

export default async function NewsListingPage() {
  const articles = await getNewsArticles()

  return (
    <div className="section">
      <div className="container">
        <div className="section-header">
          <p className="section-kicker">Media &amp; Public Affairs</p>
          <h1>Council News &amp; Announcements</h1>
          <p className="section-subtitle">
            Stay up to date with major regional projects, council decisions, public notices, and sustainability initiatives across Greater Geelong.
          </p>
        </div>

        <div className="grid-3">
          {articles.map((article) => {
            const slug = extractSlug(article.path.alias, article.id)
            return (
              <NewsCard
                key={article.id}
                id={article.id}
                title={article.title}
                summary={article.body.summary}
                category={article.field_news_category?.name}
                date={article.created}
                slug={slug}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
