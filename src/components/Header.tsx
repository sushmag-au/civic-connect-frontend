'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { label: 'Services', href: '/services' },
    { label: 'News', href: '/news' },
    { label: 'Events', href: '/events' },
    { label: 'Contact', href: '/contact' },
  ]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <header className="site-header">
      {/* Top Bar for Accessibility, Language & Contact */}
      <div className="top-bar">
        <div className="container top-bar-content">
          <div>
            <span>Harborview Country &bull; City of Harborview</span>
          </div>
          <div className="top-bar-links">
            <a href="tel:0352725272" aria-label="Call Council on 03 5272 5272">
              📞 (03) 5272 5272
            </a>
            <span aria-hidden="true">&bull;</span>
            <Link href="/contact">National Relay: 133 677</Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="container">
        <div className="nav-container">
          {/* Logo / Brand */}
          <Link href="/" className="site-brand" aria-label="CivicConnect Home - City of Harborview">
            <div className="brand-crest" aria-hidden="true">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>
            <div className="brand-text">
              <span className="brand-title">CivicConnect</span>
              <span className="brand-subtitle">City of Harborview</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="desktop-nav" aria-label="Main Navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${isActive(item.href) ? 'active' : ''}`}
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/contact" className="btn btn-gold btn-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              Report an Issue
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-panel"
            aria-label={mobileMenuOpen ? 'Close main navigation' : 'Open main navigation'}
          >
            {mobileMenuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <nav id="mobile-nav-panel" className="mobile-nav-panel" aria-label="Mobile Navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`mobile-nav-link ${isActive(item.href) ? 'active' : ''}`}
              aria-current={isActive(item.href) ? 'page' : undefined}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div style={{ marginTop: '0.75rem' }}>
            <Link
              href="/contact"
              className="btn btn-gold"
              style={{ width: '100%' }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Report an Issue
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
