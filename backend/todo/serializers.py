from rest_framework import serializers
from .models import Todo

class TodoSerializers(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = ('id', 'title','category','description','completed','startDate', 'endDate', 'priority', 'emergency')