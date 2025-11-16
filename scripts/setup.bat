@echo off
REM NotWrapper MVP Setup Script for Windows

echo 🔍 NotWrapper MVP Setup Script
echo ================================
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    exit /b 1
)

echo ✅ Node.js detected

REM Check Python
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Python is not installed. Please install Python 3.9+ first.
    exit /b 1
)

echo ✅ Python detected

REM Install root dependencies
echo.
echo 📦 Installing root dependencies...
call npm install

REM Install web dependencies
echo.
echo 📦 Installing web app dependencies...
cd apps\web
call npm install
cd ..\..

REM Install backend dependencies
echo.
echo 📦 Installing backend dependencies...
cd apps\backend
call npm install
cd ..\..

REM Install Python analyzer dependencies
echo.
echo 📦 Installing Python analyzer dependencies...
cd apps\analyzer

if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
)

call venv\Scripts\activate
pip install -r requirements.txt

cd ..\..

REM Create .env files
echo.
echo 📝 Setting up environment files...

if not exist "apps\web\.env.local" (
    copy apps\web\.env.local.example apps\web\.env.local
    echo ✅ Created apps\web\.env.local
)

if not exist "apps\backend\.env" (
    copy apps\backend\.env.example apps\backend\.env
    echo ✅ Created apps\backend\.env
)

echo.
echo ================================
echo ✅ Setup complete!
echo.
echo Next steps:
echo 1. Set up Supabase and add credentials to .env files
echo 2. Start development servers in separate terminals
echo 3. See DEVELOPMENT.md for detailed instructions
echo.
pause

