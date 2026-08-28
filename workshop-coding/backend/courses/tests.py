from rest_framework import status
from rest_framework.test import APITestCase
from .models import Course


class CourseApiTests(APITestCase):
    def setUp(self):
        self.url = '/api/courses/'
        self.course = Course.objects.create(
            title='Python untuk Data', description='Belajar Python.', instructor='Ayu',
            level='Pemula', duration=8, price=299000,
        )

    def test_get_courses(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_post_put_patch_delete_course(self):
        created = self.client.post(self.url, {
            'title': 'React Modern', 'description': 'Belajar React.', 'instructor': 'Bima',
            'level': 'Menengah', 'duration': 10, 'students': 12, 'price': '399000', 'accent': 'coral',
        }, format='json')
        self.assertEqual(created.status_code, status.HTTP_201_CREATED)
        course_url = f"{self.url}{created.data['id']}/"
        updated = self.client.put(course_url, {
            'title': 'React Modern Updated', 'description': 'Materi baru.', 'instructor': 'Bima',
            'level': 'Menengah', 'duration': 12, 'students': 20, 'price': '449000', 'accent': 'coral',
        }, format='json')
        self.assertEqual(updated.status_code, status.HTTP_200_OK)
        patched = self.client.patch(course_url, {'students': 25}, format='json')
        self.assertEqual(patched.status_code, status.HTTP_200_OK)
        deleted = self.client.delete(course_url)
        self.assertEqual(deleted.status_code, status.HTTP_204_NO_CONTENT)
