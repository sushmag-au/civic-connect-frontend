import React from 'react'
import type { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'

export const metadata: Metadata = {
  title: 'Contact Council & Report an Issue',
  description:
    'Contact the City of Harborview council customer service centre, report municipal issues, find council addresses, operating hours, and telephone support.',
}

export default function ContactPage() {
  return (
    <div className="section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <p className="section-kicker">We&apos;re Here to Help</p>
          <h1>Contact Us &amp; Report an Issue</h1>
          <p className="section-subtitle">
            Submit a service request, report a civic maintenance problem, or connect with our customer service centre across Harborview.
          </p>
        </div>

        {/* 2-Column Contact Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
            {/* Left: Contact Form */}
            <div>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>
                Online Enquiry Form
              </h2>
              <ContactForm />
            </div>

            {/* Right: Council Contact Info & Map Placeholder */}
            <div>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>
                Council Office &amp; Contact Information
              </h2>

              {/* Main Address Card */}
              <div className="sidebar-card" style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span aria-hidden="true">🏛️</span> Civic Administration Centre
                </h3>
                <address style={{ fontStyle: 'normal', lineHeight: 1.6, color: '#334155', marginBottom: '1rem' }}>
                  <strong>City of Harborview</strong><br />
                  70 City Square Drive (Civic Precinct)<br />
                  Harborview VIC 3220, Australia
                </address>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.925rem' }}>
                  <div>
                    <strong>Phone:</strong>{' '}
                    <a href="tel:0352725272" style={{ fontWeight: 600 }}>(03) 5272 5272</a>
                  </div>
                  <div>
                    <strong>Email:</strong>{' '}
                    <a href="mailto:contactus@geelongcity.vic.gov.au">contactus@geelongcity.vic.gov.au</a>
                  </div>
                  <div>
                    <strong>Postal Address:</strong> PO Box 104, Harborview VIC 3220
                  </div>
                  <div>
                    <strong>Operating Hours:</strong> Monday &ndash; Friday: 8:30am &ndash; 5:00pm
                  </div>
                </div>
              </div>

              {/* Emergency / Out of Hours Card */}
              <div className="sidebar-card" style={{ marginBottom: '1.5rem', background: '#FEF3C7', borderColor: '#FDE68A' }}>
                <h3 style={{ fontSize: '1.1rem', color: '#92400E', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span aria-hidden="true">⚠️</span> Urgent &amp; After-Hours Hazards
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#78350F', margin: 0 }}>
                  For urgent after-hours municipal hazards (such as burst council water pipes, dangerous trees fallen on roadways, or dog attacks), phone our 24/7 emergency dispatch line on <strong>(03) 5272 5272</strong>.
                </p>
              </div>

              {/* Google Maps / Location Visual Card */}
              <div
                style={{
                  background: 'var(--color-white)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div
                  style={{
                    height: '220px',
                    background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-white)',
                    textAlign: 'center',
                    padding: '1.5rem',
                    position: 'relative',
                  }}
                >
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }} aria-hidden="true">
                    📍
                  </div>
                  <strong style={{ fontSize: '1.1rem' }}>Harborview Civic Centre</strong>
                  <span style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
                    70 City Square Drive, Harborview VIC 3220
                  </span>
                  <a
                    href="https://maps.google.com/?q=70+Gheringhap+St+Harborview+VIC+3220"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-gold btn-sm"
                    style={{ marginTop: '1rem' }}
                  >
                    Open in Google Maps &rarr;
                  </a>
                </div>
                <div style={{ padding: '1rem', background: '#F8FAFC', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  Accessible parking bays and tactile ground indicators located at the primary City Square Drive entrance.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
