from rest_framework import serializers
#API
#追加
from .models import Todo, Project
from drf_writable_nested.serializers import WritableNestedModelSerializer

class TodoSerializers(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = ('id', 'title','category','description','completed','startDate', 'endDate', 'priority', 'emergency', 'project')

class ProjectSerializers(WritableNestedModelSerializer):
    todo = TodoSerializers(many=True, required=False, allow_null=True)
    class Meta:
        model = Project
        fields = ('id', 'projectName', 'overview', 'deadline', 'completed', 'todo')
        #project = models.ForeignKey(Project, on_delete=models.CASCADE, default='fire', related_name='todo')