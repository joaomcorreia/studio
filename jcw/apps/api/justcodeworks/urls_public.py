from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def api_root(request):
    """API root endpoint"""
    return JsonResponse({
        'message': 'Just Code Works API v0',
        'endpoints': {
            'onboarding': '/api/onboarding/',
            'auth': '/api/auth/',
            'tenants': '/api/tenants/',
            'admin': '/api/admin/',
        }
    })

# Public schema URLs (shared across all tenants)
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api_root, name='api_root'),
    path('api/auth/', include('apps.auth.urls')),
    path('api/tenants/', include('apps.tenants.urls')),
    path('api/onboarding/', include('apps.onboarding.urls')),
    path('api/admin/', include('apps.core.urls')),
]