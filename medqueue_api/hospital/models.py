from django.db import models
from region.models import Region
from department.models import Department

class Hospital(models.Model):
    name = models.CharField(max_length=255, verbose_name='Shifoxona nomi')
    description = models.TextField(verbose_name='Batafsil ma\'lumot')
    address = models.TextField(verbose_name='Manzil')

    # Bog'lanishlar
    region = models.ForeignKey(Region, on_delete=models.CASCADE, related_name='hospitals', verbose_name='Viloyatlar')
    departments = models.ManyToManyField(Department, related_name='hospitals', verbose_name='Mavjud bo\'limlar')

    # Qo'shimcha ma'lumotlar
    estabished_data = models.DateField(verbose_name='Tashkil topgan sana')
    image = models.ImageField(upload_to='hospitals/', verbose_name='Rasmi')
    phone = models.CharField(max_length=20, verbose_name='Telefon raqami')
    email = models.EmailField(verbose_name='Qo\'llab-quvvatlash emaili')

    # Ijtimoiy tarmoqlar
    website = models.URLField(blank=True, null=True, verbose_name='Veb-sayt')
    telegram = models.URLField(blank=True, null=True, verbose_name='Telegram link')
    instagram = models.URLField(blank=True, null=True, verbose_name='Instagram link')

    # Joylashuv ma'lumotlari
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True, verbose_name='Kenglik (Latitude)')
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True, verbose_name='Uzunlik (Longitude)')

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = 'Shifoxona'
        verbose_name_plural = 'Shifoxonalar'