from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    # doctor_id bo'yicha har bir shifokor uchun alohida navbat "xonasi" ochiladi
    re_path(r'ws/queue/(?P<doctor_id>\d+)/$', consumers.QueueConsumer.as_asgi()),
]
