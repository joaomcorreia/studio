"""
Demo script to create sample tenants for JCW platform
"""
import os
import sys
import django

# Add the API directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'jcw', 'apps', 'api'))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'justcodeworks.settings.simple')
django.setup()

from apps.tenants.models import Tenant, Domain
from apps.core.utils import generate_tenant_slug, ensure_unique_tenant_slug
from django.db import transaction


def create_sample_tenants():
    """Create sample tenants for demonstration"""
    
    sample_tenants = [
        {
            'business_name': 'Fresh Garden Cafe',
            'contact_email': 'hello@freshgarden.com',
            'industry_category': 'restaurant',
            'city': 'Portland',
            'country': 'USA',
            'contact_phone': '+1-503-555-0199'
        },
        {
            'business_name': 'Digital Marketing Pro',
            'contact_email': 'contact@digitalmarketingpro.com', 
            'industry_category': 'services',
            'city': 'Austin',
            'country': 'USA',
            'contact_phone': '+1-512-555-0188'
        },
        {
            'business_name': 'Wellness Center',
            'contact_email': 'info@wellnesscenter.com',
            'industry_category': 'healthcare', 
            'city': 'Denver',
            'country': 'USA',
            'contact_phone': '+1-303-555-0177'
        }
    ]
    
    created_tenants = []
    
    for tenant_data in sample_tenants:
        try:
            with transaction.atomic():
                # Check if tenant already exists
                if Tenant.objects.filter(business_name=tenant_data['business_name']).exists():
                    print(f"❌ Tenant '{tenant_data['business_name']}' already exists")
                    continue
                
                # Generate unique slug
                base_slug = generate_tenant_slug(tenant_data['business_name'])
                unique_slug = ensure_unique_tenant_slug(base_slug)
                
                # Create tenant
                tenant = Tenant.objects.create(
                    slug=unique_slug,
                    **tenant_data
                )
                
                # Create domain
                domain_name = f"{unique_slug}.lvh.me"
                Domain.objects.create(
                    domain=domain_name,
                    tenant=tenant,
                    is_primary=True
                )
                
                created_tenants.append(tenant)
                print(f"✅ Created tenant: {tenant.business_name}")
                print(f"   - Slug: {tenant.slug}")
                print(f"   - URL: http://{unique_slug}.lvh.me:3000")
                print(f"   - Email: {tenant.contact_email}")
                print()
                
        except Exception as e:
            print(f"❌ Error creating tenant '{tenant_data['business_name']}': {str(e)}")
    
    return created_tenants


if __name__ == '__main__':
    print("🚀 Creating sample tenants for JCW platform...")
    print("=" * 50)
    
    created = create_sample_tenants()
    
    print("=" * 50) 
    print(f"✨ Successfully created {len(created)} new tenants!")
    
    # Show all tenants
    all_tenants = Tenant.objects.all()
    print(f"\n📊 Total tenants in system: {all_tenants.count()}")
    for i, tenant in enumerate(all_tenants, 1):
        print(f"  {i}. {tenant.business_name} ({tenant.slug}) - {tenant.industry_category}")