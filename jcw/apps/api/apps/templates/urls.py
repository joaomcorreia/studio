from django.urls import path
from . import views

urlpatterns = [
    path('templates/', views.TemplateListCreateView.as_view(), name='template_list_create'),
    path('templates/<uuid:pk>/', views.TemplateDetailView.as_view(), name='template_detail'),
    path('templates/<uuid:pk>/compose/', views.TemplateComposeView.as_view(), name='template_compose'),
]