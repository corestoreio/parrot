#!/bin/bash

script_dir="${0%/*}"
cd $script_dir

echo "Building web app..."
cd ./.. && npm install && \
    ng build -prod