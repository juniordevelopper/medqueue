import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import appointment.routing # Buni hozir yaratamiz

os.environ.setdefault('django.settings.module', 'core.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            appointment.routing.websocket_urlpatterns
        )
    ),
})
