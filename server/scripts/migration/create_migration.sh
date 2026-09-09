#!/bin/bash

read -p "Enter the name of the migration: " migrationName

npx typeorm migration:create ./src/migrations/$migrationName
