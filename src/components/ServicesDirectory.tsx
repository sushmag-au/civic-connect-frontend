'use client'

import React, { useState, useMemo } from 'react'
import ServiceCard from '@/components/ServiceCard'
import { DrupalService, extractSlug } from '@/lib/drupal'

interface ServicesDirectoryProps {
  initialServices: DrupalService[]
}

export default function ServicesDirectory({ initialServices }: ServicesDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  // Derive unique categories
  const categories = useMemo(() => {
    const set = new Set<string>()
    initialServices.forEach((s) => {
      if (s.field_service_category?.name) {
        set.add(s.field_service_category.name)
      }
    })
    return ['All', ...Array.from(set)]
  }, [initialServices])

  // Filter services by category and search term
  const filteredServices = useMemo(() => {
    return initialServices.filter((service) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        service.field_service_category?.name === selectedCategory

      const query = searchQuery.toLowerCase().trim()
      const matchesSearch =
        query === '' ||
        service.title.toLowerCase().includes(query) ||
        service.body.summary.toLowerCase().includes(query) ||
        service.field_service_category?.name.toLowerCase().includes(query)

      return matchesCategory && matchesSearch
    })
  }, [initialServices, selectedCategory, searchQuery])

  return (
    <div>
      {/* Search and Filter Toolbar */}
      <div
        style={{
          background: 'var(--color-white)',
          padding: '1.5rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '2.5rem',
        }}
        role="search"
        aria-label="Filter council services"
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
          {/* Search Input */}
          <div>
            <label htmlFor="service-search" className="form-label">
              Search Council Services
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="service-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by keyword (e.g. recycling, planning, pet, rates, trees)..."
                className="form-input"
                style={{ paddingLeft: '2.75rem' }}
              />
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-muted)',
                }}
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div>
            <span id="category-filter-label" className="form-label">
              Filter by Category
            </span>
            <div
              role="group"
              aria-labelledby="category-filter-label"
              style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}
            >
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                    aria-pressed={isSelected}
                    style={{
                      borderRadius: 'var(--radius-full)',
                      padding: '0.4rem 1rem',
                      fontSize: '0.85rem',
                    }}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Results Count & Reset */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '1.25rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--color-border)',
            fontSize: '0.875rem',
            color: 'var(--color-text-muted)',
          }}
        >
          <span>
            Showing <strong>{filteredServices.length}</strong> of{' '}
            <strong>{initialServices.length}</strong> services
          </span>
          {(searchQuery !== '' || selectedCategory !== 'All') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('All')
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-accent)',
                cursor: 'pointer',
                fontWeight: 600,
                padding: '0.25rem 0.5rem',
              }}
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length > 0 ? (
        <div className="grid-3">
          {filteredServices.map((service) => {
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
      ) : (
        <div
          style={{
            background: 'var(--color-white)',
            border: '1px dashed var(--color-border-dark)',
            borderRadius: 'var(--radius-lg)',
            padding: '3.5rem 1.5rem',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }} aria-hidden="true">
            🔍
          </div>
          <h2 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>No Services Found</h2>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '450px', margin: '0 auto 1.5rem' }}>
            We could not find any services matching &ldquo;{searchQuery}&rdquo;. Try using different terms or resetting your category filter.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setSearchQuery('')
              setSelectedCategory('All')
            }}
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  )
}
