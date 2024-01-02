# Deployment
## Backend
### Create Virtual Environment
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Change config.py
Rename `config_template.py` in `backend/config_template.py` to `config.py`

Change variable values in `config.py`

### Django Checklist
Rename `settings_template.py` of `backend/backend/settings_template.py` to `settings.py`
Fix warnings listed by the following command
```bash
python manage.py check --deploy
```

### Start Gunicorn Backend Server with Systemd
Rename `gunicorn_template.service` of `backend/gunicorn_template.service` to `gunicorn.service`

Change `<NetShareWeb>` in `gunicorn.service` to the correct path

Copy systemd unit file to system configuration directory and start the service
```bash
sudo cp gunicorn.service /etc/systemd/system/gunicorn.service
sudo systemctl start gunicorn
sudo systemctl enable gunicorn

sudo systemctl status gunicorn
```
Backend server is running on port 8000

## Frontend
### (OPTIONAL) Install NodeJS 18.16.0
Install nvm

Follows the instructions after running this command
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
```
Install NodeJS with nvm
```bash
nvm install 18.16.0
```
### Install Dependencies
```bash
cd frontend
npm install
```
### Start NextJS Frontend Server with pm2
```
npm install -g pm2
pm2 start pm2.config.js
```
Frontend is running on port 3000
##  NGINX
Install NGINX
```bash
sudo apt update
sudo apt install nginx
```
Rename `netshareweb_template.conf` of `nginx/netshareweb_template.conf` to `netshareweb.conf`

Change variables wrapped with `<>` in `gunicorn_nginx.conf` to the correct value

HTTPS certificates can be placed in the `nginx/` directory

Copy NGINX configuration file to the NGINX directory and reload NGINX
```bash
sudo cp netshareweb.conf /etc/nginx/conf.d/netshareweb.conf
sudo nginx -s reload
```