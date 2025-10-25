from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Extended user model with role-based permissions.
    """
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('tenant_admin', 'Tenant Admin'),
        ('tenant_user', 'Tenant User'),
    ]
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='tenant_user')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.username} ({self.role})"