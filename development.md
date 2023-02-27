# Development setup

**THESE INSTRUCTIONS ARE FOR DEVELOPMENT, NOT PRODUCTION**

Tested on Ubuntu 22.04

### Install asdf

**THESE INSTRUCTIONS ARE FOR DEVELOPMENT, NOT PRODUCTION**

This project contains a `.tool-versions` for the [asdf](https://asdf-vm.com/) version manager. So it's recommended to
use `asdf` for Node.js and yarn installation.  

- Install asdf
  - Ubuntu 22.04
    - [Download asdf](https://asdf-vm.com/guide/getting-started.html#_2-download-asdf)
    - [Load asdf in Bash](https://asdf-vm.com/guide/getting-started.html#_3-install-asdf)
- Install asdf plugins:
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
