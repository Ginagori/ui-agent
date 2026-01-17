# UI Agent - Global Installation Script (Windows PowerShell)
# Run this script to install the MCP servers and CLI globally

$ErrorActionPreference = "Stop"

Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║           UI Agent - Global Installation                  ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check for pnpm
$pnpmExists = Get-Command pnpm -ErrorAction SilentlyContinue
if (-not $pnpmExists) {
    Write-Host "⚠️  pnpm not found. Installing pnpm..." -ForegroundColor Yellow
    npm install -g pnpm
}

# Get the root directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RootDir = Split-Path -Parent $ScriptDir

Write-Host "📦 Installing MCP Server..." -ForegroundColor Blue
Set-Location "$RootDir\mcp-server"
pnpm install
pnpm build
npm link
Write-Host "✅ MCP Server installed: ui-agent-mcp" -ForegroundColor Green

Write-Host ""
Write-Host "📦 Installing UI Agent CLI..." -ForegroundColor Blue
Set-Location "$RootDir\ui-agent"
pnpm install
pnpm build
npm link
Write-Host "✅ UI Agent CLI installed: ui-agent" -ForegroundColor Green

Write-Host ""
Write-Host "📦 Installing Design Inspiration MCP..." -ForegroundColor Blue
Set-Location "$RootDir\design-mcp"
pnpm install
pnpm build
npm link
Write-Host "✅ Design MCP installed: design-mcp" -ForegroundColor Green

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                 Installation Complete!                    ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 Available commands:" -ForegroundColor White
Write-Host "   ui-agent          - AI-powered UI generation CLI"
Write-Host "   ui-agent-mcp      - MCP server for Claude integration"
Write-Host "   design-mcp        - Design inspiration search MCP"
Write-Host ""
Write-Host "📝 Quick start:" -ForegroundColor White
Write-Host "   1. Run: ui-agent chat"
Write-Host "   2. Describe the UI you want!"
Write-Host ""
Write-Host "📚 Add MCPs to Claude Code:" -ForegroundColor White
Write-Host '   claude mcp add ui-agent --command "ui-agent-mcp --stdio"'
Write-Host '   claude mcp add design-inspiration --command "design-mcp --stdio"'
Write-Host ""

# Return to original directory
Set-Location $RootDir
