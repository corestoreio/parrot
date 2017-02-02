#!/bin/bash

script_dir="${0%/*}"
cd $script_dir

API_ADDRESS=https://localhost/api/v1

display_usage() { 
	echo -e "buildweb installs depenencies and builds the web app for Parrot.\n" 
	echo -e "Usage:"
	echo -e "\t./buildweb.sh [flag] [value]\n"
	echo -e "The flags are:"
	echo -e "\n\t-api | --api-address\tthe address where the Parrot API is localed."
	echo -e "\tExample: ./buildweb.sh -api http://localhost:8080"
	echo -e "\n"
} 

if [  $# -eq 1 ] 
then 
    display_usage
    exit 1
fi 

while [[ $# -gt 1 ]]
do

key="$1"
case $key in
    -h|--help)
        display_usage
        exit 1
    ;;
    -api|--api-address)
    API_ADDRESS="$2"
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

/bin/bash ./../web-app/scripts/build.sh -api $API_ADDRESS && \
    echo "Copying web-app distribution to nginx for static serving..." && \
    rm -rf ./../nginx/public && mkdir ./../nginx/public && \
    cp -rf ./../web-app/dist/* ./../nginx/public