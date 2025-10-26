'use client'

import { useState, useEffect } from 'react'

export default function EditWebsitePage() {
  const [tenantInfo, setTenantInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [previewUrl, setPreviewUrl] = useState('')
  const [iframeLoading, setIframeLoading] = useState(false)
  const [iframeError, setIframeError] = useState(false)

  useEffect(() => {
    // Load tenant info and website data
    loadWebsiteData()
  }, [])

  useEffect(() => {
    // Set loading state when URL changes
    if (previewUrl) {
      setIframeLoading(true)
      setIframeError(false)
      
      // Set a timeout to detect if iframe doesn't load
      const timeout = setTimeout(() => {
        setIframeLoading(false)
        setIframeError(true)
      }, 8000) // 8 seconds timeout - if still loading, assume it failed
      
      return () => clearTimeout(timeout)
    }
  }, [previewUrl])

  const loadWebsiteData = async () => {
    try {
      // In a real app, this would fetch from your API
      // For now, we'll use mock data
      const mockTenant = {
        id: 1,
        business_name: "Demo Business",
        slug: "demo-business",
        contact_email: "demo@business.com",
        industry_category: "retail",
        is_active: true
      }
      setTenantInfo(mockTenant)
      
      // Set default preview URL - use a URL that allows iframe embedding
      const defaultUrl = 'https://httpbin.org/html'
      setPreviewUrl(defaultUrl)
    } catch (error) {
      console.error('Failed to load website data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Website</h1>
        <p className="text-gray-600 mt-2">
          Preview and edit your website content, layout, and design.
        </p>
      </div>

      {/* Preview Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Website Preview</h2>
            <button
              onClick={() => window.open(previewUrl, '_blank')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Open in New Tab
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <label htmlFor="preview-url" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Preview URL:
              </label>
            <input
              id="preview-url"
              type="url"
              value={previewUrl}
              onChange={(e) => {
                setPreviewUrl(e.target.value)
                setIframeError(false) // Reset error state when URL changes
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  // Force reload when Enter is pressed
                  setIframeLoading(true)
                  setIframeError(false)
                  const iframe = document.getElementById('preview-iframe') as HTMLIFrameElement
                  if (iframe && previewUrl) {
                    iframe.src = previewUrl
                  }
                }
              }}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
              placeholder="Enter URL to preview (e.g., https://example.com)"
            />
            <button
              onClick={() => {
                if (previewUrl) {
                  setIframeLoading(true)
                  setIframeError(false)
                  const iframe = document.getElementById('preview-iframe') as HTMLIFrameElement
                  if (iframe) {
                    iframe.src = previewUrl // Reload with current URL
                  }
                }
              }}
              disabled={!previewUrl}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            </div>
            
            {/* Quick URL Examples */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">Quick test:</span>
              <button
                onClick={() => setPreviewUrl('https://httpbin.org/html')}
                className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded hover:bg-green-200"
              >
                Test Page
              </button>
              <button
                onClick={() => setPreviewUrl('https://www.w3.org/Style/Examples/011/firstcss.en.html')}
                className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
              >
                W3C Demo
              </button>
              <button
                onClick={() => setPreviewUrl('data:text/html,<html><body><h1>Hello World!</h1><p>This is a test page that works in iframe.</p></body></html>')}
                className="text-xs px-2 py-1 bg-purple-100 text-purple-600 rounded hover:bg-purple-200"
              >
                Data URL
              </button>
            </div>
          </div>
        </div>

        {/* Preview Frame */}
        <div className="p-6">
          {previewUrl ? (
            <div className="relative">
              {iframeLoading && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-sm text-gray-600">Loading preview...</span>
                  </div>
                </div>
              )}
              <iframe
                id="preview-iframe"
                src={previewUrl}
                className="w-full h-[600px] border border-gray-300 rounded-lg shadow-sm"
                title="Website Preview"
                sandbox="allow-same-origin allow-scripts allow-forms allow-links allow-popups allow-top-navigation"
                referrerPolicy="no-referrer-when-downgrade"
                onLoad={(e) => {
                  console.log('Iframe loaded successfully for URL:', previewUrl)
                  setIframeLoading(false)
                  setIframeError(false)
                  
                  // Additional check to ensure content actually loaded
                  setTimeout(() => {
                    const iframe = e.target as HTMLIFrameElement
                    try {
                      // Try to access iframe content to check if it really loaded
                      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
                      if (!iframeDoc || iframeDoc.body?.innerHTML.trim() === '') {
                        console.log('Iframe loaded but content is empty or blocked')
                        setIframeError(true)
                      }
                    } catch (err) {
                      // Cross-origin, but that's ok - iframe loaded
                      console.log('Iframe loaded (cross-origin content)')
                    }
                  }, 1000)
                }}
                onError={(e) => {
                  console.log('Iframe failed to load:', e, 'URL:', previewUrl)
                  setIframeLoading(false)
                  setIframeError(true)
                }}
              />
              <div className="absolute top-2 right-2 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg px-3 py-1 text-xs text-gray-600 shadow-sm">
                {iframeError ? '🔴 Failed to Load' : '🟢 Live Preview'}
              </div>
              
              {iframeError && (
                <div className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center z-20 rounded-lg">
                  <div className="text-center max-w-md">
                    <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to Load Preview</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      The website could not be loaded in the preview. Common causes:
                    </p>
                    <ul className="text-sm text-gray-600 text-left mb-4 space-y-1">
                      <li>• Most major sites (Google, Facebook, etc.) block iframe embedding for security</li>
                      <li>• X-Frame-Options: DENY or SAMEORIGIN headers</li>
                      <li>• Content Security Policy (CSP) restrictions</li>
                      <li>• Invalid or unreachable URL</li>
                    </ul>
                    <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
                      <p className="text-xs text-blue-700">
                        💡 <strong>Tip:</strong> Use the "Test Page" button above to try a URL that allows iframe embedding.
                      </p>
                    </div>
                    <div className="flex space-x-2 justify-center">
                      <button
                        onClick={() => {
                          setIframeError(false)
                          setIframeLoading(true)
                          const iframe = document.getElementById('preview-iframe') as HTMLIFrameElement
                          if (iframe) {
                            iframe.src = previewUrl
                          }
                        }}
                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                      >
                        Try Again
                      </button>
                      <button
                        onClick={() => window.open(previewUrl, '_blank')}
                        className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50"
                      >
                        Open Externally
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Responsive Controls */}
              <div className="absolute bottom-2 left-2 flex space-x-2">
                <button
                  onClick={() => {
                    const iframe = document.getElementById('preview-iframe') as HTMLIFrameElement
                    if (iframe) {
                      iframe.style.width = '375px'
                      iframe.style.margin = '0 auto'
                    }
                  }}
                  className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg px-3 py-1 text-xs text-gray-600 shadow-sm hover:bg-opacity-100 transition-all"
                  title="Mobile View"
                >
                  📱
                </button>
                <button
                  onClick={() => {
                    const iframe = document.getElementById('preview-iframe') as HTMLIFrameElement
                    if (iframe) {
                      iframe.style.width = '768px'
                      iframe.style.margin = '0 auto'
                    }
                  }}
                  className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg px-3 py-1 text-xs text-gray-600 shadow-sm hover:bg-opacity-100 transition-all"
                  title="Tablet View"
                >
                  📱
                </button>
                <button
                  onClick={() => {
                    const iframe = document.getElementById('preview-iframe') as HTMLIFrameElement
                    if (iframe) {
                      iframe.style.width = '100%'
                      iframe.style.margin = '0'
                    }
                  }}
                  className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg px-3 py-1 text-xs text-gray-600 shadow-sm hover:bg-opacity-100 transition-all"
                  title="Desktop View"
                >
                  🖥️
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center h-[600px] flex flex-col justify-center">
              <div className="mx-auto w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Enter a URL to Preview</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-4">
                Enter a valid URL in the Preview URL field above to see your website content here.
              </p>
              <p className="text-sm text-gray-500">
                Perfect for previewing your static sites and testing different URLs.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Content Strategy</h3>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Define your target audience, key messaging, and calls-to-action.
          </p>
          <button
            onClick={() => window.location.href = '/dashboard/user/content-strategy'}
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-purple-600 hover:bg-purple-700"
          >
            Manage Content
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Subscriptions</h3>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Manage your hosting plan, website features, and domain settings.
          </p>
          <button
            onClick={() => window.location.href = '/dashboard/user/subscriptions'}
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            View Subscriptions
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Settings</h3>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Configure website settings, themes, and integrations.
          </p>
          <button
            onClick={() => window.location.href = '/dashboard/user/settings'}
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700"
          >
            Manage Settings
          </button>
        </div>
      </div>

      {/* Coming Soon Features */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">🚀 Coming Soon</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
            <div>
              <p className="font-medium text-gray-900">Live Visual Editor</p>
              <p className="text-gray-600">Edit your website content directly in the preview</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
            <div>
              <p className="font-medium text-gray-900">Drag & Drop Builder</p>
              <p className="text-gray-600">Rearrange sections with simple drag and drop</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
            <div>
              <p className="font-medium text-gray-900">Real-time Preview</p>
              <p className="text-gray-600">See changes instantly as you edit</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
            <div>
              <p className="font-medium text-gray-900">Mobile Responsive</p>
              <p className="text-gray-600">Preview and edit for all device sizes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}