#!/bin/bash

GO_WORKSPACE="$GOPATH/src/github.com/anthonynsimon/parrot"
OUTPUT_DIR="$(pwd)/dist"

mkdir -p $OUTPUT_DIR && \
    echo "Copying API sources to GOPATH workspace" && \
    rm -rf $GO_WORKSPACE && mkdir -p $GO_WORKSPACE && \
    cp -R parrot-api $GO_WORKSPACE/ && \
    cd $GO_WORKSPACE/parrot-api && \
    echo "Building Parrot API..." && \
    go get ./... && \
    go build && \
    cp parrot-api "$OUTPUT_DIR/parrot_api" && \
    exit 0
