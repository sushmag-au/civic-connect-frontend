import React from 'react'
import Link from 'next/link'
import ServiceCard from '@/components/ServiceCard'
import NewsCard from '@/components/NewsCard'
import EventCard from '@/components/EventCard'
import { getServices, getNewsArticles, getEvents, extractSlug } from '@/lib/drupal'

export const revalidate = 60 // ISR: Revalidate page every 60 seconds

export default async function HomePage() {
  const [services, newsArticles, events] = await Promise.all([
    getServices(),
    getNewsArticles(),
    getEvents(),
  ])

  // Display top 6 services and top 3 news items on homepage
  const featuredServices = services.slice(0, 6)
  const featuredNews = newsArticles.slice(0, 3)
  const upcomingEvents = events.slice(0, 3)

  return (
    <>
      {/* 1. Hero Section */}
      <section className="hero-section" aria-labelledby="hero-heading">
        <div className="hero-pattern" aria-hidden="true" />
        <div className="container">
          <div className="hero-content">
            <div className="hero-kicker">
              <span aria-hidden="true">🏛️</span>
              Official Digital Portal &bull; City of Harborview
            </div>

            <h1 id="hero-heading" className="hero-title">
              Welcome to CivicConnect
            </h1>

            <p className="hero-subtitle">
              Your digital gateway to City of Harborview council services, community programs, rates, waste management, and civic notices.
            </p>

            <div className="hero-actions">
              <Link href="/services" className="btn btn-primary" style={{ backgroundColor: '#0057A8', borderColor: '#0057A8' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                Explore Services
              </Link>
              <Link href="/news" className="btn btn-ghost">
                Latest News &amp; Updates
              </Link>
            </div>

            {/* Stats Row */}
            <div className="hero-stats" role="region" aria-label="Key Harborview Statistics">
              <div className="stat-item">
                <span className="stat-number">150+</span>
                <span className="stat-label">Council Services</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">240K+</span>
                <span className="stat-label">Residents Served</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Online Access</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Council Services Grid */}
      <section className="section" aria-labelledby="services-heading">
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', gap: '1rem' }}>
            <div>
              <p className="section-kicker">Digital Municipal Services</p>
              <h2 id="services-heading" style={{ marginBottom: '0.25rem' }}>Council Services</h2>
              <p className="section-subtitle">
                Access self-service council operations online anytime from waste collections to building permits.
              </p>
            </div>
            <div>
              <Link href="/services" className="btn btn-secondary">
                View All Services &rarr;
              </Link>
            </div>
          </div>

          <div className="grid-3">
            {featuredServices.map((service) => {
              const slug = extractSlug(service.path.alias, service.id)
              return (
                <ServiceCard
                  key={service.id}
                  id={service.id}
                  title={service.title}
                  summary={service.body.summary}
                  category={service.field_service_category.name}
                  slug={slug}
                  icon={service.field_service_icon}
                />
              )
            })}
          </div>
        </div>
      </section>

      {/* 3. Latest News Grid */}
      <section className="section section-alt" aria-labelledby="news-heading">
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', gap: '1rem' }}>
            <div>
              <p className="section-kicker">Council Announcements</p>
              <h2 id="news-heading" style={{ marginBottom: '0.25rem' }}>Latest News &amp; Media Releases</h2>
              <p className="section-subtitle">
                Stay informed with the latest project updates, policy decisions, and community initiatives across Harborview.
              </p>
            </div>
            <div>
              <Link href="/news" className="btn btn-secondary">
                View All News &rarr;
              </Link>
            </div>
          </div>

          <div className="grid-3">
            {featuredNews.map((article) => {
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
      </section>

      {/* 4. Upcoming Events */}
      <section className="section" aria-labelledby="events-heading">
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem', gap: '1rem' }}>
            <div>
              <p className="section-kicker">What&apos;s On in Harborview</p>
              <h2 id="events-heading" style={{ marginBottom: '0.25rem' }}>Upcoming Civic &amp; Community Events</h2>
              <p className="section-subtitle">
                Discover workshops, local farmers markets, environmental walks, and civic forums happening near you.
              </p>
            </div>
            <div>
              <Link href="/events" className="btn btn-secondary">
                Full Events Calendar &rarr;
              </Link>
            </div>
          </div>

          <div className="grid-3">
            {upcomingEvents.map((event) => {
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
        </div>
      </section>

      {/* 5. CTA Help Banner */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="cta-banner">
            <div>
              <h2 style={{ fontSize: '1.85rem' }}>Need Help or Have a Question?</h2>
              <p>
                Our Harborview-based customer care and digital services teams are ready to support your enquiries, application submissions, or maintenance requests.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/contact" className="btn btn-gold">
                Get in Touch
              </Link>
              <a href="tel:0352725272" className="btn btn-ghost" style={{ border: '1px solid rgba(255,255,255,0.4)' }}>
                Call (03) 5272 5272
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
