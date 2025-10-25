# Just Code Works (JCW) 🚀

A multi-tenant website builder platform built with Django and Next.js that allows users to create and manage stunning websites with ease.

## 🏗️ Architecture

- **Backend**: Django 5 + Django REST Framework
- **Frontend**: Next.js 14 with TypeScript
- **Database**: SQLite (development) / PostgreSQL (production)
- **Styling**: Tailwind CSS
- **Multi-tenancy**: Custom tenant system

## 📁 Project Structure

```
studio/
├── jcw/                    # Main JCW Platform
│   ├── apps/
│   │   ├── api/           # Django REST API
│   │   └── web/           # Next.js Frontend
│   └── shared/            # Shared utilities
├── .venv/                 # Python virtual environment
└── project.txt           # Project documentation
```

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- npm or yarn

### Backend Setup (Django API)

1. **Navigate to API directory**:
   ```bash
   cd jcw/apps/api
   ```

2. **Activate virtual environment**:
   ```bash
   # Windows
   ..\..\..\.venv\Scripts\activate
   
   # macOS/Linux
   source ../../../.venv/bin/activate
   ```

3. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations**:
   ```bash
   python manage.py migrate
   ```

5. **Create superuser**:
   ```bash
   python manage.py createsuperuser --username admin --email admin@jcw.com
   ```

6. **Start Django server**:
   ```bash
   python manage.py runserver
   ```

   API will be available at: `http://127.0.0.1:8000`

### Frontend Setup (Next.js)

1. **Navigate to web directory**:
   ```bash
   cd jcw/apps/web
   ```

2. **Install Node dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

   Frontend will be available at: `http://localhost:3000`

## 🔗 Available Endpoints

### Frontend Routes
- **Homepage**: `http://localhost:3000`
- **Test Page**: `http://localhost:3000/test`
- **Admin Dashboard**: `http://localhost:3000/dashboard/admin`
- **User Dashboard**: `http://localhost:3000/dashboard/user`

### Backend API
- **API Root**: `http://127.0.0.1:8000/api/`
- **Django Admin**: `http://127.0.0.1:8000/admin/`
- **Onboarding**: `http://127.0.0.1:8000/api/onboarding/`
- **Admin Stats**: `http://127.0.0.1:8000/api/admin/stats/`

## 🛠️ Development

### Running Both Servers

1. **Terminal 1 - Django API**:
   ```bash
   cd jcw/apps/api
   python manage.py runserver
   ```

2. **Terminal 2 - Next.js Frontend**:
   ```bash
   cd jcw/apps/web
   npm run dev
   ```

### Key Configuration Files

- **Django Settings**: `jcw/apps/api/justcodeworks/settings/simple.py`
- **Django URLs**: `jcw/apps/api/justcodeworks/urls_simple.py`
- **Next.js Config**: `jcw/apps/web/next.config.js`
- **Tailwind Config**: `jcw/apps/web/tailwind.config.ts`

## 🎯 Features

- ✅ **Multi-tenant Architecture**: Support for multiple websites
- ✅ **Django REST API**: Comprehensive backend API
- ✅ **Next.js Frontend**: Modern React-based UI
- ✅ **Admin Dashboard**: Website management interface
- ✅ **User Authentication**: Secure user management
- ✅ **Responsive Design**: Mobile-first approach
- ✅ **SQLite Development**: Easy local development

## 🔧 Configuration

### Environment Variables

Create `.env.local` in the web directory:
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

### Database Configuration

The project uses SQLite for development. For production, configure PostgreSQL in Django settings.

## 🐛 Troubleshooting

### Common Issues

1. **404 Errors**: Ensure both Django and Next.js servers are running
2. **CORS Issues**: Check Django CORS settings in `settings.py`
3. **Database Errors**: Run migrations: `python manage.py migrate`
4. **Node Modules**: Delete `node_modules` and run `npm install`

### Development Notes

- Django runs on port 8000
- Next.js runs on port 3000
- Use simplified settings for development
- SQLite database is in `jcw/apps/api/db.sqlite3`

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 🚀 Deployment

### Production Checklist

- [ ] Configure PostgreSQL database
- [ ] Set up environment variables
- [ ] Configure Django for production
- [ ] Build Next.js for production
- [ ] Set up reverse proxy (nginx)
- [ ] Configure SSL certificates

---

**Just Code Works** - Making website building simple and powerful! 🎉