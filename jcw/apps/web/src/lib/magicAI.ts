// MagicAI - AI Content Generation Utilities
// Provides reusable AI functions for content and image generation

interface AIGenerationRequest {
  businessName: string
  industry?: string
  existingContent?: string
  contentType: 'description' | 'key_message' | 'services' | 'tagline'
}

interface AIGenerationResponse {
  success: boolean
  content?: string
  error?: string
}

export class MagicAI {
  private static baseUrl = '/api/ai'

  /**
   * Generate business description using AI
   */
  static async generateDescription(
    businessName: string, 
    industry?: string, 
    existingContent?: string
  ): Promise<AIGenerationResponse> {
    return this.generateContent({
      businessName,
      industry,
      existingContent,
      contentType: 'description'
    })
  }

  /**
   * Generate key message/slogan using AI
   */
  static async generateKeyMessage(
    businessName: string, 
    industry?: string, 
    existingContent?: string
  ): Promise<AIGenerationResponse> {
    return this.generateContent({
      businessName,
      industry,
      existingContent,
      contentType: 'key_message'
    })
  }

  /**
   * Core AI content generation function
   */
  private static async generateContent(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      })

      const data = await response.json()
      return data
    } catch (error) {
      console.error('MagicAI Error:', error)
      return {
        success: false,
        error: 'Failed to generate content. Please try again.'
      }
    }
  }

  /**
   * Generate services list using AI
   */
  static async generateServices(
    businessName: string, 
    industry?: string, 
    count: number = 3
  ): Promise<AIGenerationResponse> {
    return this.generateContent({
      businessName,
      industry,
      contentType: 'services',
      existingContent: `Generate ${count} services for a ${industry} business`
    })
  }

  /**
   * Generate tagline using AI
   */
  static async generateTagline(
    businessName: string, 
    industry?: string
  ): Promise<AIGenerationResponse> {
    return this.generateContent({
      businessName,
      industry,
      contentType: 'tagline'
    })
  }

  /**
   * Generate image prompts for business visuals
   * TODO: Implement DALL-E integration
   */
  static async generateImagePrompt(
    businessName: string,
    industry: string,
    style: 'logo' | 'hero' | 'background' = 'hero'
  ): Promise<string> {
    const prompts = {
      logo: `Professional logo design for ${businessName}, a ${industry} business, clean and modern style`,
      hero: `Professional hero image for ${businessName} website, ${industry} business, high quality, modern`,
      background: `Subtle background pattern for ${businessName}, ${industry} themed, professional and clean`
    }
    
    return prompts[style]
  }

  /**
   * Generate image using DALL-E API (placeholder implementation)
   */
  static async generateImage(
    prompt: string,
    size: '256x256' | '512x512' | '1024x1024' = '1024x1024'
  ): Promise<{success: boolean, imageUrl?: string, error?: string}> {
    try {
      // In a real implementation, this would call the DALL-E API
      console.log('Generating image with prompt:', prompt)
      
      // For now, return a placeholder image
      const placeholderUrl = `https://source.unsplash.com/${size.replace('x', 'x')}/?${encodeURIComponent(prompt)}&sig=${Math.random()}`
      
      return { success: true, imageUrl: placeholderUrl }
    } catch (error) {
      return { success: false, error: 'Image generation failed' }
    }
  }

  /**
   * Smart content suggestions based on business type
   */
  static generateContentSuggestions(industry: string, businessName: string) {
    const suggestions = {
      restaurant: [
        `What makes ${businessName} special?`,
        'What type of cuisine do you specialize in?',
        'Do you offer delivery, dine-in, or catering?',
        'What\'s your signature dish or specialty?'
      ],
      retail: [
        `What products does ${businessName} sell?`,
        'What makes your products unique?',
        'Do you offer online shopping or in-store only?',
        'What\'s your target customer demographic?'
      ],
      services: [
        `What services does ${businessName} provide?`,
        'What\'s your area of expertise?',
        'How long have you been in business?',
        'What makes you different from competitors?'
      ],
      healthcare: [
        `What medical services does ${businessName} offer?`,
        'What are your specializations?',
        'Do you accept insurance?',
        'What makes your practice unique?'
      ]
    }

    return suggestions[industry as keyof typeof suggestions] || suggestions.services
  }
}

// Export utility functions for easy import
export const {
  generateDescription,
  generateKeyMessage,
  generateImagePrompt,
  generateContentSuggestions
} = MagicAI

export default MagicAI