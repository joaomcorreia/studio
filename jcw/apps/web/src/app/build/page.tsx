'use client'

import { useState, FormEvent, ChangeEvent, useEffect } from 'react'
import MagicAI from '../../lib/magicAI'

// Common services by industry
const servicesByIndustry = {
  restaurant: [
    'Dine-in Service', 'Takeout/Delivery', 'Catering', 'Private Events', 
    'Online Reservations', 'Bar Service', 'Live Music', 'Outdoor Seating'
  ],
  retail: [
    'In-store Shopping', 'Online Shopping', 'Personal Shopping', 'Gift Cards',
    'Returns & Exchanges', 'Loyalty Program', 'Custom Orders', 'Alterations'
  ],
  services: [
    'Consultation', 'Installation', 'Maintenance', 'Repair Service',
    'Emergency Service', '24/7 Support', 'Free Estimates', 'Warranty'
  ],
  healthcare: [
    'General Checkups', 'Preventive Care', 'Diagnostic Services', 'Treatment',
    'Emergency Care', 'Telemedicine', 'Health Screening', 'Specialist Referrals'
  ],
  other: [
    'Consultation', 'Custom Solutions', 'Support Services', 'Training',
    'Installation', 'Maintenance', 'Online Services', 'Customer Support'
  ]
}

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
  const [services, setServices] = useState({
    selected: [] as string[],
    custom: ''
  })
  const [suggestedSlug, setSuggestedSlug] = useState('')
  const [devUrl, setDevUrl] = useState('')
  const [contentInfo, setContentInfo] = useState({
    description: '',
    target_audience: '',
    key_message: '',
    call_to_action: ''
  })
  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [folders, setFolders] = useState<string[]>(['Root'])
  const [currentFolder, setCurrentFolder] = useState('Root')
  const [selectedImages, setSelectedImages] = useState<number[]>([])
  const [imagesByFolder, setImagesByFolder] = useState<{[key: string]: {files: File[], previews: string[]}}>({
    'Root': { files: [], previews: [] }
  })
  const [showCreateFolder, setShowCreateFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState('All')
  const [isLoading, setIsLoading] = useState(false)
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [showWebsiteSection, setShowWebsiteSection] = useState(false)
  const [showServicesSection, setShowServicesSection] = useState(false)
  const [showContentSection, setShowContentSection] = useState(false)
  const [showImageSection, setShowImageSection] = useState(false)
  const [showLogoSection, setShowLogoSection] = useState(false)
  const [logoChoice, setLogoChoice] = useState<'upload' | 'generate' | null>(null)
  const [uploadedLogo, setUploadedLogo] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>('')
  const [generatedLogoUrl, setGeneratedLogoUrl] = useState<string>('')
  const [isGeneratingLogo, setIsGeneratingLogo] = useState(false)
  const [showTemplateSection, setShowTemplateSection] = useState(false)
  const [templates, setTemplates] = useState<any[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [selectedTemplateData, setSelectedTemplateData] = useState<any | null>(null)
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false)
  const [showPrintingSection, setShowPrintingSection] = useState(false)

  // Show logo section when a logo choice is made
  useEffect(() => {
    if (logoChoice && !showLogoSection) {
      const timer = setTimeout(() => setShowLogoSection(true), 100)
      return () => clearTimeout(timer)
    }
  }, [logoChoice, showLogoSection])

  // Show template section after logo is completed (uploaded or generated)
  useEffect(() => {
    if ((uploadedLogo || generatedLogoUrl) && !showTemplateSection) {
      const timer = setTimeout(() => {
        setShowTemplateSection(true)
        loadTemplates()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [uploadedLogo, generatedLogoUrl, showTemplateSection])

  const checkSlug = async (business_name: string) => {
    if (!business_name) return
    
    // Generate slug locally for immediate preview
    const slug = business_name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    
    setSuggestedSlug(slug)
    
    // Update dev URL preview to localhost
    setDevUrl(`http://localhost:3000/build/${slug}/`)
    
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
        // Only update if server suggests different slug
        if (data.suggested_slug !== slug) {
          setSuggestedSlug(data.suggested_slug)
          setDevUrl(`http://localhost:3000/build/${data.suggested_slug}/`)
        }
        setDevUrl(data.dev_url)
      }
    } catch (error) {
      console.error('Slug check failed:', error)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    console.log('Form submitted!')
    console.log('Form data:', formData)
    console.log('Website info:', websiteInfo)
    console.log('Selected template:', selectedTemplate)
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
          custom_domain: websiteInfo.custom_domain,
          services: services.selected,
          custom_services: services.custom,
          content_info: contentInfo,
          images_count: uploadedImages.length,
          folders: folders,
          images_by_folder: Object.fromEntries(
            Object.entries(imagesByFolder).map(([folder, data]) => [
              folder, 
              { count: data.files.length }
            ])
          ),
          logo_info: {
            choice: logoChoice,
            uploaded: uploadedLogo ? true : false,
            generated: generatedLogoUrl ? true : false
          },
          selected_template: selectedTemplate
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('API Response:', data)
        setResult(data)
      } else {
        console.error('API request failed with status:', response.status)
        const errorData = await response.json()
        console.error('Error data:', errorData)
        setResult({ success: false, error: errorData })
      }
      
      // Show printing section instead of opening new tab
      setShowPrintingSection(true)
      
    } catch (error) {
      console.error('Network error:', error)
      setResult({ success: false, error: 'Network error occurred' })
      // Still show printing section even if API fails
      setShowPrintingSection(true)
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
    
    // Show content section after website name is entered
    if (value.length >= 2 && !showContentSection) {
      setShowContentSection(true)
    }
  }

  const handleServiceChange = (service: string, checked: boolean) => {
    const newSelected = checked 
      ? [...services.selected, service]
      : services.selected.filter(s => s !== service)
    
    setServices(prev => ({
      ...prev,
      selected: newSelected
    }))
    
    // Show image upload section when first service is selected
    if (newSelected.length > 0 && !showImageSection) {
      setShowImageSection(true)
    }
  }

  const handleCustomServicesChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setServices(prev => ({ ...prev, custom: e.target.value }))
  }

  const handleContentChange = (field: keyof typeof contentInfo, value: string) => {
    setContentInfo(prev => ({ ...prev, [field]: value }))
    
    // Show services section after description is entered (50+ characters)
    if (field === 'description' && value.length >= 50 && !showServicesSection) {
      setShowServicesSection(true)
    }
  }

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return

    const newFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024 // 5MB limit
    )

    if (newFiles.length === 0) {
      alert('Please select valid image files (max 5MB each)')
      return
    }

    // Create preview URLs
    const newPreviews = newFiles.map(file => URL.createObjectURL(file))
    
    // Add to current folder
    setImagesByFolder(prev => ({
      ...prev,
      [currentFolder]: {
        files: [...prev[currentFolder].files, ...newFiles],
        previews: [...prev[currentFolder].previews, ...newPreviews]
      }
    }))
    
    // Update legacy arrays for backward compatibility
    setUploadedImages(prev => [...prev, ...newFiles])
    setImagePreviews(prev => [...prev, ...newPreviews])
  }

  const removeImage = (index: number) => {
    const folderData = imagesByFolder[currentFolder]
    if (!folderData || index >= folderData.previews.length) return

    // Revoke the object URL to prevent memory leaks
    URL.revokeObjectURL(folderData.previews[index])
    
    // Remove from current folder
    setImagesByFolder(prev => ({
      ...prev,
      [currentFolder]: {
        files: prev[currentFolder].files.filter((_, i) => i !== index),
        previews: prev[currentFolder].previews.filter((_, i) => i !== index)
      }
    }))

    // Update legacy arrays
    const globalIndex = uploadedImages.findIndex((_, i) => 
      imagePreviews[i] === folderData.previews[index]
    )
    if (globalIndex >= 0) {
      setUploadedImages(prev => prev.filter((_, i) => i !== globalIndex))
      setImagePreviews(prev => prev.filter((_, i) => i !== globalIndex))
    }

    // Remove from selected if selected
    setSelectedImages(prev => prev.filter(i => i !== index))
  }

  const createFolder = () => {
    if (!newFolderName.trim()) return
    
    const folderName = newFolderName.trim()
    if (folders.includes(folderName)) {
      alert('Folder already exists!')
      return
    }

    setFolders(prev => [...prev, folderName])
    setImagesByFolder(prev => ({
      ...prev,
      [folderName]: { files: [], previews: [] }
    }))
    setNewFolderName('')
    setShowCreateFolder(false)
  }

  const selectAllImages = () => {
    const folderData = imagesByFolder[currentFolder]
    if (!folderData) return

    if (selectedImages.length === folderData.files.length) {
      setSelectedImages([])
    } else {
      setSelectedImages(folderData.files.map((_, index) => index))
    }
  }

  const deleteSelectedImages = () => {
    if (selectedImages.length === 0) return

    const folderData = imagesByFolder[currentFolder]
    if (!folderData) return

    // Revoke URLs for selected images
    selectedImages.forEach(index => {
      if (folderData.previews[index]) {
        URL.revokeObjectURL(folderData.previews[index])
      }
    })

    // Remove selected images
    const remainingFiles = folderData.files.filter((_, index) => !selectedImages.includes(index))
    const remainingPreviews = folderData.previews.filter((_, index) => !selectedImages.includes(index))

    setImagesByFolder(prev => ({
      ...prev,
      [currentFolder]: {
        files: remainingFiles,
        previews: remainingPreviews
      }
    }))

    // Update legacy arrays
    const allFiles: File[] = []
    const allPreviews: string[] = []
    Object.values(imagesByFolder).forEach(folder => {
      if (folder === folderData) {
        allFiles.push(...remainingFiles)
        allPreviews.push(...remainingPreviews)
      } else {
        allFiles.push(...folder.files)
        allPreviews.push(...folder.previews)
      }
    })
    
    setUploadedImages(allFiles)
    setImagePreviews(allPreviews)
    setSelectedImages([])
  }

  const toggleImageSelection = (index: number) => {
    setSelectedImages(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const moveImageToFolder = (imageIndex: number, sourceFolder: string, targetFolder: string) => {
    const sourceFolderData = imagesByFolder[sourceFolder]
    if (!sourceFolderData || imageIndex >= sourceFolderData.files.length) return

    const file = sourceFolderData.files[imageIndex]
    const preview = sourceFolderData.previews[imageIndex]

    // Remove from source folder
    const newSourceFiles = sourceFolderData.files.filter((_, i) => i !== imageIndex)
    const newSourcePreviews = sourceFolderData.previews.filter((_, i) => i !== imageIndex)

    // Add to target folder
    const targetFolderData = imagesByFolder[targetFolder]
    const newTargetFiles = [...targetFolderData.files, file]
    const newTargetPreviews = [...targetFolderData.previews, preview]

    // Update both folders
    setImagesByFolder(prev => ({
      ...prev,
      [sourceFolder]: {
        files: newSourceFiles,
        previews: newSourcePreviews
      },
      [targetFolder]: {
        files: newTargetFiles,
        previews: newTargetPreviews
      }
    }))

    // Update legacy arrays
    const allFiles: File[] = []
    const allPreviews: string[] = []
    Object.entries(imagesByFolder).forEach(([folderName, folder]) => {
      if (folderName === sourceFolder) {
        allFiles.push(...newSourceFiles)
        allPreviews.push(...newSourcePreviews)
      } else if (folderName === targetFolder) {
        allFiles.push(...newTargetFiles)
        allPreviews.push(...newTargetPreviews)
      } else {
        allFiles.push(...folder.files)
        allPreviews.push(...folder.previews)
      }
    })
    
    setUploadedImages(allFiles)
    setImagePreviews(allPreviews)

    // Clear selections
    setSelectedImages([])
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleImageUpload(e.dataTransfer.files)
  }

  const generateAIContent = async (contentType: 'description' | 'key_message') => {
    if (!formData.business_name) {
      alert('Please enter your business name first')
      return
    }

    setIsGeneratingAI(true)
    
    try {
      let result
      const existingContent = contentType === 'description' ? contentInfo.description : contentInfo.key_message
      
      if (contentType === 'description') {
        result = await MagicAI.generateDescription(
          formData.business_name,
          formData.industry_category,
          existingContent
        )
      } else if (contentType === 'key_message') {
        result = await MagicAI.generateKeyMessage(
          formData.business_name,
          formData.industry_category,
          existingContent
        )
      }

      if (result?.success) {
        if (contentType === 'description') {
          setContentInfo(prev => ({ ...prev, description: result.content || '' }))
          // Trigger services section if description is long enough
          if ((result.content?.length || 0) >= 50 && !showServicesSection) {
            setShowServicesSection(true)
          }
        } else if (contentType === 'key_message') {
          setContentInfo(prev => ({ ...prev, key_message: result.content || '' }))
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

  const generateAIServiceSuggestions = (description: string, industry: string): string[] => {
    // AI-powered service suggestions based on content and industry
    const keywordMap: { [key: string]: string[] } = {
      // Food & Restaurant keywords
      restaurant: ['dine-in service', 'takeout', 'catering', 'private events', 'reservations'],
      food: ['delivery', 'catering', 'meal prep', 'cooking classes', 'custom orders'],
      italian: ['authentic recipes', 'wine pairing', 'pasta making classes', 'family recipes'],
      family: ['kid-friendly menu', 'family packages', 'birthday parties', 'group dining'],
      fresh: ['daily specials', 'seasonal menu', 'farm-to-table', 'organic options'],
      
      // Business & Services keywords
      consulting: ['business consultation', 'strategic planning', 'expert advice', 'custom solutions'],
      digital: ['digital marketing', 'online presence', 'social media', 'website design'],
      marketing: ['brand strategy', 'advertising campaigns', 'market analysis', 'lead generation'],
      technology: ['tech solutions', 'system integration', 'automation', 'technical support'],
      
      // Health & Wellness keywords
      health: ['wellness programs', 'health screenings', 'preventive care', 'fitness plans'],
      wellness: ['holistic treatments', 'stress management', 'lifestyle coaching', 'nutrition guidance'],
      therapy: ['individual sessions', 'group therapy', 'specialized treatment', 'follow-up care'],
      
      // Retail & Shopping keywords
      boutique: ['personal styling', 'custom fitting', 'exclusive collections', 'personal shopping'],
      fashion: ['style consultation', 'wardrobe planning', 'fashion advice', 'trend updates'],
      custom: ['personalized service', 'made-to-order', 'bespoke solutions', 'tailored approach']
    }
    
    const baseServices = servicesByIndustry[industry as keyof typeof servicesByIndustry] || servicesByIndustry.other
    const aiSuggestions: string[] = []
    
    // Extract AI suggestions based on description content
    const descriptionLower = description.toLowerCase()
    Object.entries(keywordMap).forEach(([keyword, suggestions]) => {
      if (descriptionLower.includes(keyword)) {
        aiSuggestions.push(...suggestions)
      }
    })
    
    // Remove duplicates and combine with base services
    const combinedServices = [...baseServices, ...aiSuggestions]
    const uniqueServices = combinedServices.filter((service, index) => 
      combinedServices.indexOf(service) === index
    )
    return uniqueServices.slice(0, 12) // Limit to 12 suggestions
  }

  const generateSlugFromWebsiteName = (websiteName: string) => {
    if (!websiteName) return
    
    const slug = websiteName
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    
    setWebsiteInfo(prev => ({ ...prev, slug }))
    
    // Update preview URL to localhost
    setDevUrl(`http://localhost:3000/build/${slug}/`)
  }

  // Logo handling functions
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file')
      return
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      alert('Logo file size must be less than 2MB')
      return
    }

    // Create preview
    const preview = URL.createObjectURL(file)
    setUploadedLogo(file)
    setLogoPreview(preview)
    setShowLogoSection(true)
  }

  const removeLogo = () => {
    if (logoPreview) {
      URL.revokeObjectURL(logoPreview)
    }
    setUploadedLogo(null)
    setLogoPreview('')
  }

  const generateLogo = async () => {
    if (!formData.business_name || !formData.industry_category) {
      alert('Please complete business name and category first')
      return
    }

    setIsGeneratingLogo(true)
    
    try {
      // Placeholder for Freepik API integration
      // This will be replaced with actual Freepik API call later
      
      // Simulated API call delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Generate a placeholder logo URL (in real implementation, this would come from Freepik API)
      // Using a different placeholder service that works better
      const businessInitials = formData.business_name.slice(0, 3).toUpperCase()
      const mockLogoUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(businessInitials)}&size=200&background=4F46E5&color=FFFFFF&bold=true&format=png`
      
      setGeneratedLogoUrl(mockLogoUrl)
      setShowLogoSection(true)
      
      // TODO: Replace with actual Freepik API integration
      console.log('Generating logo for:', {
        business_name: formData.business_name,
        category: formData.industry_category,
        // Additional parameters for Freepik API:
        // - style: 'modern', 'classic', 'minimalist', etc.
        // - colors: based on industry category
        // - elements: industry-specific icons/symbols
      })
      
    } catch (error) {
      console.error('Logo generation failed:', error)
      alert('Failed to generate logo. Please try again.')
    } finally {
      setIsGeneratingLogo(false)
    }
  }

  // Load available templates from API
  const loadTemplates = async () => {
    if (templates.length > 0) return // Already loaded
    
    setIsLoadingTemplates(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'}/templates/`)
      if (response.ok) {
        const data = await response.json()
        setTemplates(data)
      } else {
        console.error('Failed to load templates')
      }
    } catch (error) {
      console.error('Error loading templates:', error)
    } finally {
      setIsLoadingTemplates(false)
    }
  }

  // Handle template selection and update preview
  const handleTemplateSelection = (templateId: string) => {
    setSelectedTemplate(templateId)
    const templateData = templates.find(t => t.id === templateId)
    setSelectedTemplateData(templateData)
  }

  if (result?.success) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <h1 className="text-2xl font-bold text-green-800 mb-4">🎉 Website Created Successfully!</h1>
          <p className="text-green-700 mb-6">{result.message}</p>
          
          <div className="bg-white rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-2">Your website is now live at:</p>
            <div className="font-mono text-sm bg-gray-100 p-2 rounded border mb-3">
              {(() => {
                const generateSlugHelper = (text: string): string => {
                  return text
                    .toLowerCase()
                    .trim()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-')
                    .replace(/^-+|-+$/g, '')
                }
                const businessSlug = websiteInfo.slug || suggestedSlug || generateSlugHelper(formData.business_name)
                return `http://localhost:3000/build/${businessSlug}/`
              })()}
            </div>
            <p className="text-xs text-gray-500">
              ✨ Your website opened automatically in a new tab
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={() => {
                const generateSlugHelper = (text: string): string => {
                  return text
                    .toLowerCase()
                    .trim()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-')
                    .replace(/^-+|-+$/g, '')
                }
                const businessSlug = websiteInfo.slug || suggestedSlug || generateSlugHelper(formData.business_name)
                const localhostUrl = `http://localhost:3000/build/${businessSlug}/`
                window.open(localhostUrl, '_blank', 'noopener,noreferrer')
              }}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View My Website
            </button>
            
            <button 
              onClick={() => window.location.href = '/dashboard/user'}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Go to Dashboard
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-green-200">
            <p className="text-sm text-green-600">
              🚀 <strong>What's Next?</strong>
            </p>
            <ul className="text-sm text-green-700 mt-2 space-y-1">
              <li>• Customize your website further in the dashboard</li>
              <li>• Connect your custom domain</li>
              <li>• Add more content and pages</li>
              <li>• Set up analytics and SEO</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8 px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Build Your Website
        </h1>
        
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-5 space-y-6">
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
              {/* Progress Indicator */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{showImageSection ? '5/5' : showServicesSection ? '4/5' : showContentSection ? '3/5' : showWebsiteSection ? '2/5' : '1/5'} steps</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: showTemplateSection ? '100%' : showLogoSection ? '85%' : showImageSection ? '70%' : showServicesSection ? '57%' : showContentSection ? '43%' : showWebsiteSection ? '28%' : '14%'
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span className={showWebsiteSection || showContentSection || showServicesSection || showImageSection || showLogoSection || showTemplateSection ? 'text-blue-600 font-medium' : ''}>Business</span>
                  <span className={showWebsiteSection ? (showContentSection || showServicesSection || showImageSection || showLogoSection || showTemplateSection ? 'text-blue-600 font-medium' : 'text-gray-700') : ''}>Website</span>
                  <span className={showContentSection ? (showServicesSection || showImageSection || showLogoSection || showTemplateSection ? 'text-blue-600 font-medium' : 'text-gray-700') : ''}>Content</span>
                  <span className={showServicesSection ? (showImageSection || showLogoSection || showTemplateSection ? 'text-blue-600 font-medium' : 'text-gray-700') : ''}>Services</span>
                  <span className={showImageSection ? (showLogoSection || showTemplateSection ? 'text-blue-600 font-medium' : 'text-gray-700') : ''}>Images</span>
                  <span className={showLogoSection ? (showTemplateSection ? 'text-blue-600 font-medium' : 'text-gray-700') : ''}>Logo</span>
                  <span className={showTemplateSection ? 'text-blue-600 font-medium' : ''}>Template</span>
                </div>
              </div>

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

              {/* Website Content & Description Section - appears after website name */}
              {showContentSection && (
                <div className="bg-purple-50 rounded-lg p-6 mb-6 border-l-4 border-purple-500 animate-fadeIn">
                  <h2 className="text-xl font-semibold mb-6 text-gray-900">Website Content & Messaging</h2>
                  <p className="text-sm text-gray-600 mb-6">
                    🎯 Tell us about your business to help our AI create compelling content and suggest relevant services
                  </p>
                  
                  <div className="space-y-6">
                    {/* Business Description with AI Generation */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Business Description *
                        </label>
                        <button
                          type="button"
                          onClick={() => generateAIContent('description')}
                          disabled={!formData.business_name || isGeneratingAI}
                          className="inline-flex items-center px-3 py-1 text-xs font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-full hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          {isGeneratingAI ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Generating...
                            </>
                          ) : (
                            <>
                              <svg className="mr-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                              AI Generate
                            </>
                          )}
                        </button>
                      </div>
                      <textarea
                        required
                        value={contentInfo.description}
                        onChange={(e) => handleContentChange('description', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                        rows={4}
                        maxLength={500}
                        placeholder="Describe your business in detail. What makes you unique? What's your story? What services do you offer?"
                      />
                      <div className="flex justify-between items-start mt-1">
                        <p className="text-xs text-gray-500">
                          💡 Be descriptive! This helps our AI suggest relevant services and create better content.
                        </p>
                        <span className="text-xs text-gray-400 ml-2">
                          {contentInfo.description.length}/500
                        </span>
                      </div>
                      {!formData.business_name && (
                        <p className="text-xs text-amber-600 mt-1">
                          ⚠️ Enter business name above to enable AI generation
                        </p>
                      )}
                      {formData.business_name && !isGeneratingAI && (
                        <p className="text-xs text-emerald-600 mt-1">
                          ✨ AI Ready! Click "AI Generate" to create compelling content automatically
                        </p>
                      )}
                    </div>

                    {/* Content Strategy Notice */}
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-blue-800">Need to define your target audience and key messaging?</p>
                          <p className="text-sm text-blue-700 mt-1">
                            Complete your content strategy in the user dashboard for better website results.
                          </p>
                          <div className="mt-2">
                            <button
                              onClick={() => window.open('/dashboard/user/content-strategy', '_blank')}
                              className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
                            >
                              <svg className="mr-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              Go to Content Strategy
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Content Preview & AI Analysis */}
                  {contentInfo.description && (
                    <div className="mt-6 p-4 bg-white border border-purple-200 rounded-lg">
                      <h4 className="text-sm font-medium text-purple-700 mb-3">✨ Content Preview</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p><strong>Story:</strong> {contentInfo.description.substring(0, 100)}{contentInfo.description.length > 100 ? '...' : ''}</p>
                        {contentInfo.target_audience && (
                          <p><strong>Audience:</strong> {contentInfo.target_audience}</p>
                        )}
                        {contentInfo.key_message && (
                          <p><strong>Key Message:</strong> {contentInfo.key_message}</p>
                        )}
                        {contentInfo.call_to_action && (
                          <p><strong>Main Action:</strong> {contentInfo.call_to_action.charAt(0).toUpperCase() + contentInfo.call_to_action.slice(1)}</p>
                        )}
                      </div>
                      
                      {isGeneratingAI && (
                        <div className="mt-3 p-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded border-l-2 border-purple-400 animate-pulse">
                          <p className="text-xs text-purple-700 font-medium">🤖 AI is generating content...</p>
                          <p className="text-xs text-purple-600">Please wait while we create compelling copy for you!</p>
                        </div>
                      )}
                      
                      {!isGeneratingAI && contentInfo.description.length >= 50 && (
                        <div className="mt-3 p-2 bg-blue-50 rounded border-l-2 border-blue-400">
                          <p className="text-xs text-blue-700 font-medium">🤖 AI Analysis Complete</p>
                          <p className="text-xs text-blue-600">Service suggestions are ready below!</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* AI-Powered Services Selection Section - appears after description */}
              {showServicesSection && (
                <div className="bg-blue-50 rounded-lg p-6 mb-6 border-l-4 border-blue-500 animate-fadeIn">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900">🤖 AI-Suggested Services</h2>
                  <div className="bg-blue-100 rounded-lg p-3 mb-4">
                    <p className="text-sm text-blue-800 font-medium">
                      ✨ Based on your business description, we've intelligently suggested these services:
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      Select the ones that match what you offer. You can always add more later!
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-3 mb-6">
                    {generateAIServiceSuggestions(contentInfo.description, formData.industry_category).map((service) => (
                      <label key={service} className="flex items-center space-x-2 p-2 hover:bg-white rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={services.selected.includes(service)}
                          onChange={(e) => handleServiceChange(service, e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{service}</span>
                      </label>
                    ))}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Services (Optional)
                    </label>
                    <textarea
                      value={services.custom}
                      onChange={handleCustomServicesChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={3}
                      placeholder="Tell us about any other services you offer that aren't listed above..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      💡 Be specific! E.g., "Wedding photography", "24-hour emergency repairs", "Vegan menu options"
                    </p>
                  </div>

                  {/* Selected Services Preview */}
                  {services.selected.length > 0 && (
                    <div className="mt-4 p-3 bg-white rounded border">
                      <p className="text-sm font-medium text-gray-700 mb-2">Selected Services:</p>
                      <div className="flex flex-wrap gap-2">
                        {services.selected.map((service, index) => (
                          <span key={service} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 animate-popIn">
                            {service}
                            <button
                              type="button"
                              onClick={() => handleServiceChange(service, false)}
                              className="ml-1 hover:text-blue-600"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Image Upload Section - appears after selecting services */}
              {showImageSection && (
                <div className="bg-white border border-gray-300 mb-6 animate-fadeIn" style={{boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
                  {/* Header Section - File Explorer Style */}
                  <div className="flex items-center justify-between px-3 py-2 bg-gray-100 border-b border-gray-300">
                    <div className="flex items-center space-x-2">
                      <span className="text-base">�</span>
                      <h2 className="text-sm font-medium text-gray-800">Your Images</h2>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-600">Current Folder:</span>
                      <select 
                        value={currentFolder}
                        onChange={(e) => setCurrentFolder(e.target.value)}
                        className="text-xs bg-white border border-gray-400 px-2 py-1 text-gray-800 focus:outline-none"
                        style={{fontSize: '11px'}}
                      >
                        {folders.map(folder => (
                          <option key={folder} value={folder}>
                            📁 {folder}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between mb-4 bg-white rounded-lg p-3 border">
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setShowCreateFolder(true)}
                        className="inline-flex items-center px-3 py-1.5 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 transition-colors"
                      >
                        � Create Folder
                      </button>
                      <button
                        type="button"
                        onClick={selectAllImages}
                        className="inline-flex items-center px-3 py-1.5 bg-gray-500 text-white text-sm font-medium rounded hover:bg-gray-600 transition-colors"
                      >
                        ☑️ Select All
                      </button>
                      {selectedImages.length > 0 && (
                        <button
                          type="button"
                          onClick={deleteSelectedImages}
                          className="inline-flex items-center px-2 py-1 bg-red-500 text-white text-xs rounded border border-red-600 hover:bg-red-600 transition-colors"
                        >
                          🗑️ Delete Selected
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Create Folder Modal */}
                  {showCreateFolder && (
                    <div className="mb-4 bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
                      <div className="flex items-center space-x-3">
                        <input
                          type="text"
                          value={newFolderName}
                          onChange={(e) => setNewFolderName(e.target.value)}
                          placeholder="Enter folder name..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          onKeyPress={(e) => e.key === 'Enter' && createFolder()}
                        />
                        <button
                          type="button"
                          onClick={createFolder}
                          className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600"
                        >
                          Create
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowCreateFolder(false)
                            setNewFolderName('')
                          }}
                          className="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Main Content Area - Two Column Layout */}
                  <div className="flex min-h-[400px]">
                    {/* Left Sidebar - Windows Explorer Style */}
                    <div className="w-56 bg-gray-50 border-r border-gray-300 p-2">
                      <div className="space-y-0">
                        {folders.map(folder => {
                          const folderCount = imagesByFolder[folder]?.files.length || 0
                          return (
                            <div
                              key={folder}
                              onClick={() => setCurrentFolder(folder)}
                              onDragOver={(e) => {
                                e.preventDefault()
                                e.currentTarget.classList.add('bg-green-100', 'border-green-400', 'border-2', 'border-dashed')
                              }}
                              onDragLeave={(e) => {
                                e.currentTarget.classList.remove('bg-green-100', 'border-green-400', 'border-2', 'border-dashed')
                              }}
                              onDrop={(e) => {
                                e.preventDefault()
                                e.currentTarget.classList.remove('bg-green-100', 'border-green-400', 'border-2', 'border-dashed')
                                
                                const draggedImageIndex = parseInt(e.dataTransfer.getData('imageIndex'))
                                const sourceFolder = e.dataTransfer.getData('sourceFolder')
                                
                                if (folder !== sourceFolder && !isNaN(draggedImageIndex)) {
                                  moveImageToFolder(draggedImageIndex, sourceFolder, folder)
                                }
                              }}
                              className={`flex items-center justify-between px-2 py-1 cursor-pointer transition-colors text-xs hover:bg-gray-200 rounded ${
                                currentFolder === folder
                                  ? 'bg-blue-200 text-blue-800 font-medium'
                                  : 'text-gray-700'
                              }`}
                            >
                              <div className="flex items-center space-x-1.5">
                                <span className="text-yellow-600 text-sm">📁</span>
                                <span className="truncate">{folder}</span>
                              </div>
                              <span className="text-gray-500 text-xs">{folderCount}</span>
                            </div>
                          )
                        })}
                      </div>

                      {/* Compact Upload Area */}
                      <div className="mt-2 pt-2 border-t border-gray-300">
                        <div
                          className={`border border-dashed rounded p-3 text-center transition-all duration-200 ${
                            isDragging 
                              ? 'border-blue-400 bg-blue-50' 
                              : 'border-gray-400 hover:border-blue-400 hover:bg-gray-100'
                          }`}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                        >
                          <div className="text-lg mb-1">📁</div>
                          <p className="text-xs text-gray-600 mb-2">Drop files here</p>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e.target.files)}
                            className="hidden"
                            id="image-upload"
                          />
                          <label
                            htmlFor="image-upload"
                            className="inline-block px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 cursor-pointer transition-colors"
                          >
                            Browse
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Right Content Area - Compact Image Grid */}
                    <div className="flex-1 p-2">
                      {imagesByFolder[currentFolder]?.files.length > 0 ? (
                        <div className="flex flex-wrap gap-3 items-start">
                          {imagesByFolder[currentFolder].previews.map((preview, index) => (
                            <div 
                              key={index} 
                              className="relative group flex-shrink-0"
                              draggable
                              onDragStart={(e) => {
                                e.dataTransfer.setData('imageIndex', index.toString())
                                e.dataTransfer.setData('sourceFolder', currentFolder)
                                e.dataTransfer.effectAllowed = 'move'
                              }}
                            >
                              {/* Selection overlay */}
                              <div 
                                className={`absolute inset-0 border-2 transition-all cursor-pointer z-10 ${
                                  selectedImages.includes(index)
                                    ? 'border-blue-500 bg-blue-500 bg-opacity-30'
                                    : 'border-transparent hover:border-blue-300'
                                }`}
                                onClick={() => toggleImageSelection(index)}
                              >
                                {selectedImages.includes(index) && (
                                  <div className="absolute top-1 left-1 w-4 h-4 bg-blue-600 text-white rounded-sm flex items-center justify-center text-xs">
                                    ✓
                                  </div>
                                )}
                              </div>
                              
                              <div className="relative bg-white border border-gray-300 overflow-hidden cursor-move" style={{width: 'auto', maxWidth: '200px'}}>
                                <img
                                  src={preview}
                                  alt={`Image ${index + 1}`}
                                  className="block h-auto object-contain pointer-events-none"
                                  style={{
                                    maxHeight: '150px',
                                    minHeight: '80px',
                                    width: 'auto',
                                    maxWidth: '200px'
                                  }}
                                />
                                
                                {/* File info overlay */}
                                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs px-1 py-1 pointer-events-none">
                                  <div className="truncate text-xs font-medium">
                                    {imagesByFolder[currentFolder].files[index].name.split('.')[0]}
                                  </div>
                                </div>

                                {/* Delete button */}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    removeImage(index)
                                  }}
                                  className="absolute top-1 right-1 bg-red-500 text-white rounded-sm w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-20"
                                >
                                  ×
                                </button>

                                {/* Drag indicator */}
                                <div className="absolute top-1 left-1 text-gray-500 opacity-0 group-hover:opacity-50 transition-opacity pointer-events-none">
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 6L6 10l4 4 4-4-4-4z"/>
                                  </svg>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center py-8">
                          <div className="text-4xl mb-3">📂</div>
                          <h3 className="text-sm font-medium text-gray-700 mb-2">
                            No images in "{currentFolder}"
                          </h3>
                          <p className="text-gray-500 text-xs mb-3">
                            Drag files here or use the sidebar upload
                          </p>
                          <label
                            htmlFor="image-upload"
                            className="inline-flex items-center px-3 py-1.5 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 cursor-pointer transition-colors"
                          >
                            <svg className="mr-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Upload Files
                          </label>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status Bar - Windows Explorer Style */}
                  <div className="px-3 py-1.5 bg-gray-100 border-t border-gray-300 text-xs text-gray-600">
                    <div className="flex items-center justify-between">
                      <span>
                        {imagesByFolder[currentFolder]?.files.length || 0} items
                      </span>
                      <span>
                        JPG, PNG, WebP • Max 5MB
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Logo Section - appears after images section */}
              {showImageSection && (
                <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6 animate-fadeIn">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-orange-600 text-lg">🎨</span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Your Business Logo</h2>
                  </div>
                  
                  <p className="text-gray-600 mb-6">
                    Do you have your own logo or would you like us to create a new one?
                  </p>

                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    {/* Upload Logo Option */}
                    <div 
                      className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                        logoChoice === 'upload' 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onClick={() => setLogoChoice('upload')}
                    >
                      <div className="text-center">
                        <div className="text-3xl mb-3">📁</div>
                        <h3 className="font-medium text-gray-900 mb-2">Upload My Logo</h3>
                        <p className="text-sm text-gray-600">
                          I have my own logo file ready to upload
                        </p>
                      </div>
                    </div>

                    {/* Generate Logo Option */}
                    <div 
                      className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                        logoChoice === 'generate' 
                          ? 'border-purple-500 bg-purple-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onClick={() => setLogoChoice('generate')}
                    >
                      <div className="text-center">
                        <div className="text-3xl mb-3">✨</div>
                        <h3 className="font-medium text-gray-900 mb-2">Generate New Logo</h3>
                        <p className="text-sm text-gray-600">
                          Create a professional logo based on my business
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Upload Interface */}
                  {logoChoice === 'upload' && (
                    <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                      <h4 className="font-medium text-blue-900 mb-4">Upload Your Logo</h4>
                      
                      {!uploadedLogo ? (
                        <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center">
                          <div className="text-4xl mb-4">🖼️</div>
                          <p className="text-blue-700 mb-4">
                            Drop your logo file here or click to browse
                          </p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                            id="logo-upload"
                          />
                          <label
                            htmlFor="logo-upload"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                          >
                            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Choose File
                          </label>
                          <p className="text-xs text-blue-600 mt-2">
                            PNG, JPG, SVG • Max 2MB • Recommended: 500x500px
                          </p>
                        </div>
                      ) : (
                        <div className="bg-white rounded-lg border border-blue-200 p-4">
                          <div className="flex items-center space-x-4">
                            <img 
                              src={logoPreview} 
                              alt="Logo preview" 
                              className="w-16 h-16 object-contain border border-gray-200 rounded"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{uploadedLogo.name}</p>
                              <p className="text-sm text-gray-600">
                                {(uploadedLogo.size / 1024).toFixed(1)} KB
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={removeLogo}
                              className="text-red-600 hover:text-red-700"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Generate Interface */}
                  {logoChoice === 'generate' && (
                    <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                      <h4 className="font-medium text-purple-900 mb-4">Generate Professional Logo</h4>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-purple-700 mb-2">
                            Business Category
                          </label>
                          <p className="text-sm text-purple-600 bg-purple-100 px-3 py-2 rounded">
                            {formData.industry_category || 'Not specified'}
                          </p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-purple-700 mb-2">
                            Business Name
                          </label>
                          <p className="text-sm text-purple-600 bg-purple-100 px-3 py-2 rounded">
                            {formData.business_name || 'Your Business Name'}
                          </p>
                        </div>

                        {!generatedLogoUrl ? (
                          <button
                            type="button"
                            onClick={generateLogo}
                            disabled={isGeneratingLogo || !formData.business_name || !formData.industry_category}
                            className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 transition-colors"
                          >
                            {isGeneratingLogo ? (
                              <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating Logo...
                              </span>
                            ) : '✨ Generate Logo with AI'}
                          </button>
                        ) : (
                          <div className="bg-white rounded-lg border border-purple-200 p-4">
                            <div className="flex items-center space-x-4">
                              <img 
                                src={generatedLogoUrl} 
                                alt="Generated logo" 
                                className="w-16 h-16 object-contain border border-gray-200 rounded"
                              />
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">AI Generated Logo</p>
                                <p className="text-sm text-gray-600">
                                  Based on {formData.industry_category} business
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => setGeneratedLogoUrl('')}
                                className="text-purple-600 hover:text-purple-700 text-sm"
                              >
                                Generate Another
                              </button>
                            </div>
                          </div>
                        )}
                        
                        {!formData.business_name || !formData.industry_category ? (
                          <p className="text-sm text-amber-600">
                            ⚠️ Please complete business name and category to generate logo
                          </p>
                        ) : null}
                      </div>
                    </div>
                  )}


                </div>
              )}

              {/* Template Selection Section - appears after logo completion */}
              {showTemplateSection && (
                <div className="bg-indigo-50 rounded-lg p-6 mb-6 border-l-4 border-indigo-500 animate-fadeIn">
                  <h2 className="text-xl font-semibold mb-6 text-gray-900">Choose Your Website Template</h2>
                  <p className="text-sm text-gray-600 mb-6">
                    🎨 Select a professional template that matches your business style. You can customize colors, content, and layout later.
                  </p>
                  
                  {isLoadingTemplates ? (
                    <div className="flex items-center justify-center py-12">
                      <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="ml-3 text-gray-600">Loading templates...</span>
                    </div>
                  ) : templates.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {templates.map((template) => (
                        <div
                          key={template.id}
                          onClick={() => handleTemplateSelection(template.id)}
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                            selectedTemplate === template.id
                              ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                              : 'border-gray-200 bg-white hover:border-indigo-300'
                          }`}
                        >
                          {/* Template Preview Image */}
                          <div className="aspect-w-16 aspect-h-10 bg-gray-100 rounded-lg mb-4 overflow-hidden">
                            {template.preview_image_url ? (
                              <img
                                src={template.preview_image_url}
                                alt={template.name}
                                className="w-full h-32 object-cover"
                              />
                            ) : (
                              <div className="w-full h-32 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                                <div className="text-center">
                                  <div className="text-3xl mb-2">🎨</div>
                                  <p className="text-sm text-gray-600">{template.name}</p>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* Template Info */}
                          <div className="space-y-2">
                            <h3 className="font-semibold text-gray-900 text-sm">{template.name}</h3>
                            <p className="text-xs text-gray-600 line-clamp-2">
                              {template.description || 'Professional template perfect for your business'}
                            </p>
                            <div className="flex items-center justify-between text-xs">
                              <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                                {template.category?.toUpperCase() || 'GENERAL'}
                              </span>
                              {selectedTemplate === template.id && (
                                <span className="text-indigo-600 font-semibold">✓ Selected</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-4xl mb-4">📋</div>
                      <p className="text-gray-600">No templates available at the moment.</p>
                      <button
                        type="button"
                        onClick={loadTemplates}
                        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        Retry Loading Templates
                      </button>
                    </div>
                  )}
                  
                  {selectedTemplate && (
                    <div className="mt-6 p-4 bg-indigo-100 rounded-lg border border-indigo-200">
                      <div className="flex items-start space-x-3">
                        <div className="text-indigo-600 mt-1">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-indigo-900 mb-1">Template Selected!</h4>
                          <p className="text-sm text-indigo-700">
                            {templates.find(t => t.id === selectedTemplate)?.name} will be used as your website foundation. 
                            You can customize everything after creation.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Debug button for testing */}
              <button
                type="button"
                onClick={() => {
                  const slug = 'test-restaurant'
                  const url = `http://localhost:3000/build/${slug}/`
                  console.log('Direct test - opening:', url)
                  window.open(url, '_blank', 'noopener,noreferrer')
                }}
                className="w-full bg-gray-600 text-white py-2 rounded-lg font-medium text-sm hover:bg-gray-700 transition-all duration-200 mb-4"
              >
                🧪 Test Direct URL Opening (Debug)
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary-600 to-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:from-primary-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Building Your Website...</span>
                  </span>
                ) : selectedTemplate ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <span>Create My Website</span>
                    <span className="text-xl">🚀</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span>Complete All Steps First</span>
                  </span>
                )}
              </button>
              
              {selectedTemplate && contentInfo.description ? (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-center text-sm text-green-700 flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Ready to build! Your website will be created and opened automatically in a new tab.
                  </p>
                </div>
              ) : (
                <>
                  {!selectedTemplate && showTemplateSection && (
                    <p className="text-center text-sm text-amber-600 mt-2">
                      ⚠️ Please select a template to create your website
                    </p>
                  )}
                  {!contentInfo.description && showContentSection && (
                    <p className="text-center text-sm text-amber-600 mt-2">
                      ⚠️ Please complete the business description to see AI service suggestions
                    </p>
                  )}
                </>
              )}
            </form>
          </div>
          
          <div className="col-span-7 bg-white rounded-lg shadow-lg p-6 h-fit sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {showPrintingSection ? '�️ Print Products' : '�🖼️ Live Preview'}
            </h3>
            
            {showPrintingSection ? (
              // Printing Section
              <div className="space-y-6">
                {/* Success Message */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="text-green-600">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-900">Website Created Successfully! 🎉</h4>
                      <p className="text-sm text-green-700 mt-1">
                        Your website has been built and is ready. Now let's create matching print materials for your business.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Business Cards Row */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                  <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Business Cards
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { name: 'Premium Business Cards', desc: 'High-quality cardstock with your logo', price: '$49', image: '📇' },
                      { name: 'Luxury Foil Cards', desc: 'Gold/silver foil accents', price: '$89', image: '✨' },
                      { name: 'Eco-Friendly Cards', desc: 'Recycled materials, sustainable', price: '$39', image: '🌱' }
                    ].map((card, idx) => (
                      <div key={idx} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border">
                        <div className="text-2xl mb-2">{card.image}</div>
                        <h5 className="font-semibold text-sm mb-1">{card.name}</h5>
                        <p className="text-xs text-gray-600 mb-2">{card.desc}</p>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-blue-600">{card.price}</span>
                          <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700">
                            Select
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trifolds & Flyers Row */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
                  <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <svg className="w-6 h-6 mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Brochures & Flyers
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { name: 'Tri-fold Brochures', desc: 'Professional service showcase', price: '$79', image: '📄' },
                      { name: 'Promotional Flyers', desc: 'Eye-catching marketing materials', price: '$59', image: '📢' },
                      { name: 'Menu/Catalog', desc: 'Product or service listings', price: '$69', image: '📋' }
                    ].map((item, idx) => (
                      <div key={idx} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border">
                        <div className="text-2xl mb-2">{item.image}</div>
                        <h5 className="font-semibold text-sm mb-1">{item.name}</h5>
                        <p className="text-xs text-gray-600 mb-2">{item.desc}</p>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-purple-600">{item.price}</span>
                          <button className="bg-purple-600 text-white px-3 py-1 rounded text-xs hover:bg-purple-700">
                            Select
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gifts Row */}
                <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-6 border border-green-200">
                  <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <svg className="w-6 h-6 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                    Branded Gifts & Merchandise
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { name: 'Custom Mugs', desc: 'Coffee mugs with your branding', price: '$29', image: '☕' },
                      { name: 'Branded T-Shirts', desc: 'Staff uniforms or promotional tees', price: '$45', image: '👕' },
                      { name: 'Gift Packages', desc: 'Custom branded gift sets', price: '$99', image: '🎁' }
                    ].map((gift, idx) => (
                      <div key={idx} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border">
                        <div className="text-2xl mb-2">{gift.image}</div>
                        <h5 className="font-semibold text-sm mb-1">{gift.name}</h5>
                        <p className="text-xs text-gray-600 mb-2">{gift.desc}</p>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-green-600">{gift.price}</span>
                          <button className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700">
                            Select
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-200">
                  <div className="text-center space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900">Ready to Order Your Print Materials?</h4>
                    <p className="text-sm text-gray-600">
                      All products will use your website's branding, colors, and business information automatically.
                    </p>
                    <div className="flex gap-3 justify-center">
                      <button 
                        onClick={() => {
                          const businessSlug = websiteInfo.slug || suggestedSlug || formData.business_name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
                          const localhostUrl = `http://localhost:3001/build/${businessSlug}/`
                          window.open(localhostUrl, '_blank', 'noopener,noreferrer')
                        }}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View My Website
                      </button>
                      <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l-2.5 5m0 0h4.5m0 0v6m0-6h9m-9 6h9" />
                        </svg>
                        Order Selected Items
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Original Live Preview Section
              <div className="border rounded-lg overflow-hidden bg-gray-50 min-h-[600px] shadow-inner">
              {/* Browser Bar */}
              <div className="bg-gray-800 text-white p-2 text-xs flex items-center">
                <div className="flex space-x-1 mr-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
                <div className="bg-gray-700 rounded px-2 py-1 font-mono text-xs flex-1">
                  <span className="text-gray-400">🔒 </span>
                  {websiteInfo.custom_domain || (websiteInfo.slug ? `justcodeworks.eu/build/${websiteInfo.slug}/` : 'justcodeworks.eu/build/your-website/')}
                </div>
              </div>
              
              {/* Website Content */}
              {selectedTemplateData && selectedTemplateData.html_content ? (
                <div className="bg-white min-h-[560px] relative overflow-hidden">
                  <iframe
                    srcDoc={`
                      <!DOCTYPE html>
                      <html>
                      <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <style>
                          body { 
                            margin: 0; 
                            padding: 10px; 
                            font-family: Arial, sans-serif; 
                            overflow-x: hidden;
                            transform: scale(0.7);
                            transform-origin: top left;
                            width: 142.85%;
                            height: 142.85%;
                          }
                          * {
                            max-width: 100% !important;
                            box-sizing: border-box !important;
                          }
                          img {
                            max-width: 100% !important;
                            height: auto !important;
                          }
                          ${(selectedTemplateData.css_content || '')
                            .replace(/```css/gi, '')
                            .replace(/```/gi, '')
                            .replace(/height:\s*100vh/gi, 'height: auto')
                            .replace(/width:\s*100vw/gi, 'width: 100%')
                            .replace(/min-height:\s*100vh/gi, 'min-height: auto')
                            .replace(/position:\s*fixed/gi, 'position: relative')
                          }
                        </style>
                      </head>
                      <body>
                        ${(() => {
                          // Prepare comprehensive business data for replacement
                          const businessData = {
                            BUSINESS_NAME: websiteInfo.website_name || formData.business_name || 'Your Business Name',
                            WEBSITE_NAME: websiteInfo.website_name || formData.business_name || 'Your Business Name',
                            LOGO_URL: logoPreview || generatedLogoUrl || '',
                            KEY_MESSAGE: contentInfo.key_message || (formData.industry_category ? `Professional ${formData.industry_category} services` : 'Quality services you can trust'),
                            DESCRIPTION: contentInfo.description || '',
                            SHORT_DESCRIPTION: contentInfo.description ? contentInfo.description.substring(0, 150) + '...' : '',
                            CITY: formData.city || '',
                            COUNTRY: formData.country || '',
                            LOCATION: formData.city && formData.country ? `${formData.city}, ${formData.country}` : formData.city || formData.country || '',
                            CONTACT_EMAIL: formData.contact_email || '',
                            CONTACT_PHONE: formData.contact_phone || '',
                            CUSTOM_DOMAIN: websiteInfo.custom_domain || '',
                            WEBSITE_URL: websiteInfo.custom_domain || (websiteInfo.slug ? `justcodeworks.eu/build/${websiteInfo.slug}` : ''),
                            SERVICES: services.selected.slice(0, 6).join(', '),
                            SERVICES_LIST: services.selected.slice(0, 8).map(service => `<li>${service}</li>`).join(''),
                            SERVICES_CARDS: services.selected.slice(0, 6).map(service => `<div class="service-card"><h4>${service}</h4></div>`).join(''),
                            PRIMARY_SERVICE: services.selected[0] || 'Professional Services',
                            SERVICE_COUNT: services.selected.length.toString(),
                            CALL_TO_ACTION: contentInfo.call_to_action ? contentInfo.call_to_action.charAt(0).toUpperCase() + contentInfo.call_to_action.slice(1).replace('_', ' ') : 'Get Started',
                            TARGET_AUDIENCE: contentInfo.target_audience || '',
                            INDUSTRY: formData.industry_category || 'business',
                            INDUSTRY_TITLE: formData.industry_category ? formData.industry_category.charAt(0).toUpperCase() + formData.industry_category.slice(1) : 'Business',
                            CUSTOM_SERVICES: services.custom || '',
                            GALLERY_COUNT: uploadedImages.length.toString(),
                            CURRENT_YEAR: new Date().getFullYear().toString(),
                            SLUG: websiteInfo.slug || '',
                            // Conditional content
                            HAS_DESCRIPTION: contentInfo.description ? 'true' : 'false',
                            HAS_SERVICES: services.selected.length > 0 ? 'true' : 'false',
                            HAS_GALLERY: uploadedImages.length > 0 ? 'true' : 'false',
                            HAS_PHONE: formData.contact_phone ? 'true' : 'false',
                            HAS_CUSTOM_DOMAIN: websiteInfo.custom_domain ? 'true' : 'false'
                          }

                          // Start with the template HTML
                          let processedHtml = selectedTemplateData.html_content

                          // Replace all business data placeholders
                          Object.entries(businessData).forEach(([key, value]) => {
                            const regex = new RegExp(`{{${key}}}`, 'g')
                            processedHtml = processedHtml.replace(regex, value)
                          })

                          // Additional common template patterns
                          processedHtml = processedHtml
                            // Generic business name patterns
                            .replace(/Restaurant Name/gi, businessData.BUSINESS_NAME)
                            .replace(/Restaurant\s+Website/gi, businessData.BUSINESS_NAME)
                            .replace(/Your\s+Business\s+Name/gi, businessData.BUSINESS_NAME)
                            .replace(/Business\s+Name/gi, businessData.BUSINESS_NAME)
                            
                            // Location patterns
                            .replace(/123\s+Main\s+St,?\s*Anytown,?\s*USA/gi, businessData.LOCATION || 'Contact us for location')
                            .replace(/\(123\)\s*456-7890/gi, businessData.CONTACT_PHONE || 'Contact us')
                            .replace(/info@restaurant\.com/gi, businessData.CONTACT_EMAIL)
                            .replace(/contact@restaurant\.com/gi, businessData.CONTACT_EMAIL)
                            .replace(/info@example\.com/gi, businessData.CONTACT_EMAIL)
                            
                            // Generic content replacements
                            .replace(/Lorem ipsum[^.]*\./gi, businessData.DESCRIPTION || 'Welcome to our business!')
                            .replace(/Lorem ipsum[^,]*,/gi, businessData.SHORT_DESCRIPTION || 'Quality service you can trust,')
                            
                            // Year patterns
                            .replace(/Established in \d{4}/gi, `Established in ${businessData.CURRENT_YEAR}`)
                            .replace(/Established:?\s*\d{4}/gi, `Established: ${businessData.CURRENT_YEAR}`)
                            .replace(/\d{4}/g, (match) => {
                              const year = parseInt(match);
                              if (year >= 1900 && year <= new Date().getFullYear()) {
                                return businessData.CURRENT_YEAR;
                              }
                              return match;
                            })
                            
                            // Menu and service patterns
                            .replace(/Item name/gi, businessData.PRIMARY_SERVICE || 'Our Service')
                            .replace(/Item description/gi, `${businessData.PRIMARY_SERVICE || 'Quality service'} - Contact us for details`)
                            
                            // Owner/Chef patterns
                            .replace(/John Doe/gi, businessData.BUSINESS_NAME.split(' ')[0] || 'Owner')
                            .replace(/Executive Chef & Owner/gi, `Owner of ${businessData.BUSINESS_NAME}`)
                            .replace(/Our Chef/gi, `${businessData.BUSINESS_NAME} Team`)
                          
                          // Conditional sections based on business data
                          if (businessData.HAS_SERVICES === 'true') {
                            processedHtml = processedHtml.replace(/Our Menu/gi, 'Our Services')
                            processedHtml = processedHtml.replace(/Appetizers/gi, 'Main Services')
                          }

                          // Enhanced image replacement with business context
                          const getContextualImage = (type) => {
                            const baseUrl = 'https://picsum.photos/400/300'
                            const random = Math.floor(Math.random() * 100)
                            
                            switch (type) {
                              case 'hero':
                                if (formData.industry_category === 'restaurant') return `${baseUrl}?restaurant&random=${random}`
                                if (formData.industry_category === 'retail') return `${baseUrl}?shop&random=${random}`
                                if (formData.industry_category === 'services') return `${baseUrl}?office&random=${random}`
                                return `${baseUrl}?business&random=${random}`
                              case 'gallery':
                                return uploadedImages.length > 0 ? imagePreviews[Math.floor(Math.random() * imagePreviews.length)] : `${baseUrl}?gallery&random=${random}`
                              case 'about':
                                return `${baseUrl}?team&random=${random}`
                              case 'contact':
                                return `${baseUrl}?office&random=${random}`
                              default:
                                return `${baseUrl}?random=${random}`
                            }
                          }

                          // Replace various image patterns with contextual images
                          processedHtml = processedHtml
                            .replace(/src="[^"]*hero[^"]*"/gi, `src="${getContextualImage('hero')}"`)
                            .replace(/src="[^"]*gallery[^"]*"/gi, `src="${getContextualImage('gallery')}"`)
                            .replace(/src="[^"]*about[^"]*"/gi, `src="${getContextualImage('about')}"`)
                            .replace(/src="[^"]*contact[^"]*"/gi, `src="${getContextualImage('contact')}"`)
                            .replace(/src="[^"]*\.(jpg|jpeg|png|gif|webp)[^"]*"/gi, `src="${getContextualImage('default')}"`)
                            .replace(/src="#"/gi, `src="${getContextualImage('default')}"`)
                            .replace(/src="food[^"]*"/gi, `src="${getContextualImage('hero')}"`)
                            .replace(/src="interior[^"]*"/gi, `src="${getContextualImage('hero')}"`)
                            .replace(/src="team[^"]*"/gi, 'src="https://ui-avatars.com/api/?name=' + encodeURIComponent(formData.business_name.substring(0, 2)) + '&background=0d8abc&color=fff&size=200"')
                            .replace(/src="owner[^"]*"/gi, 'src="https://ui-avatars.com/api/?name=' + encodeURIComponent(formData.business_name.substring(0, 2)) + '&background=0d8abc&color=fff&size=200"')

                          // Clean up template artifacts
                          return processedHtml
                            .replace(/<link\s+rel="stylesheet"\s+href="[^"]*"[^>]*>/gi, '')
                            .replace(/<!DOCTYPE[^>]*>/gi, '')
                            .replace(/<\/?html[^>]*>/gi, '')
                            .replace(/<\/?head[^>]*>/gi, '')
                            .replace(/<\/?body[^>]*>/gi, '')
                            .replace(/<meta[^>]*>/gi, '')
                            .replace(/<title[^>]*>.*?<\/title>/gi, '')
                            .replace(/```html/gi, '')
                            .replace(/```css/gi, '')
                            .replace(/```/gi, '')
                            .replace(/<script[^>]*>.*?<\/script>/gi, '')
                        })()}
                      </body>
                      </html>
                    `}
                    style={{
                      width: '100%',
                      height: '560px',
                      border: 'none',
                      overflow: 'hidden'
                    }}
                    sandbox="allow-same-origin"
                  />
                </div>
              ) : (
                <div className="p-4 bg-white min-h-[560px] relative">
                  <div className="border-b pb-3 mb-4">
                    <div className="flex items-center space-x-3">
                      {/* Logo Preview */}
                      {(logoPreview || generatedLogoUrl) && (
                        <img 
                          src={logoPreview || generatedLogoUrl} 
                          alt="Logo" 
                          className="w-10 h-10 object-contain border border-gray-200 rounded"
                        />
                      )}
                      <h1 className="text-xl font-bold text-gray-800 transition-all duration-300">
                        {websiteInfo.website_name || formData.business_name || 'Your Business Name'}
                      </h1>
                    </div>
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
                      {contentInfo.key_message || (formData.industry_category ? 
                        `Professional ${formData.industry_category} services` : 
                        'Quality services you can trust')
                      }
                    </p>
                    {formData.city && (
                      <p className="text-gray-500 text-xs mb-3">
                        📍 Located in {formData.city}{formData.country && `, ${formData.country}`}
                      </p>
                    )}
                    {contentInfo.call_to_action && (
                      <button className="mt-3 px-4 py-2 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">
                        {contentInfo.call_to_action.charAt(0).toUpperCase() + contentInfo.call_to_action.slice(1).replace('_', ' ')} →
                      </button>
                    )}
                  </div>

                  {/* About Us Section - appears when business description exists */}
                  {contentInfo.description && (
                    <div className="border-t pt-4 transition-all duration-500 animate-fadeIn">
                      <h3 className="text-sm font-semibold text-gray-800 mb-3 text-left flex items-center">
                        <span className="w-1 h-4 bg-blue-500 mr-2 rounded"></span>
                        About Us
                      </h3>
                      <div className="text-left space-y-2 ml-3">
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {contentInfo.description}
                        </p>
                        {contentInfo.target_audience && (
                          <div className="mt-3 p-2 bg-blue-50 rounded border-l-2 border-blue-300">
                            <p className="text-xs text-gray-700">
                              <strong className="text-blue-800">Perfect for:</strong> {contentInfo.target_audience}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Services Section - appears when services are selected */}
                  {services.selected.length > 0 && (
                    <div className="border-t pt-4 mt-4 transition-all duration-500 animate-fadeIn">
                      <h3 className="text-sm font-semibold text-gray-800 mb-3 text-left flex items-center">
                        <span className="w-1 h-4 bg-green-500 mr-2 rounded"></span>
                        Our Services
                      </h3>
                      <div className="grid grid-cols-1 gap-2 ml-3">
                        {services.selected.slice(0, 6).map((service) => (
                          <div key={service} className="flex items-center text-xs text-gray-600">
                            <span className="text-green-500 mr-2 text-sm">✓</span>
                            {service}
                          </div>
                        ))}
                        {services.selected.length > 6 && (
                          <div className="text-xs text-gray-500 italic mt-1 ml-4">
                            +{services.selected.length - 6} more services available
                          </div>
                        )}
                      </div>
                      {services.custom && (
                        <div className="mt-3 ml-3 p-2 bg-green-50 rounded text-xs text-gray-700 border-l-2 border-green-300">
                          <strong className="text-green-800">Specialty Services:</strong><br />
                          {services.custom.substring(0, 80)}{services.custom.length > 80 ? '...' : ''}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Gallery Section - appears when images are uploaded */}
                  {uploadedImages.length > 0 && (
                    <div className="border-t pt-4 mt-4 transition-all duration-500 animate-fadeIn">
                      <h3 className="text-sm font-semibold text-gray-800 mb-3 text-left flex items-center">
                        <span className="w-1 h-4 bg-orange-500 mr-2 rounded"></span>
                        Gallery
                      </h3>
                      <div className="ml-3">
                        {/* Category Filters */}
                        <div className="mb-3 flex flex-wrap gap-1">
                          {['All', ...folders.filter(f => imagesByFolder[f]?.files.length > 0)].map((category) => {
                            const categoryCount = category === 'All' 
                              ? uploadedImages.length 
                              : imagesByFolder[category]?.files.length || 0
                            
                            return (
                              <button
                                key={category}
                                onClick={() => setSelectedGalleryCategory(category)}
                                className={`px-2 py-1 text-xs rounded-full border transition-colors ${
                                  selectedGalleryCategory === category
                                    ? 'bg-orange-500 text-white border-orange-600'
                                    : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
                                }`}
                              >
                                {category} ({categoryCount})
                              </button>
                            )
                          })}
                        </div>

                        {/* Images for Selected Category */}
                        <div className="flex flex-wrap gap-2 items-start">
                          {(() => {
                            let displayImages = []
                            let displayPreviews = []
                            
                            if (selectedGalleryCategory === 'All') {
                              displayPreviews = imagePreviews
                            } else {
                              const categoryData = imagesByFolder[selectedGalleryCategory]
                              if (categoryData) {
                                displayPreviews = categoryData.previews
                              }
                            }
                            
                            return displayPreviews.slice(0, 8).map((preview, index) => (
                              <div key={`${selectedGalleryCategory}-${index}`} className="relative flex-shrink-0">
                                <img
                                  src={preview}
                                  alt={`${selectedGalleryCategory} ${index + 1}`}
                                  className="border object-contain"
                                  style={{
                                    maxHeight: '80px',
                                    minHeight: '40px',
                                    width: 'auto',
                                    maxWidth: '120px'
                                  }}
                                />
                                {index === 7 && displayPreviews.length > 8 && (
                                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">
                                      +{displayPreviews.length - 8}
                                    </span>
                                  </div>
                                )}
                              </div>
                            ))
                          })()}
                        </div>
                        
                        <p className="text-xs text-gray-500 mt-2">
                          {(() => {
                            if (selectedGalleryCategory === 'All') {
                              return `${uploadedImages.length} image${uploadedImages.length !== 1 ? 's' : ''} across all categories`
                            } else {
                              const categoryCount = imagesByFolder[selectedGalleryCategory]?.files.length || 0
                              return `${categoryCount} image${categoryCount !== 1 ? 's' : ''} in ${selectedGalleryCategory} category`
                            }
                          })()}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Contact Section - appears when contact info is available */}
                  {(formData.contact_email || formData.contact_phone || websiteInfo.custom_domain) && (
                    <div className="border-t pt-4 mt-4 transition-all duration-500 animate-fadeIn">
                      <h3 className="text-sm font-semibold text-gray-800 mb-3 text-left flex items-center">
                        <span className="w-1 h-4 bg-purple-500 mr-2 rounded"></span>
                        Get In Touch
                      </h3>
                      <div className="space-y-2 ml-3">
                        {formData.contact_phone && (
                          <div className="flex items-center text-xs text-gray-600">
                            <span className="text-green-500 mr-2">📞</span>
                            <span>{formData.contact_phone}</span>
                          </div>
                        )}
                        {formData.contact_email && (
                          <div className="flex items-center text-xs text-gray-600">
                            <span className="text-blue-500 mr-2">📧</span>
                            <span>{formData.contact_email}</span>
                          </div>
                        )}
                        {websiteInfo.custom_domain && (
                          <div className="flex items-center text-xs text-gray-600">
                            <span className="text-orange-500 mr-2">🌐</span>
                            <span>{websiteInfo.custom_domain}</span>
                          </div>
                        )}
                        {formData.city && (
                          <div className="flex items-center text-xs text-gray-600">
                            <span className="text-red-500 mr-2">📍</span>
                            <span>{formData.city}{formData.country && `, ${formData.country}`}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            )}
            
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                {showPrintingSection ? (
                  <>🎉 Your website has been created! Select print products to complete your business materials.</>
                ) : selectedTemplateData ? (
                  <>✨ Template preview with your business data! Select different templates to update the preview.</>
                ) : (
                  <>✨ This preview updates in real-time as you type! Select a template to see it in action.</>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}