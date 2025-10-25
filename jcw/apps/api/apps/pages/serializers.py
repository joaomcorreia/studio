from rest_framework import serializers
from .models import Page, PageSection
from apps.sections.serializers import SectionSerializer


class PageSectionSerializer(serializers.ModelSerializer):
    section = SectionSerializer(read_only=True)
    
    class Meta:
        model = PageSection
        fields = ['id', 'section', 'order_index', 'props_data']


class PageSerializer(serializers.ModelSerializer):
    page_sections = PageSectionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Page
        fields = ['id', 'slug', 'title', 'status', 'template', 'page_sections', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']