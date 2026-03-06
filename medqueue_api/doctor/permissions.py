from rest_framework import permissions

class IsDoctorOwner(permissions.BasePermission):
    """Faqat shifokor o'z ma'lumotlarini ma'lumotlarini o'zgartira olishi uchun permission"""
    def has_objects_permission(self, request, view, obj):
        if reqeust.method in permissions.SAFE_METHODS:
            return True
        return obj.user == request.user