#!/bin/bash

echo "Starting Parrot containers..."
docker-compose up --build -d
docker exec parrot_api_1 pgmgr db create && pgmgr db migrate
docker-compose logs -f