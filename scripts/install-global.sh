#!/bin/bash

# UI Agent - Global Installation Script
# Run this script to install both the MCP server and CLI globally

set -e

echo "╔══════════════════════════════════════════════════════════╗"
echo "║           UI Agent - Global Installation                  ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Check for pnpm
if ! command -v pnpm &> /dev/null; then
    echo "⚠️  pnpm not found. Installing pnpm..."
    npm install -g pnpm
fi

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

echo "📦 Installing MCP Server..."
cd "$ROOT_DIR/mcp-server"
pnpm install
pnpm build
npm link
echo "✅ MCP Server installed: ui-agent-mcp"

echo ""
echo "📦 Installing UI Agent CLI..."
cd "$ROOT_DIR/ui-agent"
pnpm install
pnpm build
npm link
echo "✅ UI Agent CLI installed: ui-agent"

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║                 Installation Complete!                    ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo "🚀 Available commands:"
echo "   ui-agent          - AI-powered UI generation CLI"
echo "   ui-agent-mcp      - MCP server for Claude integration"
echo ""
echo "📝 Quick start:"
echo "   1. Set your API key: export ANTHROPIC_API_KEY=your_key"
echo "   2. Run: ui-agent chat"
echo "   3. Describe the UI you want!"
echo ""
echo "📚 For Claude Desktop integration, add to your config:"
echo '   {"mcpServers": {"ui-agent": {"command": "ui-agent-mcp", "args": ["--stdio"]}}}'
echo ""
