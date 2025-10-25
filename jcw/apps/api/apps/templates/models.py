from django.db import models
from django.core.validators import RegexValidator
import uuid


class Template(models.Model):
    """
    Reusable templates composed of ordered sections with rules.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Template identification
    slug = models.SlugField(
        max_length=50, 
        unique=True,
        validators=[RegexValidator(r'^[a-z0-9-]+$', 'Slug must contain only lowercase letters, numbers, and hyphens')]
    )
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    
    # Website type
    WEBSITE_TYPE_CHOICES = [
        ('one_page', 'One Page'),
        ('multi_page', 'Multi Page'),
        ('ecommerce', 'eCommerce'),
    ]
    website_type = models.CharField(max_length=20, choices=WEBSITE_TYPE_CHOICES)
    
    # Default template per type
    is_default = models.BooleanField(default=False)
    
    # Audit
    created_by = models.ForeignKey('users.User', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = [['website_type', 'is_default']]  # Only one default per type
        ordering = ['website_type', 'name']
    
    def __str__(self):
        return f"{self.name} ({self.website_type})"
    
    def save(self, *args, **kwargs):
        # Ensure only one default per website type
        if self.is_default:
            Template.objects.filter(website_type=self.website_type, is_default=True).update(is_default=False)
        super().save(*args, **kwargs)


class TemplateSection(models.Model):
    """
    Junction table for template sections with ordering and constraints.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    template = models.ForeignKey(Template, related_name='template_sections', on_delete=models.CASCADE)
    section = models.ForeignKey('sections.Section', on_delete=models.CASCADE)
    
    # Section ordering and rules
    order_index = models.PositiveIntegerField()
    is_required = models.BooleanField(default=False)
    placement_constraints = models.JSONField(default=dict, blank=True)
    
    class Meta:
        ordering = ['order_index']
        unique_together = ['template', 'order_index']
    
    def __str__(self):
        return f"{self.template.name} - {self.section.name} ({self.order_index})"