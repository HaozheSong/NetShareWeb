from django.urls import path

from . import views

# frontend -> backend -> usage
# /dashboard/run-example/ -> POST /api/run-example/create  -> create new example
# /dashboard/run-example/ -> GET /api/run-example/read/all/ -> get all examples
# /dashboard/run-example/log/?<example_id> -> GET /api/run-example/read/log/<example_id>/ -> log of example_id
# /dashboard/run-example/result/?<example_id>/ -> GET /api/run-example/read/result/<example_id>/ -> result of example_id
urlpatterns = [
    # prefix /api/run-example
    path('create/', views.create_example, name='create_example'),
    path('read/all/', views.read_all_examples, name='read_all_examples'),
    path('read/log/',views.read_log,name="read_log"),
    # path('read/result/'),
]
