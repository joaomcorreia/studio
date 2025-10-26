'use client'

import { useState, useEffect } from 'react'
import SectionEditor, { SectionData } from '@/components/admin/SectionEditor'

export default function SectionsPage() {
  const [sections, setSections] = useState<SectionData[]>([])
  const [selectedSection, setSelectedSection] = useState<SectionData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [businessInfo, setBusinessInfo] = useState({
    name: 'Just Code Works',
    industry: 'technology'
  })

  useEffect(() => {
    loadSections()
  }, [])

  const loadSections = async () => {
    setIsLoading(true)
    try {
      // In a real app, this would fetch from your API
      // For now, load mock data with JCW template sections
      const mockSections: SectionData[] = [
        {
          id: '1',
          name: 'Hero Section',
          type: 'hero',
          isVisible: true,
          order: 1,
          content: {
            title: 'Just Code Works',
            subtitle: 'Créez votre site web professionnel en quelques minutes',
            description: 'Plateforme tout-en-un pour créer, gérer et optimiser votre présence en ligne.',
            buttonText: 'Commencer gratuitement',
            buttonUrl: '#pricing',
            backgroundImage: ''
          },
          styling: {
            backgroundColor: '#0a1a5e',
            textColor: '#ffffff',
            padding: 'py-20',
            backgroundType: 'gradient',
            gradient: 'bg-gradient-to-r from-blue-900 to-purple-900'
          },
          metadata: {
            lastModified: new Date(),
            createdBy: 'admin',
            aiGenerated: false
          }
        },
        {
          id: '2',
          name: 'Services Section',
          type: 'services',
          isVisible: true,
          order: 2,
          content: {
            title: 'Nos Services',
            subtitle: 'Solutions complètes pour votre entreprise',
            description: 'Découvrez notre gamme de services conçus pour propulser votre business.',
            items: [
              {
                id: '1',
                title: 'Création de Sites Web',
                description: 'Sites web modernes et responsives adaptés à vos besoins.',
                image: '',
                features: []
              },
              {
                id: '2', 
                title: 'E-commerce',
                description: 'Boutiques en ligne performantes pour maximiser vos ventes.',
                image: '',
                features: []
              },
              {
                id: '3',
                title: 'Marketing Digital',
                description: 'Stratégies digitales pour augmenter votre visibilité.',
                image: '',
                features: []
              }
            ]
          },
          styling: {
            backgroundColor: '#ffffff',
            textColor: '#1a202c',
            padding: 'py-16',
            backgroundType: 'color'
          },
          metadata: {
            lastModified: new Date(),
            createdBy: 'admin',
            aiGenerated: false
          }
        },
        {
          id: '3',
          name: 'Pricing Section',
          type: 'pricing',
          isVisible: true,
          order: 3,
          content: {
            title: 'Nos Tarifs',
            subtitle: 'Des prix transparents pour tous vos projets',
            description: 'Choisissez le plan qui correspond à vos besoins et votre budget.',
            items: [
              {
                id: '1',
                title: 'Starter',
                description: 'Parfait pour commencer votre présence en ligne.',
                price: '€9',
                features: ['Site web basique', 'Hébergement inclus', 'Support email']
              },
              {
                id: '2',
                title: 'Business',
                description: 'Idéal pour les entreprises en croissance.',
                price: '€19',
                features: ['Site web professionnel', 'E-commerce', 'SEO basique', 'Support prioritaire']
              },
              {
                id: '3',
                title: 'Enterprise',
                description: 'Solution complète pour les grandes entreprises.',
                price: '€29',
                features: ['Solution sur-mesure', 'Intégrations avancées', 'Support 24/7', 'Formation incluse']
              }
            ]
          },
          styling: {
            backgroundColor: '#f7fafc',
            textColor: '#1a202c',
            padding: 'py-16',
            backgroundType: 'color'
          },
          metadata: {
            lastModified: new Date(),
            createdBy: 'admin',
            aiGenerated: false
          }
        }
      ]
      
      setSections(mockSections)
      
      // Auto-select first section
      if (mockSections.length > 0) {
        setSelectedSection(mockSections[0])
      }
    } catch (error) {
      console.error('Failed to load sections:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const createNewSection = () => {
    const newSection: SectionData = {
      id: Date.now().toString(),
      name: 'New Section',
      type: 'hero',
      isVisible: true,
      order: sections.length + 1,
      content: {
        title: 'New Section Title',
        subtitle: 'New section subtitle',
        description: 'New section description',
        buttonText: 'Call to Action',
        buttonUrl: '#'
      },
      styling: {
        backgroundColor: '#ffffff',
        textColor: '#1a202c',
        padding: 'py-16',
        backgroundType: 'color'
      },
      metadata: {
        lastModified: new Date(),
        createdBy: 'admin',
        aiGenerated: false
      }
    }
    
    setSections([...sections, newSection])
    setSelectedSection(newSection)
  }

  const handleSectionUpdate = (updatedSection: SectionData) => {
    setSections(sections.map(section => 
      section.id === updatedSection.id ? updatedSection : section
    ))
    setSelectedSection(updatedSection)
  }

  const handleSaveSection = async () => {
    if (!selectedSection) return
    
    setIsSaving(true)
    try {
      // In a real app, this would save to your API
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      console.log('Section saved:', selectedSection)
      
      // Update the sections list
      setSections(sections.map(section => 
        section.id === selectedSection.id ? selectedSection : section
      ))
    } catch (error) {
      console.error('Failed to save section:', error)
      alert('Failed to save section. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePreviewSection = () => {
    // Open preview in new tab
    window.open(`http://localhost:3000?preview=${selectedSection?.id}`, '_blank')
  }

  const deleteSection = async (sectionId: string) => {
    if (!confirm('Are you sure you want to delete this section?')) return
    
    try {
      setSections(sections.filter(section => section.id !== sectionId))
      if (selectedSection?.id === sectionId) {
        setSelectedSection(sections.find(s => s.id !== sectionId) || null)
      }
    } catch (error) {
      console.error('Failed to delete section:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">Loading sections...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Section List */}
      <div className="w-80 bg-white shadow-lg border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Website Sections</h1>
              <p className="text-sm text-gray-500">AI-Powered Content Management</p>
            </div>
          </div>
          <button 
            onClick={createNewSection}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Create New Section</span>
          </button>
        </div>

        {/* Sections List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-3">
            {sections.map((section) => (
              <div
                key={section.id}
                onClick={() => setSelectedSection(section)}
                className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                  selectedSection?.id === section.id
                    ? 'bg-blue-50 border-blue-300 shadow-md'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${section.isVisible ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                    <div>
                      <h3 className="font-medium text-gray-900">{section.name}</h3>
                      <p className="text-sm text-gray-500 capitalize">{section.type} section</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {section.metadata.aiGenerated && (
                      <div className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>AI</span>
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteSection(section.id)
                      }}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="mt-2 text-xs text-gray-400">
                  Order: {section.order} • Modified: {section.metadata.lastModified.toLocaleDateString()}
                </div>
                
                {section.content.title && (
                  <div className="mt-2 text-sm text-gray-600 truncate">
                    "{section.content.title}"
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Statistics Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{sections.length}</div>
              <div className="text-xs text-gray-500">Total Sections</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{sections.filter(s => s.isVisible).length}</div>
              <div className="text-xs text-gray-500">Published</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{sections.filter(s => s.metadata.aiGenerated).length}</div>
              <div className="text-xs text-gray-500">AI Generated</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Section Editor */}
      <div className="flex-1 overflow-y-auto">
        {selectedSection ? (
          <SectionEditor
            section={selectedSection}
            businessName={businessInfo.name}
            industry={businessInfo.industry}
            onSectionUpdate={handleSectionUpdate}
            onPreview={handlePreviewSection}
            onSave={handleSaveSection}
            isLoading={isSaving}
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-50">
            <div className="text-center">
              <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Section to Edit</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Choose a section from the sidebar to start editing its content, design, and settings with AI-powered tools.
              </p>
              {sections.length === 0 && (
                <button
                  onClick={createNewSection}
                  className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Your First Section
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}