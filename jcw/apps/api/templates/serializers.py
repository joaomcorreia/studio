from rest_framework import serializers
from .models import Template
from PIL import Image
import openai
import base64
import io


class TemplateSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Template
        fields = [
            'id', 'name', 'category', 'description', 'file_name', 
            'image', 'image_url', 'html_content', 'css_content', 
            'is_active', 'used_by_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'file_name', 'created_at', 'updated_at', 'used_by_count']
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class TemplateCreateSerializer(serializers.ModelSerializer):
    image = serializers.ImageField()
    
    class Meta:
        model = Template
        fields = ['name', 'category', 'description', 'image']
    
    def create(self, validated_data):
        # Generate HTML and CSS from the uploaded image
        html_content, css_content = self.generate_code_from_image(validated_data['image'])
        
        template = Template.objects.create(
            **validated_data,
            html_content=html_content,
            css_content=css_content,
            created_by=self.context['request'].user
        )
        return template
    
    def generate_code_from_image(self, image_file):
        """
        Generate HTML and CSS code based on the uploaded image using OpenAI Vision API
        """
        try:
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