import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: {
    template: 'CivicConnect | %s',
    default: 'CivicConnect — City of Harborview Council Portal',
  },
  description:
    'CivicConnect is the official digital portal for the City of Harborview, Victoria. Access council services, news updates, public events, planning information, and report civic issues 24/7.',
  keywords: [
    'City of Harborview',
    'Harborview Council',
    'Civic Services',
    'Waste & Recycling',
    'Planning Permits',
    'Drupal JSON:API',
    'Local Government Victoria',
  ],
  authors: [{ name: 'Sushma Gogula' }],
  creator: 'Sushma Gogula',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    siteName: 'CivicConnect — City of Harborview',
    title: 'CivicConnect — City of Harborview Council Portal',
    description: 'Empowering Harborview residents with rapid digital council services, civic news, and transparent local governance.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        {/* Skip Navigation Link for WCAG 2.1 AA Keyboard Accessibility */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        {/* Global Council Header */}
        <Header />

        {/* Primary Content Container */}
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>

        {/* Global Council Footer */}
        <Footer />
      </body>
    </html>
  )
}
