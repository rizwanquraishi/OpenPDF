#!/bin/bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR/backend"

echo "Starting OpenPDF Backend on port 8000..."
./venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
