#!/bin/bash

OUTPUT_DIR="$(pwd)/dist"

mkdir -p $OUTPUT_DIR && \
    cd web-app && \
    echo "Installing web app dependencies, this might take a few minutes..." && \
    npm install && \
    echo "Building web app..." && \
    npm run build && \
    cp -R dist "$OUTPUT_DIR/static"
    exit 0
