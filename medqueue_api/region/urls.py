from django.urls import path
from .views import RegionListView

urlpatterns = [
    path('list/', RegionListView.as_view(), name='region-list'),
]