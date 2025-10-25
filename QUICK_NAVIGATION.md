# 🏠 JCW Platform - Quick Navigation Guide

## ✅ SERVERS ARE RUNNING!

Both servers are now active and working properly:
- **Django API**: http://127.0.0.1:8000 ✅
- **Next.js Frontend**: http://localhost:3000 ✅

## 🎯 Main URLs to Access Your Platform:

### 🏡 **Main Project Homepage**
**http://localhost:3000**
- This is your main platform homepage
- Shows the JCW platform overview
- Links to admin dashboards and features

### 👑 **Django Admin Panel**
**http://127.0.0.1:8000/admin/**
- Username: `admin`
- Email: `admin@jcw.com`
- Manage tenants, users, and all backend data

### 🔌 **API Endpoints**
**http://127.0.0.1:8000/api/**
- REST API root
- All backend endpoints for the platform

## 🏢 **Tenant Websites (Multi-Tenant)**

### Method 1: Query Parameter (MOST RELIABLE)
- **Mary's Restaurant**: http://localhost:3000?tenant=marys-restaurant
- **TechFlow Solutions**: http://localhost:3000?tenant=techflow-solutions
- **Fresh Garden Cafe**: http://localhost:3000?tenant=fresh-garden-cafe
- **Digital Marketing Pro**: http://localhost:3000?tenant=digital-marketing-pro
- **Wellness Center**: http://localhost:3000?tenant=wellness-center

### Method 2: Subdomains (May not work in all browsers)
- **Mary's Restaurant**: http://marys-restaurant.lvh.me:3000
- **TechFlow Solutions**: http://techflow-solutions.lvh.me:3000

## 🚀 **Quick Start Guide:**

1. **Visit Main Homepage**: http://localhost:3000
2. **Try a Tenant Site**: http://localhost:3000?tenant=marys-restaurant
3. **Access Admin Panel**: http://127.0.0.1:8000/admin/
4. **Check API**: http://127.0.0.1:8000/api/

## 🔧 **If URLs Don't Work:**

1. **Check servers are running**: Look for terminal output showing both servers active
2. **Restart servers if needed**:
   - Django: `cd jcw/apps/api && python manage.py runserver`
   - Next.js: `cd jcw/apps/web && npm run dev`
3. **Use localhost instead of 127.0.0.1** or vice versa
4. **Clear browser cache** and try again

---

**🎉 Your multi-tenant website builder platform is ready to use!**