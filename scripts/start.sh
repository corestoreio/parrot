#!/bin/bash

script_dir="${0%/*}"
cd $script_dir/..

display_usage() { 
	echo -e "start the services for Parrot.\n" 
	echo -e "Usage:"
	echo -e "\t./start.sh [flag] [value]\n"
	echo -e "The flags are:"
	echo -e "\n\t-dbp | --db-port\tthe port that docker will bind the database to"
	echo -e "\tExample: ./start.sh -dbp 5432"
	echo -e "\n"
} 

if [  $# -eq 1 ] 
then 
    display_usage
    exit 1
fi 

DB_PORT=5432

while [[ $# -gt 1 ]]
do
key="$1"

case $key in
    -h|--help)
        display_usage
        exit 1
    ;;
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