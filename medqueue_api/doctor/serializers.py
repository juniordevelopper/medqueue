from rest_framework import serializers
from .models import Doctor
from account.models import User
from appointment.models import Appointment
from django.utils import timezone
from hospital.serializers import HospitalSerializer

class UserForDoctorSerializer(serializers.ModelSerializer):
    """Doctor shaxsiy ma'lumotlarini doctor modelidan olamiz"""
    """Bu ma'lumotlarini Userga o'qish uchun yuboramiz"""
    class Meta:
        model = User
        fields = ['full_name', 'bio', 'avatar', 'gender', 'is_online', 'last_login']

class DoctorSerializer(serializers.ModelSerializer):
    user_detail = UserForDoctorSerializer(source='user', read_only=True)
    hospital_name = serializers.ReadOnlyField(source='hospital.name')
    department_name = serializers.ReadOnlyField(source='department.name')

    class Meta:
        model = Doctor
        fields = [
            'id', 'user_detail', 'hospital', 'hospital_name',
            'department', 'department_name', 'specialty',
            'experience_years', 'room_number', 'work_hours', 'is_aviable'
        ]

class DoctorUpdateSerializer(serializers.ModelSerializer):
    # --- USER MODELIDAN KELADIGAN BARCHA MAYDONLAR ---
    email = serializers.EmailField(source='user.email', read_only=True)
    full_name = serializers.CharField(source='user.full_name')
    phone = serializers.CharField(source='user.phone', allow_null=True, required=False)
    bio = serializers.CharField(source='user.bio', allow_null=True, required=False)
    avatar = serializers.ImageField(source='user.avatar', required=False)
    
    # Faqat ko'rish uchun mo'ljallangan User maydonlari
    blood_group = serializers.CharField(source='user.blood_group', read_only=True)
    birth_date = serializers.DateField(source='user.birth_date', read_only=True)
    # --- DOCTOR MODELIDAGI BOG'LANISH NOMALARI ---
    hospital_name = serializers.CharField(source='hospital.name', read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)

    class Meta:
        model = Doctor
        # Frontendga yuboriladigan barcha maydonlar ro'yxati
        fields = [
            'id', 'email', 'full_name', 'phone', 'bio', 'avatar', 
            'blood_group', 'birth_date',
            'experience_years', 'is_aviable', 'specialty', 
            'hospital_name', 'department_name', 'room_number', 'work_hours'
        ]
        # Tahrirlash taqiqlangan (Faqat ko'rish uchun) maydonlar
        read_only_fields = [
            'id', 'email', 'blood_group', 'birth_date',
            'specialty', 'hospital_name', 'department_name', 'room_number', 'work_hours'
        ]

    def update(self, instance, validated_data):
        # User ma'lumotlarini 'user' kaliti ostidan ajratib olamiz
        user_data = validated_data.pop('user', {})
        user = instance.user

        # User modelini yangilash (ism, bio, telefon, rasm)
        if user_data:
            for attr, value in user_data.items():
                setattr(user, attr, value)
            user.save()

        # Doctor modelining o'z maydonlarini yangilash (tajriba, holat)
        return super().update(instance, validated_data)

class PatientInQueueSerializer(serializers.ModelSerializer):
    """Navbatda turgan bemorlarning faqat ismini ko'rsatish uchun"""
    full_name = serializers.ReadOnlyField(source='patient.full_name')
    class Meta:
        model = Appointment
        fields = ['queue_number', 'full_name', 'status']

class DoctorDetailSerializer(serializers.ModelSerializer):
    user_detail = UserForDoctorSerializer(source='user', read_only=True)
    hospital_details = HospitalSerializer(source='hospital', read_only=True)
    
    # Bugungi navbatlar ro'yxati
    today_queue = serializers.SerializerMethodField()

    class Meta:
        model = Doctor
        fields = [
            'id', 'user_detail', 'hospital_details', 'specialty', 
            'experience_years', 'room_number', 'work_hours', 
            'is_aviable', 'today_queue'
        ]

    def get_today_queue(self, obj):
        today = timezone.now().date()
        # Faqat kutilayotgan va qabuldagi bemorlarni yuboramiz
        appointments = Appointment.objects.filter(
            doctor=obj, 
            date=today, 
            status__in=['waiting', 'in_progress']
        ).order_by('queue_number')
        return PatientInQueueSerializer(appointments, many=True).data