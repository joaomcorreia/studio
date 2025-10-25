from rest_framework import serializers
from .models import Template, TemplateSection
from apps.sections.serializers import SectionSerializer


class TemplateSectionSerializer(serializers.ModelSerializer):
    section = SectionSerializer(read_only=True)
    section_id = serializers.UUIDField(write_only=True)
    
    class Meta:
        model = TemplateSection
        fields = ['id', 'section', 'section_id', 'order_index', 'is_required', 'placement_constraints']


class TemplateSerializer(serializers.ModelSerializer):
    template_sections = TemplateSectionSerializer(many=True, required=False)
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    
    class Meta:
        model = Template
        fields = [
            'id', 'slug', 'name', 'description', 'website_type', 'is_default',
            'template_sections', 'created_by', 'created_by_username', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        template_sections_data = validated_data.pop('template_sections', [])
        template = Template.objects.create(**validated_data)
        
        for section_data in template_sections_data:
            section_id = section_data.pop('section_id')
            TemplateSection.objects.create(
                template=template,
                section_id=section_id,
                **section_data
            )
        
        return template


class TemplateComposeSerializer(serializers.Serializer):
    """
    Serializer for applying template to create pages.
    """
    page_slug = serializers.SlugField(default='home')
    page_title = serializers.CharField(max_length=100, default='Home Page')