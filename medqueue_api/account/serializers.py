from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    """
    Foydalanuvchi ma'lumotlarini ko'rishi va tahrirlashi uchun serializer
    """
    class Meta:
        model = User
        # Frontendga yuboriladigan maydonlar
        fields = [
            'id', 'email', 'full_name', 'phone', 'avatar',
            'gender', 'blood_group', 'birth_date',
            'is_doctor', 'is_patient', 'is_online',
            'created_at', 'updated_at', 'last_login'
        ]
        # Bu maydonlar faqat o'qish uchun o'zgartirishga ruxsat bermaymiz
        read_only_fields = [
            'id', 'is_doctor', 'is_patient', 'is_online',
            'created_at', 'updated_at', 'last_login'
        ]

class RegisterSerializer(serializers.ModelSerializer):
    """
    Yangi foydalanuvchini ro'yxatdan o'tkazish uchun serializer
    """
    # Parol uchun maxsus maydon(faqat yozish mumkin o'zgartirib bo'lmaydi)
    password = serializers.CharField(write_only=True, min_length=8)
    
    class Meta:
        model = User
        fields = ['full_name', 'email', 'phone', 'password']

    def create(self, validated_data):
        """
        Bu funksiya ma'lumotlar tekshirilgandan so'ng (validation), foydalanuvchini bazaga saqlaydi.
        """
        user = User.objects.create_user(
            full_name=validated_data.get('full_name', ''),
            email=validated_data['email'],
            phone=validated_data['phone'],
            password=validated_data.get('password', ''),
        )
        return user

class PasswordResetRequestSerializer(serializers.Serializer):
    """Faqat emailni qabul qilish uchun"""
    email = serializers.EmailField()

class PasswordResetConfirmSerializer(serializers.Serializer):
    """Yangi parolni qabul qilish va tekshirish uchun"""
    new_password = serializers.CharField(write_only=True, min_length=8)

class UserShortSerializer(serializers.ModelSerializer):
    """Login vaqtida foydalanuvchi rolini aniqlash uchun"""
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'is_doctor', 'is_patient']

class UserProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # Bemor tahrirlay oladigan maydonlar
        fields = [
            'id', 'email', 'full_name', 'phone', 'avatar',
            'gender', 'blood_group', 'birth_date', 'bio',
            'is_doctor', 'is_patient', 'created_at'
        ]
        # Tahrirlab bo'lmaydigan (faqat ko'rinadigan) maydonlar
        read_only_fields = ['id', 'email', 'is_doctor', 'is_patient', 'created_at']
