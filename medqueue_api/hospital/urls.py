from django.urls import path
from .views import HospitalListView

urlpatterns = [
    path('list/', HospitalListView.as_view(), name='hospital-list'),
]