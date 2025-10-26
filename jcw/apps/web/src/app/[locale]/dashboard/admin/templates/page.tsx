'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { templateService, Template, TemplateStats } from '@/services/templateService'
import TemplateUploadModal from '@/components/admin/TemplateUploadModal'
import TemplateEditModal from '@/components/admin/TemplateEditModal'
import TemplateDeleteModal from '@/components/admin/TemplateDeleteModal'

export default function TemplatesPage() {
  const t = useTranslations('admin');
  const tCommon = useTranslations('common');
  const tDashboard = useTranslations('dashboard');
  const [templates, setTemplates] = useState<Template[]>([])
  const [stats, setStats] = useState<TemplateStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const [deletingTemplate, setDeletingTemplate] = useState<Template | null>(null)
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([])
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // Load templates and stats from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [templatesData, statsData, categoriesData] = await Promise.all([
          templateService.getTemplates(),
          templateService.getStats(),
          templateService.getCategories()
        ])
        setTemplates(templatesData)
        setStats(statsData)
        setCategories(categoriesData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load templates')
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  // Handle template upload
  const handleUpload = async (templateData: {
    name: string
    category: string  
    description: string
    file: File
    previewUrl: string
  }) => {
    try {
      const uploadData = {
        name: templateData.name,
        category: templateData.category,
        description: templateData.description,
        preview_image: templateData.file,
        website_type: 'one_page' // Default to one_page for all templates
      }
      
      const newTemplate = await templateService.uploadTemplate(uploadData)
      setTemplates(prev => [newTemplate, ...prev])
      setShowUploadModal(false)
      
      // Refresh stats
      const updatedStats = await templateService.getStats()
      setStats(updatedStats)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload template')
    }
  }

  // Handle template edit
  const handleEdit = (template: Template) => {
    setEditingTemplate(template)
    setShowEditModal(true)
  }

  // Handle template update
  const handleUpdate = async (updatedTemplate: Template) => {
    try {
      const updated = await templateService.updateTemplate(updatedTemplate.id, {
        name: updatedTemplate.name,
        category: updatedTemplate.category,
        description: updatedTemplate.description,
        is_active: updatedTemplate.is_active
      })
      
      setTemplates(prev => 
        prev.map(template => 
          template.id === updated.id ? updated : template
        )
      )
      
      // Update selected template if it's currently being viewed
      if (selectedTemplate && selectedTemplate.id === updated.id) {
        setSelectedTemplate(updated)
      }
      
      setShowEditModal(false)
      setEditingTemplate(null)
      
      // Refresh stats
      const updatedStats = await templateService.getStats()
      setStats(updatedStats)
      
      return updated
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update template')
    }
  }

  // Handle template delete
  const handleDelete = (template: Template) => {
    setDeletingTemplate(template)
    setShowDeleteModal(true)
  }

  // Handle template delete confirmation
  const handleDeleteConfirm = async (templateId: string) => {
    try {
      await templateService.deleteTemplate(templateId)
      
      setTemplates(prev => prev.filter(template => template.id !== templateId))
      
      // Close template code view if deleted template was selected
      if (selectedTemplate && selectedTemplate.id === templateId) {
        setSelectedTemplate(null)
      }
      
      setShowDeleteModal(false)
      setDeletingTemplate(null)
      
      // Refresh stats
      const updatedStats = await templateService.getStats()
      setStats(updatedStats)
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete template')
    }
  }

  // Handle template status toggle
  const handleToggleStatus = async (template: Template) => {
    try {
      setActionLoading(template.id)
      const updated = await templateService.toggleTemplateStatus(template.id)
      
      setTemplates(prev => 
        prev.map(t => 
          t.id === updated.id ? updated : t
        )
      )
      
      // Update selected template if it's currently being viewed
      if (selectedTemplate && selectedTemplate.id === updated.id) {
        setSelectedTemplate(updated)
      }
      
      // Refresh stats
      const updatedStats = await templateService.getStats()
      setStats(updatedStats)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle template status')
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('manageTemplates')}</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and create website templates for different industries
          </p>
        </div>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          {t('createTemplate')}
        </button>
      </div>

      {/* Template Stats */}
      {stats && (
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
                <p className="text-2xl font-bold text-gray-900">{stats.total_templates}</p>
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
                <p className="text-2xl font-bold text-gray-900">{stats.active_templates}</p>
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
                <p className="text-2xl font-bold text-gray-900">{stats.categories_count}</p>
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
                <p className="text-2xl font-bold text-gray-900">{stats.total_usage}</p>
              </div>
            </div>
          </div>
        </div>
      )}

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
                className="h-[432px] bg-gray-200 flex items-center justify-center relative cursor-pointer overflow-hidden"
                onClick={() => setSelectedTemplate(template)}
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
                  {template.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Used by {template.used_by_count} tenants</span>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setSelectedTemplate(template)}
                      className="text-blue-600 hover:text-blue-900 text-sm"
                    >
                      View Code
                    </button>
                    <button 
                      onClick={() => handleEdit(template)}
                      className="text-green-600 hover:text-green-900 text-sm"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleToggleStatus(template)}
                      disabled={actionLoading === template.id}
                      className="text-purple-600 hover:text-purple-900 text-sm disabled:opacity-50"
                    >
                      {actionLoading === template.id ? '...' : (template.is_active ? 'Deactivate' : 'Activate')}
                    </button>
                    <button 
                      onClick={() => handleDelete(template)}
                      className="text-red-600 hover:text-red-900 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Template Code Display Section */}
      {selectedTemplate && (
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedTemplate.name} - Template Code
              </h3>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-700">HTML</h4>
                  <button
                    onClick={() => navigator.clipboard.writeText(selectedTemplate.html_content)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1 rounded transition-colors"
                  >
                    Copy HTML
                  </button>
                </div>
                <div className="bg-gray-900 rounded-lg overflow-hidden">
                  <pre className="p-4 text-green-400 text-sm overflow-auto max-h-[36rem]">
                    <code>{selectedTemplate.html_content}</code>
                  </pre>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-700">CSS</h4>
                  <button
                    onClick={() => navigator.clipboard.writeText(selectedTemplate.css_content)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1 rounded transition-colors"
                  >
                    Copy CSS
                  </button>
                </div>
                <div className="bg-gray-900 rounded-lg overflow-hidden">
                  <pre className="p-4 text-blue-400 text-sm overflow-auto max-h-[36rem]">
                    <code>{selectedTemplate.css_content}</code>
                  </pre>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                <span className="font-medium">Category:</span> {selectedTemplate.category} • 
                <span className="font-medium ml-2">File:</span> {selectedTemplate.file_name} • 
                <span className="font-medium ml-2">Type:</span> {selectedTemplate.website_type}
              </div>
              <div className="space-x-3">
                <button
                  onClick={() => navigator.clipboard.writeText(selectedTemplate.html_content + '\n\n/* CSS */\n\n' + selectedTemplate.css_content)}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Copy All Code
                </button>
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Hide Code
                </button>
              </div>
            </div>
          </div>
        </div>
      )}



      {/* Upload Modal */}
      <TemplateUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUpload}
      />

      {/* Edit Modal */}
      <TemplateEditModal
        template={editingTemplate}
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setEditingTemplate(null)
        }}
        onSave={handleUpdate}
        categories={categories}
      />

      {/* Delete Modal */}
      <TemplateDeleteModal
        template={deletingTemplate}
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setDeletingTemplate(null)
        }}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}