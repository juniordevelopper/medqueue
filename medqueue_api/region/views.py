from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Region
from .serializers import RegionSerializer

class RegionListView(generics.ListAPIView):
    """Barcha hududlarni ko'rish uchun. Faqat login qilgan foydalanuvchilar ko'ra oladi"""
    queryset = Region.objects.all()
    serializer_class = RegionSerializer
    permission_classes = [IsAuthenticated]