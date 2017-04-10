#!/bin/bash

echo "Building API server source files..." && \
    cd $PARROT_API_ROOT && go build && \

    echo "Starting server..." && \
    $PARROT_API_ROOT/parrot-api