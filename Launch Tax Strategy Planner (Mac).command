#!/bin/bash
# Tax Strategy Planner - Mac launcher.
# Opens the app in its own window (Chrome or Edge app mode); falls back to the
# default browser. Works from any folder. Nothing to install.
DIR="$(cd "$(dirname "$0")" && pwd)"
URL="file://${DIR// /%20}/index.html"

if [ -d "/Applications/Google Chrome.app" ]; then
  open -na "Google Chrome" --args --app="$URL"
elif [ -d "/Applications/Microsoft Edge.app" ]; then
  open -na "Microsoft Edge" --args --app="$URL"
else
  open "$DIR/index.html"
fi
