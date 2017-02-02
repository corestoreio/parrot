#!/bin/bash

API_ADDRESS=https://localhost/api/v1

while [[ $# -gt 1 ]]
do

key="$1"

case $key in
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

script_dir="${0%/*}"
cd $script_dir/.. && \
    echo "Installing dependencies, this might take a few minutes..." && \
    npm install && \

    echo "Configuring build..." && \
    sed 's~{{API_ADDRESS}}~'$API_ADDRESS'~g' app.config.ts.tmpl > ./src/app/app.config.ts && \

    echo "Building web app..." && \
    npm run build && \
    echo 0
