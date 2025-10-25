"""
Basic smoke tests for JCW v0 implementation
"""
import pytest
import requests
from django.test import TestCase
from django.contrib.auth import get_user_model
from apps.tenancy.models import Tenant
from apps.core.models import Section, Template, Page

User = get_user_model()


class TenantCreationTest(TestCase):
    """Test tenant creation and slug generation"""
    
    def test_tenant_slug_generation(self):
        """Test that tenant slugs are generated correctly"""
        tenant = Tenant.objects.create(
            business_name="Mary's Restaurant & Café",
            contact_email="mary@example.com",
            industry_category="restaurant"
        )
        # Should generate a clean slug
        self.assertTrue(tenant.slug)
        self.assertNotIn(' ', tenant.slug)
        self.assertNotIn("'", tenant.slug)
    
    def test_duplicate_slug_handling(self):
        """Test that duplicate slugs are handled"""
        Tenant.objects.create(
            business_name="Test Business",
            contact_email="test1@example.com"
        )
        tenant2 = Tenant.objects.create(
            business_name="Test Business",  # Same name
            contact_email="test2@example.com"
        )
        # Should have different slugs
        self.assertNotEqual(
            Tenant.objects.get(contact_email="test1@example.com").slug,
            tenant2.slug
        )


class SectionNamingTest(TestCase):
    """Test section naming convention validation"""
    
    def test_valid_section_names(self):
        """Test that valid section names are accepted"""
        valid_names = [
            "hero_basic",
            "cta_restaurant", 
            "footer_simple",
            "header_navigation"
        ]
        for name in valid_names:
            section = Section(name=name, type="hero", html_template="<div></div>")
            # Should not raise validation error
            section.full_clean()
    
    def test_invalid_section_names(self):
        """Test that invalid section names are rejected"""
        from django.core.exceptions import ValidationError
        
        invalid_names = [
            "invalidname",  # No underscore
            "hero_",  # Ends with underscore
            "_basic",  # Starts with underscore
            "hero-basic",  # Hyphen instead of underscore
        ]
        for name in invalid_names:
            section = Section(name=name, type="hero", html_template="<div></div>")
            with self.assertRaises(ValidationError):
                section.full_clean()


class APIEndpointTest(TestCase):
    """Test basic API endpoint functionality"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass123"
        )
        self.tenant = Tenant.objects.create(
            business_name="Test Business",
            contact_email="test@example.com",
            owner=self.user
        )
    
    def test_onboarding_check_slug_endpoint(self):
        """Test the slug checking endpoint"""
        from django.urls import reverse
        from django.test import Client
        
        client = Client()
        url = reverse('onboarding-check-slug')
        response = client.post(
            url,
            {'business_name': 'New Restaurant'},
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn('suggested_slug', data)
        self.assertIn('dev_url', data)


# Integration test that can be run manually
def test_api_integration():
    """
    Manual test to check if API endpoints are working
    Run this after starting the Django server
    """
    base_url = "http://127.0.0.1:8000/api"
    
    # Test slug checking
    response = requests.post(
        f"{base_url}/onboarding/check-slug/",
        json={"business_name": "Test Restaurant"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "suggested_slug" in data
    print(f"✓ Slug check working: {data['suggested_slug']}")
    
    # Test tenant creation
    response = requests.post(
        f"{base_url}/onboarding/start/",
        json={
            "business_name": "API Test Restaurant",
            "contact_email": "apitest@example.com",
            "industry_category": "restaurant",
            "city": "Test City",
            "country": "Test Country"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    print(f"✓ Tenant creation working: {data['slug']}")


if __name__ == "__main__":
    # Run integration test
    try:
        test_api_integration()
        print("\n✅ All integration tests passed!")
    except Exception as e:
        print(f"\n❌ Integration test failed: {e}")
        print("Make sure Django server is running on port 8000")