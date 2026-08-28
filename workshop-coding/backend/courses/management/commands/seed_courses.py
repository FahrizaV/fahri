from django.core.management.base import BaseCommand
from courses.models import Course


class Command(BaseCommand):
    help = 'Creates a small demo catalog for local development.'

    def handle(self, *args, **options):
        demo_courses = [
            {'title': 'Python untuk Data', 'description': 'Bangun fondasi analisis data dengan Python.', 'instructor': 'Ayu Lestari', 'level': 'Pemula', 'duration': 8, 'students': 124, 'price': 299000, 'accent': 'teal'},
            {'title': 'React dari Nol', 'description': 'Buat antarmuka modern dengan komponen React.', 'instructor': 'Bima Pratama', 'level': 'Menengah', 'duration': 12, 'students': 86, 'price': 399000, 'accent': 'coral'},
            {'title': 'Design System Praktis', 'description': 'Susun sistem visual yang konsisten dan terukur.', 'instructor': 'Nadia Putri', 'level': 'Lanjutan', 'duration': 6, 'students': 51, 'price': 249000, 'accent': 'violet'},
        ]
        for course in demo_courses:
            Course.objects.get_or_create(title=course['title'], defaults=course)
        self.stdout.write(self.style.SUCCESS('Demo courses are ready.'))
