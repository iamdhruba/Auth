@echo off
echo Starting School Financial Management System...
echo.

echo Installing Backend Dependencies...
cd backend
call npm install
echo.

echo Installing Frontend Dependencies...
cd ../frontend
call npm install
echo.

echo Starting Backend Server...
cd ../backend
start "Backend Server" cmd /k "npm run dev"
timeout /t 3

echo Starting Frontend Server...
cd ../frontend
start "Frontend Server" cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
pause