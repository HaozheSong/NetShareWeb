from django.urls import path

from . import views

# frontend -> backend -> usage
# /dashboard/task/ -> POST /api/task/create/  -> create new example
# /dashboard/task/ -> GET /api/task/read/all/ -> get all examples
# /dashboard/task/log/?<example_id> -> GET /api/task/read/log/?<example_id> -> log of example_id
# /dashboard/task/result/?<example_id>/ -> GET /api/task/read/result/?<example_id> -> result json of example_id
# /dashboard/task/result/?<example_id>/ -> GET /api/task/read/result/?<example_id>&<file_name> -> result images of example_id

# PUT /api/task/update/ -> update example status

urlpatterns = [
    # prefix /api/task
    path('create/', views.create_task, name='create_task'),
    path('read/all/', views.read_all_tasks, name='read_all_tasks'),
    path('read/log/', views.read_log, name='read_task_log'),
    path('update/', views.update, name='update_task'),
    path('read/result/', views.read_result, name='read_task_result'),
]
