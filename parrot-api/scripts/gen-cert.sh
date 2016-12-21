#!/bin/bash

echo "Generating TLS certs..."
cd certs && generate-cert --host ${PARROT_HOST:-parrot}