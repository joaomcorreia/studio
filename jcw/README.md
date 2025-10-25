# Just Code Works (JCW) v0 Implementation

A Django + Next.js multi-tenant website builder platform with schema-per-tenant architecture.

## 🚀 Quick Start

1. **Full Setup** (first time):
   ```cmd
   setup_full.cmd
   ```

2. **Start Development Servers**:
   ```cmd
   dev_servers.cmd
   ```

3. **Access the Platform**:
   - Main App: http://127.0.0.1:3000/
   - API Docs: http://127.0.0.1:8000/api/
   - Admin Panel: http://127.0.0.1:8000/admin/
   - Demo Site: http://marysrestaurant.lvh.me:3000/

## Quick Start (Windows CMD)

### 1. Clone and Setup

```cmd
git clone <repository-url> jcw
cd jcw
```

### 2. Setup API (Django)

```cmd
scripts\setup_api.cmd
```

This will:
- Create Python virtual environment in `apps/api/.venv`
- Install Django, django-tenants, and dependencies
- Create Django project structure
- Generate `.env.example` file

### 3. Configure API Environment

```cmd
cd apps\api
copy .env.example .env
```

Edit `apps/api/.env` and update:
- `DJANGO_SECRET_KEY` - Generate a secure key
- `DATABASE_URL` - Use PostgreSQL or comment out for SQLite

### 4. Setup Database

```cmd
cd apps\api
.venv\Scripts\activate.bat
python manage.py migrate_schemas --shared
python manage.py createsuperuser
```

### 5. Setup Web (Next.js)

```cmd
scripts\setup_web.cmd
```

This will:
- Create Next.js app with TypeScript and Tailwind
- Install dependencies
- Generate `.env.local.example` file

### 6. Configure Web Environment

```cmd
cd apps\web
copy .env.local.example .env.local
```

No changes needed for basic development.

### 7. Start Development Servers

```cmd
scripts\dev.cmd
```

This opens two terminal windows:
- **Django API**: http://127.0.0.1:8000
- **Next.js Web**: http://localhost:3000

## Local Subdomain Testing

For testing multi-tenancy with subdomains, we use `lvh.me` which automatically resolves to `127.0.0.1`:

- **Main site**: http://localhost:3000
- **Test tenant**: http://marysrestaurant.lvh.me:3000

No hosts file modification required!

## Available Routes

### Marketing Site (localhost:3000)
- `/` - Homepage with website type selection
- `/build` - Onboarding flow (placeholder)

### Admin Dashboard (localhost:3000/dashboard/admin)
- Overview, tenants, sections, templates, activity log

### User Dashboard (localhost:3000/dashboard/user)  
- My site, section library, theme settings, preview

### API Endpoints (127.0.0.1:8000/api)
All endpoints are placeholders ready for v0 implementation.

## Project Structure

```
jcw/
├── apps/api/          # Django API server
│   ├── justcodeworks/ # Django project
│   └── apps/          # Django apps (tenants, sections, etc.)
├── apps/web/          # Next.js frontend
│   └── src/app/       # App Router pages
├── docs/              # Documentation
└── scripts/           # Windows CMD setup scripts
```

## Next Steps

This scaffolding provides:
- ✅ Clean project structure with boundaries
- ✅ Multi-tenant foundation with django-tenants
- ✅ Dashboard route stubs (admin + user)  
- ✅ Windows CMD development workflow
- ✅ Local subdomain strategy (.lvh.me)
- ❌ No business logic yet (comes in "Implement v0")

**Ready for**: "Implement v0" - Add models, API endpoints, and dashboard functionality.

## Development Notes

- TypeScript errors are expected until packages are installed
- CSS @tailwind errors are expected until Tailwind is properly configured  
- Use `scripts\dev.cmd` to start both servers simultaneously
- Django admin available at http://127.0.0.1:8000/admin
- All placeholder pages render basic UI without functionality