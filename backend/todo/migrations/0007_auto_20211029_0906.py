# Generated by Django 3.2.8 on 2021-10-29 09:06

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('todo', '0006_auto_20211029_0903'),
    ]

    operations = [
        migrations.AlterField(
            model_name='todo',
            name='endDate',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
        migrations.AlterField(
            model_name='todo',
            name='startDate',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]
