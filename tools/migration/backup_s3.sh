#!/bin/sh 

TARGET_BUCKET="330day-s3-production"

BACKUP_FOLDER="./temp/$TARGET_BUCKET-all"

for bucket in $(aws s3 ls | awk '{print $3}'); do
    # echo "Backing up: $bucket"

    # Skip not target bucket
    if [ "$bucket" != "$TARGET_BUCKET" ]; then
        # echo "Skipping: $bucket"
        continue
    fi
    echo "Syncing: $bucket"
    mkdir -p "$BACKUP_FOLDER"
    aws s3 sync s3://$bucket "$BACKUP_FOLDER"
done