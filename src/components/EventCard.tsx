import React from 'react'
import Link from 'next/link'

export interface EventCardProps {
  id: string
  title: string
  date: string
  location?: string
  category?: string
  summary?: string
  slug?: string
}

function parseDatePill(dateString: string): { day: string; month: string } {
  try {
    const d = new Date(dateString)
    const day = d.getDate().toString().padStart(2, '0')
    const month = d.toLocaleDateString('en-AU', { month: 'short' }).toUpperCase()
    return { day, month }
  } catch {
    return { day: '15', month: 'OCT' }
  }
}

export default function EventCard({
  title,
  date,
  location = 'City of Greater Geelong',
  category = 'Civic Event',
  summary,
  slug,
}: EventCardProps) {
  const { day, month } = parseDatePill(date)
  const eventHref = slug ? `/events#${slug}` : '/events'

  return (
    <article className="event-card">
      {/* Visual Date Pill */}
      <div className="event-date-pill" aria-hidden="true">
        <span className="event-date-day">{day}</span>
        <span className="event-date-month">{month}</span>
      </div>

      <div className="event-details" style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <span className="badge badge-outline" style={{ fontSize: '0.725rem' }}>
            {category}
          </span>
        </div>

        <h3 className="event-title">
          <Link href={eventHref} style={{ color: 'inherit', textDecoration: 'none' }}>
            {title}
          </Link>
        </h3>

        {summary && (
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
            {summary}
          </p>
        )}

        <div className="event-location">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span>{location}</span>
        </div>
      </div>
    </article>
  )
}
