from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def index(request):
    if request.method == "POST":
        resp = {
            'exampleId': 1,
            'isCompleted': False,
            'message': ''
        }
        return JsonResponse(resp)
