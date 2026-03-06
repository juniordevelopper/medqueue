from django.urls import path
from .views import AppointmentCreateView, PatientAppointmentsView, DoctorQueueActionView

urlpatterns = [
    path('book/', AppointmentCreateView.as_view(), name='appointment-book'),
    path('my-list/', PatientAppointmentsView.as_view(), name='my-appointments'),
    path('doctor-action/<int:pk>/<str:action>/', DoctorQueueActionView.as_view()),
]
