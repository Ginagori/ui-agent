# Design Inspiration MCP

MCP server for searching design inspiration from Dribbble, Behance, Awwwards, and getting UI pattern recommendations.

## Features

- **Search Dribbble** - Find shots and design examples
- **Search Behance** - Find design projects
- **Search Awwwards** - Find award-winning websites
- **UI Patterns** - Get best practices for common UI patterns
- **Design Recommendations** - Get tailored suggestions for specific use cases

## Installation

```bash
cd design-mcp
pnpm install
pnpm build
npm link
```

## Usage with Claude Code

Add to your `~/.claude.json`:

```json
{
  "mcpServers": {
    "design-inspiration": {
      "command": "design-mcp",
      "args": ["--stdio"]
    }
  }
}
```

Or use the command:

```bash
claude mcp add design-inspiration --command "design-mcp --stdio"
```

## Available Tools

| Tool | Description |
|------|-------------|
| `search_dribbble` | Search Dribbble for design shots |
| `search_behance` | Search Behance for design projects |
| `search_awwwards` | Search Awwwards for winning websites |
| `search_design_inspiration` | Search multiple sources at once |
| `get_ui_pattern` | Get best practices for a UI pattern |
| `list_ui_patterns` | List all available UI patterns |
| `get_design_recommendations` | Get tailored design recommendations |

## Example Usage

```
"Search Dribbble for veterinary clinic dashboard designs"
→ Uses search_dribbble with query "veterinary clinic dashboard"

"What are the best practices for a pricing page?"
→ Uses get_ui_pattern with pattern "pricing"

"Give me design recommendations for a fintech app with a modern style"
→ Uses get_design_recommendations with useCase and style
```

## Integration with UI Agent

This MCP works alongside UI Agent for a complete design-to-code workflow:

1. **Find inspiration** with design-mcp
2. **Get patterns** and best practices
3. **Generate components** with UI Agent following the inspiration

## Available UI Patterns

- dashboard
- login
- pricing
- settings
- table
- form
- modal
- sidebar
- card
- notification

## License

MIT
