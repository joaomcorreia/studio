'use client'

import { useState } from 'react'
import { Template } from '@/services/templateService'

interface TemplateDeleteModalProps {
  template: Template | null
  isOpen: boolean
  onClose: () => void
  onConfirm: (templateId: string) => void
}

export default function TemplateDeleteModal({
  template,
  isOpen,
  onClose,
  onConfirm
}: TemplateDeleteModalProps) {
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    if (!template) return

    setLoading(true)
    try {
      await onConfirm(template.id)
      onClose()
    } catch (err) {
      // Error handling is done in parent component
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !template) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                Delete Template
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Are you sure you want to delete this template?
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              {template.preview_image_url && (
                <img
                  src={template.preview_image_url}
                  alt={template.name}
                  className="w-12 h-12 object-cover rounded"
                />
              )}
              <div>
                <p className="text-sm font-medium text-gray-900">{template.name}</p>
                <p className="text-sm text-gray-500">{template.category}</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  This action cannot be undone
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    This will permanently delete the template including all its files and generated code. 
                    {template.used_by_count > 0 && (
                      <span className="font-medium">
                        {' '}This template is currently used by {template.used_by_count} project(s).
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete Template'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}