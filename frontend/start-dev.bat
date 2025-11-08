@echo off
echo Starting IlerAI Development Servers...

start "Backend Server" cmd /k "cd ../backend && npm run dev"
timeout /t 3 /nobreak > nul
start "Frontend Server" cmd /k "npm run dev"

echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
pause