from django.urls import path
from . import views

urlpatterns = [
    path('activity/', views.ActivityLogListView.as_view(), name='activity_list'),
]