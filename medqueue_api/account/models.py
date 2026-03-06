from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class CustomUserManager(BaseUserManager):
  def create_user(self, email, password=None, **extra_fields):
    if not email:
      raise ValueError('Email manzilini kiritish majburiy!')
    email = self.normalize_email(email)

    if 'username' in extra_fields:
      extra_fields['username'] = email.split('@')[0]
    
    user = self.model(email=email, **extra_fields)
    user.set_password(password)
    user.save(using=self._db)
    return user

  def create_superuser(self, email, password=None, **extra_fields):
    extra_fields.setdefault('is_staff', True)
    extra_fields.setdefault('is_superuser', True)
    extra_fields.setdefault('is_active', True)
    return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
  # Jins uchun tanlovlar
  GENDER_CHOICES = (
    ('M', 'Erkak'),
    ('F', 'Ayol'),
  )

  # Qon guruhi uchun tanlovlar
  BLOOD_CHOICES = (
    ('1+', 'I (Rh+)'), ('1-', 'I (Rh-)'),
    ('2+', 'II (Rh+)'), ('2-', 'II (Rh-)'),
    ('3+', 'III (Rh+)'), ('3-', 'III (Rh-)'),
    ('4+', 'IV (Rh+)'), ('4-', 'IV (Rh-)'),
  )

  # Login ma'lumotlari
  email = models.EmailField(unique=True)
  username = models.CharField(max_length=150, blank=True)
    
  # Ism va familiya (Har doim kerak bo'ladi)
  full_name = models.CharField(max_length=255, blank=True)
  bio = models.TextField(blank=True, null=True)
  
  # Rasm va telefon
  avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
  phone = models.CharField(max_length=15, null=True, blank=True)

  # Asosiy ma'lumotlar
  gender = models.CharField(max_length=1, choices=GENDER_CHOICES, null=True, blank=True)
  blood_group = models.CharField(max_length=2, choices=BLOOD_CHOICES, null=True, blank=True)
  birth_date = models.DateField(null=True, blank=True)

  # Online haqidagi ma'lumot
  is_online = models.BooleanField(default=False)

  # Rol turlari
  is_doctor = models.BooleanField(default=False)
  is_patient = models.BooleanField(default=True)

  # Statuslar
  is_active = models.BooleanField(default=False)
  is_staff = models.BooleanField(default=False)

  # Vaqtlar
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  # Login uchun sozlamalar
  objects = CustomUserManager()
  
  USERNAME_FIELD = 'email' # Login uchun email ishlatiladi
  REQUIRED_FIELDS = [] # Superuser yaratishda email va paroldan boshqa narsa so'ramaydi

  def __str__(self):
    return f'{self.email} - {self.full_name}'
  
  class Meta:
    verbose_name = 'Foydalanuvchi'
    verbose_name_plural = 'Foydalanuvchilar'
  

