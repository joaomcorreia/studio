from django.urls import path
from . import views

urlpatterns = [
    # For public schema (admin access)
    path('', views.TenantListView.as_view(), name='tenant_list'),
    path('<uuid:pk>/', views.TenantDetailView.as_view(), name='tenant_detail'),
    # For tenant schema (user access)
    path('info/', views.TenantInfoView.as_view(), name='tenant_info'),
    # Public endpoint for frontend routing
    path('by-slug/<str:slug>/', views.get_tenant_by_slug, name='tenant_by_slug'),
]