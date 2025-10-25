"""
JCW v0 - Simple Testing Script (no external dependencies)
Run this to validate core functionality
"""
import sys
import os
import json

def test_project_structure():
    """Test that all required files exist"""
    print("🔍 Testing project structure...")
    
    required_files = [
        "apps/api/manage.py",
        "apps/api/requirements.txt",
        "apps/web/package.json",
        "apps/web/src/app/page.tsx",
        "apps/web/src/app/build/page.tsx",
        "setup_full.cmd",
        "dev_servers.cmd"
    ]
    
    missing_files = []
    for file_path in required_files:
        if not os.path.exists(file_path):
            missing_files.append(file_path)
    
    if missing_files:
        print(f"❌ Missing files: {missing_files}")
        return False
    else:
        print("✅ All required files present")
        return True


def test_django_setup():
    """Test Django configuration"""
    print("\n🔍 Testing Django setup...")
    
    try:
        # Add Django apps to Python path
        sys.path.insert(0, os.path.join(os.getcwd(), 'apps', 'api'))
        
        # Test Django settings
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
        import django
        django.setup()
        
        from django.conf import settings
        print(f"✅ Django configured with SECRET_KEY: {settings.SECRET_KEY[:10]}...")
        
        # Test models can be imported
        from apps.tenancy.models import Tenant
        from apps.core.models import Section, Template, Page
        print("✅ All models import successfully")
        
        # Test utilities
        from apps.core.utils import generate_tenant_slug, validate_section_naming_convention
        
        # Test slug generation
        slug1 = generate_tenant_slug("Mary's Restaurant & Café")
        slug2 = generate_tenant_slug("Test Business!")
        print(f"✅ Slug generation working: '{slug1}', '{slug2}'")
        
        # Test section naming validation
        try:
            validate_section_naming_convention("hero_restaurant")
            print("✅ Section naming validation working")
        except Exception as e:
            print(f"❌ Section validation failed: {e}")
            return False
            
        return True
        
    except Exception as e:
        print(f"❌ Django setup failed: {e}")
        return False


def test_api_endpoints_offline():
    """Test API endpoint configuration (without running server)"""
    print("\n🔍 Testing API configuration...")
    
    try:
        # Test URL configuration
        from config.urls import urlpatterns
        print(f"✅ Main URLs configured with {len(urlpatterns)} patterns")
        
        from apps.api.urls import urlpatterns as api_urls
        print(f"✅ API URLs configured with {len(api_urls)} patterns")
        
        # Test serializers can be imported
        from apps.api.serializers import (
            TenantSerializer, SectionSerializer, 
            TemplateSerializer, PageSerializer
        )
        print("✅ All serializers import successfully")
        
        # Test views can be imported
        from apps.api.views import (
            OnboardingCheckSlugView, OnboardingStartView,
            AdminStatsView, AdminTenantListView
        )
        print("✅ All views import successfully")
        
        return True
        
    except Exception as e:
        print(f"❌ API configuration failed: {e}")
        return False


def test_frontend_configuration():
    """Test Next.js configuration"""
    print("\n🔍 Testing frontend configuration...")
    
    try:
        # Check package.json
        with open('apps/web/package.json', 'r') as f:
            package_data = json.load(f)
        
        required_deps = ['react', 'next', 'typescript']
        missing_deps = [dep for dep in required_deps if dep not in package_data.get('dependencies', {})]
        
        if missing_deps:
            print(f"❌ Missing dependencies: {missing_deps}")
            return False
        
        print(f"✅ Package.json configured with React {package_data['dependencies']['react']}")
        
        # Check environment variables
        env_file = 'apps/web/.env.local'
        if os.path.exists(env_file):
            print("✅ Environment variables configured")
        else:
            print("⚠️  Environment file missing (will use defaults)")
        
        # Check main pages exist
        pages = [
            'apps/web/src/app/page.tsx',
            'apps/web/src/app/build/page.tsx',
            'apps/web/src/app/dashboard/admin/page.tsx',
            'apps/web/src/app/dashboard/user/page.tsx'
        ]
        
        missing_pages = [page for page in pages if not os.path.exists(page)]
        if missing_pages:
            print(f"❌ Missing pages: {missing_pages}")
            return False
        
        print("✅ All frontend pages present")
        return True
        
    except Exception as e:
        print(f"❌ Frontend configuration failed: {e}")
        return False


def test_management_commands():
    """Test Django management commands"""
    print("\n🔍 Testing management commands...")
    
    try:
        # Test seed_demo command exists
        from django.core.management import get_commands
        commands = get_commands()
        
        if 'seed_demo' in commands:
            print("✅ seed_demo command available")
        else:
            print("❌ seed_demo command not found")
            return False
        
        # Test command can be imported
        from apps.core.management.commands.seed_demo import Command
        print("✅ seed_demo command imports successfully")
        
        return True
        
    except Exception as e:
        print(f"❌ Management commands failed: {e}")
        return False


def main():
    """Run all tests"""
    print("=====================================")
    print("  JCW v0 - Testing Suite")
    print("=====================================")
    
    tests = [
        ("Project Structure", test_project_structure),
        ("Django Setup", test_django_setup),
        ("API Configuration", test_api_endpoints_offline),
        ("Frontend Configuration", test_frontend_configuration),
        ("Management Commands", test_management_commands)
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        try:
            if test_func():
                passed += 1
            print("-" * 50)
        except Exception as e:
            print(f"❌ {test_name} crashed: {e}")
            print("-" * 50)
    
    print(f"\n📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed! Your JCW v0 implementation is ready.")
        print("\nNext steps:")
        print("1. Run: setup_full.cmd (if not done yet)")
        print("2. Run: dev_servers.cmd")
        print("3. Visit: http://127.0.0.1:3000/")
        print("4. Demo: http://marysrestaurant.lvh.me:3000/")
    else:
        print(f"\n⚠️  {total - passed} tests failed. Check the output above.")
        print("Run setup_full.cmd to ensure proper setup.")


if __name__ == "__main__":
    main()