from django.urls import path
from . import views

urlpatterns = [
    path('', views.PageListCreateView.as_view(), name='page_list_create'),
    path('<uuid:pk>/', views.PageDetailView.as_view(), name='page_detail'),
]