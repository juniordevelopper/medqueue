from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, VerifyEmailView, PasswordResetRequestView, PasswordResetConfirmView, CurrentUserView

urlpatterns = [
    # Ro'yxatdan o'tish uchun path
    path('register/', RegisterView.as_view(), name='register'),

    # Emaildagi tasdiqlash linki bosilganda ishlaydigan url
    path('verify-email/<str:uidb64>/<str:token>/', VerifyEmailView.as_view(), name='verify_email'),

    # Login (SimpleJWT tayyor URL-lari)
    # TokenObtainPairView - email va parol yuborilsa, token qaytaradi
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),

    # Foydalanuvchi profileni tahrirlash
    path('user/me/', CurrentUserView.as_view(), name='current_user'),

    # Tokenni yangilash (muddati tugaganda)
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),   

    # Parolni yangilash uchun ishlatiladi.
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset'),
    path('password-reset-confirm/<str:uidb64>/<str:token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
]