#!/bin/bash
# Production server startup script for ZTA-Suite
# This script serves the built production files

cd /workspace/project/ZTA-Suite

# Kill any existing server on port 12000
pkill -9 -f "serve -s dist -l 12000" 2>/dev/null
sleep 1

# Build the app if dist doesn't exist or is outdated
if [ ! -d "dist" ] || [ "src" -nt "dist" ]; then
    echo "Building production bundle..."
    npm run build
fi

# Start the production server
echo "Starting production server on port 12000..."
setsid serve -s dist -l 12000 </dev/null > /tmp/serve.log 2>&1 &

sleep 2
echo "Server started. Check /tmp/serve.log for details."
echo "App available at: https://work-1-ikuulrlrqhzpiwgg.prod-runtime.all-hands.dev"
