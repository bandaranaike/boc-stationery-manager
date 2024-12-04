#!/bin/bash
cd ~/StationeryManager || exit
gnome-terminal -- bash -c "npm start; exec bash"
firefox http://localhost:3000
