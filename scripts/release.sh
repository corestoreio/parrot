#!/bin/bash

script_dir="${0%/*}"
cd $script_dir

/bin/bash ./../web-app/scripts/deploy.sh && \
    rm -rf ./../nginx/public && mkdir ./../nginx/public && \
    cp -rf ./../web-app/dist/* ./../nginx/public