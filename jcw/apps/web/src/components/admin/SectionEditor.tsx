'use client'

import { useState, useEffect } from 'react'
import AIContentEditor from './AIContentEditor'
import AIImageGenerator from './AIImageGenerator'

export interface SectionData {
  id: string
  name: string
  type: 'hero' | 'services' | 'about' | 'pricing' | 'testimonials' | 'contact' | 'footer' | 'header'
  isVisible: boolean
  order: number
  content: {
    title?: string
    subtitle?: string
    description?: string
    buttonText?: string
    buttonUrl?: string
    backgroundImage?: string
    items?: Array<{
      id: string
      title: string
      description: string
      image?: string
      price?: string
      features?: string[]
    }>
  }
  styling: {
    backgroundColor?: string
    textColor?: string
    padding?: string
    margin?: string
    backgroundType?: 'color' | 'image' | 'gradient'
    gradient?: string
  }
  metadata: {
    lastModified: Date
    createdBy: string
    aiGenerated: boolean
  }
}

interface SectionEditorProps {
  section: SectionData
  businessName?: string
  industry?: string
  onSectionUpdate: (section: SectionData) => void
  onPreview: () => void
  onSave: () => void
  isLoading?: boolean
}

export default function SectionEditor({
  section,
  businessName = 'Your Business',
  industry = 'general',
  onSectionUpdate,
  onPreview,
  onSave,
  isLoading = false
}: SectionEditorProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'design' | 'settings'>('content')
  const [localSection, setLocalSection] = useState<SectionData>(section)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  useEffect(() => {
    setLocalSection(section)
    setHasUnsavedChanges(false)
  }, [section])

  const updateSection = (updates: Partial<SectionData>) => {
    const updatedSection = { 
      ...localSection, 
      ...updates,
      metadata: {
        ...localSection.metadata,
        lastModified: new Date()
      }
    }
    setLocalSection(updatedSection)
    setHasUnsavedChanges(true)
    onSectionUpdate(updatedSection)
  }

  const updateContent = (field: string, value: any) => {
    updateSection({
      content: {
        ...localSection.content,
        [field]: value
      }
    })
  }

  const updateStyling = (field: string, value: any) => {
    updateSection({
      styling: {
        ...localSection.styling,
        [field]: value
      }
    })
  }

  const addItem = () => {
    const newItem = {
      id: Date.now().toString(),
      title: 'New Item',
      description: 'Item description',
      features: []
    }
    
    updateContent('items', [...(localSection.content.items || []), newItem])
  }

  const updateItem = (itemId: string, updates: any) => {
    const updatedItems = (localSection.content.items || []).map(item =>
      item.id === itemId ? { ...item, ...updates } : item
    )
    updateContent('items', updatedItems)
  }

  const removeItem = (itemId: string) => {
    const updatedItems = (localSection.content.items || []).filter(item => item.id !== itemId)
    updateContent('items', updatedItems)
  }

  const renderContentTab = () => (
    <div className="space-y-6">
      {/* Section Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
        <AIContentEditor
          initialContent={localSection.content.title || ''}
          contentType="title"
          businessName={businessName}
          industry={industry}
          placeholder="Enter section title..."
          onContentChange={(content) => updateContent('title', content)}
          multiline={false}
          maxLength={100}
        />
      </div>

      {/* Section Subtitle */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
        <AIContentEditor
          initialContent={localSection.content.subtitle || ''}
          contentType="subtitle"
          businessName={businessName}
          industry={industry}
          placeholder="Enter section subtitle..."
          onContentChange={(content) => updateContent('subtitle', content)}
          multiline={false}
          maxLength={200}
        />
      </div>

      {/* Section Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <AIContentEditor
          initialContent={localSection.content.description || ''}
          contentType="description"
          businessName={businessName}
          industry={industry}
          placeholder="Enter section description..."
          onContentChange={(content) => updateContent('description', content)}
          maxLength={1000}
        />
      </div>

      {/* Button Configuration */}
      {['hero', 'services', 'pricing'].includes(localSection.type) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
            <AIContentEditor
              initialContent={localSection.content.buttonText || ''}
              contentType="button"
              businessName={businessName}
              industry={industry}
              placeholder="Enter button text..."
              onContentChange={(content) => updateContent('buttonText', content)}
              multiline={false}
              maxLength={50}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Button URL</label>
            <input
              type="url"
              value={localSection.content.buttonUrl || ''}
              onChange={(e) => updateContent('buttonUrl', e.target.value)}
              placeholder="https://..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      )}

      {/* Background Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Background Image</label>
        <AIImageGenerator
          businessName={businessName}
          industry={industry}
          imageType="background"
          currentImageUrl={localSection.content.backgroundImage}
          onImageGenerated={(imageUrl) => updateContent('backgroundImage', imageUrl)}
        />
      </div>

      {/* Section Items (for services, pricing, etc.) */}
      {['services', 'pricing', 'testimonials'].includes(localSection.type) && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">
              {localSection.type === 'services' ? 'Services' : 
               localSection.type === 'pricing' ? 'Pricing Plans' : 'Testimonials'}
            </label>
            <button
              onClick={addItem}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              Add Item
            </button>
          </div>

          <div className="space-y-4">
            {(localSection.content.items || []).map((item, index) => (
              <div key={item.id} className="bg-gray-50 p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Item {index + 1}</h4>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <AIContentEditor
                      initialContent={item.title}
                      contentType="service"
                      businessName={businessName}
                      industry={industry}
                      onContentChange={(content) => updateItem(item.id, { title: content })}
                      multiline={false}
                      maxLength={100}
                    />
                  </div>

                  {localSection.type === 'pricing' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                      <input
                        type="text"
                        value={item.price || ''}
                        onChange={(e) => updateItem(item.id, { price: e.target.value })}
                        placeholder="€29/month"
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </div>

                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <AIContentEditor
                    initialContent={item.description}
                    contentType="service"
                    businessName={businessName}
                    industry={industry}
                    onContentChange={(content) => updateItem(item.id, { description: content })}
                    maxLength={300}
                  />
                </div>

                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                  <AIImageGenerator
                    businessName={businessName}
                    industry={industry}
                    imageType="service"
                    currentImageUrl={item.image}
                    onImageGenerated={(imageUrl) => updateItem(item.id, { image: imageUrl })}
                  />
                </div>

                {localSection.type === 'pricing' && (
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Features</label>
                    <textarea
                      value={(item.features || []).join('\n')}
                      onChange={(e) => updateItem(item.id, { features: e.target.value.split('\n').filter(f => f.trim()) })}
                      placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const renderDesignTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Background Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Background Type</label>
          <select
            value={localSection.styling.backgroundType || 'color'}
            onChange={(e) => updateStyling('backgroundType', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="color">Solid Color</option>
            <option value="gradient">Gradient</option>
            <option value="image">Image</option>
          </select>
        </div>

        {/* Background Color */}
        {localSection.styling.backgroundType !== 'image' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
            <div className="flex space-x-2">
              <input
                type="color"
                value={localSection.styling.backgroundColor || '#ffffff'}
                onChange={(e) => updateStyling('backgroundColor', e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded"
              />
              <input
                type="text"
                value={localSection.styling.backgroundColor || '#ffffff'}
                onChange={(e) => updateStyling('backgroundColor', e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                placeholder="#ffffff"
              />
            </div>
          </div>
        )}

        {/* Text Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
          <div className="flex space-x-2">
            <input
              type="color"
              value={localSection.styling.textColor || '#000000'}
              onChange={(e) => updateStyling('textColor', e.target.value)}
              className="w-12 h-10 border border-gray-300 rounded"
            />
            <input
              type="text"
              value={localSection.styling.textColor || '#000000'}
              onChange={(e) => updateStyling('textColor', e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              placeholder="#000000"
            />
          </div>
        </div>

        {/* Padding */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Padding</label>
          <select
            value={localSection.styling.padding || 'py-16'}
            onChange={(e) => updateStyling('padding', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="py-8">Small (32px)</option>
            <option value="py-12">Medium (48px)</option>
            <option value="py-16">Large (64px)</option>
            <option value="py-20">Extra Large (80px)</option>
          </select>
        </div>
      </div>

      {/* Gradient Settings */}
      {localSection.styling.backgroundType === 'gradient' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gradient</label>
          <select
            value={localSection.styling.gradient || 'bg-gradient-to-r from-blue-500 to-purple-600'}
            onChange={(e) => updateStyling('gradient', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="bg-gradient-to-r from-blue-500 to-purple-600">Blue to Purple</option>
            <option value="bg-gradient-to-r from-green-400 to-blue-500">Green to Blue</option>
            <option value="bg-gradient-to-r from-purple-400 to-pink-400">Purple to Pink</option>
            <option value="bg-gradient-to-r from-yellow-400 to-orange-500">Yellow to Orange</option>
            <option value="bg-gradient-to-r from-gray-700 to-gray-900">Dark Gray</option>
          </select>
        </div>
      )}
    </div>
  )

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Visibility */}
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={localSection.isVisible}
              onChange={(e) => updateSection({ isVisible: e.target.checked })}
              className="rounded border-gray-300"
            />
            <span className="text-sm font-medium text-gray-700">Visible on website</span>
          </label>
        </div>

        {/* Section Order */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
          <input
            type="number"
            value={localSection.order}
            onChange={(e) => updateSection({ order: parseInt(e.target.value) })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            min="0"
          />
        </div>
      </div>

      {/* Section Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Section Name</label>
        <input
          type="text"
          value={localSection.name}
          onChange={(e) => updateSection({ name: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Enter section name..."
        />
      </div>

      {/* Metadata */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Section Information</h4>
        <div className="space-y-2 text-sm text-gray-600">
          <p><strong>Type:</strong> {localSection.type}</p>
          <p><strong>Last Modified:</strong> {localSection.metadata.lastModified.toLocaleString()}</p>
          <p><strong>Created By:</strong> {localSection.metadata.createdBy}</p>
          {localSection.metadata.aiGenerated && (
            <p className="flex items-center space-x-1">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Contains AI-generated content</span>
            </p>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="section-editor bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{localSection.name}</h2>
          <p className="text-sm text-gray-500 capitalize">{localSection.type} section</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onPreview}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Preview
          </button>
          <button
            onClick={onSave}
            disabled={!hasUnsavedChanges || isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {[
          { id: 'content', label: 'Content', icon: '📝' },
          { id: 'design', label: 'Design', icon: '🎨' },
          { id: 'settings', label: 'Settings', icon: '⚙️' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-6 py-4 font-medium text-sm transition-colors ${
              activeTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'content' && renderContentTab()}
        {activeTab === 'design' && renderDesignTab()}
        {activeTab === 'settings' && renderSettingsTab()}
      </div>

      {/* Unsaved Changes Warning */}
      {hasUnsavedChanges && (
        <div className="bg-yellow-50 border-t border-yellow-200 p-4">
          <div className="flex items-center space-x-2 text-yellow-800">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-sm font-medium">You have unsaved changes</span>
          </div>
        </div>
      )}
    </div>
  )
}