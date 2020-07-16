#!/bin/bash
# Run the email server and web app

trap 'kill 0' EXIT

echo "Starting up email server and web app"

cd "$(dirname "$0")"

start_angular() 
{
	echo "Starting angular app"
	cd WebApp
	ng serve -o
}

node EmailServer/index.js & start_angular &

wait