import React from 'react'
import Link from 'next/link'

export interface NewsCardProps {
  id: string
  title: string
  summary: string
  category?: string
  date: string
  slug: string
}

function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString)
    return d.toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return dateString
  }
}

export default function NewsCard({
  title,
  summary,
  category = 'Council News',
  date,
  slug,
}: NewsCardProps) {
  const newsHref = `/news/${slug}`
  const formattedDate = formatDate(date)

  return (
    <article className="card" style={{ height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <time dateTime={date} style={{ fontSize: '0.825rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
          {formattedDate}
        </time>
        <span className="badge badge-gold">{category}</span>
      </div>

      <h3 className="card-title" style={{ fontSize: '1.25rem', lineHeight: '1.3' }}>
        <Link href={newsHref} style={{ color: 'inherit', textDecoration: 'none' }}>
          {title}
        </Link>
      </h3>

      <p className="card-summary">{summary}</p>

      <div style={{ marginTop: 'auto', paddingTop: '0.75rem' }}>
        <Link href={newsHref} className="card-action" aria-label={`Read article: ${title}`}>
          <span>Read Full Story</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </Link>
      </div>
    </article>
  )
}
