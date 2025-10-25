from django.urls import path
from . import views

urlpatterns = [
    # Admin endpoints
    path('stats/', views.AdminStatsView.as_view(), name='admin_stats'),
    path('tenants/', views.AdminTenantListView.as_view(), name='admin_tenants'),
    path('tenants/<uuid:pk>/', views.AdminTenantDetailView.as_view(), name='admin_tenant_detail'),
    path('activity/', views.AdminActivityView.as_view(), name='admin_activity'),
]