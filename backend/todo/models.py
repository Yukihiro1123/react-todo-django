from django.db import models
from datetime import date
from django.utils import timezone
# Create your models here.
class Todo(models.Model):
    GENRE_CHOICES = (
        (1, 'Work'),
        (2, 'Event'),
        (3, 'Appointment'),
        (4, 'Habit'),
    )
    LEVEL_CHOICES = (
        (1, 'Low'),
        (2, 'Medium'),
        (3, 'High'),
    )
    title = models.CharField(max_length=20)
    category = models.CharField(max_length=20, choices=GENRE_CHOICES)
    description = models.TextField(max_length=1000)
    completed = models.BooleanField(default=False)
    startDate = models.DateTimeField(default=date.today)
    endDate = models.DateTimeField(default=date.today)
    #緊急度
    emergency = models.IntegerField(choices=LEVEL_CHOICES, default=1)
    #重要度
    priority = models.IntegerField(choices=LEVEL_CHOICES, default=1)
    def __str__(self):
        return self.title