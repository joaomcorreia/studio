from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.conf import settings
from django.conf.urls.static import static

def api_root(request):
    """API root endpoint"""
    return JsonResponse({
        'message': 'Just Code Works API v0 - Simple Mode',
        'version': '0.1.0',
        'endpoints': {
            'onboarding': '/api/onboarding/',
            'auth': '/api/auth/',
            'tenants': '/api/tenants/',
            'admin': '/api/admin/',
            'pages': '/api/pages/',
            'sections': '/api/sections/',
            'templates': '/api/templates/',
            'themes': '/api/themes/',
        }
    })

# Simple URL configuration (no tenancy)
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('apps.auth.urls')),  # Authentication endpoints - must come before generic api/ path
    path('api/onboarding/', include('apps.onboarding.urls')),
    path('api/admin/', include('apps.core.urls')),
    path('api/tenants/', include('apps.tenants.urls')),
    path('api/pages/', include('apps.pages.urls')),
    path('api/sections/', include('apps.sections.urls')),
    path('api/templates/', include('apps.templates.urls')),
    path('api/themes/', include('apps.themes.urls')),
    path('api/activity/', include('apps.activity.urls')),
    path('api/', api_root, name='api_root'),  # Generic API root - must come last
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)