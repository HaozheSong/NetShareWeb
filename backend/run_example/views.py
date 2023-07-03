from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import grpc
from . import example_pb2, example_pb2_grpc
from backend.config import ML_SERVER

counter = 0
MOCK_TEST = True


@csrf_exempt
def index(request):
    channel = grpc.insecure_channel(f"{ML_SERVER['IP']}:{ML_SERVER['PORT']}")
    stub = example_pb2_grpc.RunExampleStub(channel)
    if request.method == "POST":
        if MOCK_TEST:
            resp = {
                'exampleId': 1,
                'isCompleted': False,
                'message': 'POST request to start example\n'
            }
        elif not MOCK_TEST:
            start_request = example_pb2.Example(
                example_id=1, example_name='netflow'
            )
            start_response = stub.Start(start_request)
            resp = {
                'exampleId': start_response.example_id,
                'isCompleted': start_response.is_completed,
                'message': start_response.message
            }
        return JsonResponse(resp)
    if request.method == "GET":
        if MOCK_TEST:
            global counter
            if counter >= 0:
                is_completed = False
                counter += 1
            else:
                is_completed = True
                counter = 0
            resp = {
                'exampleId': 1,
                'isCompleted': is_completed,
                'message': f'[{counter}] GET request to query example status\n'
            }
        elif not MOCK_TEST:
            query_request = example_pb2.Example(
                example_id=1, example_name='netflow'
            )
            query_response = stub.QueryStatus(query_request)
            resp = {
                'exampleId': query_response.example_id,
                'isCompleted': query_response.is_completed,
                'message': query_response.message
            }
        return JsonResponse(resp)
