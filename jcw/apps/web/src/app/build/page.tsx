'use client'

import { useState, FormEvent, ChangeEvent } from 'react'
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
          )
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
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
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
          <div className="space-y-6">
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
                      width: showImageSection ? '100%' : showServicesSection ? '80%' : showContentSection ? '60%' : showWebsiteSection ? '40%' : '20%'
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span className={showWebsiteSection || showContentSection || showServicesSection || showImageSection ? 'text-blue-600 font-medium' : ''}>Business Info</span>
                  <span className={showWebsiteSection ? (showContentSection || showServicesSection || showImageSection ? 'text-blue-600 font-medium' : 'text-gray-700') : ''}>Website Details</span>
                  <span className={showContentSection ? (showServicesSection || showImageSection ? 'text-blue-600 font-medium' : 'text-gray-700') : ''}>Content</span>
                  <span className={showServicesSection ? (showImageSection ? 'text-blue-600 font-medium' : 'text-gray-700') : ''}>AI Services</span>
                  <span className={showImageSection ? 'text-blue-600 font-medium' : ''}>Images</span>
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

                    {/* Target Audience */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Who are your ideal customers?
                      </label>
                      <input
                        type="text"
                        value={contentInfo.target_audience}
                        onChange={(e) => handleContentChange('target_audience', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="e.g., Food lovers, families, couples on date nights, business professionals"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        🎯 This helps us write content that speaks to your customers
                      </p>
                    </div>

                    {/* Key Message with AI Generation */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Key Message or Unique Selling Point
                        </label>
                        <button
                          type="button"
                          onClick={() => generateAIContent('key_message')}
                          disabled={!formData.business_name || isGeneratingAI}
                          className="inline-flex items-center px-3 py-1 text-xs font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
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
                      <input
                        type="text"
                        value={contentInfo.key_message}
                        onChange={(e) => handleContentChange('key_message', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="e.g., Authentic Italian cuisine, 24/7 service, Award-winning quality, Best prices in town"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        ⭐ What should visitors remember most about your business?
                      </p>
                    </div>

                    {/* Call to Action */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        What should visitors do first?
                      </label>
                      <select
                        value={contentInfo.call_to_action}
                        onChange={(e) => handleContentChange('call_to_action', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        📞 This will be the main button/action on your website
                      </p>
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

              <button
                type="submit"
                disabled={isLoading || !contentInfo.description}
                className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 transition-all"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Your Website...
                  </span>
                ) : showImageSection ? 'Create My Website 🚀' : 'Complete All Steps First'}
              </button>
              
              {!contentInfo.description && showContentSection && (
                <p className="text-center text-sm text-amber-600 mt-2">
                  ⚠️ Please complete the business description to see AI service suggestions
                </p>
              )}
            </form>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 h-fit sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              🖼️ Live Preview
            </h3>
            
            <div className="border rounded-lg overflow-hidden bg-gray-50 min-h-96 shadow-inner">
              {/* Browser Bar */}
              <div className="bg-gray-800 text-white p-2 text-xs flex items-center">
                <div className="flex space-x-1 mr-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
                <div className="bg-gray-700 rounded px-2 py-1 font-mono text-xs flex-1">
                  <span className="text-gray-400">🔒 </span>
                  {websiteInfo.slug ? `justcodeworks.eu/build/${websiteInfo.slug}/` : 'justcodeworks.eu/build/your-website/'}
                </div>
              </div>
              
              {/* Website Content */}
              <div className="p-4 bg-white min-h-80 relative">
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
                {(formData.contact_email || formData.contact_phone) && (
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
                      {formData.city && (
                        <div className="flex items-center text-xs text-gray-600">
                          <span className="text-red-500 mr-2">�</span>
                          <span>{formData.city}{formData.country && `, ${formData.country}`}</span>
                        </div>
                      )}
                    </div>
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