# Generated by Django 3.2.8 on 2021-10-09 12:55

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('todo', '0002_auto_20211009_1253'),
    ]

    operations = [
        migrations.AlterField(
            model_name='todo',
            name='end_date',
            field=models.DateField(default=datetime.date.today),
        ),
        migrations.AlterField(
            model_name='todo',
            name='start_date',
            field=models.DateField(default=datetime.date.today),
        ),
    ]