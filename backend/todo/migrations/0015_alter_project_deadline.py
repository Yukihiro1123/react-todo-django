# Generated by Django 3.2.8 on 2021-10-31 02:27

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('todo', '0014_alter_project_deadline'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='deadline',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]
