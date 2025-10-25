from rest_framework import serializers
from .models import ActivityLog


class ActivityLogSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = ActivityLog
        fields = [
            'id', 'user', 'username', 'action_type', 'resource_type', 
            'resource_id', 'description', 'metadata', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']