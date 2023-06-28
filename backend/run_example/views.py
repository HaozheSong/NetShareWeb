from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import grpc
from . import example_pb2, example_pb2_grpc

counter = 0


@csrf_exempt
def index(request):
    channel = grpc.insecure_channel('20.106.177.226:50051')
    stub = example_pb2_grpc.RunExampleStub(channel)
    if request.method == "POST":
        # start_request = example_pb2.Example(
        #     example_id=1, example_name='netflow'
        # )
        # start_response = stub.Start(start_request)
        # resp = {
        #     'exampleId': start_response.example_id,
        #     'isCompleted': start_response.is_completed,
        #     'message': start_response.message
        # }
        resp = {
            'exampleId': 1,
            'isCompleted': False,
            'message': 'post\n'
        }
        return JsonResponse(resp)
    if request.method == "GET":
        # query_request = example_pb2.Example(
        #     example_id=1, example_name='netflow'
        # )
        # query_response = stub.QueryStatus(query_request)
        # resp = {
        #     'exampleId': query_response.example_id,
        #     'isCompleted': query_response.is_completed,
        #     'message': query_response.message
        # }
        global counter
        if counter >= 0:
            is_completed = False
        else:
            is_completed = True
        resp = {
            'exampleId': 1,
            'isCompleted': is_completed,
            'message': f'get{counter}\n'
        }
        counter += 1
        return JsonResponse(resp)
