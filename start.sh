#!/bin/bash

echo "Stopping existing containers..."
docker-compose down

echo "Building and starting parrot containers..."
cp -R ./web-app/dist/. ./nginx/public/
docker-compose up --build --force-recreate -d

echo "Attaching to logs..."
docker-compose logs -f