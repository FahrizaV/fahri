from rest_framework import viewsets
from .models import Course
from .serializers import CourseSerializer


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get('search')
        level = self.request.query_params.get('level')
        if search:
            queryset = queryset.filter(title__icontains=search) | queryset.filter(instructor__icontains=search)
        if level and level != 'Semua level':
            queryset = queryset.filter(level=level)
        return queryset.distinct()
