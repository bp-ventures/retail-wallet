#!/usr/bin/env bash
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
cd "$SCRIPT_DIR"
cd ..
[ -r "$HOME/.profile" ] && source "$HOME/.profile"
asdf exec npm install
asdf exec npx pm2 del pm2.json
asdf exec npm run build
asdf exec npx pm2 start pm2.json
