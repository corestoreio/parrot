#!/bin/bash

script_dir="${0%/*}"
cd $script_dir

/bin/bash ./../web-app/scripts/build.sh && \
    echo "Copying web-app distribution to nginx for static serving..." && \
    rm -rf ./../nginx/public && mkdir ./../nginx/public && \
    cp -rf ./../web-app/dist/* ./../nginx/public