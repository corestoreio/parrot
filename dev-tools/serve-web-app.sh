#!/bin/bash

cd dist/static && python -m SimpleHTTPServer 8080 || python3 -m http.server