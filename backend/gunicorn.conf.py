import multiprocessing
import os

wsgi_app = 'backend.wsgi:application'
bind = '127.0.0.1:8000'
workers = multiprocessing.cpu_count() * 2 + 1
# daemon = True

accesslog_path = '../log/gunicorn_access.log'
errorlog_path = '../log/gunicorn_error.log'
if not os.path.exists('../log'):
    os.mkdir('../log')
for log in [accesslog_path, errorlog_path]:
    if not os.path.exists(log):
        f = open(log, 'w')
        f.close()

accesslog = accesslog_path
errorlog = errorlog_path
capture_output = True