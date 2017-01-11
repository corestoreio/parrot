#!/bin/bash

echo "Fetching latest version of parrot..."

git clone https://github.com/anthonynsimon/parrot.git && \
    cd ./parrot/parrot-api && \
    export PARROT_API_ROOT=$PWD && \
    chmod +rwx ./scripts/server-start.sh && \
    /bin/bash ./scripts/server-start.sh