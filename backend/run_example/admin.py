from django.contrib import admin

from .models import Example


class ExampleAdmin(admin.ModelAdmin):
    field_names = []
    for field in Example._meta.get_fields():
        field_names.append(field.name)
    list_display = (field_names)


admin.site.register(Example, ExampleAdmin)
