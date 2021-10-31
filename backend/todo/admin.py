from django.contrib import admin
from .models import Todo, Project
# Register your models here.
#アドミン画面
# class TodoAdmin(admin.ModelAdmin):
#     list_display = ('title','category','description','completed','startDate', 'endDate','priority', 'emergency', 'project')
# admin.site.register(Todo, TodoAdmin)


#追加
class TodoAdminInline(admin.TabularInline):
    model = Todo

class ProjectAdmin(admin.ModelAdmin):
    inlines = (TodoAdminInline, )
    model = Project
    list_display = ('projectName', 'overview', 'deadline', 'completed')
admin.site.register(Project, ProjectAdmin)
