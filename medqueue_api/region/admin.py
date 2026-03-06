from django.contrib import admin
from .models import Region

@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    list_disolay = ('name',)
    search_fields = ('name',)
    list_filter = ('created_at',)