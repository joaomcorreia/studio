from rest_framework import serializers
from .models import SiteTheme


class SiteThemeSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteTheme
        fields = [
            'id', 'primary_color', 'secondary_color', 
            'font_family_heading', 'font_family_body', 
            'custom_css', 'theme_options', 'updated_at'
        ]
        read_only_fields = ['id', 'updated_at']
    
    def validate_primary_color(self, value):
        if not value.startswith('#') or len(value) != 7:
            raise serializers.ValidationError("Color must be a valid hex color (e.g., #3b82f6)")
        return value
    
    def validate_secondary_color(self, value):
        if not value.startswith('#') or len(value) != 7:
            raise serializers.ValidationError("Color must be a valid hex color (e.g., #64748b)")
        return value