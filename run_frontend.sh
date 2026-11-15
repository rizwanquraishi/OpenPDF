#!/bin/bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR/frontend"

echo "Starting OpenPDF Frontend on port 3000..."
npm start -- -p 3000
