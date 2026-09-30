#!/bin/sh
# Starts the Snackdown LAN server (needs Node.js 18+)
cd "$(dirname "$0")" && exec node server/server.js "$@"
