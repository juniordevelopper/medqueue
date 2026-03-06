from rest_framework import serializers
from .models import Appointment
from django.utils import timezone
from doctor.models import Doctor
from account.serializers import UserForDoctorSerializer
from hospital.serializers import HospitalSerializer

class PatientInQueueSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField(source='patient.full_name')
    class Meta:
        model = Appointment
        fields = ['queue_number', 'full_name', 'status']

class DoctorDetailSerializer(serializers.ModelSerializer):
    user_detail = UserForDoctorSerializer(source='user', read_only=True)
    hospital_details = HospitalSerializer(source='hospital', read_only=True)
    
    today_queue = serializers.SerializerMethodField()

    class Meta:
        model = Doctor
        fields = [
            'id', 'user_detail', 'hospital_details', 'specialty', 
            'experience_years', 'room_number', 'work_hours', 
            'is_aviable', 'today_queue'
        ]

    def get_today_queue(self, obj):
        today = timezone.localdate()  # UTC o‘rniga localdate
        appointments = Appointment.objects.filter(
            doctor=obj,
            date=today,
            status__in=['waiting', 'in_progress']
        ).order_by('queue_number')
        return PatientInQueueSerializer(appointments, many=True).data