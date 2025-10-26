'use client'

import { useState, useEffect } from 'react'

interface DashboardComponent {
  id: string
  type: 'overview-card' | 'quick-action' | 'coming-soon' | 'notice-banner' | 'site-overview' | 'stats-grid' | 'getting-started' | 'pages-grid'
  title: string
  description: string
  icon: string
  href?: string
  buttonText?: string
  status: 'draft' | 'published'
  order: number
  isVisible: boolean
  backgroundColor?: string
  textColor?: string
  content?: string
}

export default function DashboardEditorPage() {
  const [components, setComponents] = useState<DashboardComponent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [previewMode, setPreviewMode] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  useEffect(() => {
    loadDashboardComponents()
  }, [])

  const loadDashboardComponents = async () => {
    try {
      // In a real app, this would fetch from your API
      // Mock data representing the actual user dashboard structure
      const mockComponents: DashboardComponent[] = [
        {
          id: '1',
          type: 'notice-banner',
          title: 'Development Mode',
          description: 'This dashboard shows mock data when API endpoints are not available. Perfect for frontend development!',
          icon: 'info',
          status: 'published',
          order: 1,
          isVisible: true,
          backgroundColor: 'bg-blue-50 border-blue-200',
          textColor: 'text-blue-800'
        },
        {
          id: '2',
          type: 'site-overview',
          title: 'Your Development Site',
          description: 'Main site information and quick actions',
          icon: 'globe',
          status: 'published',
          order: 2,
          isVisible: true
        },
        {
          id: '3',
          type: 'stats-grid',
          title: 'Site Statistics',
          description: 'Overview of pages, published content, and drafts',
          icon: 'chart-bar',
          status: 'published',
          order: 3,
          isVisible: true
        },
        {
          id: '4',
          type: 'getting-started',
          title: 'Getting Started Guide',
          description: 'Step-by-step guide for new users',
          icon: 'academic-cap',
          status: 'published',
          order: 4,
          isVisible: true
        },
        {
          id: '5',
          type: 'pages-grid',
          title: 'Your Pages',
          description: 'Manage and edit your website pages',
          icon: 'document-text',
          status: 'published',
          order: 5,
          isVisible: true
        },
        {
          id: '6',
          type: 'quick-action',
          title: 'Content Strategy',
          description: 'Define your target audience, key messaging, and calls-to-action',
          icon: 'heart',
          href: '/dashboard/user/content-strategy',
          buttonText: 'Manage Content',
          status: 'draft',
          order: 6,
          isVisible: false
        },
        {
          id: '7',
          type: 'quick-action',
          title: 'Advanced Analytics',
          description: 'Get detailed insights about your website performance',
          icon: 'chart-line',
          href: '/dashboard/user/analytics',
          buttonText: 'View Analytics',
          status: 'draft',
          order: 7,
          isVisible: false
        }
      ]
      setComponents(mockComponents)
    } catch (error) {
      console.error('Failed to load dashboard components:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateComponent = (id: string, updates: Partial<DashboardComponent>) => {
    setComponents(prev => prev.map(comp => 
      comp.id === id ? { ...comp, ...updates } : comp
    ))
    setHasUnsavedChanges(true)
  }

  const addNewComponent = () => {
    const newComponent: DashboardComponent = {
      id: Date.now().toString(),
      type: 'quick-action',
      title: 'New Component',
      description: 'Component description',
      icon: 'plus',
      href: '',
      buttonText: 'Action',
      status: 'draft',
      order: components.length + 1,
      isVisible: true
    }
    setComponents(prev => [...prev, newComponent])
    setHasUnsavedChanges(true)
  }

  const deleteComponent = (id: string) => {
    setComponents(prev => prev.filter(comp => comp.id !== id))
    setHasUnsavedChanges(true)
  }

  const publishChanges = async () => {
    try {
      // In a real app, this would save to your API and update all user dashboards
      console.log('Publishing dashboard changes:', components)
      setHasUnsavedChanges(false)
      alert('Dashboard changes published successfully! All user dashboards will be updated.')
    } catch (error) {
      console.error('Failed to publish changes:', error)
      alert('Failed to publish changes. Please try again.')
    }
  }

  const saveDraft = async () => {
    try {
      // In a real app, this would save as draft to your API
      console.log('Saving draft:', components)
      setHasUnsavedChanges(false)
      alert('Draft saved successfully!')
    } catch (error) {
      console.error('Failed to save draft:', error)
      alert('Failed to save draft. Please try again.')
    }
  }

  const getIconForType = (icon: string) => {
    const icons: { [key: string]: JSX.Element } = {
      users: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" /></svg>,
      eye: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
      heart: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
      'credit-card': <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
      settings: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
      edit: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
      move: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>,
      plus: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>,
      info: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      globe: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
      'chart-bar': <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
      'chart-line': <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>,
      'academic-cap': <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>,
      'document-text': <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
    }
    return icons[icon] || icons.plus
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Editor</h1>
            <p className="text-gray-600 mt-2">
              Edit the user dashboard that appears at <strong>/dashboard/user</strong>. Use Preview Mode to see exactly how it will look to users, then publish your changes to update all user dashboards.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {previewMode ? 'Edit Mode' : 'Preview Mode'}
            </button>
            {hasUnsavedChanges && (
              <span className="text-sm text-orange-600 font-medium">Unsaved changes</span>
            )}
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={addNewComponent}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Component
            </button>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={saveDraft}
              disabled={!hasUnsavedChanges}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Draft
            </button>
            <button
              onClick={publishChanges}
              disabled={!hasUnsavedChanges}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Publish Changes
            </button>
          </div>
        </div>
      </div>

      {previewMode ? (
        /* Preview Mode - Shows actual user dashboard */
        <div className="bg-gray-100 rounded-lg p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Demo Business Dashboard</h1>
            
            {/* Components rendered in order */}
            {components
              .filter(comp => comp.isVisible)
              .sort((a, b) => a.order - b.order)
              .map((component) => {
                switch (component.type) {
                  case 'notice-banner':
                    return (
                      <div key={component.id} className={`${component.backgroundColor || 'bg-blue-50 border border-blue-200'} rounded-lg p-4 mb-6`}>
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <h3 className={`text-sm font-medium ${component.textColor || 'text-blue-800'}`}>{component.title}</h3>
                            <div className={`mt-1 text-sm ${component.textColor || 'text-blue-700'}`}>
                              <p>{component.description}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  
                  case 'site-overview':
                    return (
                      <div key={component.id} className="bg-white rounded-lg shadow p-6 mb-8">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h2 className="text-xl font-semibold text-gray-900">{component.title}</h2>
                            <p className="text-gray-600">http://demo-business.lvh.me:3000</p>
                            <p className="text-sm text-gray-500 mt-1">Industry: retail</p>
                          </div>
                          <span className="inline-block px-3 py-1 text-sm rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        </div>
                        <div className="flex space-x-4">
                          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                            View Site
                          </button>
                          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">
                            Site Settings
                          </button>
                        </div>
                      </div>
                    )
                  
                  case 'stats-grid':
                    return (
                      <div key={component.id} className="grid md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow">
                          <h3 className="text-lg font-medium text-gray-900 mb-2">Pages</h3>
                          <p className="text-3xl font-bold text-blue-600">3</p>
                          <p className="text-gray-600 text-sm">Pages created</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                          <h3 className="text-lg font-medium text-gray-900 mb-2">Published</h3>
                          <p className="text-3xl font-bold text-green-600">2</p>
                          <p className="text-gray-600 text-sm">Live pages</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                          <h3 className="text-lg font-medium text-gray-900 mb-2">Drafts</h3>
                          <p className="text-3xl font-bold text-yellow-600">1</p>
                          <p className="text-gray-600 text-sm">Work in progress</p>
                        </div>
                      </div>
                    )
                  
                  case 'getting-started':
                    return (
                      <div key={component.id} className="bg-white rounded-lg shadow p-6 mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">{component.title}</h2>
                        <div className="space-y-4">
                          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">1</div>
                            <div className="ml-4">
                              <p className="font-medium text-gray-900">Create your first page</p>
                              <p className="text-gray-600">Start building your website with a new page</p>
                            </div>
                            <button className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-lg">Create Page</button>
                          </div>
                          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                            <div className="flex-shrink-0 w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center font-semibold">2</div>
                            <div className="ml-4">
                              <p className="font-medium text-gray-900">Choose your sections</p>
                              <p className="text-gray-600">Browse our section library and add sections to your pages</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  
                  case 'pages-grid':
                    return (
                      <div key={component.id} className="bg-white rounded-lg shadow mb-8">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                          <h2 className="text-lg font-semibold text-gray-900">{component.title}</h2>
                          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">Add New Page</button>
                        </div>
                        <div className="p-6">
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="border border-gray-200 rounded-lg p-4">
                              <div className="flex justify-between items-start mb-3">
                                <h3 className="font-medium text-gray-900">Home Page</h3>
                                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">published</span>
                              </div>
                              <p className="text-sm text-gray-600 mb-3">/home</p>
                              <div className="flex space-x-2">
                                <button className="text-sm text-blue-600">Edit</button>
                                <button className="text-sm text-gray-600">Preview</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  
                  default:
                    return null
                }
              })}
          </div>
        </div>
      ) : (
        /* Edit Mode */
        <div className="space-y-6">
          {components
            .sort((a, b) => a.order - b.order)
            .map((component) => (
              <div
                key={component.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-gray-600">
                      {getIconForType(component.icon)}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{component.title}</h3>
                      <p className="text-sm text-gray-500">Type: {component.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      component.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {component.status}
                    </span>
                    <button
                      onClick={() => updateComponent(component.id, { isVisible: !component.isVisible })}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        component.isVisible 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {component.isVisible ? 'Visible' : 'Hidden'}
                    </button>
                    <button
                      onClick={() => deleteComponent(component.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={component.title}
                      onChange={(e) => updateComponent(component.id, { title: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                    <select
                      value={component.icon}
                      onChange={(e) => updateComponent(component.id, { icon: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="users">Users</option>
                      <option value="eye">Eye</option>
                      <option value="heart">Heart</option>
                      <option value="credit-card">Credit Card</option>
                      <option value="settings">Settings</option>
                      <option value="edit">Edit</option>
                      <option value="move">Move</option>
                      <option value="plus">Plus</option>
                      <option value="info">Info</option>
                      <option value="globe">Globe</option>
                      <option value="chart-bar">Chart Bar</option>
                      <option value="chart-line">Chart Line</option>
                      <option value="academic-cap">Academic Cap</option>
                      <option value="document-text">Document Text</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={component.description}
                      onChange={(e) => updateComponent(component.id, { description: e.target.value })}
                      rows={2}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {component.type === 'quick-action' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Link URL</label>
                        <input
                          type="text"
                          value={component.href || ''}
                          onChange={(e) => updateComponent(component.id, { href: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="/dashboard/user/..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                        <input
                          type="text"
                          value={component.buttonText || ''}
                          onChange={(e) => updateComponent(component.id, { buttonText: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </>
                  )}
                  {component.type === 'notice-banner' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
                        <select
                          value={component.backgroundColor || 'bg-blue-50 border-blue-200'}
                          onChange={(e) => updateComponent(component.id, { backgroundColor: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="bg-blue-50 border-blue-200">Blue</option>
                          <option value="bg-green-50 border-green-200">Green</option>
                          <option value="bg-yellow-50 border-yellow-200">Yellow</option>
                          <option value="bg-red-50 border-red-200">Red</option>
                          <option value="bg-purple-50 border-purple-200">Purple</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
                        <select
                          value={component.textColor || 'text-blue-800'}
                          onChange={(e) => updateComponent(component.id, { textColor: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="text-blue-800">Blue</option>
                          <option value="text-green-800">Green</option>
                          <option value="text-yellow-800">Yellow</option>
                          <option value="text-red-800">Red</option>
                          <option value="text-purple-800">Purple</option>
                        </select>
                      </div>
                    </>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                    <input
                      type="number"
                      value={component.order}
                      onChange={(e) => updateComponent(component.id, { order: parseInt(e.target.value) })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={component.status}
                      onChange={(e) => updateComponent(component.id, { status: e.target.value as 'draft' | 'published' })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Publishing Info */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Publishing Information</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>• Changes are saved as drafts until you click "Publish Changes"</p>
              <p>• Publishing will update all user dashboards immediately</p>
              <p>• Users will see the new layout on their next dashboard visit</p>
              <p>• Draft components are not visible to users until published</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}