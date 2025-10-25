from django.urls import path
from . import views

urlpatterns = [
    path('start/', views.OnboardingStartView.as_view(), name='onboarding_start'),
    path('check-slug/', views.CheckSlugView.as_view(), name='onboarding_check_slug'),
]