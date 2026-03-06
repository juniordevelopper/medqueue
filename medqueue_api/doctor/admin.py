from django.contrib import admin
from .models import Doctor
from account.models import User

# Register your models here.
@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ('user', 'hospital', 'department', 'specialty', 'room_number')
    list_filter = ('hospital', 'department')
    search_fields = ('user__full_name', 'specialty')

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "user":
            # Faqat bemor, faol va hali doktor bo'lmaganlarni ko'rsatish
            kwargs["queryset"] = User.objects.filter(
                is_patient=True, 
                is_active=True, 
                is_doctor=False,
                is_staff=False
            )
        return super().formfield_for_foreignkey(db_field, request, **kwargs)