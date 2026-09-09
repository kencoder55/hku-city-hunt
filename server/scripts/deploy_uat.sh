#!/bin/sh
set -e

# Deploy NestJS API to Lightsail UAT.
# Usage: ./scripts/deploy_uat.sh
# Optional: UAT_HOST=x.x.x.x UAT_USER=ec2-user ./scripts/deploy_uat.sh

SERVER_IP=carelab.mosaicdigi.com
USER="${UAT_USER:-ec2-user}"
FILE_NAME=server.zip
DIR=/home/$USER/server
INBOX=/home/$USER/inbox

APP_ROOT="$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)"
cd "$APP_ROOT"

echo "Building server"
yarn build

echo "Packing $FILE_NAME"
rm -f "$FILE_NAME"
zip -r "$FILE_NAME" dist package.json yarn.lock ecosystem.config.js tsconfig.json nest-cli.json src/

echo "Uploading to $USER@$SERVER_IP"
ssh "$USER@$SERVER_IP" "mkdir -p $INBOX $DIR"
scp "$FILE_NAME" "$USER@$SERVER_IP:$INBOX/"

echo "Installing and reloading PM2"
ssh "$USER@$SERVER_IP" << EOF
set -e
export PATH="/usr/local/bin:/usr/bin:\$PATH"
unzip -o $INBOX/$FILE_NAME -d $DIR
cd $DIR
yarn install
pm2 startOrReload ecosystem.config.js --update-env
pm2 save
EOF

rm -f "$FILE_NAME"
echo "UAT server deploy completed ($SERVER_IP)"
