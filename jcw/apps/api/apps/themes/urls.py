from django.urls import path
from . import views

urlpatterns = [
    path('theme/', views.ThemeView.as_view(), name='theme'),
]