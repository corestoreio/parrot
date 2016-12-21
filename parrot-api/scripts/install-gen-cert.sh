#!/bin/bash

echo "Installing generate TLS cert tool..."
cd $PARROT_API_ROOT/cmd/generate-cert && go install