#!/bin/bash

echo "Building and packaging web app source..."
cd web-app/scripts && bash deploy.sh
cd ../../.. && zip -r parrot ./parrot