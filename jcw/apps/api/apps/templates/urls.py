from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Use ViewSet for the new API
router = DefaultRouter()
router.register(r'', views.TemplateViewSet, basename='template')

urlpatterns = [
    # New API endpoints
    path('', include(router.urls)),
    
    # Legacy endpoints for backward compatibility
    path('legacy/', views.TemplateListCreateView.as_view(), name='template_list_create'),
    path('legacy/<uuid:pk>/', views.TemplateDetailView.as_view(), name='template_detail'),
]