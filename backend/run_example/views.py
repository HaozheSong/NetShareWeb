from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone

import grpc
from . import example_pb2, example_pb2_grpc

from backend.config import ML_SERVER
from run_example.models import Example

counter = 0
MOCK_TEST = False


def utc2local(utc_dt):
    local_dt = timezone.localtime(utc_dt)
    return local_dt.strftime('%Y-%m-%d_%H-%M-%S')


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
                'exampleId': 1,
                'isSuccessful': True,
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
                created_at=utc2local(example.created_at)
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
                'exampleId': grpc_response['example_id'],
                'isSuccessful': grpc_response['is_successful'],
            }
            return JsonResponse(json_response)
    if request.method == 'GET':
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
            try:
                example_id = request.GET['exampleID']
                example = Example.objects.get(pk=example_id)
                query_request = example_pb2.Example(
                    example_id=example_id,
                    example_name=example.example_name
                )
                query_response = stub.QueryStatus(query_request)
                resp = {
                    'exampleID': query_response.example_id,
                    'isCompleted': query_response.is_completed,
                    'message': query_response.message
                }
                return JsonResponse(resp)
            except KeyError:
                return 'Query param exampleID is required'
            except Example.DoesNotExist:
                return f"Example with exampleID {request.GET['exampleID']} does not exist"
