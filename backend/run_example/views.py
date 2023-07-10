from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone

import grpc
from . import example_pb2, example_pb2_grpc

from backend.config import ML_SERVER
from run_example.models import Example

MOCK_TEST = False


@csrf_exempt
def index(request):
    channel = grpc.insecure_channel(f"{ML_SERVER['IP']}:{ML_SERVER['PORT']}")
    stub = example_pb2_grpc.RunExampleStub(channel)
    if request.method == 'POST':
        example_name = request.POST.get('exampleName', 'netflow')
        example = Example(example_name=example_name)
        example.save()
        if MOCK_TEST:
            resp = {
                'example_id': 1,
                'is_successful': True,
            }
            example.log_file_name = 'test'
            example.is_completed = False
            example.updated_at = timezone.now()
            example.save()
            return JsonResponse(resp)
        elif not MOCK_TEST:
            grpc_start_request = example_pb2.StartingExample(
                example_id=example.example_id,
                example_name=example_name,
                created_at=example.created_at.strftime('%Y%m%d_%H%M%S')
            )
            grpc_start_response = stub.Start(grpc_start_request)
            grpc_response = {
                'example_id': grpc_start_response.example_id,
                'is_successful': grpc_start_response.is_successful,
                'log_file_name': grpc_start_response.log_file_name
            }
            example.log_file_name = grpc_response['log_file_name']
            example.is_completed = False
            example.updated_at = timezone.now()
            example.save()
            json_response = {
                'example_id': grpc_response['example_id'],
                'is_successful': grpc_response['is_successful'],
            }
            return JsonResponse(json_response)
    if request.method == 'GET':
        try:
            example_id = int(request.GET['example_id'])
            example = Example.objects.get(pk=example_id)
        except KeyError:
            return 'Query param example_id is required'
        except Example.DoesNotExist:
            return f"Example with example_id {request.GET['example_id']} does not exist"
        if MOCK_TEST:
            json_response = {
                'example_id': example_id,
                'is_completed': example.is_completed,
                'log_file_content': 'test'
            }
            return JsonResponse(json_response)
        elif not MOCK_TEST:
            query_request = example_pb2.RunningExample(
                example_id=example_id,
                example_name=example.example_name,
                log_file_name=example.log_file_name
            )
            query_response = stub.QueryStatus(query_request)
            grpc_response = {
                'example_id': query_response.example_id,
                'example_name': query_response.example_name,
                'is_completed': query_response.is_completed,
                'log_file_name': query_response.log_file_name,
                'log_file_content': query_response.log_file_content
            }
            json_response = {
                'example_id': grpc_response['example_id'],
                'is_completed': grpc_response['is_completed'],
                'log_file_content': grpc_response['log_file_content']
            }
            return JsonResponse(json_response)


def get_all_examples(request):
    json_array = []
    all_examples = Example.objects.all()
    for example in all_examples:
        json_array.append(example.to_json_obj())
    return JsonResponse(json_array, safe=False)
