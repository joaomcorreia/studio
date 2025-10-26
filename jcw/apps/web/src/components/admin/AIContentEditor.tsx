'use client'

import { useState, useRef, useEffect } from 'react'
import MagicAI from '@/lib/magicAI'

interface AIContentEditorProps {
  initialContent?: string
  contentType: 'title' | 'subtitle' | 'description' | 'button' | 'tagline' | 'service' | 'pricing' | 'feature'
  businessName?: string
  industry?: string
  placeholder?: string
  onContentChange: (content: string) => void
  className?: string
  maxLength?: number
  multiline?: boolean
}

interface AIGenerationOptions {
  tone: 'professional' | 'friendly' | 'casual' | 'corporate' | 'creative'
  length: 'short' | 'medium' | 'long'
  style: 'modern' | 'traditional' | 'tech' | 'elegant' | 'bold'
}

export default function AIContentEditor({
  initialContent = '',
  contentType,
  businessName = 'Your Business',
  industry = 'general',
  placeholder = 'Enter content...',
  onContentChange,
  className = '',
  maxLength = 500,
  multiline = true
}: AIContentEditorProps) {
  const [content, setContent] = useState(initialContent)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showAIOptions, setShowAIOptions] = useState(false)
  const [aiOptions, setAIOptions] = useState<AIGenerationOptions>({
    tone: 'professional',
    length: 'medium',
    style: 'modern'
  })
  const [suggestions, setSuggestions] = useState<string[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    onContentChange(content)
  }, [content, onContentChange])

  useEffect(() => {
    // Generate smart suggestions based on content type and industry
    const smartSuggestions = generateSmartSuggestions()
    setSuggestions(smartSuggestions)
  }, [contentType, businessName, industry])

  const generateSmartSuggestions = (): string[] => {
    const suggestions = {
      title: [
        `Welcome to ${businessName}`,
        `${businessName} - Your ${industry} Solution`,
        `Experience Excellence with ${businessName}`,
        `${businessName}: Leading ${industry} Services`
      ],
      subtitle: [
        `Quality ${industry} services you can trust`,
        `Professional solutions for all your ${industry} needs`,
        `Innovation meets reliability at ${businessName}`,
        `Your trusted partner in ${industry}`
      ],
      description: [
        `${businessName} provides exceptional ${industry} services...`,
        `With years of experience in ${industry}...`,
        `We specialize in delivering high-quality ${industry} solutions...`,
        `At ${businessName}, we understand your ${industry} needs...`
      ],
      button: [
        'Get Started Today',
        'Learn More',
        'Contact Us Now',
        'Book a Consultation',
        'Start Your Journey',
        'Explore Services'
      ],
      tagline: [
        `Excellence in ${industry}`,
        `Your Success, Our Mission`,
        `Innovation Delivered`,
        `Quality You Can Trust`
      ]
    }

    return suggestions[contentType as keyof typeof suggestions] || []
  }

  const generateAIContent = async () => {
    setIsGenerating(true)
    try {
      let aiContent = ''
      
      // Create detailed prompts based on content type and AI options
      const prompt = createAIPrompt()
      
      // Use MagicAI to generate content
      const response = await MagicAI.generateDescription(businessName, industry, prompt)
      
      if (response.success && response.content) {
        aiContent = response.content
        
        // Adjust content length based on preferences
        aiContent = adjustContentLength(aiContent, aiOptions.length)
        
        // Apply tone adjustments
        aiContent = adjustTone(aiContent, aiOptions.tone)
        
        setContent(aiContent)
      } else {
        throw new Error(response.error || 'Failed to generate content')
      }
    } catch (error) {
      console.error('AI Generation Error:', error)
      // Fallback to template-based generation
      const fallbackContent = generateFallbackContent()
      setContent(fallbackContent)
    } finally {
      setIsGenerating(false)
      setShowAIOptions(false)
    }
  }

  const createAIPrompt = (): string => {
    const prompts = {
      title: `Generate a compelling ${aiOptions.tone} ${aiOptions.style} title for ${businessName}, a ${industry} business. Style: ${aiOptions.style}. Length: ${aiOptions.length}`,
      subtitle: `Create a ${aiOptions.tone} subtitle that complements the main title for ${businessName}, emphasizing ${industry} expertise. Style: ${aiOptions.style}`,
      description: `Write a ${aiOptions.tone} description for ${businessName}, a ${industry} company. Highlight unique value propositions. Style: ${aiOptions.style}. Length: ${aiOptions.length}`,
      button: `Suggest a ${aiOptions.tone} call-to-action button text for ${businessName} ${industry} website`,
      tagline: `Create a memorable ${aiOptions.tone} tagline for ${businessName} in the ${industry} industry`,
      service: `Describe a key service offered by ${businessName} in the ${industry} sector. Tone: ${aiOptions.tone}`,
      pricing: `Write compelling ${aiOptions.tone} pricing copy for ${businessName} ${industry} services`,
      feature: `Highlight a key feature or benefit of ${businessName} in the ${industry} market`
    }

    return prompts[contentType] || prompts.description
  }

  const adjustContentLength = (text: string, length: string): string => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    
    switch (length) {
      case 'short':
        return sentences.slice(0, 1).join('.') + '.'
      case 'long':
        return text
      default: // medium
        return sentences.slice(0, 2).join('.') + '.'
    }
  }

  const adjustTone = (text: string, tone: string): string => {
    // Simple tone adjustments - in a real app, this would be more sophisticated
    const toneAdjustments = {
      friendly: text.replace(/\./g, '!').replace(/We are/g, "We're").replace(/cannot/g, "can't"),
      casual: text.toLowerCase().replace(/^./, text[0].toUpperCase()),
      corporate: text.replace(/!/g, '.'),
      creative: text.replace(/\b(good|great)\b/gi, 'amazing').replace(/\b(help)\b/gi, 'empower'),
      professional: text
    }

    return toneAdjustments[tone as keyof typeof toneAdjustments] || text
  }

  const generateFallbackContent = (): string => {
    const fallbacks = {
      title: `${businessName} - Premium ${industry} Services`,
      subtitle: `Professional ${industry} solutions tailored to your needs`,
      description: `${businessName} is a leading provider of ${industry} services, committed to delivering exceptional quality and customer satisfaction. Our experienced team brings innovative solutions to help your business thrive.`,
      button: 'Get Started',
      tagline: `Excellence in ${industry}`,
      service: `Professional ${industry} service designed to meet your specific needs`,
      pricing: `Affordable ${industry} solutions with transparent pricing`,
      feature: `Advanced ${industry} capabilities for modern businesses`
    }

    return fallbacks[contentType] || fallbacks.description
  }

  const applySuggestion = (suggestion: string) => {
    setContent(suggestion)
  }

  const handleContentChange = (value: string) => {
    if (maxLength && value.length > maxLength) {
      return
    }
    setContent(value)
  }

  return (
    <div className={`ai-content-editor ${className}`}>
      <div className="flex flex-col space-y-3">
        {/* Content Input */}
        <div className="relative">
          {multiline ? (
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder={placeholder}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
              rows={contentType === 'title' ? 2 : contentType === 'description' ? 4 : 3}
            />
          ) : (
            <input
              type="text"
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder={placeholder}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          )}
          
          {/* Character count */}
          {maxLength && (
            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
              {content.length}/{maxLength}
            </div>
          )}
        </div>

        {/* AI Controls */}
        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={() => setShowAIOptions(!showAIOptions)}
            disabled={isGenerating}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>{isGenerating ? 'Generating...' : 'AI Generate'}</span>
          </button>

          {!isGenerating && content && (
            <button
              onClick={() => setContent('')}
              className="px-3 py-2 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        {/* AI Options Panel */}
        {showAIOptions && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">AI Generation Options</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tone</label>
                <select
                  value={aiOptions.tone}
                  onChange={(e) => setAIOptions({...aiOptions, tone: e.target.value as any})}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                >
                  <option value="professional">Professional</option>
                  <option value="friendly">Friendly</option>
                  <option value="casual">Casual</option>
                  <option value="corporate">Corporate</option>
                  <option value="creative">Creative</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Length</label>
                <select
                  value={aiOptions.length}
                  onChange={(e) => setAIOptions({...aiOptions, length: e.target.value as any})}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                >
                  <option value="short">Short</option>
                  <option value="medium">Medium</option>
                  <option value="long">Long</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Style</label>
                <select
                  value={aiOptions.style}
                  onChange={(e) => setAIOptions({...aiOptions, style: e.target.value as any})}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                >
                  <option value="modern">Modern</option>
                  <option value="traditional">Traditional</option>
                  <option value="tech">Tech</option>
                  <option value="elegant">Elegant</option>
                  <option value="bold">Bold</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex space-x-2">
              <button
                onClick={generateAIContent}
                disabled={isGenerating}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
              >
                {isGenerating ? 'Generating...' : 'Generate Content'}
              </button>
              <button
                onClick={() => setShowAIOptions(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Smart Suggestions */}
        {suggestions.length > 0 && !showAIOptions && (
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2">Quick Suggestions:</h5>
            <div className="flex flex-wrap gap-2">
              {suggestions.slice(0, 3).map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => applySuggestion(suggestion)}
                  className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
                >
                  {suggestion.length > 30 ? suggestion.substring(0, 30) + '...' : suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}