const API_BASE_URL = 'http://127.0.0.1:8000/api'

export interface Template {
  id: string
  name: string
  category: string
  description: string
  website_type: string
  file_name: string
  preview_image: string | null
  preview_image_url: string | null
  html_content: string
  css_content: string
  is_active: boolean
  used_by_count: number
  created_at: string
  updated_at: string
}

export interface TemplateUploadData {
  name: string
  category: string
  description: string
  preview_image: File
  website_type?: string
}

export interface TemplateStats {
  total_templates: number
  active_templates: number
  categories_count: number
  total_usage: number
}

export interface Category {
  value: string
  label: string
}

class TemplateService {
  private async makeRequest(url: string, options: RequestInit = {}) {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        // Add auth headers when implementing authentication
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }))
      throw new Error(error.error || 'Request failed')
    }

    return response.json()
  }

  private async makeFormRequest(url: string, formData: FormData) {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header for FormData - browser will set it with boundary
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Upload failed' }))
      throw new Error(error.error || 'Upload failed')
    }

    return response.json()
  }

  async getTemplates(category?: string): Promise<Template[]> {
    const params = category ? `?category=${category}` : ''
    return this.makeRequest(`/templates/${params}`)
  }

  async getTemplate(id: string): Promise<Template> {
    return this.makeRequest(`/templates/${id}/`)
  }

  async uploadTemplate(data: TemplateUploadData): Promise<Template> {
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('category', data.category)
    formData.append('description', data.description)
    formData.append('preview_image', data.preview_image)
    if (data.website_type) {
      formData.append('website_type', data.website_type)
    }

    return this.makeFormRequest('/templates/upload/', formData)
  }

  async getTemplateCode(id: string): Promise<{
    html_content: string
    css_content: string
    name: string
    category: string
    file_name: string
  }> {
    return this.makeRequest(`/templates/${id}/code/`)
  }

  async getCategories(): Promise<Category[]> {
    return this.makeRequest('/templates/categories/')
  }

  async updateTemplate(id: string, data: Partial<Template>): Promise<Template> {
    return this.makeRequest(`/templates/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async getStats(): Promise<TemplateStats> {
    return this.makeRequest('/templates/stats/')
  }

  async toggleTemplateStatus(id: string): Promise<Template> {
    return this.makeRequest(`/templates/${id}/toggle_status/`, {
      method: 'POST',
    })
  }

  async deleteTemplate(id: string): Promise<void> {
    await this.makeRequest(`/templates/${id}/`, {
      method: 'DELETE',
    })
  }
}

export const templateService = new TemplateService()