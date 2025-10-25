from functools import wraps
from django.http import JsonResponse
from rest_framework import status


def admin_required(view_func):
    """
    Decorator to restrict access to admin users only.
    """
    @wraps(view_func)
    def _wrapped_view(self, request, *args, **kwargs):
        # Check if user is authenticated
        if not request.user.is_authenticated:
            return JsonResponse(
                {'error': 'Authentication required'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Check if user has admin role
        if request.user.role != 'admin':
            return JsonResponse(
                {'error': 'Admin permissions required'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        return view_func(self, request, *args, **kwargs)
    return _wrapped_view


def admin_or_tenant_admin_required(view_func):
    """
    Decorator to restrict access to admin or tenant admin users.
    """
    @wraps(view_func)
    def _wrapped_view(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return JsonResponse(
                {'error': 'Authentication required'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        if request.user.role not in ['admin', 'tenant_admin']:
            return JsonResponse(
                {'error': 'Admin or tenant admin permissions required'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        return view_func(self, request, *args, **kwargs)
    return _wrapped_view