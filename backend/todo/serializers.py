from rest_framework import serializers
#API
#追加
from .models import Todo, Project

class TodoSerializers(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = ('id', 'title','category','description','completed','startDate', 'endDate', 'priority', 'emergency', 'project')

class ProjectSerializers(serializers.ModelSerializer):
    todo = TodoSerializers(many=True, read_only=True)
    class Meta:
        model = Project
        fields = ('id', 'projectName', 'overview', 'deadline', 'completed', 'todo')
        #project = models.ForeignKey(Project, on_delete=models.CASCADE, default='fire', related_name='todo')