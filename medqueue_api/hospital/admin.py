from django.contrib import admin
from django.utils.html import format_html
from .models import Hospital

@admin.register(Hospital)
class HospitalAdmin(admin.ModelAdmin):
    list_display = ('name', 'region', 'phone', 'display_image')
    list_filter = ('region',)
    search_fields = ('name', 'address')
    filter_horizontal = ('departments',)

    def display_image(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="50" height="50" style="border-radius: 5px; object-fit: cover;" />', obj.image.url)
        return 'Rasm yo\'q'
    display_image.short_description = 'Rasm'