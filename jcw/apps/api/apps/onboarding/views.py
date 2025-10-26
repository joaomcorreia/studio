from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db import transaction
from django.shortcuts import get_object_or_404
from apps.tenants.models import Tenant, Domain
from apps.core.utils import generate_tenant_slug, ensure_unique_tenant_slug
from .serializers import OnboardingSerializer


class OnboardingStartView(APIView):
    """
    Create a new tenant from onboarding data.
    """
    permission_classes = [AllowAny]  # Public endpoint
    
    def post(self, request):
        serializer = OnboardingSerializer(data=request.data)
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    # Generate unique slug
                    base_slug = generate_tenant_slug(serializer.validated_data['business_name'])
                    unique_slug = ensure_unique_tenant_slug(base_slug)
                    
                    # Create tenant
                    tenant = Tenant.objects.create(
                        slug=unique_slug,
                        business_name=serializer.validated_data['business_name'],
                        contact_email=serializer.validated_data['contact_email'],
                        contact_phone=serializer.validated_data.get('contact_phone', ''),
                        website_url=serializer.validated_data.get('website_url', ''),
                        industry_category=serializer.validated_data.get('industry_category', 'other'),
                        city=serializer.validated_data.get('city', ''),
                        country=serializer.validated_data.get('country', ''),
                        plan=serializer.validated_data.get('plan', 'basic'),
                    )
                    
                    # Create domain for development
                    from django.conf import settings
                    suffix = getattr(settings, 'TENANT_SUBDOMAIN_SUFFIX', '.lvh.me')
                    domain_name = f"{unique_slug}{suffix}"
                    
                    Domain.objects.create(
                        domain=domain_name,
                        tenant=tenant,
                        is_primary=True
                    )
                    
                    return Response({
                        'success': True,
                        'tenant_id': tenant.id,
                        'slug': unique_slug,
                        'dev_url': tenant.dev_url,
                        'message': f'Tenant "{tenant.business_name}" created successfully!'
                    }, status=status.HTTP_201_CREATED)
                    
            except Exception as e:
                return Response({
                    'success': False,
                    'error': str(e)
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CheckSlugView(APIView):
    """
    Check if a business name would generate an available slug.
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        business_name = request.data.get('business_name', '')
        if not business_name:
            return Response({'error': 'business_name is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        base_slug = generate_tenant_slug(business_name)
        unique_slug = ensure_unique_tenant_slug(base_slug)
        
        from django.conf import settings
        suffix = getattr(settings, 'TENANT_SUBDOMAIN_SUFFIX', '.lvh.me')
        
        return Response({
            'suggested_slug': unique_slug,
            'dev_url': f"http://{unique_slug}{suffix}:3000",
            'is_available': base_slug == unique_slug
        })


class WebsiteView(APIView):
    """
    Retrieve website data by slug for localhost preview.
    """
    permission_classes = [AllowAny]
    
    def get(self, request, slug):
        # Find tenant by slug
        tenant = get_object_or_404(Tenant, slug=slug)
        
        # For now, return basic tenant data
        # Later this can be enhanced with full template rendering
        return Response({
            'success': True,
            'slug': tenant.slug,
            'business_name': tenant.business_name,
            'website_name': tenant.business_name,  # Fallback to business name
            'description': f"Welcome to {tenant.business_name}",
            'contact_email': tenant.contact_email,
            'contact_phone': tenant.contact_phone,
            'city': tenant.city,
            'country': tenant.country,
            'industry_category': tenant.industry_category,
            'services': [],  # Will be populated from tenant data
            'logo_url': None,  # Will be populated when logo functionality is added
            'template_html': None,  # Will be populated when template rendering is added
            'dev_url': tenant.dev_subdomain_url,
        })