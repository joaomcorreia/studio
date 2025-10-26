#!/usr/bin/env python3
"""
Simple script to create a new tenant via the JCW API
Usage: python create_tenant.py
"""

import requests
import json
import sys

def create_tenant():
    """Interactive tenant creation"""
    print("🏢 JCW Tenant Creation Tool")
    print("=" * 40)
    
    # Collect tenant information
    business_name = input("Business Name: ").strip()
    if not business_name:
        print("❌ Business name is required!")
        return
    
    contact_email = input("Contact Email: ").strip()
    if not contact_email:
        print("❌ Contact email is required!")
        return
    
    contact_phone = input("Phone (optional): ").strip()
    website_url = input("Website URL (optional): ").strip()
    
    print("\nIndustry Categories:")
    print("1. Restaurant")
    print("2. Retail") 
    print("3. Services")
    print("4. Healthcare")
    print("5. Construction")
    print("6. Transport")
    print("7. Travel")
    print("8. Auto Repair")
    print("9. Beauty")
    print("10. Other")
    
    industry_choice = input("Select industry (1-10): ").strip()
    industry_map = {
        '1': 'restaurant',
        '2': 'retail', 
        '3': 'services',
        '4': 'healthcare',
        '5': 'construction',
        '6': 'transport',
        '7': 'travel',
        '8': 'auto_repair',
        '9': 'beauty',
        '10': 'other'
    }
    industry_category = industry_map.get(industry_choice, 'other')
    
    print("\nPlan Options:")
    print("1. Basic")
    print("2. Starter")
    print("3. Premium") 
    print("4. Pro")
    
    plan_choice = input("Select plan (1-4): ").strip()
    plan_map = {
        '1': 'basic',
        '2': 'starter',
        '3': 'premium',
        '4': 'pro'
    }
    plan = plan_map.get(plan_choice, 'basic')
    
    city = input("City (optional): ").strip()
    country = input("Country (optional): ").strip()
    
    # Prepare tenant data
    tenant_data = {
        'business_name': business_name,
        'contact_email': contact_email,
        'contact_phone': contact_phone,
        'website_url': website_url,
        'industry_category': industry_category,
        'plan': plan,
        'city': city,
        'country': country
    }
    
    print(f"\n📝 Creating tenant with data:")
    print(json.dumps(tenant_data, indent=2))
    
    confirm = input("\nProceed? (y/N): ").strip().lower()
    if confirm != 'y':
        print("❌ Cancelled.")
        return
    
    try:
        # Make API request
        response = requests.post(
            'http://127.0.0.1:8000/api/onboarding/start/',
            headers={'Content-Type': 'application/json'},
            json=tenant_data,
            timeout=10
        )
        
        result = response.json()
        
        if response.status_code == 201 and result.get('success'):
            print("\n✅ SUCCESS!")
            print(f"   Business: {business_name}")
            print(f"   Tenant ID: {result['tenant_id']}")
            print(f"   Slug: {result['slug']}")
            print(f"   Dev URL: {result['dev_url']}")
            print(f"   Message: {result['message']}")
            
            print(f"\n🌐 Visit your new tenant site:")
            print(f"   {result['dev_url']}")
            
        else:
            print(f"\n❌ ERROR: {result.get('error', 'Unknown error')}")
            
    except requests.exceptions.ConnectionError:
        print("\n❌ Connection Error: Make sure the Django server is running on http://127.0.0.1:8000")
    except requests.exceptions.Timeout:
        print("\n❌ Timeout: Server took too long to respond")
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")

def list_tenants():
    """List all existing tenants"""
    try:
        response = requests.get(
            'http://127.0.0.1:8000/api/tenants/public/list/',
            timeout=10
        )
        
        if response.status_code == 200:
            tenants = response.json()
            
            if tenants:
                print(f"\n📋 Found {len(tenants)} tenant(s):")
                print("-" * 80)
                for tenant in tenants:
                    print(f"🏢 {tenant['business_name']}")
                    print(f"   ID: {tenant['id']}")
                    print(f"   Slug: {tenant['slug']}")
                    print(f"   Email: {tenant['contact_email']}")
                    if tenant.get('contact_phone'):
                        print(f"   Phone: {tenant['contact_phone']}")
                    if tenant.get('website_url'):
                        print(f"   Website: {tenant['website_url']}")
                    print(f"   Industry: {tenant['industry_category']}")
                    print(f"   Plan: {tenant['plan']}")
                    if tenant.get('city') and tenant.get('country'):
                        print(f"   Location: {tenant['city']}, {tenant['country']}")
                    print(f"   Status: {'✅ Active' if tenant['is_active'] else '❌ Inactive'}")
                    print(f"   Dev URL: {tenant['dev_url']}")
                    print(f"   Created: {tenant['created_at'][:10]}")
                    print("-" * 80)
            else:
                print("\n📋 No tenants found.")
        else:
            print(f"\n❌ Error fetching tenants: {response.status_code}")
            
    except requests.exceptions.ConnectionError:
        print("\n❌ Connection Error: Make sure the Django server is running on http://127.0.0.1:8000")
    except Exception as e:
        print(f"\n❌ Error: {e}")

if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == 'list':
        list_tenants()
    else:
        create_tenant()