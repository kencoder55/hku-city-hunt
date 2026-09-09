#!/bin/sh 
#
# Setup Notes
# 1. install aws cli using brew: `brew install awscli`
# 2. login to aws cli: `aws login`
# 3. test the cli with: `aws s3 ls`

TARGET_DATE=$1
TARGET_BUCKET="330day-s3-production"

if [ -z "$TARGET_DATE" ]; then
    echo "Usage: $0 <target_date>"
    exit 1
fi


BACKUP_FOLDER="./temp/$TARGET_BUCKET-$TARGET_DATE"

# change - to _
# BACKUP_FOLDER=$(echo "$BACKUP_FOLDER" | tr '-' '_')

S3_FOLDER="s3://$TARGET_BUCKET/missions/$TARGET_DATE/"

# echo "Syncing: $TARGET_BUCKET-$TARGET_DATE"
# echo "Sync to Folder: $BACKUP_FOLDER"
# mkdir -p "$BACKUP_FOLDER"
# Create backup folder if not exist
mkdir -p "$BACKUP_FOLDER"

echo "Syncing: $BACKUP_FOLDER"
# ls "$BACKUP_FOLDER"

aws s3 sync $S3_FOLDER $BACKUP_FOLDER

