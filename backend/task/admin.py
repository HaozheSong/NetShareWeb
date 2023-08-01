from django.contrib import admin
from .models import Task


class TaskAdmin(admin.ModelAdmin):
    field_names = []
    for field in Task._meta.get_fields():
        field_names.append(field.name)
    list_display = (field_names)


admin.site.register(Task, TaskAdmin)
