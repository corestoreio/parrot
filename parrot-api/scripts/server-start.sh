#!/bin/bash

echo "Initializing API server..."
chmod +wx $PARROT_REPO_ROOT/parrot-api/scripts/install-gen-cert.sh && $PARROT_REPO_ROOT/parrot-api/scripts/install-gen-cert.sh
chmod +wx $PARROT_REPO_ROOT/parrot-api/scripts/gen-cert.sh && $PARROT_REPO_ROOT/parrot-api/scripts/gen-cert.sh

echo "Building API server source files..."
cd $PARROT_REPO_ROOT/parrot-api
go build

echo "Starting server..."
$PARROT_REPO_ROOT/parrot-api/parrot-api