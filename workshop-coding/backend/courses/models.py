from django.db import models


class Course(models.Model):
    LEVELS = [('Pemula', 'Pemula'), ('Menengah', 'Menengah'), ('Lanjutan', 'Lanjutan')]

    title = models.CharField(max_length=160)
    description = models.TextField()
    instructor = models.CharField(max_length=120)
    level = models.CharField(max_length=20, choices=LEVELS, default='Pemula')
    duration = models.PositiveIntegerField(help_text='Durasi dalam jam')
    students = models.PositiveIntegerField(default=0)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    accent = models.CharField(max_length=20, default='teal')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title
