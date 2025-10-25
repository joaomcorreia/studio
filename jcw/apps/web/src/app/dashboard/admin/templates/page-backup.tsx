'use client'

import { useState, useEffect } from 'react'
import TemplateUploadModal from '@/components/admin/TemplateUploadModal'
import { templateService, Template, TemplateStats } from '@/services/templateService'

export default function TemplatesPage() {
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [templates, setTemplates] = useState<Template[]>([])
  const [stats, setStats] = useState<TemplateStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Load templates and stats on component mount
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [templatesData, statsData] = await Promise.all([
        templateService.getTemplates(),
        templateService.getStats()
      ])
      setTemplates(templatesData)
      setStats(statsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleUploadTemplate = async (templateData: any) => {
    try {
      const uploadData = {
        name: templateData.name,
        category: templateData.category,
        description: templateData.description,
        preview_image: templateData.file,
        website_type: 'one_page' // Default to one page
      }
      
      const newTemplate = await templateService.uploadTemplate(uploadData)
      setTemplates(prev => [...prev, newTemplate])
      
      // Refresh stats
      const updatedStats = await templateService.getStats()
      setStats(updatedStats)
      
    } catch (error) {
      console.error('Upload failed:', error)
      throw error
    }
  }

  const handleSelectTemplate = async (template: Template) => {
    try {
      // If template already has code, use it
      if (template.html_content && template.css_content) {
        setSelectedTemplate(template)
      } else {
        // Fetch the code from API
        const codeData = await templateService.getTemplateCode(template.id)
        const templateWithCode = {
          ...template,
          html_content: codeData.html_content,
          css_content: codeData.css_content
        }
        setSelectedTemplate(templateWithCode)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load template code')
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Website Templates</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and create website templates for different industries
          </p>
        </div>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Create New Template
        </button>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading templates</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
              <div className="mt-4">
                <button
                  onClick={loadData}
                  className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Template Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-lg p-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Templates</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.total_templates || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="bg-green-100 rounded-lg p-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Active</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.active_templates || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="bg-purple-100 rounded-lg p-3">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h4" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Categories</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.categories_count || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="bg-orange-100 rounded-lg p-3">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Usage</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.total_usage || 0}</p>
                </div>
              </div>
            </div>
          </div>

      {/* Template Categories */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button className="border-b-2 border-blue-500 py-2 px-1 text-sm font-medium text-blue-600">
              All Templates
            </button>
            <button className="border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Restaurant
            </button>
            <button className="border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Business
            </button>
            <button className="border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Portfolio
            </button>
            <button className="border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              E-commerce
            </button>
            <button className="border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Blog
            </button>
          </nav>
        </div>
      </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No templates yet</h3>
                <p className="text-gray-500 mb-4">Create your first template by uploading a screenshot.</p>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Create New Template
                </button>
              </div>
            ) : (
              templates.map((template) => (
                <div key={template.id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div 
                    className="h-48 bg-gray-200 flex items-center justify-center relative cursor-pointer overflow-hidden"
                    onClick={() => handleSelectTemplate(template)}
                  >
                    {template.preview_image_url ? (
                      <img 
                        src={template.preview_image_url} 
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center text-gray-500">
                        <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm">Click to view code</p>
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <span className="bg-black bg-opacity-50 backdrop-blur text-white text-xs px-2 py-1 rounded">
                        {template.category}
                      </span>
                    </div>
                    {template.file_name && (
                      <div className="absolute bottom-2 left-2">
                        <span className="bg-black bg-opacity-50 backdrop-blur text-white text-xs px-2 py-1 rounded">
                          {template.file_name}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        template.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {template.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">
                      {template.description || 'No description available'}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Used by {template.used_by_count} tenants</span>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleSelectTemplate(template)}
                          className="text-blue-600 hover:text-blue-900 text-sm"
                        >
                          View Code
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 text-sm">Preview</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* Upload Modal */}
      <TemplateUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUploadTemplate}
      />

      {/* Code Display Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedTemplate.name} - HTML & CSS
              </h3>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 h-full">
                {/* HTML Code */}
                <div className="flex flex-col">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">HTML</h4>
                  <div className="flex-1 bg-gray-900 rounded-lg overflow-hidden">
                    <pre className="p-4 text-green-400 text-sm overflow-auto h-full">
                      <code>{selectedTemplate.html_content || 'No HTML content available'}</code>
                    </pre>
                  </div>
                </div>
                
                {/* CSS Code */}
                <div className="flex flex-col">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">CSS</h4>
                  <div className="flex-1 bg-gray-900 rounded-lg overflow-hidden">
                    <pre className="p-4 text-blue-400 text-sm overflow-auto h-full">
                      <code>{selectedTemplate.css_content || 'No CSS content available'}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t p-4 bg-gray-50">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => navigator.clipboard.writeText((selectedTemplate.html_content || '') + '\n\n' + (selectedTemplate.css_content || ''))}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Copy Code
                </button>
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}