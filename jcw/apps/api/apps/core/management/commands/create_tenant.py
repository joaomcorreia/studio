"""
Management command to create a new tenant
"""
from django.core.management.base import BaseCommand
from apps.tenants.models import Tenant, Domain
from apps.core.utils import generate_tenant_slug, ensure_unique_tenant_slug
from django.db import transaction


class Command(BaseCommand):
    help = 'Create a new tenant'

    def add_arguments(self, parser):
        parser.add_argument('business_name', type=str, help='Name of the business')
        parser.add_argument('contact_email', type=str, help='Contact email for the tenant')
        parser.add_argument('--slug', type=str, help='Custom slug (optional)')
        parser.add_argument('--industry', type=str, default='other', 
                          choices=['restaurant', 'retail', 'services', 'healthcare', 'other'],
                          help='Industry category')
        parser.add_argument('--city', type=str, default='', help='City')
        parser.add_argument('--country', type=str, default='', help='Country')
        parser.add_argument('--phone', type=str, default='', help='Phone number')

    def handle(self, *args, **options):
        business_name = options['business_name']
        contact_email = options['contact_email']
        
        try:
            with transaction.atomic():
                # Generate or use custom slug
                if options['slug']:
                    slug = ensure_unique_tenant_slug(options['slug'])
                else:
                    base_slug = generate_tenant_slug(business_name)
                    slug = ensure_unique_tenant_slug(base_slug)
                
                # Create tenant
                tenant = Tenant.objects.create(
                    slug=slug,
                    business_name=business_name,
                    industry_category=options['industry'],
                    city=options['city'],
                    country=options['country'],
                    contact_email=contact_email,
                    contact_phone=options['phone'],
                )
                
                # Create development domain
                domain_name = f"{slug}.lvh.me"
                Domain.objects.create(
                    domain=domain_name,
                    tenant=tenant,
                    is_primary=True
                )
                
                self.stdout.write(
                    self.style.SUCCESS(f'Successfully created tenant: {tenant.business_name}')
                )
                self.stdout.write(f'  - Tenant ID: {tenant.id}')
                self.stdout.write(f'  - Slug: {tenant.slug}')
                self.stdout.write(f'  - Development URL: http://{slug}.lvh.me:3000')
                self.stdout.write(f'  - Contact: {tenant.contact_email}')
                
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating tenant: {str(e)}')
            )