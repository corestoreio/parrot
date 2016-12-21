#!/bin/bash

echo "Generating TLS certs..."
cd $PARROT_API_ROOT/certs && generate-cert --host ${PARROT_HOST:-parrot}