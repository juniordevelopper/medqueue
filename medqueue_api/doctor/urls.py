from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DoctorViewSet

router = DefaultRouter()
# Endi barcha amallar (all, profile, detail) shu bitta router orqali o'tadi
router.register(r'profile', DoctorViewSet, basename='doctor')

urlpatterns = [
    path('', include(router.urls)),
]
