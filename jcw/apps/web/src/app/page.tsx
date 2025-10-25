'use client'

import { useEffect } from 'react'
import TenantSitePage from './tenant/page'

export default function HomePage() {
  // Check if this is a tenant subdomain request
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname
      
      // If it's a subdomain (not localhost:3000 or 127.0.0.1:3000)
      if (hostname.includes('.lvh.me') && !hostname.startsWith('www.')) {
        // This is handled by the TenantSitePage component below
        return
      }
    }
  }, [])

  // Check if this is a tenant request
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname
    const urlParams = new URLSearchParams(window.location.search)
    const tenantParam = urlParams.get('tenant')
    
    if ((hostname.includes('.lvh.me') && !hostname.startsWith('www.')) || tenantParam) {
      return <TenantSitePage />
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 16px' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#111827', marginBottom: '24px' }}>
            Just Code Works 🚀
          </h1>
          <p style={{ fontSize: '18px', color: '#6b7280', maxWidth: '600px', margin: '0 auto 40px' }}>
            Your multi-tenant website builder is working! Create stunning websites with our easy-to-use platform.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="/build"
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '12px 32px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '500',
                display: 'inline-block'
              }}
            >
              🎨 Start Building
            </a>
            <a
              href="/dashboard/admin"
              style={{
                backgroundColor: '#059669',
                color: 'white',
                padding: '12px 32px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '500',
                display: 'inline-block'
              }}
            >
              👑 Admin Dashboard
            </a>
          </div>
        </div>

        <div style={{ marginTop: '64px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '32px' }}>
            ✅ System Status
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ color: '#059669', fontWeight: 'bold', marginBottom: '8px' }}>🖥️ Django API</h3>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>Running at :8000</p>
            </div>
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ color: '#059669', fontWeight: 'bold', marginBottom: '8px' }}>⚛️ Next.js</h3>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>Running at :3000</p>
            </div>
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ color: '#059669', fontWeight: 'bold', marginBottom: '8px' }}>🗄️ Database</h3>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>SQLite Ready</p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '48px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
            🔗 Quick Links
          </h3>
          <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap', fontSize: '14px' }}>
            <a href="http://127.0.0.1:8000/api/" target="_blank" style={{ color: '#2563eb', textDecoration: 'underline' }}>
              API Root
            </a>
            <a href="http://127.0.0.1:8000/admin/" target="_blank" style={{ color: '#2563eb', textDecoration: 'underline' }}>
              Django Admin
            </a>
            <a href="/dashboard/user" style={{ color: '#2563eb', textDecoration: 'underline' }}>
              User Dashboard
            </a>
            <a href="/test" style={{ color: '#2563eb', textDecoration: 'underline' }}>
              Test Page
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}