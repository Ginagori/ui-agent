# Agente Frontend MCP para Lovable

## Core Principles

- **TYPE_SAFETY**: All functions must have type hints
- **VERBOSE_NAMING**: Use descriptive names (create_lovable_project, not create)
- **AI_FRIENDLY_LOGGING**: JSON structured logs with fix_suggestion field
- **KISS**: Keep solutions simple, avoid over-engineering
- **YAGNI**: Don't build features until needed

## Tech Stack

- **MCP Server**: TypeScript + @modelcontextprotocol/sdk
- **Backend**: FastAPI (Python 3.11+)
- **Transport**: Streamable HTTP / stdio
- **Validation**: Zod (TypeScript) / Pydantic (Python)
- **Package Manager**: pnpm (Node) / uv (Python)

## Architecture

```
ui-agent/
├── mcp-server/              # MCP Server (TypeScript)
│   ├── src/
│   │   ├── server.ts        # Main MCP server
│   │   ├── tools/           # Tool implementations
│   │   │   ├── project.ts   # Create/manage projects
│   │   │   ├── code.ts      # Edit code in Lovable
│   │   │   └── deploy.ts    # Deploy applications
│   │   └── types/           # TypeScript types
│   └── package.json
├── agent/                   # Agent logic (Python)
│   ├── src/
│   │   ├── agent.py         # Main agent orchestrator
│   │   ├── mcp_client.py    # MCP client connection
│   │   └── prompts/         # Agent prompts
│   └── pyproject.toml
└── docs/
    └── PRD.md
```

## MCP Tools Available

### Project Management
- `create_project` - Create new Lovable project
- `list_projects` - List user's projects
- `get_project_info` - Get project details

### Code Operations
- `edit_code` - Edit files in project
- `add_component` - Add React component
- `install_dependency` - Add npm package

### Deployment
- `deploy_project` - Deploy to production
- `get_deploy_status` - Check deployment status
- `rollback_deploy` - Rollback deployment

## Code Style

- Use snake_case for Python, camelCase for TypeScript
- Maximum line length: 100 characters
- Type hints required for all function parameters
- Use async/await for all I/O operations

## Testing

- Unit tests in `__tests__/` directories
- Integration tests for MCP tool calls
- Use vitest for TypeScript, pytest for Python

## Environment Variables

```env
LOVABLE_API_KEY=your_api_key
LOVABLE_WORKSPACE_ID=your_workspace
MCP_SERVER_PORT=3000
```
