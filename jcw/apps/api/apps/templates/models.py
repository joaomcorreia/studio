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
    
    # Industry category for template classification
    CATEGORY_CHOICES = [
        ('rest', 'Restaurant'),
        ('business', 'Business'),
        ('autorepair', 'Auto Repair'),
        ('portfolio', 'Portfolio'),
        ('ecommerce', 'E-commerce'),
        ('blog', 'Blog'),
        ('medical', 'Medical'),
        ('fitness', 'Fitness'),
    ]
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, blank=True)
    
    # File naming and image storage
    file_name = models.CharField(max_length=100, blank=True)  # e.g., jcw-rest-02
    preview_image = models.ImageField(upload_to='templates/images/', blank=True, null=True)
    
    # Generated HTML and CSS content
    html_content = models.TextField(blank=True)
    css_content = models.TextField(blank=True)
    
    # Usage statistics
    used_by_count = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    # Default template per type
    is_default = models.BooleanField(default=False)
    
    # Audit
    created_by = models.ForeignKey('users.User', on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['website_type', 'name']
        constraints = [
            models.UniqueConstraint(
                fields=['website_type'],
                condition=models.Q(is_default=True),
                name='unique_default_per_website_type'
            )
        ]
    
    def __str__(self):
        return f"{self.name} ({self.website_type})"
    
    def save(self, *args, **kwargs):
        # Ensure only one default per website type
        if self.is_default:
            Template.objects.filter(website_type=self.website_type, is_default=True).update(is_default=False)
            
        # Auto-generate file name if category is set and file_name is empty
        if self.category and not self.file_name:
            category_prefix = f"jcw-{self.category}"
            existing_count = Template.objects.filter(
                category=self.category,
                file_name__startswith=category_prefix
            ).count()
            self.file_name = f"{category_prefix}-{existing_count + 1:02d}"
            
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