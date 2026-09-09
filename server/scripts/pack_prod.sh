#!/bin/sh 

FILE_NAME=server.zip
USER=ec2-user
DIR=/home/$USER/server

# Build the server
yarn build

# Zip the server folder
zip -r $FILE_NAME dist package.json ecosystem.config.js tsconfig.json src/

echo "Server Packed successfully"


