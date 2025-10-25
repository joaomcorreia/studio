from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Section
from .serializers import SectionSerializer
from apps.tenants.views import IsAdminUser


class SectionListCreateView(generics.ListCreateAPIView):
    """
    List all sections or create new section (admin only for create).
    """
    queryset = Section.objects.all().order_by('category', 'name')
    serializer_class = SectionSerializer
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAdminUser()]
        return [permissions.IsAuthenticated()]
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class SectionDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or delete a section (admin only for modify operations).
    """
    queryset = Section.objects.all()
    serializer_class = SectionSerializer
    
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [IsAdminUser()]
        return [permissions.IsAuthenticated()]


class SectionApproveView(APIView):
    """
    Approve a section (admin only).
    """
    permission_classes = [IsAdminUser]
    
    def post(self, request, pk):
        try:
            section = Section.objects.get(pk=pk)
            section.status = 'approved'
            section.save()
            
            return Response({
                'success': True,
                'message': f'Section "{section.name}" approved successfully'
            })
        except Section.DoesNotExist:
            return Response({
                'error': 'Section not found'
            }, status=status.HTTP_404_NOT_FOUND)