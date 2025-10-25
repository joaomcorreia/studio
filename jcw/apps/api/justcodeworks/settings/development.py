from .base import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env('DEBUG', default=True)

ALLOWED_HOSTS = env.list('ALLOWED_HOSTS', default=['localhost', '127.0.0.1', '.lvh.me'])

# Development-specific CORS settings
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# Allow all lvh.me subdomains for development
CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^http://.*\.lvh\.me:3000$",
]

# Additional development settings
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django_tenants': {
            'handlers': ['console'],
            'level': 'DEBUG',
        },
    },
}