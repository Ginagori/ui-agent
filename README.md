# UI Agent

Generador de componentes UI con calidad profesional (estilo Lovable) usando Claude AI.

## 🚀 Instalación Global (Recomendado)

### Windows (PowerShell)
```powershell
git clone https://github.com/your-org/ui-agent.git
cd ui-agent
.\scripts\install-global.ps1
```

### macOS / Linux
```bash
git clone https://github.com/your-org/ui-agent.git
cd ui-agent
chmod +x scripts/install-global.sh
./scripts/install-global.sh
```

Esto instala dos comandos globales:
- `ui-agent` - CLI para generar componentes
- `ui-agent-mcp` - Servidor MCP para Claude Desktop

### Configurar API Key

```bash
# En tu terminal
export ANTHROPIC_API_KEY=sk-ant-your-key

# O en Windows PowerShell
$env:ANTHROPIC_API_KEY="sk-ant-your-key"
```

---

## 📦 Compartir con tu Equipo

Tu compañero puede instalar UI Agent en su máquina:

```bash
# Clonar el repo
git clone https://github.com/your-org/ui-agent.git
cd ui-agent

# Ejecutar script de instalación (Windows)
.\scripts\install-global.ps1

# O en macOS/Linux
./scripts/install-global.sh
```

Una vez instalado, pueden usar `ui-agent` desde cualquier proyecto.

---

## 🎨 UI Agent CLI

Un CLI que genera componentes React/TypeScript directamente en tu proyecto usando Claude AI.

### Uso Rápido

```bash
# Desde cualquier proyecto React
cd tu-proyecto

# Modo interactivo (recomendado)
ui-agent chat

# Ejemplos de lo que puedes pedir:
# - "Crea un formulario de login con social login buttons"
# - "Necesito una página de pricing con 3 planes"
# - "Un dashboard con sidebar y header"
```

### Instalación Local (alternativa)

Un CLI que genera componentes React/TypeScript directamente en tu proyecto usando Claude AI.

### Instalación Rápida

```bash
cd ui-agent
pnpm install

# Configurar API key de Anthropic
cp .env.example .env
# Edita .env y agrega tu ANTHROPIC_API_KEY
```

### Uso

#### Modo Interactivo (Chat)
```bash
pnpm dev chat --project /ruta/a/tu/proyecto

# Ejemplo:
# You: Crea un botón con variantes primary, secondary y destructive
# Agent: [genera el componente y pregunta si guardarlo]
```

#### Generación Rápida
```bash
# Generar componente con prompt
pnpm dev quick "un card de usuario con avatar, nombre y botón de seguir" --project /mi/proyecto

# Generar con nombre específico
pnpm dev quick "formulario de login" --name LoginForm --output src/components/auth
```

#### Generar Página Completa
```bash
pnpm dev page --project /mi/proyecto
# Describe: "Dashboard con sidebar, header y grid de cards de estadísticas"
# El agente genera todos los componentes necesarios
```

#### Modificar Componente Existente
```bash
pnpm dev modify src/components/Button.tsx --project /mi/proyecto
# Instrucción: "Agrega una variante 'ghost' y soporte para iconos"
```

### Comandos Disponibles

| Comando | Alias | Descripción |
|---------|-------|-------------|
| `generate` | `g` | Generar componente interactivamente |
| `quick <desc>` | `q` | Generación rápida sin prompts |
| `page` | - | Generar página completa con componentes |
| `modify <file>` | `m` | Modificar componente existente |
| `chat` | - | Modo conversacional interactivo |

### Opciones

```bash
Options:
  -p, --project <path>   Ruta al proyecto (default: directorio actual)
  -o, --output <dir>     Directorio de salida (default: src/components)
  -n, --name <name>      Nombre del componente
  -s, --styling <type>   tailwind | css | styled-components
  --no-typescript        Generar JavaScript en vez de TypeScript
  --dry-run              Mostrar código sin guardar
```

### Ejemplo Real de Uso

```bash
# Desde la carpeta de tu proyecto React
cd /Users/natal/mi-app-react

# Ejecutar el agente
npx tsx /path/to/ui-agent/src/cli.ts chat

# Conversación:
You: Crea un componente de pricing con 3 planes: Free, Pro y Enterprise

# El agente:
# 1. Lee tu proyecto para entender el estilo existente
# 2. Genera un componente PricingSection.tsx con Tailwind
# 3. Te muestra el código y pregunta si guardarlo
# 4. Lo guarda en src/components/PricingSection.tsx
```

---

## 🔌 MCP Server (Para Claude Desktop)

El servidor MCP permite usar UI Agent directamente desde Claude Desktop.

### Configuración en Claude Desktop

Después de la instalación global, edita tu configuración de Claude Desktop:

**macOS**: `~/.claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

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

Reinicia Claude Desktop y tendrás acceso a las herramientas de UI Agent.

### Modo HTTP (para conexiones remotas)

```bash
# Iniciar servidor HTTP en puerto 3000
ui-agent-mcp

# O con puerto personalizado
MCP_SERVER_PORT=8080 ui-agent-mcp
```

### Herramientas MCP Disponibles

| Categoría | Tool | Descripción |
|-----------|------|-------------|
| **Proyecto** | `create_project` | Crear nuevo proyecto |
| | `list_projects` | Listar proyectos |
| | `get_project_info` | Detalles de proyecto |
| **Código** | `edit_file` | Crear/editar archivos |
| | `add_component` | Agregar componente React |
| | `list_files` | Listar archivos |
| | `install_dependency` | Instalar paquete npm |
| **Deploy** | `deploy_project` | Desplegar aplicación |
| | `get_deploy_status` | Estado del deployment |
| | `rollback_deployment` | Rollback |

---

## Arquitectura del Proyecto

```
ui-agent/
├── ui-agent/                # CLI de generación de UI
│   ├── src/
│   │   ├── agent.ts         # Lógica del agente con Claude
│   │   └── cli.ts           # Comandos CLI
│   └── package.json
│
├── mcp-server/              # Servidor MCP
│   ├── src/
│   │   ├── server.ts        # Entry point
│   │   ├── tools/           # Herramientas MCP
│   │   └── client/          # Cliente API
│   └── package.json
│
├── docs/
│   └── PRD.md
├── CLAUDE.md
└── README.md
```

## ¿Cuál usar?

| Escenario | Herramienta |
|-----------|-------------|
| Generar componentes en tu proyecto local | **UI Agent** |
| Trabajar desde VS Code con terminal | **UI Agent** |
| Integrar con Claude Desktop | **MCP Server** |
| Conectar con Lovable | **MCP Server** (como personal connector) |
| Automatización en CI/CD | **MCP Server** |

## Requisitos

- Node.js 18+
- pnpm
- API Key de Anthropic (para UI Agent)

## Variables de Entorno

```bash
# Para UI Agent
ANTHROPIC_API_KEY=sk-ant-...

# Para MCP Server
LOVABLE_API_KEY=...
LOVABLE_WORKSPACE_ID=...
MCP_SERVER_PORT=3000
```

## Referencias

- [Anthropic API](https://docs.anthropic.com)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [Lovable Documentation](https://docs.lovable.dev)

## Licencia

MIT
