#!/bin/sh 

RDS_HOST="day330-2026-db.cyn1ucwlzozn.ap-east-1.rds.amazonaws.com"
RDS_PORT=3306
SSH_USER=ec2-user
SSH_HOST=95.40.26.229

# Create SSH tunnel
ssh -L 33306:$RDS_HOST:$RDS_PORT $SSH_USER@$SSH_HOST 