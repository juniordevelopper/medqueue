from django.db import models
from django.conf import settings
from doctor.models import Doctor

class Appointment(models.Model):
    STATUS_CHOICES = (
        ('waiting', 'Kutilmoqda'),
        ('in_progress', 'Qabulda'),
        ('completed', 'Tugallangan'),
        ('cancelled', 'Bekor qilingan'),
    )

    patient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='appointments')
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='appointments')
    
    # Navbat raqami (har bir shifokor uchun har kuni 1 dan boshlanadi)
    queue_number = models.PositiveIntegerField()
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='waiting')
    
    # Vaqtlar
    date = models.DateField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        # Bir kunda bitta bemor bitta shifokorga faqat bir marta navbat oladi
        unique_together = ('patient', 'doctor', 'date')
        ordering = ['queue_number']

    def __str__(self):
        return f"#{self.queue_number} - {self.patient.full_name} -> {self.doctor.specialty}"

    @property
    def estimated_waiting_time(self):
        """Taxminiy kutish vaqtini hisoblash (har bir kishi uchun 10 daqiqa)"""
        # O'zidan oldinda turgan 'waiting' holatidagi bemorlar soni
        waiting_count = Appointment.objects.filter(
            doctor=self.doctor,
            date=self.date,
            status='waiting',
            queue_number__lt=self.queue_number
        ).count()
        
        # Agar hozir kimdir qabulda bo'lsa (in_progress), uni ham qo'shish kerak bo'lishi mumkin
        return waiting_count * 10 
