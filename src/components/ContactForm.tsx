'use client'

import React, { useState } from 'react'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    enquiryType: 'general',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [referenceId, setReferenceId] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate async submission to Drupal webform / API
    setTimeout(() => {
      const generatedRef = `GG-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`
      setReferenceId(generatedRef)
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 700)
  }

  const handleReset = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      enquiryType: 'general',
      subject: '',
      message: '',
    })
    setIsSubmitted(false)
    setReferenceId('')
  }

  if (isSubmitted) {
    return (
      <div
        style={{
          background: '#ECFDF5',
          border: '1px solid #A7F3D0',
          borderRadius: 'var(--radius-lg)',
          padding: '2.5rem',
          textAlign: 'center',
        }}
        role="alert"
        aria-live="polite"
      >
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }} aria-hidden="true">
          ✅
        </div>
        <h3 style={{ color: '#065F46', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
          Enquiry Received Successfully
        </h3>
        <p style={{ color: '#047857', maxWidth: '500px', margin: '0 auto 1.25rem', fontSize: '1rem' }}>
          Thank you for contacting the City of Greater Geelong. Your message has been routed to the relevant municipal services team.
        </p>
        <div
          style={{
            display: 'inline-block',
            background: 'var(--color-white)',
            border: '1px dashed #059669',
            padding: '0.65rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            color: '#065F46',
            marginBottom: '1.5rem',
          }}
        >
          Reference Number: {referenceId}
        </div>
        <p style={{ fontSize: '0.875rem', color: '#047857', marginBottom: '1.5rem' }}>
          A confirmation email has been dispatched to <strong>{formData.email}</strong>. Our standard response timeframe is within 2 business days.
        </p>
        <button type="button" onClick={handleReset} className="btn btn-primary">
          Submit Another Request
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: 'var(--color-white)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '2rem',
        boxShadow: 'var(--shadow-sm)',
      }}
      aria-label="Council Enquiry and Issue Reporting Form"
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        {/* Full Name */}
        <div className="form-group">
          <label htmlFor="fullName" className="form-label">
            Full Name <span style={{ color: '#DC2626' }}>*</span>
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            value={formData.fullName}
            onChange={handleChange}
            placeholder="e.g. Jane Citizen"
            className="form-input"
          />
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email Address <span style={{ color: '#DC2626' }}>*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="jane.citizen@example.com"
            className="form-input"
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        {/* Phone */}
        <div className="form-group">
          <label htmlFor="phone" className="form-label">
            Contact Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="e.g. 0412 345 678"
            className="form-input"
          />
        </div>

        {/* Enquiry Type */}
        <div className="form-group">
          <label htmlFor="enquiryType" className="form-label">
            Enquiry Type <span style={{ color: '#DC2626' }}>*</span>
          </label>
          <select
            id="enquiryType"
            name="enquiryType"
            required
            value={formData.enquiryType}
            onChange={handleChange}
            className="form-select"
          >
            <option value="general">General Council Enquiry</option>
            <option value="report">Report an Issue / Hazard / Pothole</option>
            <option value="waste">Waste &amp; Bin Collection</option>
            <option value="planning">Planning &amp; Building Application</option>
            <option value="rates">Rates, Valuations &amp; Payments</option>
            <option value="animals">Animal Management &amp; Pets</option>
            <option value="feedback">Compliments &amp; Feedback</option>
          </select>
        </div>
      </div>

      {/* Subject */}
      <div className="form-group">
        <label htmlFor="subject" className="form-label">
          Subject / Brief Summary <span style={{ color: '#DC2626' }}>*</span>
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          value={formData.subject}
          onChange={handleChange}
          placeholder="e.g. Missed recycling bin on Mercer St"
          className="form-input"
        />
      </div>

      {/* Message */}
      <div className="form-group">
        <label htmlFor="message" className="form-label">
          Detailed Message <span style={{ color: '#DC2626' }}>*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={formData.message}
          onChange={handleChange}
          placeholder="Please describe the issue or enquiry with as much detail as possible, including relevant addresses or reference numbers..."
          className="form-textarea"
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0 }}>
          Fields marked with <span style={{ color: '#DC2626' }}>*</span> are required.
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary"
          style={{ minWidth: '160px' }}
        >
          {isSubmitting ? 'Sending Request...' : 'Submit Request'}
        </button>
      </div>
    </form>
  )
}
