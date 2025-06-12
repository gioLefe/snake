#!/bin/bash

# Function to run the client
run_client() {
  echo "Starting client..."
  npm run client
}

# Function to run the server
run_server() {
  echo "Starting server..."
  npm run server
}

# Run the client in the background
run_client &

# Run the server in the background
run_server &