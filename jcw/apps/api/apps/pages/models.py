from django.db import models
from django.core.validators import RegexValidator
import uuid


class Page(models.Model):
    """
    Tenant-scoped page model. Each page contains ordered sections.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Page identification
    slug = models.SlugField(
        max_length=50,
        validators=[RegexValidator(r'^[a-z0-9-]+$', 'Slug must contain only lowercase letters, numbers, and hyphens')]
    )
    title = models.CharField(max_length=100)
    
    # Status
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    
    # Optional template reference
    template = models.ForeignKey('templates.Template', null=True, blank=True, on_delete=models.SET_NULL)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['slug']  # Unique per tenant schema
    
    def __str__(self):
        return f"{self.title} ({self.slug})"


class PageSection(models.Model):
    """
    Junction table for page sections with ordering and props.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    page = models.ForeignKey(Page, related_name='page_sections', on_delete=models.CASCADE)
    section = models.ForeignKey('sections.Section', on_delete=models.CASCADE)
    
    # Section ordering and configuration
    order_index = models.PositiveIntegerField()
    props_data = models.JSONField(default=dict, blank=True)  # Section-specific data
    
    class Meta:
        ordering = ['order_index']
        unique_together = ['page', 'order_index']
    
    def __str__(self):
        return f"{self.page.title} - {self.section.name} ({self.order_index})"