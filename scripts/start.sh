#!/bin/bash

script_dir="${0%/*}"
cd $script_dir/..

DB_PORT=5432

while [[ $# -gt 1 ]]
do
key="$1"

case $key in
    -dbp|--db-port)
    DB_PORT="$2"
    shift # past argument
    ;;
    --default)
    ;;
    *)
    # unknown option
    ;;
esac
shift # past argument or value
done

sed "s/{{DB_PORT}}/$DB_PORT/g" docker-compose.tmpl > docker-compose.yml

echo "Stopping existing containers..."
docker-compose down

echo "Building and starting parrot containers..."
docker-compose up --build --force-recreate -d

echo "Attaching to logs..."
docker-compose logs -f