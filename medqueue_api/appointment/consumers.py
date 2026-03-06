import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import Appointment
from django.utils import timezone

class QueueConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.doctor_id = self.scope['url_route']['kwargs']['doctor_id']
        self.room_group_name = f'queue_{self.doctor_id}'

        # Guruhga qo'shilish
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()
        
        # Ulanganda darhol joriy holatni yuboramiz
        await self.send_queue_update()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Navbat ma'lumotlarini bazadan olish (Real-time statistikasi)
    async def send_queue_update(self, event=None):
        stats = await self.get_queue_stats()
        await self.send(text_data=json.dumps(stats))

    @sync_to_async
    def get_queue_stats(self):
        today = timezone.now().date()
        appointments = Appointment.objects.filter(doctor_id=self.doctor_id, date=today)
        
        # Hozir kim qabulda?
        current = appointments.filter(status='in_progress').first()
        # Navbatda necha kishi bor?
        waiting_count = appointments.filter(status='waiting').count()
        
        return {
            'current_patient': current.patient.full_name if current else "Hech kim yo'q",
            'waiting_count': waiting_count,
            'total_today': appointments.count(),
            'estimated_wait': waiting_count * 10 # 10 minutdan
        }
