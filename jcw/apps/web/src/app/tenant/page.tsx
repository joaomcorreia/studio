'use client'

import { useEffect, useState } from 'react'

interface Tenant {
  id: string
  slug: string
  business_name: string
  industry_category: string
  city: string
  country: string
  contact_email: string
}

export default function TenantSitePage() {
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Get tenant slug from URL
    const hostname = window.location.hostname
    const urlParams = new URLSearchParams(window.location.search)
    let tenantSlug = ''
    
    // Check for subdomain first
    if (hostname.includes('.lvh.me')) {
      tenantSlug = hostname.split('.')[0]
    } else if (hostname.includes('.localhost')) {
      tenantSlug = hostname.split('.')[0]
    } else {
      // Fallback to query parameter
      tenantSlug = urlParams.get('tenant') || ''
    }

    if (tenantSlug && tenantSlug !== 'www') {
      // Fetch tenant data from API
      fetch(`http://127.0.0.1:8000/api/tenants/by-slug/${tenantSlug}/`)
        .then(res => res.json())
        .then(data => {
          if (data.id) {
            setTenant(data)
          } else {
            setError('Tenant not found')
          }
        })
        .catch(err => {
          setError('Failed to load tenant')
          console.error('Tenant fetch error:', err)
        })
        .finally(() => setLoading(false))
    } else {
      setError('Invalid subdomain')
      setLoading(false)
    }
  }, [])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <h2>Loading tenant site...</h2>
        </div>
      </div>
    )
  }

  if (error || !tenant) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb' }}>
        <div style={{ textAlign: 'center', maxWidth: '600px', padding: '48px 24px' }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>🏗️</div>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
            Tenant Site Not Found
          </h1>
          <p style={{ fontSize: '18px', color: '#6b7280', marginBottom: '32px' }}>
            {error === 'Tenant not found' 
              ? "This tenant doesn't exist or hasn't been configured yet."
              : "There was an error loading this tenant site."
            }
          </p>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>Possible Issues:</h3>
            <ul style={{ textAlign: 'left', color: '#6b7280' }}>
              <li>• Tenant hasn't been created in the admin panel</li>
              <li>• DNS configuration issue with .lvh.me</li>
              <li>• Backend API is not running on port 8000</li>
              <li>• Subdomain routing is not configured</li>
            </ul>
          </div>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="http://localhost:3000"
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '500'
              }}
            >
              🏠 Go to Main Platform
            </a>
            <a
              href="http://127.0.0.1:8000/admin/"
              target="_blank"
              style={{
                backgroundColor: '#059669',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '500'
              }}
            >
              ⚙️ Django Admin
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 16px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
            Welcome to {tenant.business_name}! 🎉
          </h1>
          <p style={{ fontSize: '20px', color: '#6b7280', maxWidth: '600px', margin: '0 auto' }}>
            This is a multi-tenant website powered by Just Code Works platform.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '48px' }}>
          <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
              🏢 Business Info
            </h2>
            <div style={{ color: '#6b7280', lineHeight: '1.6' }}>
              <p><strong>Name:</strong> {tenant.business_name}</p>
              <p><strong>Industry:</strong> {tenant.industry_category}</p>
              <p><strong>Location:</strong> {tenant.city}, {tenant.country}</p>
              <p><strong>Contact:</strong> {tenant.contact_email}</p>
            </div>
          </div>

          <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
              🌐 Tenant Details
            </h2>
            <div style={{ color: '#6b7280', lineHeight: '1.6' }}>
              <p><strong>Slug:</strong> {tenant.slug}</p>
              <p><strong>Tenant ID:</strong> {tenant.id.slice(0, 8)}...</p>
              <p><strong>Domain:</strong> {window.location.hostname}</p>
              <p><strong>Status:</strong> <span style={{ color: '#059669' }}>✅ Active</span></p>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
            🚀 Multi-Tenant Platform Demo
          </h2>
          <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '24px' }}>
            This website is dynamically generated based on the subdomain. Each tenant gets their own customized site.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="http://localhost:3000"
              style={{
                backgroundColor: '#6366f1',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '500'
              }}
            >
              🏠 Main Platform
            </a>
            <a
              href="http://localhost:3000/dashboard/admin"
              style={{
                backgroundColor: '#059669',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '500'
              }}
            >
              ⚙️ Admin Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}