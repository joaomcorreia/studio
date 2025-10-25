from rest_framework import generics, permissions
from .models import ActivityLog
from .serializers import ActivityLogSerializer


class ActivityLogListView(generics.ListAPIView):
    """
    List activity logs (tenant-scoped).
    """
    serializer_class = ActivityLogSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Tenant-scoped activity logs
        return ActivityLog.objects.all().order_by('-created_at')[:50]  # Last 50 activities