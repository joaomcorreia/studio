// Content indexing service for AI assistant
export interface PageContent {
  path: string
  title: string
  description: string
  content: string
  sections: {
    heading: string
    content: string
  }[]
  services?: string[]
  pricing?: {
    plan: string
    price: string
    features: string[]
  }[]
}

class ContentIndexer {
  private static instance: ContentIndexer
  private contentCache: Map<string, PageContent> = new Map()
  private lastUpdated: Date = new Date()

  static getInstance(): ContentIndexer {
    if (!ContentIndexer.instance) {
      ContentIndexer.instance = new ContentIndexer()
    }
    return ContentIndexer.instance
  }

  // Index all website content
  async indexAllContent(): Promise<void> {
    const pages = [
      { path: '/', component: 'homepage' },
      { path: '/websites', component: 'websites' },
      { path: '/custom', component: 'custom' },
      { path: '/prints', component: 'prints' },
      { path: '/build', component: 'build' }
    ]

    for (const page of pages) {
      try {
        const content = await this.extractPageContent(page.path, page.component)
        this.contentCache.set(page.path, content)
      } catch (error) {
        console.error(`Error indexing ${page.path}:`, error)
      }
    }

    this.lastUpdated = new Date()
  }

  // Extract content from a specific page
  private async extractPageContent(path: string, component: string): Promise<PageContent> {
    // This would be expanded to dynamically read from actual pages
    // For now, we'll manually define the content structure
    
    const contentMap: Record<string, PageContent> = {
      '/': {
        path: '/',
        title: 'Just Code Works - Professional Website Development',
        description: 'Build beautiful, professional websites with our expert development services. From starter websites to custom solutions.',
        content: 'Just Code Works specializes in creating professional websites tailored to your business needs. We offer comprehensive web development services including starter websites, premium business sites, custom development, and print design services.',
        sections: [
          {
            heading: 'Professional Website Development',
            content: 'We create stunning, responsive websites that help your business grow online. Our team combines technical expertise with creative design to deliver exceptional results.'
          },
          {
            heading: 'Our Services',
            content: 'Website development, custom applications, e-commerce solutions, print design, branding, and ongoing maintenance and support.'
          },
          {
            heading: 'Why Choose Us',
            content: 'Professional quality, responsive design, SEO optimization, fast loading times, mobile-friendly, ongoing support, and competitive pricing.'
          }
        ],
        services: ['Website Development', 'Custom Applications', 'E-commerce', 'Print Design', 'Branding', 'SEO Optimization']
      },
      '/websites': {
        path: '/websites',
        title: 'Website Plans - Starter & Premium Options',
        description: 'Choose from our Starter or Premium website plans. Professional websites with full customization and ongoing support.',
        content: 'We offer two main website plans: Starter Plan for new businesses and Premium Plan for established companies. Both include professional design, responsive layouts, and ongoing support.',
        sections: [
          {
            heading: 'Starter Plan',
            content: 'Perfect for new businesses. Includes professional design, up to 5 pages, contact forms, mobile responsive design, basic SEO, and 1 year of hosting.'
          },
          {
            heading: 'Premium Plan',
            content: 'Ideal for established businesses. Includes everything in Starter plus advanced features, unlimited pages, e-commerce integration, advanced SEO, analytics, and priority support.'
          }
        ],
        services: ['Website Design', 'Responsive Development', 'SEO Optimization', 'Hosting', 'Maintenance'],
        pricing: [
          {
            plan: 'Starter',
            price: '€499',
            features: ['Up to 5 pages', 'Mobile responsive', 'Contact forms', 'Basic SEO', '1 year hosting', 'Professional design']
          },
          {
            plan: 'Premium',
            price: '€999',
            features: ['Unlimited pages', 'E-commerce ready', 'Advanced SEO', 'Analytics integration', 'Priority support', 'Custom features']
          }
        ]
      },
      '/custom': {
        path: '/custom',
        title: 'Custom Websites - Tailored Solutions',
        description: 'Custom websites built specifically for your unique business needs with advanced features and integrations.',
        content: 'Custom websites are built for projects that go beyond standard plans. From unique layouts to advanced dashboards and multi-system integrations, every feature is adapted to fit your exact needs.',
        sections: [
          {
            heading: 'Custom Design & Layouts',
            content: 'Unique page structures designed for your brand, advanced animations and visual effects using React, Next.js, and Framer Motion, personalized user journeys and landing flows.'
          },
          {
            heading: 'Custom Forms & Logic',
            content: 'Unlimited custom forms for quotes, bookings, requests, and reports. Conditional logic and field validation. Email routing, file uploads, and form analytics.'
          },
          {
            heading: 'Advanced Integrations',
            content: 'Facebook, Instagram, and Google Business integration. Payment and booking systems. CRM and newsletter tools like HubSpot and Mailchimp. POS or print-on-demand connectivity.'
          },
          {
            heading: 'Management & Support',
            content: 'Flexible admin dashboard, multi-language support, advanced SEO controls, role-based access for teams, integrated analytics, and ongoing support.'
          }
        ],
        services: ['Custom Development', 'API Integrations', 'Database Design', 'Advanced Features', 'Ongoing Support']
      },
      '/prints': {
        path: '/prints',
        title: 'Print Design Services - Business Cards, Brochures & More',
        description: 'Professional print design services including business cards, trifold brochures, gifts, and custom clothing with Printful integration.',
        content: 'Complete print design services for all your business needs. From business cards to custom apparel, we design professional print materials that represent your brand perfectly.',
        sections: [
          {
            heading: 'Business Cards',
            content: 'Professional business card designs that make a lasting impression. High-quality printing with various paper options and finishes.'
          },
          {
            heading: 'Trifold Brochures',
            content: 'Informative trifold brochures perfect for marketing your services. Professional layout and design with compelling content.'
          },
          {
            heading: 'Custom Gifts',
            content: 'Branded promotional items and corporate gifts. Mugs, notebooks, pens, and other promotional materials with your logo and branding.'
          },
          {
            heading: 'Custom Clothing',
            content: 'Branded apparel including t-shirts, hoodies, and other clothing items. High-quality printing and embroidery options available.'
          }
        ],
        services: ['Business Cards', 'Brochures', 'Promotional Items', 'Custom Apparel', 'Brand Design']
      },
      '/build': {
        path: '/build',
        title: 'Website Builder - Create Your Site',
        description: 'Use our website builder to create your perfect site. Choose templates, customize design, and launch your professional website.',
        content: 'Our website builder makes it easy to create professional websites. Choose from templates, customize your design, add content, and launch your site with our guided process.',
        sections: [
          {
            heading: 'Choose Your Template',
            content: 'Select from our collection of professionally designed templates. Each template is fully responsive and optimized for performance.'
          },
          {
            heading: 'Customize Your Design',
            content: 'Personalize colors, fonts, layouts, and content to match your brand. Easy-to-use editor with real-time preview.'
          },
          {
            heading: 'Add Your Content',
            content: 'Add your text, images, and other content. Our system helps you optimize for search engines and user experience.'
          },
          {
            heading: 'Launch Your Site',
            content: 'Review your site, test functionality, and launch with professional hosting and ongoing support.'
          }
        ],
        services: ['Template Selection', 'Design Customization', 'Content Management', 'Site Launch', 'Hosting']
      }
    }

    return contentMap[path] || {
      path,
      title: 'Just Code Works',
      description: 'Professional website development services',
      content: 'Content not yet indexed for this page.',
      sections: [],
      services: []
    }
  }

  // Get content for AI assistant
  getContentForAssistant(): string {
    let fullContent = ''
    
    for (const [path, content] of this.contentCache.entries()) {
      fullContent += `\n\nPage: ${content.title} (${path})\n`
      fullContent += `Description: ${content.description}\n`
      fullContent += `Content: ${content.content}\n`
      
      if (content.sections.length > 0) {
        fullContent += `Sections:\n`
        content.sections.forEach(section => {
          fullContent += `- ${section.heading}: ${section.content}\n`
        })
      }
      
      if (content.services && content.services.length > 0) {
        fullContent += `Services: ${content.services.join(', ')}\n`
      }
      
      if (content.pricing && content.pricing.length > 0) {
        fullContent += `Pricing:\n`
        content.pricing.forEach(price => {
          fullContent += `- ${price.plan}: ${price.price} - Features: ${price.features.join(', ')}\n`
        })
      }
    }
    
    return fullContent
  }

  // Get specific page content
  getPageContent(path: string): PageContent | undefined {
    return this.contentCache.get(path)
  }

  // Check if content needs update
  shouldUpdate(): boolean {
    const hoursSinceUpdate = (Date.now() - this.lastUpdated.getTime()) / (1000 * 60 * 60)
    return hoursSinceUpdate > 1 // Update every hour
  }

  // Get all indexed paths
  getIndexedPaths(): string[] {
    return Array.from(this.contentCache.keys())
  }
}

export default ContentIndexer