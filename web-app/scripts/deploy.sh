#!/bin/bash

echo "Building and deploying web app..."
npm install
ng build -prod
rm -rf ./../../nginx/public && mkdir ./../../nginx/public
cp -rf ./../dist/ ./../../nginx/public/
rm -rf ./../dist