from django.db import models
import uuid


class SiteTheme(models.Model):
    """
    Tenant-scoped theme customization. One per tenant.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Colors
    primary_color = models.CharField(max_length=7, default='#3b82f6')  # Hex color
    secondary_color = models.CharField(max_length=7, default='#64748b')
    
    # Typography
    font_family_heading = models.CharField(max_length=100, default='Inter')
    font_family_body = models.CharField(max_length=100, default='Inter')
    
    # Advanced customization
    custom_css = models.TextField(blank=True)
    theme_options = models.JSONField(default=dict)  # Additional theme data
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Theme (Primary: {self.primary_color})"