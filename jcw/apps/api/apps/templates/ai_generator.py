"""
Template Section Generator - Creates modular restaurant templates with AI
"""
import os
import openai
from django.conf import settings

# Set up OpenAI API
openai.api_key = os.getenv('OPENAI_API_KEY')

class RestaurantSectionGenerator:
    """Generate restaurant template sections using AI"""
    
    def __init__(self):
        self.section_types = [
            'hero',
            'about-us', 
            'menu',
            'gallery',
            'contact'
        ]
        
    def generate_section_content(self, template_number, section_type, style_description):
        """Generate HTML and CSS for a specific section"""
        
        prompt = f"""
        Create a modern, responsive restaurant website section for "{section_type}".
        
        Template Style: {style_description}
        Template ID: jcw-rest-{template_number:02d}
        Section ID: jcw-rest-{template_number:02d}-{section_type}
        
        Requirements:
        - Modern, clean design with restaurant/food business focus
        - Fully responsive (mobile-first approach)
        - Use CSS Grid and Flexbox for layouts
        - Include proper accessibility attributes
        - Use semantic HTML5 elements
        - Professional color scheme suitable for restaurants
        - Smooth animations and hover effects
        - Optimized for performance
        
        Section-specific requirements:
        {self._get_section_requirements(section_type)}
        
        Return ONLY valid HTML and CSS code, no markdown formatting.
        Format as:
        HTML:
        [html code here]
        
        CSS:
        [css code here]
        """
        
        try:
            from openai import OpenAI
            client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
            
            response = client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are an expert web developer specializing in modern, responsive restaurant websites. Generate only clean, production-ready HTML and CSS code."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=2500,
                temperature=0.7
            )
            
            parsed_response = self._parse_ai_response(response.choices[0].message.content)
            if parsed_response:
                return parsed_response
            else:
                print(f"AI parsing failed for {section_type}, using fallback")
                return self._get_fallback_section(template_number, section_type)
            
        except Exception as e:
            print(f"Error generating section {section_type}: {e}")
            return self._get_fallback_section(template_number, section_type)
    
    def _get_section_requirements(self, section_type):
        """Get specific requirements for each section type"""
        requirements = {
            'hero': """
            - Eye-catching headline and subheading
            - Call-to-action button (reservation/order)
            - Background image placeholder or gradient
            - Navigation menu integration ready
            - Mobile hamburger menu consideration
            """,
            'about-us': """
            - Restaurant story/description text
            - Chef/owner photo placeholder
            - Mission/values highlighting
            - Restaurant establishment year
            - Awards or certifications display area
            """,
            'menu': """
            - Menu categories (appetizers, mains, desserts, drinks)
            - Item name, description, and price layout
            - Special dietary indicators (vegan, gluten-free)
            - Featured/signature dishes highlighting
            - Download menu PDF button
            """,
            'gallery': """
            - Food photography grid layout
            - Restaurant interior/ambiance photos
            - Lightbox/modal ready structure
            - Instagram feed integration ready
            - Photo categories or filtering
            """,
            'contact': """
            - Address and contact information
            - Opening hours table
            - Contact form (name, email, message, date/time for reservations)
            - Map integration placeholder
            - Social media links
            - Parking information
            """
        }
        return requirements.get(section_type, "")
    
    def _parse_ai_response(self, response_text):
        """Parse AI response to extract HTML and CSS"""
        try:
            # Split the response into HTML and CSS parts
            parts = response_text.split('CSS:')
            if len(parts) != 2:
                raise ValueError("Invalid response format")
            
            html_part = parts[0].replace('HTML:', '').strip()
            css_part = parts[1].strip()
            
            return {
                'html': html_part,
                'css': css_part
            }
            
        except Exception as e:
            print(f"Error parsing AI response: {e}")
            return None
    
    def _get_fallback_section(self, template_number, section_type):
        """Provide fallback content if AI generation fails"""
        return {
            'html': f'''<section id="jcw-rest-{template_number:02d}-{section_type}" class="section-{section_type}">
                <div class="container">
                    <h2>{section_type.replace('-', ' ').title()}</h2>
                    <p>This is a placeholder for the {section_type} section of restaurant template {template_number:02d}.</p>
                </div>
            </section>''',
            'css': f'''.section-{section_type} {{
                padding: 80px 0;
                background: #f8f9fa;
            }}
            
            .section-{section_type} .container {{
                max-width: 1200px;
                margin: 0 auto;
                padding: 0 20px;
                text-align: center;
            }}
            
            .section-{section_type} h2 {{
                font-size: 2.5rem;
                margin-bottom: 1rem;
                color: #333;
            }}'''
        }

    def get_template_styles(self):
        """Define the 4 different restaurant template styles"""
        return [
            {
                'name': 'Modern Elegance',
                'description': '''Sophisticated and upscale restaurant design with:
                - Clean minimalist layout with plenty of white space
                - Elegant typography (serif headers, sans-serif body)
                - Gold and dark navy color scheme
                - Subtle animations and parallax effects
                - Fine dining atmosphere focus'''
            },
            {
                'name': 'Rustic Charm', 
                'description': '''Warm and welcoming casual dining design with:
                - Earth tone color palette (browns, oranges, creams)
                - Textured backgrounds and wood grain elements
                - Handwritten-style fonts for headers
                - Cozy, family-friendly atmosphere
                - Farm-to-table concept highlighting'''
            },
            {
                'name': 'Urban Modern',
                'description': '''Contemporary city restaurant design with:
                - Bold, vibrant color scheme (black, white, red accents)
                - Industrial design elements
                - Clean geometric layouts
                - Fast-casual or trendy restaurant focus
                - Instagram-worthy aesthetic'''
            },
            {
                'name': 'Mediterranean Fresh',
                'description': '''Fresh and airy Mediterranean design with:
                - Blue and white color palette with olive green accents
                - Light, airy layouts with coastal elements
                - Fresh, healthy food focus
                - Seafood and Mediterranean cuisine highlighting
                - Relaxed, vacation-like atmosphere'''
            }
        ]