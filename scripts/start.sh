#!/bin/bash

script_dir="${0%/*}"
cd $script_dir/..

echo "Stopping existing containers..."
docker-compose down

echo "Building and starting parrot containers..."
docker-compose up --build --force-recreate -d

echo "Attaching to logs..."
docker-compose logs -f