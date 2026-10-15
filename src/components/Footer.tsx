import React from 'react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Column 1: About */}
          <div className="footer-col">
            <h2>CivicConnect Portal</h2>
            <p style={{ marginBottom: '1rem' }}>
              The official digital services platform for the City of Harborview, delivering seamless access to municipal services, community programs, and local government decision-making.
            </p>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
              The City of Harborview acknowledges Wadawurrung Traditional Owners of this land and all Aboriginal and Torres Strait Islander Peoples who live and work here today.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-col">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li>
                <Link href="/services">Council Services Directory</Link>
              </li>
              <li>
                <Link href="/news">Latest News & Media Releases</Link>
              </li>
              <li>
                <Link href="/events">Upcoming Community Events</Link>
              </li>
              <li>
                <Link href="/contact">Report an Issue / Contact Us</Link>
              </li>
              <li>
                <Link href="/services/waste-and-recycling">Bin Collection Schedules</Link>
              </li>
              <li>
                <Link href="/services/rates-and-valuations">Pay Rates Online</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Information */}
          <div className="footer-col">
            <h3>Customer Service Centre</h3>
            <p style={{ marginBottom: '0.5rem' }}>
              <strong>City of Harborview</strong><br />
              Wurriki Nyal, 137-149 Mercer Street<br />
              Harborview VIC 3220, Australia
            </p>
            <p style={{ marginBottom: '0.5rem' }}>
              <strong>Phone:</strong> <a href="tel:0352725272" style={{ color: '#93C5FD' }}>(03) 5272 5272</a><br />
              <strong>Hours:</strong> Mon &ndash; Fri: 8:30am &ndash; 5:00pm
            </p>
            <p>
              <strong>Email:</strong> <a href="mailto:contactus@geelongcity.vic.gov.au" style={{ color: '#93C5FD' }}>contactus@geelongcity.vic.gov.au</a>
            </p>
          </div>
        </div>

        {/* Footer Bottom Bar with Badges */}
        <div className="footer-bottom">
          <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: 0 }}>
            &copy; {new Date().getFullYear()} City of Harborview. Built with Next.js 14 and Drupal 11.
          </p>

          <div className="footer-badges" aria-label="Certifications and Architecture">
            <span className="footer-badge-pill" title="Web Content Accessibility Guidelines 2.1 Level AA">
              <span aria-hidden="true">♿</span> WCAG 2.1 AA Compliant
            </span>
            <span className="footer-badge-pill" title="Headless CMS Backend">
              <span aria-hidden="true">💧</span> Powered by Drupal 11 JSON:API
            </span>
            <span className="footer-badge-pill" title="React Server Components & ISR">
              <span aria-hidden="true">⚡</span> Next.js 14 App Router
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
