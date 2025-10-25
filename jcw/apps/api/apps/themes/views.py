from rest_framework import generics, permissions
from rest_framework.response import Response
from .models import SiteTheme
from .serializers import SiteThemeSerializer


class ThemeView(generics.RetrieveUpdateAPIView):
    """
    Get or update tenant theme (tenant-scoped, one per tenant).
    """
    serializer_class = SiteThemeSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        # Get or create theme for current tenant
        theme, created = SiteTheme.objects.get_or_create(
            defaults={
                'primary_color': '#3b82f6',
                'secondary_color': '#64748b',
                'font_family_heading': 'Inter',
                'font_family_body': 'Inter',
            }
        )
        return theme