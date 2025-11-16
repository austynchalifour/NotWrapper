#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}===================================="
echo "NotWrapper - ngrok Setup Helper"
echo -e "====================================${NC}"
echo ""

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo -e "${RED}ERROR: ngrok is not installed!${NC}"
    echo "Please install from: https://ngrok.com/download"
    echo ""
    echo "Mac/Linux: brew install ngrok/ngrok/ngrok"
    exit 1
fi

# Check if we're in the project root
if [ ! -d "apps/backend" ]; then
    echo -e "${RED}ERROR: Please run this script from the project root directory${NC}"
    exit 1
fi

echo -e "${YELLOW}[1/3] Starting Backend Server...${NC}"
cd apps/backend
npm run dev &
BACKEND_PID=$!
cd ../..

echo "Waiting for backend to start..."
sleep 5

echo ""
echo -e "${YELLOW}[2/3] Starting ngrok tunnel for Backend (port 3003)...${NC}"
ngrok http 3003 --log=stdout > ngrok.log &
NGROK_PID=$!

echo "Waiting for ngrok to initialize..."
sleep 3

# Try to get ngrok URL
NGROK_URL=""
for i in {1..10}; do
    NGROK_URL=$(curl -s http://localhost:4040/api/tunnels 2>/dev/null | grep -o '"public_url":"https://[^"]*' | grep -o 'https://[^"]*' | head -n 1)
    if [ ! -z "$NGROK_URL" ]; then
        break
    fi
    sleep 1
done

echo ""
echo -e "${GREEN}===================================="
echo "SUCCESS! Backend is exposed via ngrok"
echo -e "====================================${NC}"
echo ""

if [ ! -z "$NGROK_URL" ]; then
    echo -e "${GREEN}Your ngrok URL: $NGROK_URL${NC}"
    echo ""
    echo "To complete setup:"
    echo ""
    echo "1. Create/update apps/web/.env.local:"
    echo "   NEXT_PUBLIC_BACKEND_URL=$NGROK_URL"
    echo "   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url"
    echo "   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key"
    echo ""
else
    echo -e "${YELLOW}Could not auto-detect ngrok URL.${NC}"
    echo "Please check the ngrok web interface at: http://localhost:4040"
    echo ""
    echo "Then update apps/web/.env.local with:"
    echo "   NEXT_PUBLIC_BACKEND_URL=https://your-ngrok-url.ngrok-free.app"
    echo ""
fi

echo "2. Start the frontend:"
echo "   cd apps/web"
echo "   npm run dev"
echo ""
echo "3. Access your app at http://localhost:3000"
echo ""
echo -e "${GREEN}===================================="
echo "Useful Commands"
echo -e "====================================${NC}"
echo "- View ngrok dashboard: http://localhost:4040"
echo "- Stop all: Press Ctrl+C"
echo "- View ngrok logs: tail -f ngrok.log"
echo ""

# Cleanup on exit
cleanup() {
    echo ""
    echo "Shutting down..."
    kill $BACKEND_PID 2>/dev/null
    kill $NGROK_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Keep script running
echo "Press Ctrl+C to stop all services"
wait


