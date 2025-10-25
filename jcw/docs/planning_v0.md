# Planning Pack v0 — Just Code Works (JCW) Platform

## 1) Repo Structure

```
justcodeworks/
├── README.md
├── .gitignore
├── docs/
│   ├── run.md
│   ├── env.md
│   ├── tenancy.md
│   └── sections.md
├── api/ (Django Project)
│   ├── manage.py
│   ├── requirements.txt
│   ├── justcodeworks/
│   │   ├── settings/
│   │   │   ├── base.py
│   │   │   ├── development.py
│   │   │   └── production.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── apps/
│   │   ├── tenants/
│   │   ├── sections/
│   │   ├── templates/
│   │   ├── onboarding/
│   │   ├── auth/
│   │   └── core/
│   └── tests/
└── web/ (Next.js Project)
    ├── package.json
    ├── next.config.js
    ├── tailwind.config.js
    ├── src/
    │   ├── app/
    │   │   ├── (marketing)/
    │   │   ├── admin/
    │   │   └── dashboard/
    │   ├── components/
    │   ├── lib/
    │   └── types/
    └── public/
```

**Rationale:**
- **Clean separation**: Django exclusively handles API/backend; Next.js handles all UI/frontend concerns
- **Modular Django apps**: Each business domain (tenants, sections, templates) gets isolated app for maintainability
- **Next.js App Router**: Modern routing with RSC support for dashboard performance and marketing SEO
- **Shared types**: TypeScript definitions can be generated from Django models for consistency
- **Documentation-first**: `/docs` folder ensures setup/architecture knowledge is accessible
- **Environment splitting**: Django settings per environment prevents configuration drift
- **Test isolation**: Separate test directories maintain clear boundaries between API and web testing

## 2) Environment Variables

| NAME | Scope | Purpose |
|------|-------|---------|
| DATABASE_URL | Django | PostgreSQL connection string with credentials |
| DATABASE_TENANT_SCHEMA_PREFIX | Django | Schema prefix for django-tenants (e.g., `tenant_`) |
| SECRET_KEY | Django | Django cryptographic signing key |
| DEBUG | Django | Enable/disable debug mode and verbose errors |
| ALLOWED_HOSTS | Django | Comma-separated allowed hostnames including wildcard subdomains |
| JWT_SECRET_KEY | Django | JWT token signing secret |
| JWT_ACCESS_TOKEN_LIFETIME | Django | Access token expiration (seconds) |
| TENANT_DOMAIN_SUFFIX | Django | Base domain for subdomains (`.justcodeworks.eu`) |
| MEDIA_ROOT | Django | Local path for uploaded files (sections, previews) |
| USE_S3 | Django | Enable S3 storage backend (False for local dev) |
| AWS_S3_BUCKET_NAME | Django | S3 bucket for production file storage |
| NEXT_PUBLIC_API_URL | Next.js | Public API base URL for client-side requests |
| API_INTERNAL_URL | Next.js | Server-side API URL for SSR requests |
| NEXTAUTH_SECRET | Next.js | NextAuth.js session encryption key |
| NEXTAUTH_URL | Next.js | Canonical URL for authentication callbacks |
| NEXT_PUBLIC_DOMAIN_SUFFIX | Next.js | Domain suffix for subdomain generation UI |
| NEXT_PUBLIC_ENABLE_ECOMMERCE | Both | Feature flag for eCommerce placeholder visibility |

## 3) Data Models

### User
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| email | EmailField | Unique, required |
| password_hash | CharField | Django auth compatible |
| first_name | CharField | Optional |
| last_name | CharField | Optional |
| role | CharField | Choices: admin, tenant_admin, tenant_user |
| is_active | BooleanField | Account status |
| created_at | DateTimeField | Auto-generated |
| updated_at | DateTimeField | Auto-updated |

### Tenant
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| slug | SlugField | Unique, for subdomain generation |
| business_name | CharField | Display name |
| industry_category | CharField | Business type/vertical |
| city | CharField | Location |
| country | CharField | Location |
| primary_color | CharField | Hex color code |
| contact_email | EmailField | Business contact |
| contact_phone | CharField | Optional |
| status | CharField | Choices: pending, active, suspended |
| schema_name | CharField | Django-tenants schema identifier |
| dev_subdomain_url | URLField | Generated development URL |
| owner_id | ForeignKey | Link to User model |
| created_at | DateTimeField | Auto-generated |

### Section
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| slug | SlugField | Unique, follows naming convention |
| name | CharField | Display name |
| category | CharField | nav, hero, feature, gallery, testimonial, cta, footer |
| vertical | CharField | rest, svc, shop |
| kit_number | CharField | 01, 02, etc. |
| section_type_number | CharField | 01, 02, etc. |
| framework | CharField | Fixed to 'next' |
| version | CharField | Semantic versioning |
| json_schema | JSONField | Props definition for section |
| preview_image_url | URLField | Preview thumbnail |
| status | CharField | draft, approved, deprecated |
| compatibility_flags | JSONField | Array of tags: dark, light, minimal, etc. |
| created_by_id | ForeignKey | Link to User |
| created_at | DateTimeField | Auto-generated |

### Template
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| name | CharField | Display name |
| website_type | CharField | one_page, multi_page, ecommerce |
| description | TextField | Template description |
| is_default | BooleanField | Default template per website type |
| created_by_id | ForeignKey | Link to User |
| created_at | DateTimeField | Auto-generated |

### TemplateSection
| Field | Type | Notes |
|-------|------|-------|
| id | AutoField | Primary key |
| template_id | ForeignKey | Link to Template |
| section_id | ForeignKey | Link to Section |
| order_index | PositiveIntegerField | Section ordering |
| is_required | BooleanField | Must be included |
| placement_constraints | JSONField | Validation rules |

### Page
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| tenant_id | ForeignKey | Tenant-scoped |
| slug | SlugField | Page URL slug |
| title | CharField | Page title |
| status | CharField | draft, published |
| template_id | ForeignKey | Optional template reference |
| created_at | DateTimeField | Auto-generated |

### SiteTheme
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| tenant_id | OneToOneField | One theme per tenant |
| primary_color | CharField | Hex color |
| secondary_color | CharField | Hex color |
| font_family_heading | CharField | Font name |
| font_family_body | CharField | Font name |
| custom_css | TextField | Advanced customization |
| updated_at | DateTimeField | Auto-updated |

### ActivityLog
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| tenant_id | ForeignKey | Nullable for global actions |
| user_id | ForeignKey | Action performer |
| action_type | CharField | create, update, delete, login |
| resource_type | CharField | tenant, section, template, page |
| resource_id | UUIDField | Target resource |
| description | TextField | Human-readable action |
| metadata | JSONField | Additional context |
| created_at | DateTimeField | Auto-generated |

## 4) API Surface

```
POST /api/auth/login
POST /api/auth/logout  
POST /api/auth/refresh
GET /api/auth/me

POST /api/onboarding/start
POST /api/onboarding/check-slug
GET /api/onboarding/industries

GET /api/tenants
GET /api/tenants/{id}
PUT /api/tenants/{id}
DELETE /api/tenants/{id}
POST /api/tenants/{id}/impersonate

GET /api/sections
GET /api/sections/{id}
POST /api/sections
PUT /api/sections/{id}
DELETE /api/sections/{id}
POST /api/sections/{id}/approve

GET /api/templates
GET /api/templates/{id}
POST /api/templates
PUT /api/templates/{id}
DELETE /api/templates/{id}

GET /api/my/pages
GET /api/my/pages/{id}
POST /api/my/pages
PUT /api/my/pages/{id}
DELETE /api/my/pages/{id}
POST /api/my/pages/{id}/sections
PUT /api/my/pages/{id}/sections/{section_id}
DELETE /api/my/pages/{id}/sections/{section_id}

GET /api/my/theme
PUT /api/my/theme

GET /api/activity
GET /api/my/activity

POST /api/upload/preview
POST /api/upload/asset
```

## 5) IA — Admin Dashboard

**Routes & Components:**
- `/admin` - Dashboard Overview
  - `StatsCard` (tenants, sections, templates counts)
  - `ActivityFeed` (recent global actions)
  - `QuickActions` (approve sections, create template)

- `/admin/tenants` - Tenant Management
  - `TenantTable` (search, filter, pagination)
  - `TenantDetail` (info, impersonate, activity)
  - `ImpersonateButton`, `SuspendTenantButton`

- `/admin/sections` - Section Library Management  
  - `SectionGrid` (preview cards with metadata)
  - `SectionUploadForm` (metadata, preview image, JSON schema)
  - `SectionDetail` (preview, usage stats, approval actions)
  - `BulkApprovalActions`, `NamingConventionGuide`

- `/admin/templates` - Template Management
  - `TemplateLibrary` (cards by website type)
  - `TemplateBuilder` (drag-drop section composer)
  - `CompositionRules` (validation display)
  - `TemplatePreview`, `SectionPicker`

- `/admin/activity` - Global Activity Log
  - `ActivityTimeline` (filterable by user, action, resource)
  - `FilterPanel`, `ExportActions`

## 6) IA — User Dashboard

**Routes & Components:**
- `/dashboard` - My Site Overview
  - `SiteStatusCard` (dev URL, last edited, publish status)
  - `QuickStats` (pages, sections used)
  - `RecentChangesTimeline`
  - `PreviewButton`, `EditSiteButton`

- `/dashboard/my-site` - Site Management
  - `PageList` (home, about, contact pages)
  - `AddPageButton`, `PageSettings`
  - `/dashboard/my-site/pages/{slug}` - Page Builder
    - `SectionLibrary` (sidebar browser)
    - `PageCanvas` (drag-drop interface)
    - `SectionPropsEditor` (JSON schema forms)
    - `SaveButton`, `PreviewButton`

- `/dashboard/sections` - Browse Section Library
  - `CategoryTabs` (nav, hero, feature, etc.)
  - `SectionGrid` (read-only previews)
  - `SearchBar`, `FilterOptions`
  - `SectionDetail` (preview, add to page action)

- `/dashboard/theme` - Theme Customization
  - `ColorPicker` (primary, secondary colors)
  - `FontSelector` (heading, body typography)
  - `ThemePresets` (predefined combinations)
  - `CustomCSSEditor` (advanced users)
  - `LivePreview` (site preview with theme changes)

- `/dashboard/preview` - Site Preview
  - `DevicePreview` (desktop, tablet, mobile tabs)
  - `PageNavigation` (switch between pages)
  - `PreviewFrame` (full site render)

## 7) Acceptance Criteria

### v0 — Foundations Checklist
- [ ] Django project structure with modular apps (tenants, sections, templates, onboarding, auth, core)
- [ ] Next.js project with App Router and dashboard route structure
- [ ] Django-tenants configured for schema-per-tenant approach
- [ ] All data models defined with proper relationships and constraints
- [ ] API endpoint stubs created (no business logic)
- [ ] Dashboard route structure and basic layout components
- [ ] Environment variable templates for Django and Next.js
- [ ] Documentation files: run.md, env.md, tenancy.md, sections.md
- [ ] Local subdomain development strategy documented
- [ ] Git repository with conventional commit setup
- [ ] Windows CMD setup commands verified
- [ ] Database migrations for all models created
- [ ] JWT authentication middleware configured
- [ ] File upload storage abstraction implemented

### v1 — MVP Features Checklist
- [ ] Section upload with naming convention validation (jcw-vertical-kit-type-number)
- [ ] Section metadata management (category, tags, preview image, JSON schema)
- [ ] Section approval workflow (draft → approved status)
- [ ] Template creation with ordered section lists and composition rules
- [ ] Default template assignment per website type
- [ ] Onboarding flow: business details → slug generation → tenant creation
- [ ] Live slug preview with collision handling (-1, -2 suffixes)
- [ ] User dashboard: My Site overview with dev subdomain link
- [ ] Page builder: drag-drop sections with props editing
- [ ] Section library browser (read-only for tenants)
- [ ] Theme customization: colors, fonts, CSS
- [ ] Admin dashboard: tenant management with impersonation
- [ ] Activity logging for all CRUD operations
- [ ] Tenant data isolation verification
- [ ] Preview functionality for both sections and full sites
- [ ] File upload for section previews and tenant assets

## 8) Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Subdomain routing in Windows local dev | Cannot test multi-tenancy locally | Use hosts file entries + query param fallback (?tenant=slug) |
| Django-tenants migration complexity | Data corruption, deployment failures | Implement migration dry-run, backup procedures, rollback strategies |
| Section naming convention enforcement | Broken templates, management issues | Server-side regex validation, auto-generation, reserved name checking |
| JWT token security in browser | XSS vulnerabilities, session hijacking | Use httpOnly cookies, CSRF protection, short-lived tokens |
| File storage scaling from local to S3 | Storage limitations, deployment complexity | Abstract storage backend using Django's storage framework |
| Slug collision at scale | Poor UX with -1, -2 suffixes | Intelligent suggestions, manual editing, reserved names |
| Scope creep beyond MVP | Delayed delivery, technical debt | Strict v0/v1 adherence, feature flags, regular scope reviews |
| Windows CMD setup complexity | Developer onboarding friction | Provide PowerShell alternatives, batch files, WSL documentation |

## 9) Open Questions

1. **Local Subdomain Strategy**: Should we recommend ngrok/localtunnel for full subdomain testing, or is hosts file + query param sufficient for v0?

2. **Section Storage Format**: Should sections be stored as React component code, or metadata + props with rendering handled by a universal component system?

3. **Template Inheritance**: Do we need template versioning/inheritance, or is simple template duplication sufficient for MVP?

4. **Admin Role Granularity**: Should admin role be split into super-admin and moderator roles, or keep single admin role for v0?

5. **Preview Generation**: Should section previews be static images uploaded by admins, or dynamically generated screenshots of rendered components?