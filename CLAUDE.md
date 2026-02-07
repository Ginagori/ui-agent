# UI Agent - Generador de Componentes Frontend

## Core Principles

- **TYPE_SAFETY**: All functions must have type hints
- **VERBOSE_NAMING**: Use descriptive names (generateComponent, not generate)
- **AI_FRIENDLY_LOGGING**: JSON structured logs with fix_suggestion field
- **KISS**: Keep solutions simple, avoid over-engineering
- **YAGNI**: Don't build features until needed

## Tech Stack

- **CLI Agent**: TypeScript + Anthropic Claude API
- **MCP Server**: TypeScript + @modelcontextprotocol/sdk
- **Design MCP**: TypeScript + Cheerio (web scraping)
- **Transport**: stdio
- **Validation**: Zod (TypeScript)
- **Package Manager**: pnpm (Node)

## Architecture

```
ui-agent/
├── ui-agent/                # CLI Agent (TypeScript)
│   ├── src/
│   │   ├── agent.ts         # Main agent with Claude
│   │   └── cli.ts           # CLI commands (chat, generate, quick, modify)
│   └── package.json
├── mcp-server/              # MCP Server (TypeScript)
│   ├── src/
│   │   ├── server.ts        # Main MCP server
│   │   ├── tools/           # Tool implementations
│   │   │   ├── project.ts   # Create/manage local projects
│   │   │   ├── code.ts      # Edit code in filesystem
│   │   │   └── deploy.ts    # Deployment operations
│   │   └── client/          # API clients
│   └── package.json
├── design-mcp/              # Design Inspiration MCP (TypeScript)
│   ├── src/
│   │   └── server.ts        # Dribbble, Behance, Awwwards search
│   └── package.json
└── scripts/
    ├── install-global.ps1   # Windows installation
    └── install-global.sh    # Unix installation
```

## CLI Commands

| Command | Description |
|---------|-------------|
| `ui-agent chat` | Interactive conversation mode |
| `ui-agent quick "desc"` | Quick component generation |
| `ui-agent generate` | Interactive generation wizard |
| `ui-agent modify <file>` | Modify existing component |
| `ui-agent page` | Generate complete page with components |

## MCP Tools Available

### Design Inspiration (design-mcp)
- `search_dribbble` - Search Dribbble for design shots
- `search_behance` - Search Behance for projects
- `search_awwwards` - Search award-winning websites
- `search_design_inspiration` - Multi-source search
- `get_ui_pattern` - Best practices for UI patterns
- `list_ui_patterns` - List available patterns
- `get_design_recommendations` - Tailored design suggestions

### Project Management (ui-agent-mcp)
- `create_project` - Create new React project locally
- `list_projects` - List projects in directory
- `get_project_info` - Get project details and structure

### Code Operations (ui-agent-mcp)
- `edit_file` - Edit files in project
- `add_component` - Add React component
- `list_files` - List files in project
- `install_dependency` - Add npm package

## Playbook Integration

UI Agent automatically detects when working in a Playbook-managed project by looking for:
- `CLAUDE.md` - Project rules and tech stack
- `docs/PRD.md` - Product requirements
- `.playbook/session.json` - Session state

When detected, UI Agent:
1. Reads tech stack from CLAUDE.md
2. Follows project conventions
3. Uses established styling (Tailwind, CSS modules, etc.)
4. Generates components consistent with project architecture

## Code Style

- Use camelCase for TypeScript/JavaScript
- Maximum line length: 100 characters
- Type hints required for all function parameters
- Use async/await for all I/O operations
- Prefer functional components with hooks in React

## Component Generation Guidelines

### React Components
- Use TypeScript by default
- Functional components with hooks
- Props interface explicitly defined
- Tailwind CSS for styling (unless project uses different system)
- Responsive design by default
- Accessible HTML (aria labels, semantic elements)

### File Structure
- One component per file
- Co-locate styles if using CSS modules
- Export component as default
- Export types/interfaces as named exports

### Best Practices
- Keep components small and focused (< 200 lines)
- Extract reusable logic into custom hooks
- Use composition over inheritance
- Implement loading and error states
- Follow project's existing patterns

## Testing

- Unit tests in `__tests__/` directories
- Use vitest for TypeScript
- Test component rendering and user interactions
- Mock external dependencies

## Environment Variables

No API keys needed if using Claude MAX subscription. Claude Code handles authentication automatically.

For custom deployments:
```env
MCP_SERVER_PORT=3000  # Optional, for HTTP transport
```

## Development Workflow

1. **Start with design inspiration** (optional):
   - Use design-mcp to search Dribbble/Behance
   - Get UI pattern best practices
   - Get design recommendations for use case

2. **Generate component**:
   - Run `ui-agent chat` in project directory
   - Describe component in natural language
   - Review generated code
   - Save to project

3. **Iterate**:
   - Use `ui-agent modify` to adjust existing components
   - Follow Playbook context if available

## Common Patterns

### Generating a Dashboard
1. Search for dashboard inspiration
2. Get dashboard UI pattern best practices
3. Generate with: "Create a dashboard with sidebar navigation, header with user menu, and grid of stat cards"

### Generating Forms
1. Get form UI pattern
2. Generate with: "Create a login form with email, password, remember me, and social login buttons"

### Generating Data Tables
1. Search for table designs
2. Get table UI pattern
3. Generate with: "Create a data table with sorting, filtering, pagination, and row actions"

## References

- [Anthropic Claude API](https://docs.anthropic.com)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
