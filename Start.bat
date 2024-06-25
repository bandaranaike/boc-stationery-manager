@echo off
cd /d "C:\StationeryManager"
npm start
timeout /t 5 /nobreak
start firefox http://localhost:3000
