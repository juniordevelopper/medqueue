from django.urls import path, include

urlpatterns = [
    path('auth/', include('account.urls')),
    path('regions/', include('region.urls')),
    path('hospitals/', include('hospital.urls')),
    path('doctors/', include('doctor.urls')),
    path('appointments/', include('appointment.urls')),
]