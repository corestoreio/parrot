#!/bin/bash

echo "Starting Parrot containers..."
docker-compose up --build -d

echo "Waiting for db to launch..."
while ! nc -z localhost 5432; do   
  sleep 0.2
done

# TODO: move migrations to be handled by api when required 
echo "Migrating if needed..."
docker exec parrot_api_1 pgmgr db migrate

echo "Attaching to logs..."
docker-compose logs -f