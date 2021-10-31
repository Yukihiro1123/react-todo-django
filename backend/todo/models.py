from django.db import models
from datetime import date
from django.utils import timezone
# Create your models here.

#追加
class Project(models.Model):
    projectName = models.CharField(max_length=10, null=True)
    overview = models.TextField(max_length=20, null=True)
    deadline = models.DateTimeField(default=timezone.now)
    completed = models.BooleanField(default=False)
    def __str__(self):
        return self.projectName

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
    category = models.IntegerField(choices=GENRE_CHOICES)
    description = models.TextField(max_length=1000)
    completed = models.BooleanField(default=False)
    startDate = models.DateTimeField(default=timezone.now)
    endDate = models.DateTimeField(default=timezone.now)
    #重要度
    priority = models.IntegerField(choices=LEVEL_CHOICES, default=1)
    #緊急度
    emergency = models.IntegerField(choices=LEVEL_CHOICES, default=1)
    #追加
    project = models.ForeignKey(Project, on_delete=models.CASCADE, default='fire', related_name='todo')
    #外部キーのrelated_nameがfieldの名前と一致する
    #serializers.py
    # class ProjectSerializers(serializers.ModelSerializer):
    # todo = TodoSerializers(many=True)
    # class Meta:
    #     model = Project
    #     fields = ('id', 'projectName', 'overview', 'todo')

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['title']