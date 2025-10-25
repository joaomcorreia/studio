"""
Django management command to generate restaurant templates with modular sections
"""
from django.core.management.base import BaseCommand
from django.db import transaction
from apps.templates.models import Template, TemplateSection
from apps.sections.models import Section
from apps.users.models import User
from apps.templates.ai_generator import RestaurantSectionGenerator


class Command(BaseCommand):
    help = 'Generate 4 restaurant templates with modular sections'

    def add_arguments(self, parser):
        parser.add_argument(
            '--force',
            action='store_true',
            help='Delete existing restaurant templates and recreate them',
        )

    def handle(self, *args, **options):
        generator = RestaurantSectionGenerator()
        
        # Get or create admin user for template creation
        admin_user, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@jcw.com',
                'role': 'admin',
                'is_staff': True,
                'is_superuser': True
            }
        )
        
        if options['force']:
            self.stdout.write('Deleting existing restaurant templates...')
            Template.objects.filter(category='rest').delete()
            Section.objects.filter(vertical='rest').delete()

        template_styles = generator.get_template_styles()
        
        with transaction.atomic():
            for i, style in enumerate(template_styles, 1):
                self.stdout.write(f'Generating Template {i}: {style["name"]}')
                
                # Create main template
                template = self._create_template(i, style, admin_user)
                
                # Generate sections for this template
                sections = self._generate_template_sections(generator, i, style, admin_user)
                
                # Link sections to template
                self._link_sections_to_template(template, sections)
                
                # Combine all sections into full template HTML/CSS
                self._combine_template_content(template, sections)
                
                self.stdout.write(
                    self.style.SUCCESS(f'✓ Created template: {template.name} with {len(sections)} sections')
                )

        self.stdout.write(
            self.style.SUCCESS('\n🎉 Successfully generated 4 restaurant templates!')
        )
        self.stdout.write('Templates created:')
        for template in Template.objects.filter(category='rest').order_by('file_name'):
            sections_count = template.template_sections.count()
            self.stdout.write(f'  • {template.name} ({template.file_name}) - {sections_count} sections')

    def _create_template(self, template_number, style, admin_user):
        """Create the main template record"""
        template = Template.objects.create(
            slug=f'jcw-rest-{template_number:02d}',
            name=f'Restaurant Template {template_number:02d} - {style["name"]}',
            description=f'{style["description"]}\n\nThis template consists of modular sections that can be mixed and matched with other restaurant templates.',
            website_type='one_page',
            category='rest',
            file_name=f'jcw-rest-{template_number:02d}',
            is_active=True,
            created_by=admin_user
        )
        return template

    def _generate_template_sections(self, generator, template_number, style, admin_user):
        """Generate all sections for a template"""
        sections = []
        
        for section_type in generator.section_types:
            self.stdout.write(f'  Generating {section_type} section...')
            
            # Generate section content with AI
            content = generator.generate_section_content(
                template_number, 
                section_type, 
                style['description']
            )
            
            if content:
                # Create section record
                section = Section.objects.create(
                    slug=f'jcw-rest-{template_number:02d}-{section_type}01',
                    name=f'{style["name"]} - {section_type.replace("-", " ").title()}',
                    category=self._map_section_category(section_type),
                    vertical='rest',
                    kit_number=f'{template_number:02d}',
                    section_type_number='01',
                    framework='next',
                    version='1.0.0',
                    json_schema={
                        'html_content': content['html'],
                        'css_content': content['css'],
                        'template_id': f'jcw-rest-{template_number:02d}',
                        'section_type': section_type
                    },
                    status='approved',
                    compatibility_flags=['light', 'dark'],
                    created_by=admin_user
                )
                sections.append(section)
                self.stdout.write(f'    ✓ Created section: {section.slug}')
            else:
                self.stdout.write(
                    self.style.WARNING(f'    ⚠ Failed to generate {section_type} section')
                )
                
        return sections

    def _map_section_category(self, section_type):
        """Map section types to Section model categories"""
        mapping = {
            'hero': 'hero',
            'about-us': 'feature',
            'menu': 'feature', 
            'gallery': 'gallery',
            'contact': 'cta'
        }
        return mapping.get(section_type, 'feature')

    def _link_sections_to_template(self, template, sections):
        """Create TemplateSection links with proper ordering"""
        for order, section in enumerate(sections, 1):
            TemplateSection.objects.create(
                template=template,
                section=section,
                order_index=order,
                is_required=order == 1  # Hero section is required
            )

    def _combine_template_content(self, template, sections):
        """Combine all section HTML/CSS into template content"""
        combined_html = []
        combined_css = []
        
        # Add base CSS reset and common styles
        combined_css.append("""
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        img {
            max-width: 100%;
            height: auto;
        }
        
        a {
            text-decoration: none;
            color: inherit;
        }
        
        button {
            cursor: pointer;
            border: none;
            outline: none;
        }
        """)
        
        # Combine sections in order
        for template_section in template.template_sections.order_by('order_index'):
            section = template_section.section
            section_data = section.json_schema
            
            if 'html_content' in section_data:
                combined_html.append(section_data['html_content'])
            
            if 'css_content' in section_data:
                combined_css.append(section_data['css_content'])
        
        # Update template with combined content
        template.html_content = '\n\n'.join(combined_html)
        template.css_content = '\n\n'.join(combined_css)
        template.save()