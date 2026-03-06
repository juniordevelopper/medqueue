from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from django.utils import timezone

def send_activation_email(user, request):
    """
    Foydalanuvchiga faollashtirish linkini yuborish funksiyasi.
    """
    # request.get_host() odatda "ip:port" qaytaradi, bizga faqat IP kerak
    ip_address = request.get_host().split(':')[0]
    
    # React portini o'zgaruvchiga olamiz
    frontend_port = "5173"

    # 1. Token va ID ni kodlash (yashirin kod yasash)
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))

    # 2. Faollashtirish linki (React sahifasiga yo'naltiriladi)
    # Local tarmoqda ishlash uchun 'http://127.0.0.1:5173' (React porti)
    # activation_link = f'http://localhost:5173/activate/{uid}/{token}/'
    activation_link = f'http://{ip_address}:{frontend_port}/activate/{uid}/{token}/'

    # 3. HTML xatni tayyorlash
    context = {
        'full_name': user.full_name,
        'activation_link': activation_link,
    }
    html_content = render_to_string('email/activation_email.html', context)
    text_content = strip_tags(html_content) # HTMLni o'qiy olmaydigan brauzerlar uchun oddiy matn

    # 4. Email yuborish
    email = EmailMultiAlternatives(
        subject='MedQueue - Accountni faollashtirish',
        body=text_content,
        from_email='MedQueue <medqueue@gmail.com>', # Ismni medqueue ko'rsatish
        to=[user.email],
    )
    email.attach_alternative(html_content, 'text/html')
    email.send()

def send_password_reset_email(user, request):
    """Parolni tiklash html yuborish"""
    # request.get_host() odatda "ip:port" qaytaradi, bizga faqat IP kerak
    ip_address = request.get_host().split(':')[0]
    
    # React portini o'zgaruvchiga olamiz
    frontend_port = "5173"
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))

    # Hozircha to'g'ridan to'g'ri backendga yuboramiz.(Test uchun)
    reset_link = f'http://{ip_address}:{frontend_port}/password-reset-confirm/{uid}/{token}/'

    # HTML shablon tayyorlash
    context = {
        'full_name': user.full_name,
        'reset_link': reset_link,
    }
    html_content = render_to_string('email/password_reset_email.html', context)
    text_content = strip_tags(html_content) # Oddiy matn ko'rinishi

    email = EmailMultiAlternatives(
        subject='MedQueue - Parolni tiklash so\'rovi',
        body=text_content,
        from_email='MedQueue <medqueue@gmail.com>',
        to=[user.email],
    )
    email.attach_alternative(html_content, 'text/html')
    email.send()

def send_welcome_congrats(user, request):
    """Muvaffaqiyatli tasdiqlashdan keyin tabrik xati"""
    context = {
        'full_name': user.full_name,
        'current_time': timezone.now().strftime("%Y-%m-%d %H:%M"),
        'user_email': user.email
    }
    html_content = render_to_string('email/welcome_congrats.html', context)
    text_content = strip_tags(html_content)
    
    email = EmailMultiAlternatives(
        subject="MedQueue oilasiga xush kelibsiz!",
        body=text_content,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[user.email],
    )
    email.attach_alternative(html_content, "text/html")
    email.send()

def send_password_change_notification(user):
    """Parol o'zgarganda xabardor qilish"""
    # Hozirgi vaqtni chiroyli formatda olish
    current_time = timezone.now().strftime("%Y-%m-%d %H:%M")
    
    context = {
        'full_name': user.full_name,
        'current_time': current_time
    }
    html_content = render_to_string('email/password_changed_notify.html', context)
    text_content = strip_tags(html_content)
    
    email = EmailMultiAlternatives(
        subject="Xavfsizlik: Parolingiz o'zgartirildi",
        body=text_content,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[user.email],
    )
    email.attach_alternative(html_content, "text/html")
    email.send()