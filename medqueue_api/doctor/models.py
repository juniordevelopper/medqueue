from django.db import models
from django.conf import settings
from hospital.models import Hospital
from department.models import Department
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

class Doctor(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='doctor_profile',
        verbose_name='Foydalanuvchi'
    )

    hospital = models.ForeignKey(
        Hospital,
        on_delete=models.CASCADE,
        related_name='doctors',
        verbose_name='Shifoxona'
    )

    department = models.ForeignKey(
        Department,
        on_delete=models.CASCADE,
        related_name='doctors',
        verbose_name='Bo\'lim'
    )

    # Kasbiy ma'lumotlar
    specialty = models.CharField(max_length=150, verbose_name="Mutaxasisligi")
    experience_years = models.PositiveIntegerField(default=0, verbose_name='Ish tajribasi (yil)')
    room_number = models.PositiveIntegerField(verbose_name='Xona raqami')
    work_hours = models.CharField(max_length=100, default='8:00-18:00', verbose_name='Ish vaqti')
    
    # Shifokorning hozirgi holati
    is_aviable = models.BooleanField(default=True, verbose_name='Qabulga tayyor (active)')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        name = self.user.full_name if self.user.full_name else self.user.username
        return f'Dr. {name} ({self.specialty})'

    class Meta:
        verbose_name = 'Shifokor'
        verbose_name_plural = 'Shifokorlar'

@receiver(post_save, sender=Doctor)
def make_user_doctor(sender, instance, created, **kwargs):
    """Shifokor yaratilganda uning rolini yangilash"""
    if created:
        user = instance.user
        user.is_doctor = True
        user.is_patient = False
        user.save()

@receiver(post_delete, sender=Doctor)
def make_user_patient_again(sender, instance, **kwargs):
    """Shifokor o'chirilganda uni yana bemorga aylantirish"""
    user = instance.user
    user.is_doctor = False
    user.is_patient = True
    user.save()