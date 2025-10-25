from django.db import models
from django.contrib.auth.models import User
import uuid


class Template(models.Model):
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
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    description = models.TextField(blank=True)
    file_name = models.CharField(max_length=100, unique=True)  # e.g., jcw-rest-02
    image = models.ImageField(upload_to='templates/images/')
    html_content = models.TextField()
    css_content = models.TextField()
    is_active = models.BooleanField(default=True)
    used_by_count = models.IntegerField(default=0)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} ({self.file_name})"
    
    def save(self, *args, **kwargs):
        if not self.file_name:
            # Generate file name automatically
            category_prefix = f"jcw-{self.category}"
            existing_count = Template.objects.filter(
                category=self.category,
                file_name__startswith=category_prefix
            ).count()
            self.file_name = f"{category_prefix}-{existing_count + 1:02d}"
        super().save(*args, **kwargs)