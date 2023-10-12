# Generated by Django 4.2.2 on 2023-10-12 02:54

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Task',
            fields=[
                ('task_id', models.BigAutoField(primary_key=True, serialize=False)),
                ('task_kind', models.CharField(max_length=256)),
                ('task_name', models.CharField(max_length=256)),
                ('log_file_name', models.CharField(max_length=256, null=True)),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('is_completed', models.BooleanField(null=True)),
                ('completed_at', models.DateTimeField(null=True)),
                ('updated_at', models.DateTimeField(default=django.utils.timezone.now)),
            ],
        ),
    ]
