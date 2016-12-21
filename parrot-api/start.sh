#!/bin/bash

echo "Initializing API server..."
chmod +wx ./scripts/install-gen-cert.sh && ./scripts/install-gen-cert.sh
chmod +wx ./scripts/gen-cert.sh && ./scripts/gen-cert.sh

echo "Building API server source files..."
go build

echo "Starting server..."
./parrot-api