import React from 'react'
import type { Metadata } from 'next'
import EventCard from '@/components/EventCard'
import { getEvents, extractSlug } from '@/lib/drupal'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Community Events Calendar',
  description:
    'Explore upcoming civic events, farmers markets, sustainability workshops, and community forums in the City of Harborview.',
}

export default async function EventsPage() {
  const events = await getEvents()

  // Sort events by date ascending (soonest first)
  const sortedEvents = [...events].sort((a, b) => {
    return new Date(a.field_event_date).getTime() - new Date(b.field_event_date).getTime()
  })

  return (
    <div className="section">
      <div className="container">
        <div className="section-header">
          <p className="section-kicker">What&apos;s On Across Harborview</p>
          <h1>Council &amp; Community Events</h1>
          <p className="section-subtitle">
            Connect with your local community. Browse upcoming civic forums, outdoor recreation walks, farmers markets, and council-sponsored events.
          </p>
        </div>

        <div style={{ maxWidth: '850px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {sortedEvents.map((event) => {
            const slug = extractSlug(event.path.alias, event.id)
            return (
              <EventCard
                key={event.id}
                id={event.id}
                title={event.title}
                date={event.field_event_date}
                location={event.field_event_location}
                category={event.field_event_category?.name}
                summary={event.body.summary}
                slug={slug}
              />
            )
          })}
        </div>

        {/* Host an Event Information Box */}
        <div
          style={{
            maxWidth: '850px',
            margin: '3rem auto 0',
            padding: '2rem',
            background: 'var(--color-white)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <h2 style={{ fontSize: '1.25rem' }}>Organising an Event on Public Land?</h2>
          <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
            If you plan to run an event in a Harborview park, foreshore reserve, or closed road, you may require a Council Public Event Permit. Applications should be lodged at least 6 weeks prior to your event date.
          </p>
          <div>
            <a href="mailto:events@geelongcity.vic.gov.au" className="btn btn-secondary btn-sm">
              Contact Council Events Team
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
