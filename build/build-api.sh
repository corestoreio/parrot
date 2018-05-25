#!/bin/bash

GO_WORKSPACE="$GOPATH/src/github.com/parrot-translate/parrot"
OUTPUT_DIR="$(pwd)/dist"

mkdir -p $OUTPUT_DIR && \
    cd $GO_WORKSPACE/parrot-api && \
    echo "Building Parrot API..." && \
    go get ./... && \
    go build && \
    cp parrot-api "$OUTPUT_DIR/parrot_api" && \
    exit 0
