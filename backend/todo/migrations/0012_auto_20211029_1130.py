# Generated by Django 3.2.8 on 2021-10-29 11:30

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('todo', '0011_remove_project_overview'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='overview',
            field=models.TextField(max_length=20, null=True),
        ),
        migrations.AlterField(
            model_name='todo',
            name='project',
            field=models.ForeignKey(default='fire', on_delete=django.db.models.deletion.CASCADE, related_name='todo', to='todo.project'),
        ),
    ]
