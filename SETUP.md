# UI Agent - Guía de Instalación

## Requisitos Previos

- **Node.js 18+** - [Descargar aquí](https://nodejs.org/)
- **Git** - [Descargar aquí](https://git-scm.com/)
- **API Key de Anthropic** - [Obtener aquí](https://console.anthropic.com/)

## Instalación (5 minutos)

### Paso 1: Clonar el repositorio

```powershell
git clone https://github.com/Ginagori/ui-agent.git
cd ui-agent
```

### Paso 2: Ejecutar el script de instalación

**Windows (PowerShell):**
```powershell
.\scripts\install-global.ps1
```

**macOS / Linux:**
```bash
chmod +x scripts/install-global.sh
./scripts/install-global.sh
```

### Paso 3: ¡Listo!

Con la suscripción MAX de Claude no necesitas configurar nada más. El agente usa Claude Code directamente.

## Uso

### Generar Componentes UI

Navega a cualquier proyecto React y ejecuta:

```bash
cd tu-proyecto-react
ui-agent chat
```

Luego describe lo que quieres en lenguaje natural:

```
You: Crea un formulario de login con email, password y botón de Google

You: Necesito una página de pricing con 3 planes: Free, Pro, Enterprise

You: Un dashboard con sidebar colapsable, header con avatar y área de contenido
```

El agente generará código React + Tailwind CSS de calidad profesional.

### Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `ui-agent chat` | Modo interactivo (recomendado) |
| `ui-agent quick "descripción"` | Generación rápida sin prompts |
| `ui-agent generate` | Generación con opciones interactivas |
| `ui-agent --help` | Ver todos los comandos |

## Integración con Claude Desktop (Opcional)

Si usas Claude Desktop, puedes agregar UI Agent como servidor MCP:

1. Abre el archivo de configuración:
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
   - **macOS**: `~/.claude/claude_desktop_config.json`

2. Agrega esta configuración:
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

3. Reinicia Claude Desktop

## Troubleshooting

### "ui-agent: command not found"

El PATH de npm no está configurado. Ejecuta:

```powershell
# Ver dónde está instalado
npm bin -g

# Agregar al PATH (Windows - ejecutar como Admin)
$npmPath = npm bin -g
[System.Environment]::SetEnvironmentVariable("PATH", $env:PATH + ";" + $npmPath, "User")
```

Cierra y vuelve a abrir la terminal.

### "ANTHROPIC_API_KEY not set"

Verifica que la variable esté configurada:

```powershell
echo $env:ANTHROPIC_API_KEY
```

Si está vacía, configúrala siguiendo el Paso 3.

### Errores de permisos en Windows

Ejecuta PowerShell como Administrador y:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Contacto

Si tienes problemas, contacta a [tu nombre/email aquí].
