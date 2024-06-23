@echo off
cd /d "C:\Users\User\Documents\Projects\boc-stationery-manager"
start npm run dev
timeout /t 5 /nobreak
start firefox http://localhost:3000
