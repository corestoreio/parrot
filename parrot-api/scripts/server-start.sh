#!/bin/bash

echo "Initializing API server..."
chmod +wx $PARROT_API_ROOT/scripts/install-gen-cert.sh && $PARROT_API_ROOT/scripts/install-gen-cert.sh
chmod +wx $PARROT_API_ROOT/scripts/gen-cert.sh && $PARROT_API_ROOT/scripts/gen-cert.sh

echo "Building API server source files..."
cd $PARROT_API_ROOT
go build

echo "Starting server..."
$PARROT_API_ROOT/parrot-api