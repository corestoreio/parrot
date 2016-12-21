#!/bin/bash

echo "Generating TLS certs..."
mkdir -p certs && cd certs && generate-cert --host ${PARROT_HOST:-parrot}