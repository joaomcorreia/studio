'use client'

import { useState, useEffect } from 'react'

interface Page {
  id: number
  title: string
  slug: string
  status: string
  sections_count: number
  updated_at: string
}

interface TenantInfo {
  id: number
  business_name: string
  slug: string
  contact_email: string
  industry_category: string
  is_active: boolean
}

export default function UserDashboard() {
  const [pages, setPages] = useState<Page[]>([])
  const [tenantInfo, setTenantInfo] = useState<TenantInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'
      
      // Fetch tenant info
      const tenantResponse = await fetch(`${apiUrl}/tenant/info/`)
      if (tenantResponse.ok) {
        const tenantData = await tenantResponse.json()
        setTenantInfo(tenantData)
      }

      // Fetch pages
      const pagesResponse = await fetch(`${apiUrl}/pages/`)
      if (pagesResponse.ok) {
        const pagesData = await pagesResponse.json()
        setPages(pagesData.results || pagesData)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const createNewPage = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'
      const response = await fetch(`${apiUrl}/pages/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'New Page',
          slug: `page-${Date.now()}`,
          status: 'draft'
        })
      })

      if (response.ok) {
        fetchDashboardData() // Refresh data
      }
    } catch (error) {
      console.error('Failed to create page:', error)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="h-32 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const devUrl = tenantInfo ? `http://${tenantInfo.slug}.lvh.me:3000` : '#'

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {tenantInfo?.business_name ? `${tenantInfo.business_name} Dashboard` : 'My Site Overview'}
      </h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Your Development Site</h2>
            <p className="text-gray-600">{devUrl}</p>
            {tenantInfo?.industry_category && (
              <p className="text-sm text-gray-500 mt-1">
                Industry: {tenantInfo.industry_category}
              </p>
            )}
          </div>
          <div className="text-right">
            <span className={`inline-block px-3 py-1 text-sm rounded-full ${
              tenantInfo?.is_active 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {tenantInfo?.is_active ? 'Active' : 'In Progress'}
            </span>
          </div>
        </div>
        <div className="flex space-x-4">
          <a 
            href={devUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            View Site
          </a>
          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            Site Settings
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Pages</h3>
          <p className="text-3xl font-bold text-blue-600">{pages.length}</p>
          <p className="text-gray-600 text-sm">Pages created</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Published</h3>
          <p className="text-3xl font-bold text-green-600">
            {pages.filter(p => p.status === 'published').length}
          </p>
          <p className="text-gray-600 text-sm">Live pages</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Drafts</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {pages.filter(p => p.status === 'draft').length}
          </p>
          <p className="text-gray-600 text-sm">Work in progress</p>
        </div>
      </div>

      {pages.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Getting Started</h2>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold">
                1
              </div>
              <div className="ml-4">
                <p className="font-medium text-gray-900">Create your first page</p>
                <p className="text-gray-600">Start building your website with a new page</p>
              </div>
              <button 
                onClick={createNewPage}
                className="ml-auto bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Create Page
              </button>
            </div>
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center font-semibold">
                2
              </div>
              <div className="ml-4">
                <p className="font-medium text-gray-900">Choose your sections</p>
                <p className="text-gray-600">Browse our section library and add sections to your pages</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center font-semibold">
                3
              </div>
              <div className="ml-4">
                <p className="font-medium text-gray-900">Customize your theme</p>
                <p className="text-gray-600">Set your brand colors, fonts, and styling preferences</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Your Pages</h2>
            <button 
              onClick={createNewPage}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Add New Page
            </button>
          </div>
          <div className="p-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pages.map((page) => (
                <div key={page.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-medium text-gray-900 truncate">{page.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      page.status === 'published' 
                        ? 'bg-green-100 text-green-800'
                        : page.status === 'draft'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {page.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">/{page.slug}</p>
                  <p className="text-xs text-gray-500 mb-4">
                    {page.sections_count} sections • Updated {new Date(page.updated_at).toLocaleDateString()}
                  </p>
                  <div className="flex space-x-2">
                    <button className="text-sm text-blue-600 hover:text-blue-800">
                      Edit
                    </button>
                    <button className="text-sm text-gray-600 hover:text-gray-800">
                      Preview
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}