from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db import transaction
from .models import Template, TemplateSection
from .serializers import TemplateSerializer, TemplateComposeSerializer
from apps.tenants.views import IsAdminUser
from apps.core.utils import validate_template_composition_rules


class TemplateListCreateView(generics.ListCreateAPIView):
    """
    List all templates or create new template (admin only for create).
    """
    queryset = Template.objects.all().order_by('website_type', 'name')
    serializer_class = TemplateSerializer
    permission_classes = [IsAdminUser]
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class TemplateDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or delete a template (admin only).
    """
    queryset = Template.objects.all()
    serializer_class = TemplateSerializer
    permission_classes = [IsAdminUser]


class TemplateComposeView(APIView):
    """
    Apply a template to create pages in a tenant (admin and tenant users).
    """
    def post(self, request, pk):
        try:
            template = Template.objects.get(pk=pk)
            serializer = TemplateComposeSerializer(data=request.data)
            
            if serializer.is_valid():
                with transaction.atomic():
                    # Get ordered sections from template
                    template_sections = template.template_sections.all().order_by('order_index')
                    sections = [ts.section for ts in template_sections]
                    
                    # Validate composition rules
                    is_valid, error_message = validate_template_composition_rules(sections)
                    if not is_valid:
                        return Response({
                            'error': error_message
                        }, status=status.HTTP_400_BAD_REQUEST)
                    
                    # Create page with sections (tenant-scoped)
                    from apps.pages.models import Page, PageSection
                    
                    page = Page.objects.create(
                        slug=serializer.validated_data.get('page_slug', 'home'),
                        title=serializer.validated_data.get('page_title', 'Home Page'),
                        template=template
                    )
                    
                    # Add sections to page
                    for i, ts in enumerate(template_sections):
                        PageSection.objects.create(
                            page=page,
                            section=ts.section,
                            order_index=i,
                            props_data={}
                        )
                    
                    return Response({
                        'success': True,
                        'page_id': page.id,
                        'message': f'Page created from template "{template.name}"'
                    }, status=status.HTTP_201_CREATED)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Template.DoesNotExist:
            return Response({
                'error': 'Template not found'
            }, status=status.HTTP_404_NOT_FOUND)