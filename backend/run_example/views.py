from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import grpc
from. import example_pb2, example_pb2_grpc

@csrf_exempt
def index(request):
    channel = grpc.insecure_channel('20.106.177.226:50051')
    stub = example_pb2_grpc.RunExampleStub(channel)
    if request.method == "POST":
        start_request = example_pb2.Example(example_id=1, example_name='netflow')
        start_response = stub.Start(start_request)
        resp = {
            'exampleId': start_response.example_id,
            'isCompleted': start_response.is_completed,
            'message': start_response.message
        }
        return JsonResponse(resp)
