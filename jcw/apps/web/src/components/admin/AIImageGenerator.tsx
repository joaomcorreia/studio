'use client'

import { useState, useCallback } from 'react'
import MagicAI from '@/lib/magicAI'

interface AIImageGeneratorProps {
  businessName?: string
  industry?: string
  imageType: 'logo' | 'hero' | 'background' | 'service' | 'team' | 'product'
  onImageGenerated: (imageUrl: string, prompt: string) => void
  className?: string
  currentImageUrl?: string
}

interface ImageGenerationOptions {
  style: 'professional' | 'modern' | 'creative' | 'minimalist' | 'vibrant'
  quality: 'standard' | 'hd'
  size: '256x256' | '512x512' | '1024x1024' | '1024x1792' | '1792x1024'
  mood: 'bright' | 'dark' | 'neutral' | 'warm' | 'cool'
}

export default function AIImageGenerator({
  businessName = 'Your Business',
  industry = 'general',
  imageType,
  onImageGenerated,
  className = '',
  currentImageUrl
}: AIImageGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<Array<{url: string, prompt: string}>>([])
  const [customPrompt, setCustomPrompt] = useState('')
  const [useCustomPrompt, setUseCustomPrompt] = useState(false)
  
  const [imageOptions, setImageOptions] = useState<ImageGenerationOptions>({
    style: 'professional',
    quality: 'standard',
    size: '1024x1024',
    mood: 'neutral'
  })

  const generateImagePrompt = useCallback(() => {
    if (useCustomPrompt && customPrompt.trim()) {
      return customPrompt.trim()
    }

    const basePrompts = {
      logo: `Professional logo design for ${businessName}, ${industry} business`,
      hero: `Professional hero image for ${businessName} website, ${industry} business`,
      background: `Subtle background pattern, ${industry} themed, professional`,
      service: `${industry} service illustration, professional and clean`,
      team: `Professional team photo style image, ${industry} business environment`,
      product: `${industry} product showcase, professional photography style`
    }

    let prompt = basePrompts[imageType] || basePrompts.hero

    // Add style modifiers
    const styleModifiers = {
      professional: 'corporate, clean, business-like',
      modern: 'contemporary, sleek, minimal',
      creative: 'artistic, innovative, unique',
      minimalist: 'simple, clean, uncluttered',
      vibrant: 'colorful, energetic, dynamic'
    }

    const moodModifiers = {
      bright: 'bright lighting, cheerful, optimistic',
      dark: 'dramatic lighting, sophisticated, elegant',
      neutral: 'balanced lighting, professional',
      warm: 'warm tones, welcoming, friendly',
      cool: 'cool tones, modern, tech-focused'
    }

    prompt += `, ${styleModifiers[imageOptions.style]}, ${moodModifiers[imageOptions.mood]}`
    prompt += ', high quality, detailed, professional photography'

    return prompt
  }, [businessName, industry, imageType, imageOptions, useCustomPrompt, customPrompt])

  const generateImage = async () => {
    setIsGenerating(true)
    try {
      const prompt = generateImagePrompt()
      
      // In a real implementation, this would call DALL-E or another image generation API
      // For now, we'll simulate the API call and use placeholder images
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Generate placeholder image URL based on prompt
      const imageUrl = generatePlaceholderImage(prompt)
      
      // Add to generated images history
      const newImage = { url: imageUrl, prompt }
      setGeneratedImages(prev => [newImage, ...prev.slice(0, 4)]) // Keep last 5 images
      
      // Notify parent component
      onImageGenerated(imageUrl, prompt)
      
    } catch (error) {
      console.error('Image generation error:', error)
      alert('Failed to generate image. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  // Placeholder image generator (in real app, this would be replaced with actual DALL-E API)
  const generatePlaceholderImage = (prompt: string): string => {
    const [width, height] = imageOptions.size.split('x').map(Number)
    const seed = Math.floor(Math.random() * 1000000)
    
    // Use a service like Unsplash or Picsum for better placeholder images
    const keywords = extractKeywords(prompt)
    const searchTerm = keywords.join(',')
    
    // Different placeholder services based on image type
    if (imageType === 'logo') {
      return `https://via.placeholder.com/${width}x${height}/2563eb/ffffff?text=${encodeURIComponent(businessName)}`
    }
    
    // Use Unsplash for more realistic placeholders
    return `https://source.unsplash.com/${width}x${height}/?${encodeURIComponent(searchTerm)}&sig=${seed}`
  }

  const extractKeywords = (prompt: string): string[] => {
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'professional', 'high', 'quality']
    const words = prompt.toLowerCase().split(/[,\s]+/)
    return words
      .filter(word => word.length > 3 && !commonWords.includes(word))
      .slice(0, 3) // Take first 3 relevant keywords
  }

  const selectImage = (imageUrl: string, prompt: string) => {
    onImageGenerated(imageUrl, prompt)
  }

  const getSizeLabel = (size: string) => {
    const labels = {
      '256x256': 'Small (256x256)',
      '512x512': 'Medium (512x512)', 
      '1024x1024': 'Large Square (1024x1024)',
      '1024x1792': 'Portrait (1024x1792)',
      '1792x1024': 'Landscape (1792x1024)'
    }
    return labels[size as keyof typeof labels] || size
  }

  return (
    <div className={`ai-image-generator ${className}`}>
      <div className="space-y-4">
        {/* Current Image Preview */}
        {currentImageUrl && (
          <div className="relative">
            <img
              src={currentImageUrl}
              alt="Current image"
              className="w-full h-48 object-cover rounded-lg border border-gray-200"
            />
            <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
              Current
            </div>
          </div>
        )}

        {/* Generation Controls */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">AI Image Generation</h4>
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              {showOptions ? 'Hide Options' : 'Show Options'}
            </button>
          </div>

          {/* Custom Prompt Toggle */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="custom-prompt"
              checked={useCustomPrompt}
              onChange={(e) => setUseCustomPrompt(e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="custom-prompt" className="text-sm text-gray-700">
              Use custom prompt
            </label>
          </div>

          {/* Custom Prompt Input */}
          {useCustomPrompt && (
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Describe the image you want to generate..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            />
          )}

          {/* Options Panel */}
          {showOptions && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Style</label>
                  <select
                    value={imageOptions.style}
                    onChange={(e) => setImageOptions({...imageOptions, style: e.target.value as any})}
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                  >
                    <option value="professional">Professional</option>
                    <option value="modern">Modern</option>
                    <option value="creative">Creative</option>
                    <option value="minimalist">Minimalist</option>
                    <option value="vibrant">Vibrant</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mood</label>
                  <select
                    value={imageOptions.mood}
                    onChange={(e) => setImageOptions({...imageOptions, mood: e.target.value as any})}
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                  >
                    <option value="neutral">Neutral</option>
                    <option value="bright">Bright</option>
                    <option value="dark">Dark</option>
                    <option value="warm">Warm</option>
                    <option value="cool">Cool</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                  <select
                    value={imageOptions.size}
                    onChange={(e) => setImageOptions({...imageOptions, size: e.target.value as any})}
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                  >
                    <option value="256x256">Small (256x256)</option>
                    <option value="512x512">Medium (512x512)</option>
                    <option value="1024x1024">Large Square (1024x1024)</option>
                    <option value="1024x1792">Portrait (1024x1792)</option>
                    <option value="1792x1024">Landscape (1792x1024)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quality</label>
                  <select
                    value={imageOptions.quality}
                    onChange={(e) => setImageOptions({...imageOptions, quality: e.target.value as any})}
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                  >
                    <option value="standard">Standard</option>
                    <option value="hd">HD Quality</option>
                  </select>
                </div>
              </div>

              {/* Prompt Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Generated Prompt:</label>
                <div className="p-2 bg-white border border-gray-200 rounded text-sm text-gray-600">
                  {generateImagePrompt()}
                </div>
              </div>
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={generateImage}
            disabled={isGenerating}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{isGenerating ? 'Generating Image...' : 'Generate Image'}</span>
          </button>
        </div>

        {/* Generated Images History */}
        {generatedImages.length > 0 && (
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2">Recently Generated:</h5>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {generatedImages.map((image, index) => (
                <div
                  key={index}
                  className="relative cursor-pointer group"
                  onClick={() => selectImage(image.url, image.prompt)}
                >
                  <img
                    src={image.url}
                    alt={`Generated ${index + 1}`}
                    className="w-full h-24 object-cover rounded border border-gray-200 group-hover:border-blue-500 transition-colors"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded flex items-center justify-center">
                    <div className="hidden group-hover:block text-white text-xs bg-black bg-opacity-75 px-2 py-1 rounded">
                      Select
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isGenerating && (
          <div className="text-center py-8">
            <div className="inline-flex items-center space-x-2 text-blue-600">
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Generating your image...</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">This may take a few moments</p>
          </div>
        )}
      </div>
    </div>
  )
}