import React from 'react'
import Link from 'next/link'

export interface ServiceCardProps {
  id: string
  title: string
  summary: string
  category: string
  slug: string
  icon?: string
}

export default function ServiceCard({
  title,
  summary,
  category,
  slug,
  icon = '🏛️',
}: ServiceCardProps) {
  const serviceHref = `/services/${slug}`

  return (
    <article className="card" style={{ height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div className="card-icon-wrapper" aria-hidden="true">
          <span>{icon}</span>
        </div>
        <span className="badge badge-blue">{category}</span>
      </div>

      <h3 className="card-title">
        <Link href={serviceHref} style={{ color: 'inherit', textDecoration: 'none' }}>
          {title}
        </Link>
      </h3>

      <p className="card-summary">{summary}</p>

      <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
        <Link href={serviceHref} className="card-action" aria-label={`View service details for ${title}`}>
          <span>View Service</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </Link>
      </div>
    </article>
  )
}
