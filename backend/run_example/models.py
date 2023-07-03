from django.db import models
from django.utils import timezone


class Example(models.Model):
    example_id = models.BigAutoField(primary_key=True)
    example_name = models.CharField(max_length=256)
    created_at = models.DateTimeField(default=timezone.now)
    is_completed = models.BooleanField(null=True)
    completed_at = models.DateTimeField(null=True)
    updated_at = models.DateTimeField(null=True)
    log_file_name = models.CharField(null=True, max_length=256)