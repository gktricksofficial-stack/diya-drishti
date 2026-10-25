@echo off
echo Starting Divya Drishti Application...
echo.

echo Starting Backend Server (Python)...
start "Backend" cmd /k "cd backend && python main_simple.py"

echo Waiting for backend to start...
timeout /t 3 /nobreak >nul

echo Starting Frontend (React)...
start "Frontend" cmd /k "npm run dev"

echo.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo Press any key to stop all servers...
pause >nul

echo Stopping servers...
taskkill /FI "WINDOWTITLE eq Backend*" /T
taskkill /FI "WINDOWTITLE eq Frontend*" /T
echo All servers stopped.
