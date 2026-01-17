# UI Agent MCP Server

MCP (Model Context Protocol) server for AI-powered UI generation. Works with Claude and other MCP-compatible clients.

## Installation

### Global Installation (Recommended)

```bash
# From npm (once published)
npm install -g @anthropic-ui/ui-agent-mcp

# Or from local source
cd mcp-server
pnpm install
pnpm build
npm link
```

### For Colleagues / Team Members

```bash
# Clone the repository
git clone https://github.com/your-org/ui-agent.git
cd ui-agent/mcp-server

# Install and link globally
pnpm install
pnpm build
npm link
```

## Usage

### With Claude Desktop

Add to your Claude Desktop configuration (`~/.claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "ui-agent": {
      "command": "ui-agent-mcp",
      "args": ["--stdio"]
    }
  }
}
```

### With Claude Code (VS Code Extension)

Add to your project's `.mcp.json` or global MCP config:

```json
{
  "servers": {
    "ui-agent": {
      "command": "ui-agent-mcp",
      "args": ["--stdio"]
    }
  }
}
```

### HTTP Mode (for Remote Connections)

```bash
# Start HTTP server on default port 3000
ui-agent-mcp

# Or specify a custom port
MCP_SERVER_PORT=8080 ui-agent-mcp
```

Then connect to `http://localhost:3000/mcp`

## Available Tools

### Project Management
- `create_project` - Create a new UI project
- `list_projects` - List all projects
- `get_project_info` - Get project details
- `archive_project` - Archive a project

### Code Operations
- `edit_file` - Edit files in the project
- `add_component` - Add a new React component
- `get_file` - Read file contents
- `list_files` - List project files
- `install_dependency` - Add npm packages

### Deployment
- `deploy_project` - Deploy to production
- `get_deploy_status` - Check deployment status
- `rollback_deploy` - Rollback a deployment

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MCP_SERVER_PORT` | HTTP server port | `3000` |
| `LOVABLE_API_KEY` | API key for Lovable integration | - |
| `LOVABLE_WORKSPACE_ID` | Workspace ID | - |

## Development

```bash
# Run in development mode with hot reload
pnpm dev

# Run in stdio mode for testing
pnpm dev:stdio

# Build for production
pnpm build

# Type check
pnpm typecheck

# Lint
pnpm lint
```

## Architecture

```
mcp-server/
├── src/
│   ├── server.ts          # Main entry point (stdio + HTTP)
│   ├── tools/
│   │   ├── project.ts     # Project management tools
│   │   ├── code.ts        # Code editing tools
│   │   └── deploy.ts      # Deployment tools
│   └── types/             # TypeScript types
├── dist/                  # Compiled output
└── package.json
```

## Troubleshooting

### Command not found after `npm link`

Make sure npm's global bin directory is in your PATH:

```bash
# Check npm bin path
npm bin -g

# Add to PATH (bash/zsh)
export PATH="$(npm bin -g):$PATH"
```

### Permission errors on Windows

Run PowerShell as Administrator or use:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### MCP connection issues

1. Verify the server is running: `ui-agent-mcp --stdio`
2. Check Claude Desktop logs for connection errors
3. Ensure the config path is correct

## License

MIT
