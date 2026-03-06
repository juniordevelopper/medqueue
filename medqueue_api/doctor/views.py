from rest_framework import viewsets, generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Doctor
from .serializers import DoctorSerializer, DoctorUpdateSerializer, DoctorDetailSerializer
from .permissions import IsDoctorOwner

class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    
    def get_permissions(self):
        """Tahrirlash uchun egasi bo'lishi shart, ko'rish uchun esa shunchaki login qilgan bo'lishi kifoya"""
        if self.action in ['update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsDoctorOwner()]
        return [IsAuthenticated()]

    def get_serializer_class(self):
        # Bitta shifokor haqida batafsil (Bemor uchun)
        if self.action == 'retrieve':
            return DoctorDetailSerializer
        # Shifokor o'zini tahrirlashi uchun
        if self.action in ['update', 'partial_update']:
            return DoctorUpdateSerializer
        # Ro'yxat uchun
        return DoctorSerializer

    def get_queryset(self):
        """Barcha shifokorlarni ko'rish va filtrlash mantiqi"""
        queryset = Doctor.objects.all().select_related('user', 'hospital', 'department')
        
        # URL orqali kelayotgan parametrlar (Query Params)
        hospital_id = self.request.query_params.get('hospital')
        department_id = self.request.query_params.get('department')
        search = self.request.query_params.get('search')

        if hospital_id:
            queryset = queryset.filter(hospital_id=hospital_id)
        if department_id:
            queryset = queryset.filter(department_id=department_id)
        if search:
            # User modelidagi full_name yoki specialty bo'yicha qidirish
            queryset = queryset.filter(
                models.Q(user__full_name__icontains=search) | 
                models.Q(specialty__icontains=search)
            )
        return queryset
