'use client'

import { useState, useEffect } from 'react'

export default function ContentStrategyPage() {
  const [contentData, setContentData] = useState({
    target_audience: '',
    key_message: '',
    call_to_action: ''
  })
  
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)

  // Load existing content data on component mount
  useEffect(() => {
    loadContentData()
  }, [])

  const loadContentData = async () => {
    try {
      // In a real app, this would fetch from your API
      // For now, we'll use localStorage for persistence
      const savedData = localStorage.getItem('user-content-strategy')
      if (savedData) {
        setContentData(JSON.parse(savedData))
      }
    } catch (error) {
      console.error('Failed to load content data:', error)
    }
  }

  const handleContentChange = (field: string, value: string) => {
    setContentData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const generateAIContent = async (contentType: 'key_message') => {
    if (!contentData.target_audience) {
      alert('Please fill in your target audience first to help generate better content.')
      return
    }

    setIsGeneratingAI(true)
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: contentType,
          businessName: 'Your Business', // This would come from user data
          industry: 'business', // This would come from user data
          existingContent: contentType === 'key_message' ? contentData.key_message : ''
        })
      })

      const result = await response.json()

      if (result?.success) {
        if (contentType === 'key_message') {
          setContentData(prev => ({ ...prev, key_message: result.content || '' }))
        }
      } else {
        alert(result?.error || 'Failed to generate content')
      }
    } catch (error) {
      console.error('AI Generation Error:', error)
      alert('Failed to generate content. Please check your connection and try again.')
    } finally {
      setIsGeneratingAI(false)
    }
  }

  const saveContentData = async () => {
    setIsSaving(true)
    try {
      // In a real app, this would save to your API
      // For now, we'll use localStorage for persistence
      localStorage.setItem('user-content-strategy', JSON.stringify(contentData))
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setLastSaved(new Date())
    } catch (error) {
      console.error('Failed to save content data:', error)
      alert('Failed to save changes. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Content Strategy</h1>
        <p className="text-gray-600 mt-2">
          Define your target audience, key messaging, and primary call-to-action to create compelling website content.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="space-y-8">
          {/* Target Audience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Who are your ideal customers? *
            </label>
            <input
              type="text"
              value={contentData.target_audience}
              onChange={(e) => handleContentChange('target_audience', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Food lovers, families, couples on date nights, business professionals"
            />
            <p className="text-sm text-gray-500 mt-2">
              🎯 This helps create content that speaks directly to your customers and their needs.
            </p>
          </div>

          {/* Key Message with AI Generation */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Key Message or Unique Selling Point *
              </label>
              <button
                type="button"
                onClick={() => generateAIContent('key_message')}
                disabled={!contentData.target_audience || isGeneratingAI}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
              >
                {isGeneratingAI ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    AI Generate
                  </>
                )}
              </button>
            </div>
            <input
              type="text"
              value={contentData.key_message}
              onChange={(e) => handleContentChange('key_message', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Authentic Italian cuisine, 24/7 service, Award-winning quality, Best prices in town"
            />
            <p className="text-sm text-gray-500 mt-2">
              ⭐ What should visitors remember most about your business? This becomes your main headline.
            </p>
            {!contentData.target_audience && (
              <p className="text-sm text-amber-600 mt-1">
                ⚠️ Fill in your target audience above to enable AI generation
              </p>
            )}
          </div>

          {/* Call to Action */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What should visitors do first? *
            </label>
            <select
              value={contentData.call_to_action}
              onChange={(e) => handleContentChange('call_to_action', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select primary action...</option>
              <option value="call">Call us for information</option>
              <option value="book">Book an appointment</option>
              <option value="order">Order online</option>
              <option value="visit">Visit our location</option>
              <option value="quote">Get a quote</option>
              <option value="contact">Contact us</option>
              <option value="browse">Browse our services</option>
              <option value="subscribe">Join our mailing list</option>
              <option value="learn_more">Learn more about us</option>
              <option value="get_started">Get started today</option>
            </select>
            <p className="text-sm text-gray-500 mt-2">
              📞 This will be the main button/action on your website homepage.
            </p>
          </div>

          {/* Content Preview */}
          {(contentData.target_audience || contentData.key_message || contentData.call_to_action) && (
            <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-lg font-medium text-blue-900 mb-4">✨ Content Preview</h4>
              <div className="space-y-3 text-sm">
                {contentData.target_audience && (
                  <div>
                    <span className="font-medium text-blue-800">Target Audience:</span>
                    <p className="text-blue-700 mt-1">{contentData.target_audience}</p>
                  </div>
                )}
                {contentData.key_message && (
                  <div>
                    <span className="font-medium text-blue-800">Key Message:</span>
                    <p className="text-blue-700 mt-1 font-medium">{contentData.key_message}</p>
                  </div>
                )}
                {contentData.call_to_action && (
                  <div>
                    <span className="font-medium text-blue-800">Primary Action:</span>
                    <button className="ml-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">
                      {contentData.call_to_action.charAt(0).toUpperCase() + contentData.call_to_action.slice(1).replace('_', ' ')} →
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              {lastSaved && (
                <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
              )}
            </div>
            <button
              onClick={saveContentData}
              disabled={isSaving}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">💡 Content Strategy Tips</h3>
        <div className="grid md:grid-cols-3 gap-6 text-sm">
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Target Audience</h4>
            <p className="text-gray-600">
              Be specific about demographics, interests, and pain points. The more detailed, the better your content will resonate.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Key Message</h4>
            <p className="text-gray-600">
              Focus on what makes you unique and valuable to customers. Keep it clear, memorable, and benefit-focused.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Call to Action</h4>
            <p className="text-gray-600">
              Choose the most important first step for visitors. Make it easy and obvious what they should do next.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}