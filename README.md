A reference implementation of a Stellar Investment Dashboard built using Next.js, branded for the CLPX Stellar asset.  
Deployed to [https://clpx.finance](https://clpx.finance).

- [Production deployment](#production-deployment)
- [Development setup](#development-setup)

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

# Development setup

**THESE INSTRUCTIONS ARE FOR DEVELOPMENT, NOT PRODUCTION**

Tested on Ubuntu 20.04

### Install asdf

**THESE INSTRUCTIONS ARE FOR DEVELOPMENT, NOT PRODUCTION**

This project contains a `.tool-versions` for the [asdf](https://asdf-vm.com/) version manager. So it's recommended to
use `asdf` for Node.js and yarn installation.  
First, install `asdf` by following the instructions in the website, then:

```bash
asdf plugin add nodejs https://github.com/asdf-vm/asdf-nodejs.git
asdf plugin add yarn https://github.com/twuni/asdf-yarn 
asdf install
asdf exec yarn
```

## Environment

**THESE INSTRUCTIONS ARE FOR DEVELOPMENT, NOT PRODUCTION**

Create and adjust `.env.local`:
```bash
cp .env.development .env.local
edit .env.local
```

## Install node modules

**THESE INSTRUCTIONS ARE FOR DEVELOPMENT, NOT PRODUCTION**

```bash
npm install
```

## Run server

**THESE INSTRUCTIONS ARE FOR DEVELOPMENT, NOT PRODUCTION**

Run server:
```bash
npm run dev
```
