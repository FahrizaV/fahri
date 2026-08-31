from django.contrib import admin
from django.urls import include, path
from courses.views import country_lookup

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('courses.urls')),
    path('api/countries/<str:name>/', country_lookup),
]
