from rest_framework import serializers
from .models import Hospital
from department.serializers import DepartmentSerializer

class HospitalSerializer(serializers.ModelSerializer):
    # Bo'limlar ro'yxatini to'liq korsatish
    departments_detail = DepartmentSerializer(source='departments', many=True, read_only=True)

    # Dinamic hisoblanadigan maydonlar
    departments_count = serializers.SerializerMethodField()
    doctors_count = serializers.SerializerMethodField()
    region_name = serializers.ReadOnlyField(source='region.name')

    class Meta:
        model = Hospital
        fields = [
            'id', 'name', 'description', 'address', 'region', 'region_name',
            'estabished_data', 'image', 'phone', 'email', 'website',
            'telegram', 'instagram', 'departments', 'departments_detail',
            'departments_count', 'doctors_count', 'latitude', 'longitude'
        ]

    def get_doctors_count(self, obj):
        # Shifonaga biriktirilgan shifokorlar soni (related_name orqali)
        if hasattr(obj, 'contors'):
            return obj.doctors.count()
        else:
            return 0

    def get_departments_count(self, obj):
        # Shifoxonaga biriktirilgan bo'limlar sonini qaytaradi
        return obj.departments.count()

    def get_doctors_count(self, obj):
        # Shifokorlar sonini hisoblash (related_name='doctors' bo'lishi kerak)
        if hasattr(obj, 'doctors'):
            return obj.doctors.count()
        return 0