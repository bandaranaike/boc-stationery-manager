@echo off
cd "C:\StationeryManager"
git pull
npm install
npm run build
timeout /t 5 /nobreak