#!/bin/bash

# Source nvm to ensure node and npm are available in the script
source /home/bank-of-ceylon/.nvm/nvm.sh

# Change to the directory where your project is located
cd ~/StationeryManager

# Open a new terminal window and run npm start
gnome-terminal -- bash -c "source /home/bank-of-ceylon/.nvm/nvm.sh && npm start; exec bash"

# Wait for a few seconds to ensure npm start has time to start the server
sleep 5

# Open Firefox and go to localhost:3000
firefox http://localhost:3000 &
