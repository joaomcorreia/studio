from django.db import models
from django.contrib.auth.models import User
from django.core.validators import RegexValidator
import uuid


class Tenant(models.Model):
    """
    Simple tenant model (non-django-tenants version for development)
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Subdomain slug (e.g., "marysrestaurant")
    slug = models.SlugField(
        max_length=30, 
        unique=True,
        validators=[RegexValidator(r'^[a-z0-9-]+$', 'Slug must contain only lowercase letters, numbers, and hyphens')]
    )
    
    # Business information
    business_name = models.CharField(max_length=100)
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=20, blank=True)
    
    # Location
    city = models.CharField(max_length=50, blank=True)
    country = models.CharField(max_length=50, blank=True)
    
    # Industry categorization
    INDUSTRY_CHOICES = [
        ('restaurant', 'Restaurant'),
        ('retail', 'Retail'),
        ('services', 'Services'),
        ('healthcare', 'Healthcare'),
        ('other', 'Other'),
    ]
    industry_category = models.CharField(max_length=20, choices=INDUSTRY_CHOICES, default='other')
    
    # Tenant owner
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_tenants')
    
    # Status
    is_active = models.BooleanField(default=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'tenants_tenant'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.business_name} ({self.slug})"
    
    @property
    def dev_url(self):
        """Development URL using lvh.me"""
        return f"http://{self.slug}.lvh.me:3000"
    
    def save(self, *args, **kwargs):
        if not self.slug:
            from apps.core.utils import generate_tenant_slug
            self.slug = generate_tenant_slug(self.business_name)
        super().save(*args, **kwargs)


class Domain(models.Model):
    """
    Simple domain model for tenant routing
    """
    tenant = models.ForeignKey(Tenant, related_name='domains', on_delete=models.CASCADE)
    domain = models.CharField(max_length=253, unique=True, db_index=True)
    is_primary = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'tenants_domain'
    
    def __str__(self):
        return self.domain