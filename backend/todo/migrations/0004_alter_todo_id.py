# Generated by Django 3.2.8 on 2021-10-11 00:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('todo', '0003_auto_20211009_1255'),
    ]

    operations = [
        migrations.AlterField(
            model_name='todo',
            name='id',
            field=models.BigAutoField(primary_key=True, serialize=False),
        ),
    ]