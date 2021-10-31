from django.shortcuts import render
from rest_framework import viewsets
from .serializers import TodoSerializers, ProjectSerializers
#
#Projectを追加
from .models import Todo, Project
# Create your views here.
class TodoView(viewsets.ModelViewSet):
    serializer_class = TodoSerializers
    queryset = Todo.objects.all()

#追加
class ProjectView(viewsets.ModelViewSet):
    serializer_class = ProjectSerializers
    queryset = Project.objects.all()