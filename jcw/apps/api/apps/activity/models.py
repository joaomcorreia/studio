from django.db import models
from django.contrib.auth import get_user_model
import uuid

User = get_user_model()


class ActivityLog(models.Model):
    """
    Tenant-scoped activity logging for audit trails.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Actor
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)
    
    # Action details
    ACTION_TYPE_CHOICES = [
        ('create', 'Create'),
        ('update', 'Update'),
        ('delete', 'Delete'),
        ('login', 'Login'),
        ('view', 'View'),
    ]
    action_type = models.CharField(max_length=20, choices=ACTION_TYPE_CHOICES)
    
    # Resource details
    RESOURCE_TYPE_CHOICES = [
        ('page', 'Page'),
        ('section', 'Section'),
        ('template', 'Template'),
        ('theme', 'Theme'),
        ('tenant', 'Tenant'),
    ]
    resource_type = models.CharField(max_length=20, choices=RESOURCE_TYPE_CHOICES, blank=True)
    resource_id = models.UUIDField(null=True, blank=True)
    
    # Human-readable description and metadata
    description = models.TextField()
    metadata = models.JSONField(default=dict, blank=True)
    
    # Timestamp
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        username = self.user.username if self.user else 'System'
        return f"{username} {self.action_type} {self.resource_type} at {self.created_at}"