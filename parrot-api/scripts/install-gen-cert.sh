#!/bin/bash

echo "Installing generate TLS cert tool..."
cd $PARROT_REPO_ROOT/parrot-api/cmd/generate-cert && go install