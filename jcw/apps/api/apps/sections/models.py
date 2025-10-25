from django.db import models
from django.core.validators import RegexValidator
import uuid


class Section(models.Model):
    """
    Reusable section components. Shared across all tenants.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Section identification following naming convention
    slug = models.SlugField(
        max_length=50, 
        unique=True,
        validators=[RegexValidator(
            r'^jcw-[a-z]+-\d+-[a-z]+\d+$', 
            'Slug must follow format: jcw-{vertical}-{kit}-{type}{number} (e.g., jcw-rest-01-hero01)'
        )]
    )
    name = models.CharField(max_length=100)
    
    # Categorization
    CATEGORY_CHOICES = [
        ('nav', 'Navigation'),
        ('hero', 'Hero'),
        ('feature', 'Feature'),
        ('gallery', 'Gallery'),
        ('testimonial', 'Testimonial'),
        ('cta', 'Call to Action'),
        ('footer', 'Footer'),
    ]
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    
    # Naming convention parts
    vertical = models.CharField(max_length=10)  # rest, svc, shop
    kit_number = models.CharField(max_length=5)  # 01, 02, etc.
    section_type_number = models.CharField(max_length=5)  # 01, 02, etc.
    
    # Technical details
    framework = models.CharField(max_length=20, default='next')
    version = models.CharField(max_length=20, default='1.0.0')
    json_schema = models.JSONField(default=dict)  # Props definition
    
    # Assets
    preview_image = models.ImageField(upload_to='section_previews/', blank=True)
    
    # Status and metadata
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('approved', 'Approved'),
        ('deprecated', 'Deprecated'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    
    # Compatibility flags (JSON array)
    compatibility_flags = models.JSONField(default=list)  # ['dark', 'light', 'minimal', 'bold']
    
    # Audit
    created_by = models.ForeignKey('users.User', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['category', 'name']
    
    def __str__(self):
        return f"{self.name} ({self.slug})"
    
    def save(self, *args, **kwargs):
        # Auto-extract naming convention parts from slug
        if self.slug:
            parts = self.slug.split('-')
            if len(parts) >= 4:
                self.vertical = parts[1]
                self.kit_number = parts[2]
                # Extract type and number from last part (e.g., 'hero01' -> type='hero', number='01')
                import re
                match = re.match(r'([a-z]+)(\d+)$', parts[3])
                if match:
                    type_name, number = match.groups()
                    self.section_type_number = number.zfill(2)
        super().save(*args, **kwargs)