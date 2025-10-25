from rest_framework import generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Tenant
from .serializers import TenantSerializer


class IsAdminUser(permissions.BasePermission):
    """
    Permission class to restrict access to admin users only.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'


class TenantListView(generics.ListCreateAPIView):
    """
    List all tenants (admin only) or create new tenant.
    """
    queryset = Tenant.objects.all().order_by('-created_at')
    serializer_class = TenantSerializer
    permission_classes = [IsAdminUser]


class TenantDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or delete a specific tenant (admin only).
    """
    queryset = Tenant.objects.all()
    serializer_class = TenantSerializer
    permission_classes = [IsAdminUser]


class TenantInfoView(generics.RetrieveAPIView):
    """
    Get current tenant information (for tenant users).
    """
    serializer_class = TenantSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        # For now, return the first tenant (in simple mode)
        # In full tenancy mode, this would get the current tenant from the request
        return Tenant.objects.first()