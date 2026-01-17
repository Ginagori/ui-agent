# UI Agent

AI-powered UI component generator that creates **Lovable-quality** React components from plain language descriptions.

## Features

- 🎨 **Professional Design System** - Built-in knowledge of visual hierarchy, 8pt grid, typography, and color theory
- 📱 **Mobile-First Responsive** - All components work perfectly on any screen size
- ♿ **Accessible by Default** - WCAG compliant with proper ARIA, keyboard navigation, and semantic HTML
- ⚡ **Tailwind CSS** - Modern utility-first styling out of the box
- 🔧 **TypeScript Support** - Full type safety when you need it

## Installation

### Global Installation (Recommended)

```bash
# From npm (once published)
npm install -g @anthropic-ui/ui-agent

# Or from local source
cd ui-agent
pnpm install
pnpm build
npm link
```

### For Colleagues / Team Members

```bash
# Clone the repository
git clone https://github.com/your-org/ui-agent.git
cd ui-agent/ui-agent

# Install and link globally
pnpm install
pnpm build
npm link
```

## Setup

Set your Anthropic API key:

```bash
# Create .env file in your project or set globally
export ANTHROPIC_API_KEY=your_api_key_here
```

## Usage

### Interactive Chat Mode (Recommended)

```bash
ui-agent chat
```

Then just describe what you want in plain language:

```
You: Create a pricing page with 3 tiers - Free, Pro, and Enterprise

You: I need a dashboard with a sidebar, header, and main content area

You: Build a contact form with name, email, and message fields
```

### Quick Generate

```bash
# Generate a component
ui-agent generate "A modern login form with social login buttons"

# Generate with specific options
ui-agent generate "A data table with sorting and pagination" --framework react --typescript
```

### Initialize Project Context

```bash
# Analyze your project to generate better-fitting components
ui-agent init
```

## Examples

### What You Say → What You Get

| Your Description | Generated Component |
|-----------------|---------------------|
| "A hero section with a headline and CTA button" | Full hero with gradient, responsive text, animated button |
| "A card grid showing team members" | Responsive grid with avatar, name, role, social links |
| "A modal for confirming deletion" | Accessible dialog with focus trap, escape key handling |
| "A sidebar navigation menu" | Collapsible nav with icons, active states, mobile support |

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key | Yes |

### Project Configuration

Create `ui-agent.config.json` in your project root:

```json
{
  "framework": "react",
  "styling": "tailwind",
  "typescript": true,
  "outputDir": "src/components"
}
```

## Design System

UI Agent uses a professional design system based on:

- **Visual Hierarchy** - 4 levels of importance
- **8pt Grid System** - Consistent spacing (4px, 8px, 16px, 24px, 32px, 48px, 64px)
- **Typography Scale** - xs (12px) to 5xl (48px)
- **Color System** - Primary, secondary, neutral, and semantic colors
- **Component Patterns** - Buttons, inputs, cards, modals, navigation, forms

## Development

```bash
# Run in development mode
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test
```

## How It Works

1. **You describe** what you want in plain language
2. **UI Agent analyzes** your request and project context
3. **Claude generates** production-ready code using the embedded design system
4. **You review** and save to your project

## Comparison with Lovable

| Feature | Lovable | UI Agent |
|---------|---------|----------|
| Natural language input | ✅ | ✅ |
| Professional design quality | ✅ | ✅ |
| Responsive components | ✅ | ✅ |
| Accessible by default | ✅ | ✅ |
| Works locally | ❌ | ✅ |
| Works with any project | ❌ | ✅ |
| Free/open source | ❌ | ✅ |
| Your API key | ❌ | ✅ |

## Troubleshooting

### "ANTHROPIC_API_KEY not set"

Make sure your API key is set:
```bash
export ANTHROPIC_API_KEY=sk-ant-...
```

### Components don't match my project style

Run `ui-agent init` to analyze your project and generate more contextual components.

### Command not found

Ensure npm's global bin is in your PATH:
```bash
export PATH="$(npm bin -g):$PATH"
```

## License

MIT
