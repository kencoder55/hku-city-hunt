#!/bin/sh
set -e

# Deploy Next.js web to Lightsail UAT.
# Usage: ./scripts/deploy_uat.sh
# Optional: UAT_HOST=x.x.x.x UAT_USER=ec2-user ./scripts/deploy_uat.sh

SERVER_IP=carelab.mosaicdigi.com
USER=ec2-user
FILE_NAME=web.zip
DIR=/home/$USER/web
INBOX=/home/$USER/inbox

APP_ROOT="$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)"
cd "$APP_ROOT"

echo "Building web (uat)"
yarn build:uat

echo "Packing $FILE_NAME"
rm -f "$FILE_NAME"
zip -r "$FILE_NAME" .next public package.json yarn.lock ecosystem.config.js next.config.mjs messages .env.uat jsconfig.json -x ".next/cache/*" ".next/dev/*"

echo "Uploading to $USER@$SERVER_IP"
ssh "$USER@$SERVER_IP" "mkdir -p $INBOX $DIR"
scp "$FILE_NAME" "$USER@$SERVER_IP:$INBOX/"

echo "Installing and reloading PM2"
ssh "$USER@$SERVER_IP" << EOF
set -e
export PATH="/usr/local/bin:/usr/bin:\$PATH"
rm -rf $DIR/.next
unzip -o $INBOX/$FILE_NAME -d $DIR
cd $DIR
cp -f .env.uat .env.production
yarn install
pm2 startOrReload ecosystem.config.js --update-env
pm2 save
EOF

rm -f "$FILE_NAME"
echo "UAT web deploy completed ($SERVER_IP)"
