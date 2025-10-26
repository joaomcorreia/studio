from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def tenant_api_root(request):
    """Tenant API root endpoint"""
    return JsonResponse({
        'message': 'Just Code Works Tenant API v0',
        'tenant': getattr(request, 'tenant', None).business_name if hasattr(request, 'tenant') and request.tenant else 'Unknown',
        'endpoints': {
            'tenant_info': '/api/tenant/info/',
            'sections': '/api/sections/',
            'templates': '/api/templates/',
            'pages': '/api/pages/',
            'themes': '/api/themes/',
        }
    })

# Tenant-specific URLs
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', tenant_api_root, name='tenant_api_root'),
    path('api/', include('apps.auth.urls')),  # Authentication endpoints
    path('api/tenant/', include('apps.tenants.urls')),
    path('api/sections/', include('apps.sections.urls')),
    path('api/templates/', include('apps.templates.urls')),
    path('api/pages/', include('apps.pages.urls')),
    path('api/themes/', include('apps.themes.urls')),
    path('api/activity/', include('apps.activity.urls')),
]