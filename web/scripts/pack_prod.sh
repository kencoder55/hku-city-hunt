#!/bin/sh

FILE_NAME=web.zip
FOLDER_NAME=web

## Catch errors
set -e

## Build 
if yarn build:prod; then
    echo "Build successful"
else
    echo "Build failed, deployment failed!"
    exit 1
fi

## ZIP
if zip -r $FILE_NAME .next static package.json yarn.lock ecosystem.config.js next-i18next.config.js next.config.mjs public/ .env.production  -x ".next/cache/*" ".next/dev/*"; then
    echo "Zip successful"
else
    echo "Zip failed, deployment failed!"
    exit 1
fi

done
