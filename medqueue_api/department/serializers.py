from rest_framework import serializers
from .models import Department

class DepartmentSerializer(serializers.ModelSerializer):
    """Foydalanuvchiga shifoxona tarkibida yuboriluvchi bo'lim ma'lumotlari uchun serializer"""
    class Meta:
        model = Department
        fields = ['id', 'name', 'description']