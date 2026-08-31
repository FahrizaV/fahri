import json
import os
from urllib.error import HTTPError, URLError
from urllib.parse import quote, urlencode
from urllib.request import Request, urlopen

from django.http import JsonResponse
from rest_framework.decorators import api_view
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


@api_view(['GET'])
def country_lookup(request, name):
    api_key = os.getenv('REST_COUNTRIES_API_KEY')
    if not api_key:
        return JsonResponse({'detail': 'REST_COUNTRIES_API_KEY belum dikonfigurasi di backend/.env.'}, status=503)

    params = urlencode({'response_fields': 'names.official,capitals.name,population,region,continents,currencies,flag.url_png,flag.url_svg'})
    url = f'https://api.restcountries.com/countries/v5/names.common/{quote(name)}?{params}'
    try:
        api_request = Request(url, headers={'Authorization': f'Bearer {api_key}', 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0'})
        with urlopen(api_request, timeout=10) as response:
            payload = json.load(response)
    except HTTPError as error:
        if error.code == 404:
            return JsonResponse({'detail': 'Negara tidak ditemukan. Periksa nama negara dan coba lagi.'}, status=404)
        if error.code in (401, 403):
            return JsonResponse({'detail': 'API key REST Countries ditolak atau tidak aktif. Periksa key di dashboard REST Countries.'}, status=502)
        return JsonResponse({'detail': f'Layanan negara gagal ({error.code}).'}, status=502)
    except (URLError, TimeoutError):
        return JsonResponse({'detail': 'Tidak dapat terhubung ke layanan negara. Periksa koneksi internet Anda.'}, status=502)

    if payload.get('errors'):
        return JsonResponse({'detail': payload['errors'][0].get('message', 'Layanan negara mengembalikan error.')}, status=502)
    country = payload.get('data', {}).get('objects', [None])[0]
    if not country:
        return JsonResponse({'detail': 'Negara tidak ditemukan. Periksa nama negara dan coba lagi.'}, status=404)

    return JsonResponse({
        'name': {'official': country.get('names', {}).get('official')},
        'capital': [capital.get('name') for capital in country.get('capitals', [])],
        'population': country.get('population'),
        'region': country.get('region'),
        'continents': country.get('continents'),
        'currencies': country.get('currencies'),
        'flags': {'png': country.get('flag', {}).get('url_png'), 'svg': country.get('flag', {}).get('url_svg')},
    })
