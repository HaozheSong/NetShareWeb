import json
from pathlib import Path

from django.http import HttpResponse, JsonResponse, FileResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone

import grpc
from task import task_pb2, task_pb2_grpc

from config import ML_SERVER
from task.models import Task

# results_dir = backend/task/results
results_dir = Path(__file__).parent.joinpath('results')


def create_task(request):
    """
    /api/task/create/
    """
    channel = grpc.insecure_channel(f"{ML_SERVER['IP']}:{ML_SERVER['PORT']}")
    stub = task_pb2_grpc.TaskStub(channel)
    if request.method == 'POST':
        dataset_file = request.FILES['dataset']
        config_file = request.FILES['config']
        task = Task(task_kind='customized',
                    task_name='to be synced')
        task.save()
        # TODO: not elegant
        grpc_requests = []
        dataset_iterator = dataset_file.chunks(chunk_size=1024)
        config_iterator = config_file.chunks(chunk_size=1024)
        while True:
            dataset_chunk = next(dataset_iterator, None)
            config_chunk = next(config_iterator, None)
            if dataset_chunk is None and config_chunk is None:
                break
            else:
                grpc_request = task_pb2.StartingTask(
                    task_id=task.task_id,
                    task_kind='customized',
                    created_at=task.created_at.strftime('%Y%m%d_%H%M%S'),
                    dataset_file_name=dataset_file.name,
                    dataset_file_content=dataset_chunk,
                    config_file_name=config_file.name,
                    config_file_content=config_chunk
                )
                grpc_requests.append(grpc_request)
        grpc_response = stub.StartTask(iter(grpc_requests))
        task.task_name = grpc_response.task_name
        task.is_completed = False
        task.updated_at = timezone.now()
        task.save()
        json_response = {
            'task_id': grpc_response.task_id,
            'is_successful': grpc_response.is_successful,
        }
        return JsonResponse(json_response)


def read_log(request):
    """
    /api/task/read/log/?<task_id>
    """
    try:
        task_id = int(request.GET['task_id'])
        task = Task.objects.get(pk=task_id)
    except KeyError:
        return HttpResponse('Query param example_id is required', status=400)
    except Task.DoesNotExist:
        return HttpResponse(f"Example with example_id {request.GET['example_id']} does not exist", status=400)

    task_result_dir = results_dir.joinpath(task.task_name)
    task_log_file = task_result_dir.joinpath('stdout_stderr.log')
    if task_log_file.is_file():
        json_response = {
            'task_id': task_id,
            'task_name': task.task_name,
            'is_completed': task.is_completed,
            'log_file_name': task.log_file_name,
            'log_file_content': None
        }
        with open(task_log_file) as task_log_fd:
            json_response['log_file_content'] = task_log_fd.read()
        return JsonResponse(json_response)
    
    channel = grpc.insecure_channel(
        f"{ML_SERVER['IP']}:{ML_SERVER['PORT']}")
    stub = task_pb2_grpc.TaskStub(channel)
    grpc_request = task_pb2.RunningTask(
        task_id=task_id,
        task_name=task.task_name,
    )
    grpc_response = stub.QueryStatus(grpc_request)
    json_response = {
        'task_id': grpc_response.task_id,
        'task_name': grpc_response.task_name,
        'is_completed': grpc_response.is_completed,
        'log_file_name': grpc_response.log_file_name,
        'log_file_content': grpc_response.log_file_content
    }
    task.log_file_name = grpc_response.log_file_name
    task.save()
    return JsonResponse(json_response)


def read_all_tasks(request):
    """
    /api/task/read/all/
    """
    json_array = []
    all_tasks = Task.objects.all()
    for task in all_tasks:
        json_array.append(task.to_json_obj())
    return JsonResponse(json_array, safe=False)


@csrf_exempt
def update(request):
    """
    /api/task/update/
    """
    if request.method == 'PUT':
        request_json = json.loads(request.body)
        task = Task.objects.get(pk=request_json['task_id'])
        task.is_completed = request_json['is_completed']
        now = timezone.now()
        task.completed_at = now
        task.updated_at = now
        task.save()

        task_result_dir = results_dir.joinpath(task.task_name)
        task_result_dir.mkdir(parents=True)

        channel = grpc.insecure_channel(
            f"{ML_SERVER['IP']}:{ML_SERVER['PORT']}"
        )
        stub = task_pb2_grpc.TaskStub(channel)
        grpc_request = task_pb2.CompletedTask(
            task_id=task.task_id,
            task_name=task.task_name,
        )
        for grpc_response in stub.GetResult(grpc_request):
            file_path = task_result_dir.joinpath(
                grpc_response.file_name
            )
            with open(file_path, 'wb') as file:
                file.write(grpc_response.file_content)
        return HttpResponse('success')


def read_result(request):
    """
    /api/task/read/result/?<task_id>
    /api/task/read/result/?<task_id>&<file_name>
    """
    try:
        task_id = int(request.GET['task_id'])
        task = Task.objects.get(pk=task_id)
    except KeyError:
        return HttpResponse('Query param example_id is required', status=400)
    except Task.DoesNotExist:
        return HttpResponse(f"Example with example_id {request.GET['example_id']} does not exist", status=400)

    task_result_dir = results_dir.joinpath(task.task_name)
    file_name = request.GET.get('file_name', None)
    if file_name is None:
        result_json = task_result_dir.joinpath('result.json')
        with open(result_json) as json_file:
            return JsonResponse(json.load(json_file))
    else:
        for file in task_result_dir.iterdir():
            if (file.name == file_name):
                return FileResponse(open(file, 'rb'))
        return HttpResponse(f'{file_name} does not exist', status=404)
