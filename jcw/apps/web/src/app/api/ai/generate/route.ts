import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { businessName, industry, existingContent, contentType = 'description' } = await request.json()

    if (!businessName) {
      return NextResponse.json({ error: 'Business name is required' }, { status: 400 })
    }

    let prompt = ''
    
    switch (contentType) {
      case 'description':
        prompt = `Generate a compelling business description for "${businessName}", a ${industry || 'business'}.

${existingContent ? `Current content to improve: "${existingContent}"` : ''}

Requirements:
- 2-3 sentences maximum (150-200 words)
- Professional yet engaging tone
- Focus on unique value proposition
- Include what makes the business special
- Avoid generic phrases
- Make it customer-focused

${existingContent ? 'Enhance and improve the existing content while keeping the core message.' : 'Create original, compelling content from scratch.'}

Business Description:`

        break
        
      case 'key_message':
        prompt = `Create a powerful key message/slogan for "${businessName}", a ${industry || 'business'}.

${existingContent ? `Current message: "${existingContent}"` : ''}

Requirements:
- Maximum 10 words
- Memorable and catchy
- Highlights unique value
- Professional yet approachable
- Avoid clichés

Key Message:`
        break
        
      default:
        return NextResponse.json({ error: 'Invalid content type' }, { status: 400 })
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert marketing copywriter specializing in small business content. Create engaging, professional, and authentic content that helps businesses connect with their customers."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: contentType === 'description' ? 300 : 50,
      temperature: 0.7,
    })

    const generatedContent = completion.choices[0]?.message?.content?.trim()

    if (!generatedContent) {
      throw new Error('No content generated')
    }

    return NextResponse.json({ 
      success: true, 
      content: generatedContent,
      contentType 
    })

  } catch (error: any) {
    console.error('AI Generation Error:', error)
    
    if (error.code === 'insufficient_quota') {
      return NextResponse.json({ 
        error: 'AI service temporarily unavailable. Please try again later.' 
      }, { status: 503 })
    }
    
    return NextResponse.json({ 
      error: 'Failed to generate content. Please try again.' 
    }, { status: 500 })
  }
}