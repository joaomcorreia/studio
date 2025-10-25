from rest_framework import serializers
from .models import Section
from apps.core.utils import validate_section_naming_convention


class SectionSerializer(serializers.ModelSerializer):
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    
    class Meta:
        model = Section
        fields = [
            'id', 'slug', 'name', 'category', 'vertical', 'kit_number', 
            'section_type_number', 'framework', 'version', 'json_schema',
            'preview_image', 'status', 'compatibility_flags', 
            'created_by', 'created_by_username', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'vertical', 'kit_number', 'section_type_number', 'created_at', 'updated_at']
    
    def validate_slug(self, value):
        is_valid, error_message = validate_section_naming_convention(value)
        if not is_valid:
            raise serializers.ValidationError(error_message)
        return value
    
    def validate_compatibility_flags(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError("Compatibility flags must be a list")
        
        valid_flags = ['dark', 'light', 'minimal', 'bold', 'photo-heavy', 'rtl-ready']
        invalid_flags = [flag for flag in value if flag not in valid_flags]
        if invalid_flags:
            raise serializers.ValidationError(f"Invalid compatibility flags: {invalid_flags}")
        
        return value