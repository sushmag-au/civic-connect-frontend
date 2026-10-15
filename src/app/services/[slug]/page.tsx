import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getServices, getService, extractSlug } from '@/lib/drupal'

interface ServicePageProps {
  params: {
    slug: string
  }
}

export const revalidate = 60

export async function generateStaticParams() {
  const services = await getServices()
  return services.map((service) => ({
    slug: extractSlug(service.path.alias, service.id),
  }))
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const service = await getService(params.slug)

  if (!service) {
    return {
      title: 'Service Not Found',
      description: 'The requested council service could not be located.',
    }
  }

  return {
    title: service.title,
    description: service.body.summary,
    openGraph: {
      title: `${service.title} — City of Greater Geelong`,
      description: service.body.summary,
      type: 'article',
    },
  }
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const service = await getService(params.slug)

  if (!service) {
    notFound()
  }

  const allServices = await getServices()
  const relatedServices = allServices
    .filter((s) => s.id !== service.id)
    .slice(0, 3)

  const updatedDate = new Date(service.changed).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <>
      {/* Full-width Service Hero */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0F2347 0%, #1B3A6B 100%)',
          color: 'var(--color-white)',
          padding: '3.5rem 0',
          borderBottom: '4px solid var(--color-accent)',
        }}
        aria-labelledby="service-title"
      >
        <div className="container">
          <nav aria-label="Breadcrumb" style={{ marginBottom: '1.25rem' }}>
            <ol style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0, gap: '0.5rem', fontSize: '0.85rem' }}>
              <li>
                <Link href="/" style={{ color: '#CBD5E1' }}>Home</Link>
              </li>
              <li style={{ color: '#94A3B8' }}>/</li>
              <li>
                <Link href="/services" style={{ color: '#CBD5E1' }}>Services</Link>
              </li>
              <li style={{ color: '#94A3B8' }}>/</li>
              <li style={{ color: 'var(--color-white)', fontWeight: 600 }} aria-current="page">
                {service.title}
              </li>
            </ol>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '2rem' }} aria-hidden="true">
              {service.field_service_icon || '🏛️'}
            </span>
            <span className="badge badge-gold">
              {service.field_service_category.name}
            </span>
          </div>

          <h1 id="service-title" style={{ color: 'var(--color-white)', fontSize: '2.5rem', maxWidth: '850px', marginBottom: '1rem' }}>
            {service.title}
          </h1>

          <p style={{ color: '#E2E8F0', fontSize: '1.2rem', maxWidth: '750px', margin: 0 }}>
            {service.body.summary}
          </p>
        </div>
      </section>

      {/* Main Content & Sidebar Layout */}
      <div className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr',
                  gap: '2.5rem',
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
                  {/* Article Body Content */}
                  <article style={{ minWidth: 0 }}>
                    <div
                      className="article-content"
                      dangerouslySetInnerHTML={{ __html: service.body.value }}
                    />

                    {/* Feedback Callout Box */}
                    <div
                      style={{
                        marginTop: '3rem',
                        padding: '1.5rem',
                        borderRadius: 'var(--radius-lg)',
                        background: '#F1F5F9',
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      <h4 style={{ marginBottom: '0.35rem' }}>Did this service information help?</h4>
                      <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                        The City of Greater Geelong is continually enhancing digital accessibility and municipal services.
                      </p>
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <Link href="/contact" className="btn btn-sm btn-secondary">
                          Submit Service Feedback
                        </Link>
                        <Link href="/contact" className="btn btn-sm btn-primary">
                          Report an Issue Online
                        </Link>
                      </div>
                    </div>
                  </article>

                  {/* Sidebar */}
                  <aside aria-label="Service Details and Related Information" style={{ maxWidth: '380px', width: '100%', justifySelf: 'end' }}>
                    {/* Metadata Card */}
                    <div className="sidebar-card">
                      <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
                        Service Information
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem' }}>
                        <div>
                          <strong style={{ display: 'block', color: 'var(--color-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                            Council Department
                          </strong>
                          <span>{service.field_service_category.name}</span>
                        </div>
                        <div>
                          <strong style={{ display: 'block', color: 'var(--color-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                            Last Reviewed
                          </strong>
                          <span>{updatedDate}</span>
                        </div>
                        <div>
                          <strong style={{ display: 'block', color: 'var(--color-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                            Service Channel
                          </strong>
                          <span>Online 24/7 &bull; In-Person &bull; Phone</span>
                        </div>
                        <div>
                          <strong style={{ display: 'block', color: 'var(--color-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                            Direct Assistance
                          </strong>
                          <a href="tel:0352725272" style={{ fontWeight: 600 }}>(03) 5272 5272</a>
                        </div>
                      </div>
                    </div>

                    {/* Related Services Card */}
                    <div className="sidebar-card">
                      <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
                        Related Council Services
                      </h3>
                      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                        {relatedServices.map((rel) => {
                          const relSlug = extractSlug(rel.path.alias, rel.id)
                          return (
                            <li key={rel.id} style={{ marginBottom: '0.85rem' }}>
                              <Link
                                href={`/services/${relSlug}`}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.5rem',
                                  fontWeight: 600,
                                  fontSize: '0.925rem',
                                  color: 'var(--color-primary)',
                                }}
                              >
                                <span>{rel.field_service_icon || '📄'}</span>
                                <span>{rel.title}</span>
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                      <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
                        <Link href="/services" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                          &larr; Back to all Services
                        </Link>
                      </div>
                    </div>
                  </aside>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
