from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework import permissions
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
from django.contrib.auth.tokens import default_token_generator
from rest_framework.views import APIView
from .serializers import RegisterSerializer, PasswordResetRequestSerializer, PasswordResetConfirmSerializer, UserShortSerializer, UserProfileUpdateSerializer
from .utils import send_activation_email, send_password_reset_email
from .models import User
from .utils import send_welcome_congrats, send_password_change_notification
from rest_framework_simplejwt.authentication import JWTAuthentication

class RegisterView(generics.CreateAPIView):
    """
    Yangi foydalanuvchini ro'yxatdan o'tkazish uchun "View".
    CreateAPIView - faqat POST so'rovlarini qabul qilish uchun mo'ljallangan.
    """
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,) # Hamma ro'yxatdan o'tishi uchun ruxsat beramiz.
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        email = request.data.get('email')

        # 1. Foydalanuvchi bazada mavjudligini tekshiramiz
        user_exists = User.objects.filter(email=email).first()

        if user_exists:
            # 2. Foydalanuvchi emailini tasdiqlamay yana register qilishga urinsa qayta email jo'natamiz.
            if not user_exists.is_active:
                try:
                    send_activation_email(user_exists, request)
                    return Response({
                        'message': 'Ushbu email allaqachon ro\'yxatdan o\'tgan, lekin tasdiqlanmagan. Tasdiqlash xati qayta yuborildi! Tizimga kirish uchun iltimos emailingizni tasdiqlang!'
                    }, status=status.HTTP_200_OK)
                except Exception as e:
                    print(e)
                    return Response({'error': 'Email yuborishda xatolik yuz berdi.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                # 3. Agar foydalanuvchi allaqachon faol bo'lsa 
                return Response({'error': 'Bu email allaqachon ro\'yxatdan o\'tgan!'}, status=status.HTTP_400_BAD_REQUEST)

        # 4. Agar foydalanuvchi bazada bo'lmasa register qilamiz
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user.is_activate = False # Email tasdiqlamaguncha faol bo'lmaydi
            user.save()

            # Email yuborish
            try:
                send_activation_email(user, request)
            except Exception as e:
                print(f'Email yuborishda xatolik: {e}')
            return Response({
                'message': 'Muvaffaqiyatli ro\'yxatdan o\'tdingiz! Tizimga kirish uchun iltimos emailigizni tasdiqlang!'
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyEmailView(APIView):
    """
    Email tasdiqlash linki bosilgandan keyin sodir bo'ladigan ishlar
    """
    permission_classes = (permissions.AllowAny,)

    def get(self, request, uidb64, token):
        try:
            # 1. Kodlangan IDni (uidb64) qaytadan raqamga (ID) aylantiramiz
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        # 2. Foydalanuvchi topilsa va u yuborgan kod mos kelsa
        if user is not None and default_token_generator.check_token(user, token):
            user.is_active = True # Hisobni faollashtirish
            user.save()
            send_welcome_congrats(user)
            return Response({
                'message': 'Tabriklaymiz! Accountingiz faollashtirildi. Tizimga kirish uchun login sahifasiga qayting!'
            }, status=status.HTTP_200_OK)
        else:
            # 3. Agar kod noto'g'ri bo'lsa
            return Response({
                'error': 'Tasdiqlash linki yaroqsiz yoki muddati o\'tgan. Iltimos qayta ro\'yxatdan o\'tishga harakat qiling. Tizim sizga yangi tasdiqlash link yuboradi!'
            }, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetRequestView(APIView):
    """Email kiritilganda link yuboruvchi View"""
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            user = User.objects.filter(email=email).first()
            if user:
                send_password_reset_email(user, request)
                return Response({'message': 'Emailingizga parolni qayta tiklash uchun link yuborildi! Iltimos, Emailingizni tekshiring!'})
            return Response({'message': 'Tizimda bunday email topilmadi. Iltimos, oldin ro\'yxatdan o\'ting!'})
        return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)

class PasswordResetConfirmView(APIView):
    """Parolni qayta tiklash uchun ruxsat beruvchi link bosilganda ishlaydigan View"""
    permission_class = (permissions.AllowAny,)

    def post(self, request, uidb64, token):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if serializer.is_valid():
            try:
                uid = force_str(urlsafe_base64_decode(uidb64))
                user = User.objects.get(pk=uid)
            except (TypeError, ValueError, OverflowError, User.DoesNotExist):
                user = None

            if user is not None and default_token_generator.check_token(user, token):
                # Yangi parolni o'rnatamiz
                user.set_password(serializer.validated_data['new_password'])
                user.save()
                send_password_change_notification(user)
                return Response({'message': 'Parol muvaffaqqiyatli o\'zgartirildi!'}, status=status.HTTP_200_OK)
            return Response({'error': 'Link yaroqsiz yoki muddati tugagan. Iltimos yana urinib ko\'ring!'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CurrentUserView(generics.RetrieveAPIView):
    """Hozirgi login qilgan foydalanuvchini aniqlash uchun"""
    serializer_class = UserShortSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class CurrentUserView(generics.RetrieveUpdateAPIView):
    """
    Login qilgan foydalanuvchi ma'lumotlarini olish va yangilash
    """
    serializer_class = UserProfileUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # Bu so'rov yuborgan foydalanuvchini qaytaradi (Token orqali aniqlanadi)
        return self.request.user