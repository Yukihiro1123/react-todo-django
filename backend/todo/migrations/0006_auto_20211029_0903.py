# Generated by Django 3.2.8 on 2021-10-29 09:03

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('todo', '0005_auto_20211029_0854'),
    ]

    operations = [
        migrations.AlterField(
            model_name='todo',
            name='endDate',
            field=models.DateTimeField(default=datetime.datetime(2021, 10, 29, 9, 3, 40, 741615, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='todo',
            name='startDate',
            field=models.DateTimeField(default=datetime.datetime(2021, 10, 29, 9, 3, 40, 741596, tzinfo=utc)),
        ),
    ]
