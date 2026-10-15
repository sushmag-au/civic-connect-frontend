import React from 'react'
import type { Metadata } from 'next'
import ServicesDirectory from '@/components/ServicesDirectory'
import { getServices } from '@/lib/drupal'

export const revalidate = 60 // ISR: 60s

export const metadata: Metadata = {
  title: 'Council Services Directory',
  description:
    'Browse and search municipal services provided by the City of Greater Geelong including waste collection, planning permits, animal registration, rates, and community recreation.',
}

export default async function ServicesPage() {
  const services = await getServices()

  return (
    <div className="section">
      <div className="container">
        {/* Header Breadcrumbs / Kicker */}
        <div className="section-header">
          <p className="section-kicker">City of Greater Geelong Directory</p>
          <h1>Council Services</h1>
          <p className="section-subtitle">
            Find municipal council services, lodge digital permit applications, book collections, and manage your civic account.
          </p>
        </div>

        {/* Client Interactive Directory */}
        <ServicesDirectory initialServices={services} />
      </div>
    </div>
  )
}
