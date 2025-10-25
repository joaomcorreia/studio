from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import transaction
from apps.tenants.models import Tenant, Domain
from apps.sections.models import Section
from apps.templates.models import Template, TemplateSection

User = get_user_model()


class Command(BaseCommand):
    help = 'Seed demo data for development'

    def handle(self, *args, **options):
        self.stdout.write('Creating demo data...')
        
        with transaction.atomic():
            # Create admin user
            admin_user, created = User.objects.get_or_create(
                username='admin',
                defaults={
                    'email': 'admin@justcodeworks.eu',
                    'role': 'admin',
                    'is_staff': True,
                    'is_superuser': True,
                }
            )
            if created:
                admin_user.set_password('admin123')
                admin_user.save()
                self.stdout.write(f'✓ Created admin user: admin/admin123')
            
            # Create demo tenant
            tenant, created = Tenant.objects.get_or_create(
                slug='marysrestaurant',
                defaults={
                    'business_name': "Mary's Restaurant",
                    'industry_category': 'restaurant',
                    'city': 'Amsterdam',
                    'country': 'Netherlands',
                    'contact_email': 'mary@marysrestaurant.com',
                    'contact_phone': '+31 20 123 4567',
                }
            )
            if created:
                self.stdout.write(f'✓ Created tenant: {tenant.business_name}')
                
                # Create domain
                Domain.objects.get_or_create(
                    domain='marysrestaurant.lvh.me',
                    defaults={
                        'tenant': tenant,
                        'is_primary': True
                    }
                )
                self.stdout.write(f'✓ Created domain: marysrestaurant.lvh.me')
            
            # Create demo sections
            sections_data = [
                {
                    'slug': 'jcw-rest-01-nav01',
                    'name': 'Restaurant Navigation',
                    'category': 'nav',
                    'json_schema': {'logo': 'string', 'menu_items': 'array'},
                    'status': 'approved'
                },
                {
                    'slug': 'jcw-rest-01-hero01',
                    'name': 'Restaurant Hero Section',
                    'category': 'hero',
                    'json_schema': {'title': 'string', 'subtitle': 'string', 'background_image': 'string'},
                    'status': 'approved'
                },
                {
                    'slug': 'jcw-rest-01-feature01',
                    'name': 'Restaurant Features',
                    'category': 'feature',
                    'json_schema': {'features': 'array'},
                    'status': 'approved'
                },
                {
                    'slug': 'jcw-rest-01-footer01',
                    'name': 'Restaurant Footer',
                    'category': 'footer',
                    'json_schema': {'contact_info': 'object', 'social_links': 'array'},
                    'status': 'approved'
                }
            ]
            
            sections = []
            for section_data in sections_data:
                section, created = Section.objects.get_or_create(
                    slug=section_data['slug'],
                    defaults={
                        **section_data,
                        'created_by': admin_user
                    }
                )
                sections.append(section)
                if created:
                    self.stdout.write(f'✓ Created section: {section.name}')
            
            # Create demo template
            template, created = Template.objects.get_or_create(
                slug='restaurant-one-page',
                defaults={
                    'name': 'Restaurant One Page',
                    'description': 'Simple one-page template for restaurants',
                    'website_type': 'one_page',
                    'is_default': True,
                    'created_by': admin_user
                }
            )
            if created:
                self.stdout.write(f'✓ Created template: {template.name}')
                
                # Add sections to template
                for i, section in enumerate(sections):
                    TemplateSection.objects.create(
                        template=template,
                        section=section,
                        order_index=i,
                        is_required=True
                    )
                self.stdout.write(f'✓ Added {len(sections)} sections to template')
        
        self.stdout.write(
            self.style.SUCCESS('\n🎉 Demo data created successfully!\n')
        )
        self.stdout.write('You can now:')
        self.stdout.write('• Visit http://marysrestaurant.lvh.me:3000 to see the tenant site')
        self.stdout.write('• Login to admin with: admin/admin123')
        self.stdout.write('• Use the onboarding flow to create more tenants')
        self.stdout.write('• Explore the sections and templates in the admin dashboard')