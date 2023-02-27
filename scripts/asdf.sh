#!/usr/bin/env bash
# Add ~/.local/bin to PATH
if [ ! -f ~/.profile ]; then
  echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.profile
else
  grep -qxF 'export PATH="$HOME/.local/bin:$PATH"' ~/.profile || echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.profile
fi
if [ ! -f ~/.bashrc ]; then
  echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
else
  grep -qxF 'export PATH="$HOME/.local/bin:$PATH"' ~/.bashrc || echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
fi
# Install asdf
[ ! -d ~/.asdf ] && git clone https://github.com/asdf-vm/asdf.git ~/.asdf --branch v0.10.2
grep -qxF 'source $HOME/.asdf/asdf.sh' ~/.profile || echo 'source $HOME/.asdf/asdf.sh' >> ~/.profile
grep -qxF 'source $HOME/.asdf/asdf.sh' ~/.bashrc || echo 'source $HOME/.asdf/asdf.sh' >> ~/.bashrc
source "$HOME/.profile"
# Install nodejs
asdf list nodejs || asdf plugin add nodejs https://github.com/asdf-vm/asdf-nodejs.git
# Install yarn
asdf list yarn || asdf plugin add yarn https://github.com/twuni/asdf-yarn
asdf install
