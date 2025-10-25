from django.urls import path
from . import views

urlpatterns = [
    path('sections/', views.SectionListCreateView.as_view(), name='section_list_create'),
    path('sections/<uuid:pk>/', views.SectionDetailView.as_view(), name='section_detail'),
    path('sections/<uuid:pk>/approve/', views.SectionApproveView.as_view(), name='section_approve'),
]