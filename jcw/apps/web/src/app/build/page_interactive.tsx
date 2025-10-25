'use client'

import { useState, FormEvent, ChangeEvent } from 'react'

export default function BuildPage() {
  const [formData, setFormData] = useState({
    business_name: '',
    industry_category: '',
    city: '',
    country: '',
    contact_email: '',
    contact_phone: ''
  })
  const [websiteInfo, setWebsiteInfo] = useState({
    website_name: '',
    custom_domain: '',
    slug: ''
  })
  const [suggestedSlug, setSuggestedSlug] = useState('')
  const [devUrl, setDevUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [showWebsiteSection, setShowWebsiteSection] = useState(false)

  const checkSlug = async (business_name: string) => {
    if (!business_name) return
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'}/onboarding/check-slug/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ business_name })
      })
      
      if (response.ok) {
        const data = await response.json()
        setSuggestedSlug(data.suggested_slug)
        setDevUrl(data.dev_url)
      }
    } catch (error) {
      console.error('Slug check failed:', error)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'}/onboarding/start/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          website_name: websiteInfo.website_name,
          custom_domain: websiteInfo.custom_domain
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setResult(data)
      } else {
        const errorData = await response.json()
        setResult({ success: false, error: errorData })
      }
    } catch (error) {
      setResult({ success: false, error: 'Network error occurred' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBusinessNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData({ ...formData, business_name: value })
    checkSlug(value)
    
    // Auto-populate website name if empty
    if (!websiteInfo.website_name) {
      setWebsiteInfo({ ...websiteInfo, website_name: value })
      generateSlugFromWebsiteName(value)
    }
  }

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData({ ...formData, contact_phone: value })
    
    // Show website section after phone number is entered
    if (value.length >= 3 && !showWebsiteSection) {
      setShowWebsiteSection(true)
    }
  }

  const handleWebsiteNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setWebsiteInfo({ ...websiteInfo, website_name: value })
    generateSlugFromWebsiteName(value)
  }

  const generateSlugFromWebsiteName = (websiteName: string) => {
    if (!websiteName) return
    
    const slug = websiteName
      .toLowerCase()
      .replace(/[^a-z0-9\\s-]/g, '')
      .replace(/\\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
    
    setWebsiteInfo(prev => ({ ...prev, slug }))
    
    // Update preview URL in real-time
    const previewUrl = `https://justcodeworks.eu/build/${slug}/`
    setDevUrl(previewUrl)
  }

  if (result?.success) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <h1 className="text-2xl font-bold text-green-800 mb-4">🎉 Website Created!</h1>
          <p className="text-green-700 mb-4">{result.message}</p>
          <div className="bg-white rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600">Your development site:</p>
            <a 
              href={result.dev_url} 
              className="text-blue-600 hover:text-blue-800 font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              {result.dev_url}
            </a>
          </div>
          <button 
            onClick={() => window.location.href = '/dashboard/user'}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Build Your Website
        </h1>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="space-y-6">
            {/* Website Type Selection */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Choose Your Website Type</h2>
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="border-2 border-blue-500 bg-blue-50 rounded-lg p-4 cursor-pointer">
                  <h3 className="font-medium text-blue-700">One Page ✓</h3>
                  <p className="text-sm text-blue-600">Perfect for small businesses</p>
                </div>
                <div className="border border-gray-300 rounded-lg p-4 hover:border-primary-500 cursor-pointer">
                  <h3 className="font-medium">Multi Page</h3>
                  <p className="text-sm text-gray-600">Complete business website</p>
                </div>
                <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                  <h3 className="font-medium text-gray-500">eCommerce</h3>
                  <p className="text-sm text-gray-400">Coming soon...</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-6">Business Information</h2>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.business_name}
                    onChange={handleBusinessNameChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Mary's Restaurant"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.contact_email}
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="mary@restaurant.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry Category
                  </label>
                  <select
                    value={formData.industry_category}
                    onChange={(e) => setFormData({ ...formData, industry_category: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select industry...</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="retail">Retail</option>
                    <option value="services">Services</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.contact_phone}
                    onChange={handlePhoneChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="+31 20 123 4567"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Amsterdam"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Netherlands"
                  />
                </div>
              </div>

              {/* Website Information Section - appears after phone number */}
              {showWebsiteSection && (
                <div className="bg-gray-50 rounded-lg p-6 mb-6 border-l-4 border-blue-500 animate-fadeIn">
                  <h2 className="text-xl font-semibold mb-6 text-gray-900">Website Information</h2>
                  
                  <div className="grid md:grid-cols-1 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={websiteInfo.website_name}
                        onChange={handleWebsiteNameChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="e.g., Mary's Restaurant"
                      />
                    </div>
                  </div>

                  {/* Real-time URL Preview */}
                  {websiteInfo.slug && (
                    <div className="bg-white border border-blue-200 rounded-lg p-4 mb-4 preview-url">
                      <div className="flex items-center mb-2">
                        <span className="text-sm text-blue-700 font-medium">🔗 Your website will be built at:</span>
                      </div>
                      <div className="font-mono text-sm bg-gray-100 p-2 rounded border">
                        <span className="text-gray-600">https://justcodeworks.eu/build/</span>
                        <span className="text-blue-600 font-semibold">{websiteInfo.slug}</span>
                        <span className="text-gray-600">/</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        ✨ This URL updates automatically as you type your website name
                      </p>
                    </div>
                  )}

                  <div className="grid md:grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Custom Domain (Optional)
                      </label>
                      <input
                        type="text"
                        value={websiteInfo.custom_domain}
                        onChange={(e) => setWebsiteInfo({ ...websiteInfo, custom_domain: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="e.g., marysrestaurant.com"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        You can connect your own domain later in the dashboard
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50"
              >
                {isLoading ? 'Creating Website...' : 'Create My Website'}
              </button>
            </form>
          </div>
          
          {/* Right Column - Real-time Preview */}
          <div className="bg-white rounded-lg shadow-lg p-6 h-fit sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              🖼️ Live Preview
            </h3>
            
            {/* Mock Website Preview */}
            <div className="border rounded-lg overflow-hidden bg-gray-50 min-h-96">
              <div className="bg-blue-600 text-white p-2 text-xs flex items-center">
                <div className="flex space-x-1 mr-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
                <div className="font-mono text-xs">
                  {websiteInfo.slug ? `justcodeworks.eu/build/${websiteInfo.slug}/` : 'justcodeworks.eu/build/your-website/'}
                </div>
              </div>
              
              <div className="p-4 bg-white min-h-80">
                {/* Header */}
                <div className="border-b pb-3 mb-4">
                  <h1 className="text-xl font-bold text-gray-800 transition-all duration-300">
                    {websiteInfo.website_name || formData.business_name || 'Your Business Name'}
                  </h1>
                  <div className="flex space-x-4 mt-2 text-sm">
                    <span className="text-blue-600 hover:underline cursor-pointer">Home</span>
                    <span className="text-gray-600 hover:underline cursor-pointer">About</span>
                    <span className="text-gray-600 hover:underline cursor-pointer">Contact</span>
                  </div>
                </div>
                
                {/* Hero Section */}
                <div className="text-center py-6 transition-all duration-300">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">
                    Welcome to {websiteInfo.website_name || formData.business_name || 'Your Business'}
                  </h2>
                  <p className="text-gray-600 text-sm mb-3">
                    {formData.industry_category ? 
                      `Professional ${formData.industry_category} services` : 
                      'Quality services you can trust'
                    }
                  </p>
                  {formData.city && (
                    <p className="text-gray-500 text-xs">
                      📍 Located in {formData.city}{formData.country && `, ${formData.country}`}
                    </p>
                  )}
                </div>
                
                {/* Contact Info */}
                {(formData.contact_email || formData.contact_phone) && (
                  <div className="bg-gray-50 rounded p-3 mt-4 transition-all duration-300">
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Contact Us</h4>
                    {formData.contact_email && (
                      <p className="text-xs text-gray-600">📧 {formData.contact_email}</p>
                    )}
                    {formData.contact_phone && (
                      <p className="text-xs text-gray-600">📞 {formData.contact_phone}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                ✨ This preview updates in real-time as you type!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}