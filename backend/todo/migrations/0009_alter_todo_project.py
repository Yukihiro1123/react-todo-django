# Generated by Django 3.2.8 on 2021-10-29 09:17

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('todo', '0008_alter_todo_category'),
    ]

    operations = [
        migrations.AlterField(
            model_name='todo',
            name='project',
            field=models.ForeignKey(default='fire', on_delete=django.db.models.deletion.CASCADE, to='todo.project'),
        ),
    ]
