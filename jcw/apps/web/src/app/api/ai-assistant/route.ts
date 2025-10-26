import { NextRequest, NextResponse } from 'next/server'
import ContentIndexer from '@/services/contentIndexer'

// Initialize content indexer
const contentIndexer = ContentIndexer.getInstance()

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Update content index if needed
    if (contentIndexer.shouldUpdate()) {
      await contentIndexer.indexAllContent()
    }

    // Get all website content for context
    const websiteContent = contentIndexer.getContentForAssistant()
    const currentPage = contentIndexer.getPageContent(context || '/')

    // Create AI prompt with context
    const systemPrompt = `You are a helpful AI assistant for Just Code Works, a professional website development company. 

Your role is to:
1. Help users choose the best website solution for their needs
2. Answer questions about services, pricing, and features
3. Guide users through the website building process
4. Provide information about print design services
5. Be friendly, professional, and knowledgeable

Here is the complete information about our services and website content:

${websiteContent}

Current page context: ${currentPage?.title || 'Homepage'} - ${currentPage?.description || ''}

Guidelines:
- Always be helpful and professional
- Recommend the most suitable service based on user needs
- If asked about pricing, refer to our specific plans
- Encourage users to contact us for custom solutions
- Keep responses concise but informative
- If you don't know something specific, direct them to contact us directly

User's question: ${message}`

    // For now, we'll create intelligent responses based on the content
    // In a production environment, you would integrate with OpenAI or another AI service
    const response = await generateAIResponse(message, websiteContent, currentPage)

    return NextResponse.json({ response })

  } catch (error) {
    console.error('AI Assistant error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}

// Generate AI response based on content (mock implementation)
async function generateAIResponse(
  message: string, 
  websiteContent: string, 
  currentPage?: any
): Promise<string> {
  const lowerMessage = message.toLowerCase()
  
  // Pricing questions
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much')) {
    return `Great question about pricing! We offer several options:

📦 **Starter Plan - €499**
Perfect for new businesses and includes:
- Up to 5 pages
- Mobile responsive design
- Contact forms
- Basic SEO
- 1 year hosting
- Professional design

🚀 **Premium Plan - €999**
Ideal for established businesses:
- Unlimited pages
- E-commerce ready
- Advanced SEO
- Analytics integration
- Priority support
- Custom features

🎯 **Custom Websites**
For unique requirements with advanced features, integrations, and custom development - pricing varies based on scope.

Which type of website are you looking for? I can help you choose the best option for your needs!`
  }

  // Service comparison questions
  if (lowerMessage.includes('difference') || lowerMessage.includes('compare') || lowerMessage.includes('which plan')) {
    return `Happy to help you compare our plans! Here's the key differences:

**Starter Plan (€499)** is perfect if you:
- Are a new business or startup
- Need a simple, professional online presence
- Want up to 5 pages (Home, About, Services, Contact, etc.)
- Don't need e-commerce functionality yet

**Premium Plan (€999)** is better if you:
- Have an established business
- Need unlimited pages
- Want e-commerce capabilities
- Need advanced SEO and analytics
- Require priority support

**Custom Development** is ideal if you:
- Have unique requirements
- Need specific integrations (CRM, booking systems, etc.)
- Want advanced features not covered in standard plans
- Need a truly unique design and functionality

What's your business situation? I can recommend the best fit for your needs!`
  }

  // Print services questions
  if (lowerMessage.includes('print') || lowerMessage.includes('business card') || lowerMessage.includes('brochure')) {
    return `Excellent! We offer comprehensive print design services:

🎴 **Business Cards**
Professional designs that make lasting impressions with high-quality printing options

📄 **Trifold Brochures** 
Perfect for marketing your services with compelling layouts and content

🎁 **Custom Gifts & Promotional Items**
Branded mugs, notebooks, pens, and other promotional materials

👕 **Custom Clothing**
T-shirts, hoodies, and branded apparel with high-quality printing

We integrate with Printful for seamless ordering and delivery. All designs are created to perfectly represent your brand.

What type of print materials are you interested in? I can provide more specific information!`
  }

  // Getting started questions
  if (lowerMessage.includes('start') || lowerMessage.includes('begin') || lowerMessage.includes('how do i')) {
    return `I'd love to help you get started! Here's how it works:

🔍 **Step 1: Choose Your Path**
- Starter Plan: Quick, professional website
- Premium Plan: Advanced features & e-commerce
- Custom Development: Unique solutions
- Website Builder: DIY with our tools

📋 **Step 2: Planning**
We'll discuss your business needs, target audience, and goals

🎨 **Step 3: Design & Development**
Our team creates your website with your input and feedback

🚀 **Step 4: Launch & Support**
We launch your site and provide ongoing support

The best starting point depends on your business needs and budget. 

What type of business do you have, and what's your main goal for the website? This will help me recommend the perfect solution for you!`
  }

  // Custom development questions
  if (lowerMessage.includes('custom') || lowerMessage.includes('integration') || lowerMessage.includes('advanced')) {
    return `Custom development is perfect for unique business requirements! We create:

⚙️ **Custom Features**
- Booking systems
- Customer portals with login
- Advanced forms with conditional logic
- Product configurators
- Custom dashboards

🔗 **Integrations**
- CRM systems (HubSpot, Salesforce)
- Payment gateways
- Social media platforms
- Email marketing tools
- POS systems

🌐 **Advanced Capabilities**
- Multi-language support
- Advanced SEO controls
- Role-based access
- Analytics and reporting
- API development

Custom projects are priced based on complexity and requirements. We provide detailed quotes after understanding your specific needs.

What specific functionality are you looking for? I can help determine if custom development is the right fit!`
  }

  // Contact and support questions
  if (lowerMessage.includes('contact') || lowerMessage.includes('support') || lowerMessage.includes('help')) {
    return `I'm here to help! For personalized assistance:

📧 **Direct Contact**
Reach out to our team for detailed discussions about your project

💬 **Ongoing Support**
All our website plans include ongoing support and maintenance

🎯 **Free Consultation**
We offer free consultations to understand your needs and recommend the best solution

📞 **Priority Support**
Premium and Custom plan clients get priority support

What specific help do you need? I can provide more targeted information or guide you to the right contact method!`
  }

  // SEO questions
  if (lowerMessage.includes('seo') || lowerMessage.includes('search') || lowerMessage.includes('google')) {
    return `Great SEO question! We include SEO optimization in all our plans:

🎯 **Basic SEO (Starter Plan)**
- Proper page structure and meta tags
- Mobile-responsive design
- Fast loading speeds
- Basic keyword optimization

🚀 **Advanced SEO (Premium & Custom)**
- Comprehensive keyword research
- Advanced on-page optimization
- Schema markup and structured data
- Analytics integration
- Performance monitoring
- Local SEO optimization

📈 **SEO Benefits**
- Better Google rankings
- Increased organic traffic
- More qualified leads
- Better user experience

SEO is built into our development process, not an afterthought. We ensure your website is optimized from day one!

Is there a specific aspect of SEO you're most concerned about?`
  }

  // Default response with helpful options
  return `Thanks for your question! I'm here to help you find the perfect website solution for your business.

Here's what I can help you with:

🌐 **Website Plans**
- Starter Plan (€499) - Perfect for new businesses
- Premium Plan (€999) - Advanced features for established companies
- Custom Development - Unique solutions for special requirements

🎨 **Print Services**
- Business cards, brochures, promotional items, and custom clothing

🛠️ **Technical Questions**
- SEO optimization, integrations, features, and functionality

💰 **Pricing & Planning**
- Help you choose the right plan for your budget and needs

What specific aspect would you like to know more about? I'm here to provide detailed information and help you make the best choice for your business!`;
}

export async function GET() {
  return NextResponse.json({ 
    status: 'AI Assistant API is running',
    indexedPages: contentIndexer.getIndexedPaths()
  })
}