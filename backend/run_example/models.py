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

    def get_attr_dict(self):
        attr_dict = {}
        all_fields = Example._meta.get_fields()
        for field in all_fields:
            attr_key = field.name
            attr_value = getattr(self, attr_key)
            attr_dict[attr_key] = attr_value
        return attr_dict

    def __str__(self):
        to_str = ''
        attr_dict = self.get_attr_dict()
        for key, value in attr_dict.items():
            to_str += f'\n{key}:\t{value}'
        to_str += '\n'
        return to_str

    def to_json_obj(self):
        return self.get_attr_dict()
