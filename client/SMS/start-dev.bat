@echo off
echo ========================================
echo School Financial Management System
echo ========================================
echo.

echo Checking MongoDB connection...
echo.

echo Starting Backend Server...
cd backend
start "Backend Server" cmd /k "echo Backend starting on http://localhost:5000 && npm run dev"
timeout /t 3

echo.
echo Starting Frontend Server...
cd ../frontend
start "Frontend Server" cmd /k "echo Frontend starting on http://localhost:5173 && npm run dev"

echo.
echo ========================================
echo Servers are starting...
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:5000
echo.
echo Demo Login Credentials:
echo Admin:      admin@school.com / admin123
echo Accountant: accountant@school.com / accountant123
echo Teacher:    teacher@school.com / teacher123
echo Student:    student@school.com / student123
echo Parent:     parent@school.com / parent123
echo.
echo Note: Make sure MongoDB is running!
echo ========================================
pause