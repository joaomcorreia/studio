from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.contrib.auth.models import User
from apps.tenants.models import Tenant
from django.db.models import Count
from django.http import JsonResponse


class AdminStatsView(APIView):
    """Get platform statistics for admin dashboard"""
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def get(self, request):
        stats = {
            'total_tenants': Tenant.objects.count(),
            'active_tenants': Tenant.objects.filter(is_active=True).count(),
            'total_pages': 0,  # Will implement when Page model is ready
            'total_templates': 0,  # Will implement when Template model is ready
            'total_users': User.objects.count(),
        }
        return Response(stats)


class AdminTenantListView(APIView):
    """List and manage all tenants (admin only)"""
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def get(self, request):
        tenants = Tenant.objects.all().order_by('-created_at')
        
        # Simple serialization for now
        data = []
        for tenant in tenants:
            data.append({
                'id': tenant.id,
                'business_name': tenant.business_name,
                'slug': tenant.slug,
                'contact_email': tenant.contact_email,
                'industry_category': tenant.industry_category,
                'is_active': tenant.is_active,
                'created_at': tenant.created_at.isoformat(),
                'dev_url': tenant.dev_url,
            })
        
        return Response({'results': data})


class AdminTenantDetailView(APIView):
    """Get and update specific tenant details (admin only)"""
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def get(self, request, pk):
        try:
            tenant = Tenant.objects.get(pk=pk)
            data = {
                'id': tenant.id,
                'business_name': tenant.business_name,
                'slug': tenant.slug,
                'contact_email': tenant.contact_email,
                'contact_phone': tenant.contact_phone,
                'city': tenant.city,
                'country': tenant.country,
                'industry_category': tenant.industry_category,
                'is_active': tenant.is_active,
                'created_at': tenant.created_at.isoformat(),
                'updated_at': tenant.updated_at.isoformat(),
                'dev_url': tenant.dev_url,
            }
            return Response(data)
        except Tenant.DoesNotExist:
            return Response({'error': 'Tenant not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def patch(self, request, pk):
        try:
            tenant = Tenant.objects.get(pk=pk)
            
            # Update allowed fields
            if 'is_active' in request.data:
                tenant.is_active = request.data['is_active']
            if 'business_name' in request.data:
                tenant.business_name = request.data['business_name']
            
            tenant.save()
            
            return Response({'message': 'Tenant updated successfully'})
        except Tenant.DoesNotExist:
            return Response({'error': 'Tenant not found'}, status=status.HTTP_404_NOT_FOUND)


class AdminActivityView(APIView):
    """Get platform activity logs (admin only)"""
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def get(self, request):
        # For now, return mock data since Activity model might not be ready
        limit = int(request.GET.get('limit', 10))
        
        mock_activities = [
            {
                'id': 1,
                'tenant': 'Mary\'s Restaurant',
                'action': 'Tenant Created',
                'details': 'New tenant registration completed',
                'timestamp': '2024-01-01T12:00:00Z'
            },
            {
                'id': 2,
                'tenant': 'Mary\'s Restaurant',
                'action': 'Page Created',
                'details': 'Created home page',
                'timestamp': '2024-01-01T12:30:00Z'
            }
        ]
        
        return Response({'results': mock_activities[:limit]})


# Simple API info view
def admin_api_info(request):
    """Simple API info endpoint"""
    return JsonResponse({
        'message': 'JCW Admin API',
        'endpoints': [
            '/api/admin/stats/',
            '/api/admin/tenants/',
            '/api/admin/activity/',
        ]
    })