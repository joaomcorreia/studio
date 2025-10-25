from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from .models import Template
from .serializers import TemplateSerializer, TemplateCreateSerializer


class TemplateViewSet(viewsets.ModelViewSet):
    queryset = Template.objects.all()
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return TemplateCreateSerializer
        return TemplateSerializer
    
    def create(self, request, *args, **kwargs):
        """Create a new template with AI-generated HTML/CSS from uploaded image"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            template = serializer.save()
            response_serializer = TemplateSerializer(template, context={'request': request})
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(
                {'error': f'Failed to create template: {str(e)}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def list(self, request, *args, **kwargs):
        """List all templates with optional category filtering"""
        category = request.query_params.get('category')
        queryset = self.get_queryset()
        
        if category:
            queryset = queryset.filter(category=category)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def toggle_status(self, request, pk=None):
        """Toggle template active status"""
        template = get_object_or_404(Template, pk=pk)
        template.is_active = not template.is_active
        template.save()
        
        serializer = self.get_serializer(template)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def code(self, request, pk=None):
        """Get HTML and CSS code for a template"""
        template = get_object_or_404(Template, pk=pk)
        return Response({
            'html_content': template.html_content,
            'css_content': template.css_content,
            'name': template.name,
            'category': template.category
        })
    
    @action(detail=False, methods=['get'])
    def categories(self, request):
        """Get available template categories"""
        categories = [
            {'value': choice[0], 'label': choice[1]} 
            for choice in Template.CATEGORY_CHOICES
        ]
        return Response(categories)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get template statistics"""
        total_templates = Template.objects.count()
        active_templates = Template.objects.filter(is_active=True).count()
        categories_count = Template.objects.values('category').distinct().count()
        total_usage = sum(Template.objects.values_list('used_by_count', flat=True))
        
        return Response({
            'total_templates': total_templates,
            'active_templates': active_templates,
            'categories_count': categories_count,
            'total_usage': total_usage
        })