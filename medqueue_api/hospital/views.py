from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Hospital
from .serializers import HospitalSerializer

class HospitalListView(generics.ListAPIView):
    serializer_class = HospitalSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Hospital.objects.all().prefetch_related('departments')
        region_id = self.request.query_params.get('region')
        search = self.request.query_params.get('search')

        if region_id:
            queryset = queryset.filter(region_id=region_id)
        if search:
            queryset = queryset.filter(name__icontains=search)
        return queryset