@echo off
echo ====================================
echo NotWrapper - ngrok Setup Helper
echo ====================================
echo.

REM Check if ngrok is installed
where ngrok >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: ngrok is not installed!
    echo Please install from: https://ngrok.com/download
    echo.
    pause
    exit /b 1
)

echo [1/3] Starting Backend Server...
start "NotWrapper Backend" cmd /k "cd apps\backend && npm run dev"

echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo.
echo [2/3] Starting ngrok tunnel for Backend (port 3003)...
start "ngrok Backend" cmd /k "ngrok http 3003"

echo.
echo ====================================
echo IMPORTANT: Next Steps
echo ====================================
echo.
echo 1. Check the ngrok window for your public URL
echo    It will look like: https://abc123.ngrok-free.app
echo.
echo 2. Copy that URL
echo.
echo 3. Create/update apps\web\.env.local with:
echo    NEXT_PUBLIC_BACKEND_URL=https://your-ngrok-url.ngrok-free.app
echo    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
echo    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
echo.
echo 4. Start the frontend:
echo    cd apps\web
echo    npm run dev
echo.
echo 5. Access your app at http://localhost:3000
echo.
echo ====================================
echo.
echo Press any key to open the ngrok web interface (http://localhost:4040)
pause >nul
start http://localhost:4040


