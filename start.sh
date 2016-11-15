#!/bin/bash

echo "Starting Parrot containers..."
docker-compose up -d
docker exec parrot_api_1 pgmgr db create
docker exec parrot_api_1 pgmgr db migrate
docker-compose logs -f