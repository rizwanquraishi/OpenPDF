#!/bin/bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=========================================================="
echo "      OpenPDF – All-in-One Free PDF Processing Platform   "
echo "=========================================================="

echo "1. Starting Backend..."
bash "$DIR/run_backend.sh" &
BACKEND_PID=$!

sleep 2

echo "2. Starting Frontend..."
bash "$DIR/run_frontend.sh" &
FRONTEND_PID=$!

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true" EXIT SIGINT SIGTERM

echo "Backend running at: http://localhost:8000"
echo "Frontend running at: http://localhost:3000"
echo "Press Ctrl+C to stop both servers."

wait
