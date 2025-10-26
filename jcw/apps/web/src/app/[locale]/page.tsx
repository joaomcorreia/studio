'use client'

import { useEffect, useState } from 'react'
import { HomepageContent } from '@/components/homepage/HomepageContent'
import TenantSitePage from './tenant/page'

export default function LocaleHomePage() {
  const [isTenant, setIsTenant] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname
      const urlParams = new URLSearchParams(window.location.search)
      const tenantParam = urlParams.get('tenant')
      
      // Check if this is a tenant subdomain request
      const isTenantRequest = Boolean((hostname.includes('.lvh.me') && !hostname.startsWith('www.')) || tenantParam)
      setIsTenant(isTenantRequest)
      setIsLoading(false)
    }
  }, [])

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem',
        color: '#667eea'
      }}>
        Loading...
      </div>
    )
  }

  if (isTenant) {
    return <TenantSitePage />
  }

  return <HomepageContent />
}