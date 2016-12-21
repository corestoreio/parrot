#!/bin/bash

echo "Generating TLS certs..."
cd $PARROT_REPO_ROOT/parrot-api/certs && generate-cert --host ${PARROT_HOST:-parrot}