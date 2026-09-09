#!/bin/sh

docker-compose -p "hku-city-hunt" up -d

# Information
echo "Main Sit: http://localhost:9711"
echo "Unit Test: http://localhost:9711/tests"
echo "Database: http://localhost:9712/?server=db&username=root&db=hku_city_hunt_db"
echo "   DB password: 123456"
