from rest_framework import generics, permissions
from .models import Page
from .serializers import PageSerializer


class PageListCreateView(generics.ListCreateAPIView):
    """
    List pages or create new page (tenant-scoped).
    """
    serializer_class = PageSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Tenant-scoped: only pages in current tenant's schema
        return Page.objects.all().order_by('slug')


class PageDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or delete a page (tenant-scoped).
    """
    serializer_class = PageSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Page.objects.all()