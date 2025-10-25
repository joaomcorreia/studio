import re
import unicodedata
from django.utils.text import slugify as django_slugify


RESERVED_SLUGS = [
    'www', 'api', 'admin', 'app', 'mail', 'ftp', 'localhost', 'root', 'test',
    'staging', 'dev', 'demo', 'support', 'help', 'blog', 'news', 'about', 'contact'
]


def generate_tenant_slug(business_name, max_length=30):
    """
    Generate a URL-safe slug from business name following JCW rules:
    - Strip diacritics, lowercase, alphanumeric + hyphens only
    - Collapse whitespace, max 30 chars, avoid reserved words
    - Return base slug (uniqueness checking done separately)
    """
    if not business_name:
        return ''
    
    # Remove diacritics and normalize
    normalized = unicodedata.normalize('NFD', business_name)
    ascii_text = normalized.encode('ascii', 'ignore').decode('ascii')
    
    # Use Django's slugify as base, then enforce our rules
    slug = django_slugify(ascii_text)
    
    # Ensure only alphanumeric + hyphens
    slug = re.sub(r'[^a-z0-9-]', '', slug)
    
    # Collapse multiple hyphens
    slug = re.sub(r'-+', '-', slug)
    
    # Remove leading/trailing hyphens
    slug = slug.strip('-')
    
    # Truncate to max length
    if len(slug) > max_length:
        slug = slug[:max_length].rstrip('-')
    
    # Handle edge cases
    if not slug or slug in RESERVED_SLUGS:
        slug = 'site'  # Fallback
    
    return slug


def ensure_unique_tenant_slug(base_slug, exclude_id=None):
    """
    Ensure slug uniqueness by appending -1, -2, etc. if needed.
    """
    from apps.tenants.models import Tenant
    
    slug = base_slug
    counter = 1
    
    while True:
        # Check if slug exists (excluding current tenant if updating)
        queryset = Tenant.objects.filter(slug=slug)
        if exclude_id:
            queryset = queryset.exclude(id=exclude_id)
        
        if not queryset.exists():
            return slug
        
        # Try next suffix
        counter += 1
        slug = f"{base_slug}-{counter}"
        
        # Prevent infinite loop
        if counter > 100:
            import uuid
            slug = f"{base_slug}-{uuid.uuid4().hex[:6]}"
            break
    
    return slug


def validate_section_naming_convention(slug):
    """
    Validate section slug follows: jcw-{vertical}-{kit}-{type}{number}
    Example: jcw-rest-01-hero01
    Returns (is_valid, error_message)
    """
    pattern = r'^jcw-([a-z]+)-(\d+)-([a-z]+)(\d+)$'
    match = re.match(pattern, slug)
    
    if not match:
        return False, "Section slug must follow format: jcw-{vertical}-{kit}-{type}{number} (e.g., jcw-rest-01-hero01)"
    
    vertical, kit, section_type, number = match.groups()
    
    # Validate vertical
    valid_verticals = ['rest', 'svc', 'shop']
    if vertical not in valid_verticals:
        return False, f"Vertical must be one of: {', '.join(valid_verticals)}"
    
    # Validate kit number format
    if not kit.isdigit() or len(kit) != 2:
        return False, "Kit number must be 2 digits (e.g., 01, 02)"
    
    # Validate section type
    valid_types = ['nav', 'hero', 'feature', 'gallery', 'testimonial', 'cta', 'footer']
    if section_type not in valid_types:
        return False, f"Section type must be one of: {', '.join(valid_types)}"
    
    # Validate number format
    if not number.isdigit() or len(number) != 2:
        return False, "Section number must be 2 digits (e.g., 01, 02)"
    
    return True, ""


def validate_template_composition_rules(sections_list):
    """
    Validate template/page composition rules:
    - Hero must be first (if present)
    - Footer must be last (if present)
    - Maximum 1 navigation section
    Returns (is_valid, error_message)
    """
    if not sections_list:
        return True, ""  # Empty is valid
    
    # Count sections by category
    nav_count = 0
    hero_positions = []
    footer_positions = []
    
    for i, section in enumerate(sections_list):
        category = getattr(section, 'category', None)
        
        if category == 'nav':
            nav_count += 1
        elif category == 'hero':
            hero_positions.append(i)
        elif category == 'footer':
            footer_positions.append(i)
    
    # Rule 1: Maximum 1 navigation
    if nav_count > 1:
        return False, "Maximum 1 navigation section allowed per page"
    
    # Rule 2: Hero must be first (if present)
    if hero_positions and hero_positions[0] != 0:
        return False, "Hero section must be the first section on the page"
    
    # Rule 3: Footer must be last (if present)
    if footer_positions and footer_positions[0] != len(sections_list) - 1:
        return False, "Footer section must be the last section on the page"
    
    # Rule 4: Only one hero allowed
    if len(hero_positions) > 1:
        return False, "Only one hero section allowed per page"
    
    # Rule 5: Only one footer allowed
    if len(footer_positions) > 1:
        return False, "Only one footer section allowed per page"
    
    return True, ""