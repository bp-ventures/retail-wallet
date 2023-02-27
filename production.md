# Production deployment

Tested on Ubuntu 22.04.  

## (Optional but recommended) Create a non-privileged user for the app

Since running programs as **root** is something to be avoided, we recommend
creating a non-privileged user to run this app:
```
sudo useradd -m -U --shell /bin/bash clpx-dashboard
```

Login as the user:
```
su clpx-dashboard
```

Clone the repo:
```
git clone <repo url> clpx-dashboard
cd clpx-dashboard
```

## Create and adjust local .env
```
cp .env.production .env.local
edit .env.local
```

## Install asdf

```
source scripts/asdf.sh
```

## Run deploy.sh
```
# In summary, deploy.sh does:
# - Configures your .bashrc and .profile
# - Installs all dependencies
# - Starts the server using PM2
./scripts/deploy.sh

The app will run in port `3001` by default, you can customize it by editing the `pm2.json` file.
```

## Auto start on boot

To start the server automatically on boot, run `crontab -e` and add this to the bottom of the file:
```
# make sure to replace /home/clpx-dashboard/clpx-dashboard with the repository path in your system
@reboot /home/clpx-dashboard/clpx-dashboard/scripts/start.sh
```

## Updating

```bash
git pull
./scripts/deploy.sh
```

## Maintenance commands

The below commands can be used for maintenance:
```bash
./deploy.sh  # should always be executed after updating the code (git pull)
./start.sh  # start the server
./stop.sh  # stop the server
npx pm2 status  # display server status
npx pm2 logs CLPX-next  # display server logs
```