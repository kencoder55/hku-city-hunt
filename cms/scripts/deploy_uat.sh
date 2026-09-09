#!/bin/sh
set -e

# Deploy Next.js CMS to Lightsail UAT.
# Usage: ./scripts/deploy_uat.sh
# Optional: UAT_HOST=x.x.x.x UAT_USER=ec2-user ./scripts/deploy_uat.sh

SERVER_IP=carelab.mosaicdigi.com
USER=ec2-user
FILE_NAME=cms.zip
DIR=/home/$USER/cms
INBOX=/home/$USER/inbox

APP_ROOT="$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)"
cd "$APP_ROOT"

echo "Building CMS (uat)"
yarn build:uat

echo "Packing $FILE_NAME"
rm -f "$FILE_NAME"
ZIP_ITEMS=".next public package.json ecosystem.config.js next.config.mjs messages .env.uat jsconfig.json"
if [ -f yarn.lock ]; then
  ZIP_ITEMS="$ZIP_ITEMS yarn.lock"
fi
# shellcheck disable=SC2086
zip -r "$FILE_NAME" $ZIP_ITEMS -x ".next/cache/*" ".next/dev/*"

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
echo "UAT CMS deploy completed ($SERVER_IP)"
