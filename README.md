# Deployment
## Backend
### Create Virtual Environment
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```
### Django Checklist
Rename `settings_template.py` of `backend/backend/settings_template.py` to `settings.py`
Fix warnings listed by the following command
```bash
python manage.py check --deploy
```
### Change config.py
Rename `config_template.py` in `backend/config_template.py` to `config.py`

Change variable values in `config.py`
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

## Start NextJS Frontend Server with pm2
Rename `nextjs_template.service` of `frontend/nextjs_template.service` to `nextjs.service`

Change `<NetShareWeb>` and `<npm>` in `nextjs.service` to the correct path. Use `which npm` to get `<npm>` path.

Copy systemd unit file to system configuration directory and start the service
```bash
sudo cp nextjs.service /etc/systemd/system/nextjs.service
sudo systemctl start nextjs
sudo systemctl enable nextjs

sudo systemctl daemon-reload
sudo systemctl restart nextjs

sudo systemctl status nextjs
```
Frontend server is running on port 3000
##  NGINX
Install NGINX
```bash
sudo apt update
sudo apt install nginx
```
Rename `netshareweb_template.conf` in the root directory to `netshareweb.conf`

Change `<server_name>` and `<NetShareWeb>` in `gunicorn_nginx.conf` to the correct value

Copy NGINX configuration file to the NGINX directory and reload NGINX
```bash
sudo cp netshareweb.conf /etc/nginx/conf.d/netshareweb.conf
sudo nginx -s reload
```