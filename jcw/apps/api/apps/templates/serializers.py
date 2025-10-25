from rest_framework import serializers
from .models import Template, TemplateSection
from apps.sections.serializers import SectionSerializer
from PIL import Image
import openai
import base64
import io
import os
from django.utils.text import slugify
import random
import string


class TemplateSectionSerializer(serializers.ModelSerializer):
    section = SectionSerializer(read_only=True)
    section_id = serializers.UUIDField(write_only=True)
    
    class Meta:
        model = TemplateSection
        fields = ['id', 'section', 'section_id', 'order_index', 'is_required', 'placement_constraints']


class TemplateSerializer(serializers.ModelSerializer):
    template_sections = TemplateSectionSerializer(many=True, required=False)
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    preview_image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Template
        fields = [
            'id', 'slug', 'name', 'description', 'website_type', 'category', 
            'file_name', 'preview_image', 'preview_image_url', 'html_content', 
            'css_content', 'used_by_count', 'is_active', 'is_default',
            'template_sections', 'created_by', 'created_by_username', 
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'file_name', 'created_at', 'updated_at', 'used_by_count']
    
    def get_preview_image_url(self, obj):
        if obj.preview_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.preview_image.url)
            return obj.preview_image.url
        return None
    
    def create(self, validated_data):
        template_sections_data = validated_data.pop('template_sections', [])
        template = Template.objects.create(**validated_data)
        
        for section_data in template_sections_data:
            section_id = section_data.pop('section_id')
            TemplateSection.objects.create(
                template=template,
                section_id=section_id,
                **section_data
            )
        
        return template


class TemplateUploadSerializer(serializers.ModelSerializer):
    preview_image = serializers.ImageField()
    
    class Meta:
        model = Template
        fields = ['name', 'category', 'description', 'preview_image', 'website_type']
    
    def create(self, validated_data):
        # Generate HTML and CSS from the uploaded image
        html_content, css_content = self.generate_code_from_image(validated_data['preview_image'])
        
        # Set default website_type if not provided
        if 'website_type' not in validated_data:
            validated_data['website_type'] = 'one_page'
        
        # Generate unique slug
        base_slug = slugify(validated_data['name'])
        slug = base_slug
        counter = 1
        
        # Ensure slug is unique
        while Template.objects.filter(slug=slug).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
        
        # Handle created_by field - make it optional if no user is authenticated
        create_kwargs = {
            'slug': slug,
            'name': validated_data['name'],
            'category': validated_data['category'],
            'description': validated_data['description'],
            'preview_image': validated_data['preview_image'],
            'website_type': validated_data['website_type'],
            'html_content': html_content,
            'css_content': css_content,
            'is_default': False,  # Uploaded templates are not default
        }
        
        # Only set created_by if user is authenticated
        request = self.context.get('request')
        if request and hasattr(request, 'user') and request.user.is_authenticated:
            create_kwargs['created_by'] = request.user
        
        template = Template.objects.create(**create_kwargs)
        return template
    
    def generate_code_from_image(self, image_file):
        """
        Generate HTML and CSS code based on the uploaded image using OpenAI Vision API
        """
        try:
            # Check if OpenAI API key is available
            if not os.getenv('OPENAI_API_KEY'):
                print("OpenAI API key not found, using fallback template")
                return self.get_fallback_template()
            
            # Convert image to base64
            image = Image.open(image_file)
            # Resize image if too large
            if image.width > 1024 or image.height > 1024:
                image.thumbnail((1024, 1024), Image.Resampling.LANCZOS)
            
            # Convert to base64
            buffered = io.BytesIO()
            image.save(buffered, format="JPEG")
            image_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')
            
            # Call OpenAI Vision API
            client = openai.OpenAI()
            response = client.chat.completions.create(
                model="gpt-4-vision-preview",
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": """Analyze this website screenshot and generate clean, modern HTML and CSS code that recreates the design. 

Requirements:
1. Use semantic HTML5 elements
2. Create responsive CSS with modern techniques (flexbox, grid)
3. Use a professional color scheme that matches the design
4. Include hover effects and transitions
5. Make it mobile-friendly
6. Use proper typography and spacing
7. Return ONLY the HTML and CSS code, separated by a comment line '<!-- CSS BELOW -->'

Focus on recreating the hero section, navigation, and main content areas visible in the image."""
                            },
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{image_base64}"
                                }
                            }
                        ]
                    }
                ],
                max_tokens=2000
            )
            
            generated_code = response.choices[0].message.content
            
            # Split HTML and CSS
            if '<!-- CSS BELOW -->' in generated_code:
                parts = generated_code.split('<!-- CSS BELOW -->')
                html_content = parts[0].strip()
                css_content = parts[1].strip() if len(parts) > 1 else ""
            else:
                # Fallback if separator not found
                html_content = generated_code
                css_content = ""
            
            # Clean up code blocks if they exist
            html_content = html_content.replace('```html', '').replace('```', '').strip()
            css_content = css_content.replace('```css', '').replace('```', '').strip()
            
            return html_content, css_content
            
        except Exception as e:
            # Fallback to basic template if AI generation fails
            print(f"AI generation failed: {e}")
            return self.get_fallback_template()
    
    def get_fallback_template(self):
        """Fallback HTML and CSS template if AI generation fails"""
        html_content = """<div class="hero-section">
    <div class="container">
        <h1 class="hero-title">Your Business Name</h1>
        <p class="hero-subtitle">Professional website created from your design</p>
        <button class="cta-button">Get Started</button>
    </div>
</div>

<section class="content-section">
    <div class="container">
        <h2>About Us</h2>
        <p>This template was generated from your uploaded design. Customize it to match your business needs.</p>
    </div>
</section>"""

        css_content = """* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    color: #333;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.hero-section {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    text-align: center;
    padding: 100px 0;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.hero-title {
    font-size: 3.5rem;
    margin-bottom: 1rem;
    font-weight: 700;
}

.hero-subtitle {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    opacity: 0.9;
}

.cta-button {
    background: white;
    color: #667eea;
    padding: 15px 30px;
    border: none;
    border-radius: 50px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.cta-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}

.content-section {
    padding: 80px 0;
    background: #f8f9fa;
}

.content-section h2 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    text-align: center;
}

.content-section p {
    font-size: 1.1rem;
    text-align: center;
    max-width: 600px;
    margin: 0 auto;
}

@media (max-width: 768px) {
    .hero-title {
        font-size: 2.5rem;
    }
    
    .hero-subtitle {
        font-size: 1rem;
    }
    
    .content-section h2 {
        font-size: 2rem;
    }
}"""
        
        return html_content, css_content


class TemplateComposeSerializer(serializers.Serializer):
    """
    Serializer for applying template to create pages.
    """
    page_slug = serializers.SlugField(default='home')
    page_title = serializers.CharField(max_length=100, default='Home Page')