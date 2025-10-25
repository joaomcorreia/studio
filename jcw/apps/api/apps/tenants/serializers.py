from rest_framework import serializers
from .models import Tenant, Domain


class DomainSerializer(serializers.ModelSerializer):
    class Meta:
        model = Domain
        fields = ['domain', 'is_primary']


class TenantSerializer(serializers.ModelSerializer):
    domains = DomainSerializer(many=True, read_only=True)
    dev_url = serializers.ReadOnlyField()
    
    class Meta:
        model = Tenant
        fields = [
            'id', 'slug', 'business_name', 'industry_category', 'city', 'country',
            'contact_email', 'contact_phone', 'is_active', 'dev_url',
            'domains', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']