from django_tenants.models import TenantMixin, DomainMixin
from django.db import models
from django.core.validators import RegexValidator
import uuid


class Tenant(TenantMixin):
    """
    Tenant model for django-tenants.
    Each tenant gets its own database schema.
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
    industry_category = models.CharField(max_length=50, blank=True)
    city = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, blank=True)
    
    # Contact info
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=20, blank=True)
    
    # Status
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('active', 'Active'),
        ('suspended', 'Suspended'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # django-tenants required
    auto_create_schema = True

    def __str__(self):
        return f"{self.business_name} ({self.slug})"
    
    @property
    def dev_subdomain_url(self):
        from django.conf import settings
        suffix = getattr(settings, 'TENANT_SUBDOMAIN_SUFFIX', '.lvh.me')
        return f"http://{self.slug}{suffix}:3000"


class Domain(DomainMixin):
    """
    Domain model for tenant routing.
    """
    pass