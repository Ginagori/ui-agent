# Product Requirements Document

## Executive Summary

**Product**: Agente Frontend MCP para Lovable
**Type**: AI Agent / Developer Tool
**Target Scale**: MVP

## Mission

Crear un agente inteligente que se conecte vía MCP (Model Context Protocol) a Lovable para permitir la creación y modificación de aplicaciones web de forma programática y conversacional.

## Problem Statement

Los desarrolladores y equipos que usan Lovable actualmente deben interactuar manualmente con la plataforma. Este agente permite:
- Automatizar la creación de proyectos
- Integrar Lovable en flujos de trabajo existentes
- Permitir que otros agentes AI usen Lovable como herramienta

## MVP Scope

### Core Features (P0)

1. **Conexión MCP a Lovable**
   - Servidor MCP que expone herramientas de Lovable
   - Soporte para autenticación OAuth/API Key
   - Transporte HTTP streamable y stdio

2. **Gestión de Proyectos**
   - Crear nuevos proyectos en Lovable
   - Listar proyectos existentes
   - Obtener información de proyecto

3. **Edición de Código**
   - Modificar archivos de proyecto
   - Agregar componentes React
   - Instalar dependencias

4. **Deployment**
   - Desplegar aplicaciones
   - Verificar estado de deployment
   - Rollback si es necesario

### Nice-to-Have (P1)

1. Integración con GitHub para sync
2. Preview de cambios antes de aplicar
3. Historial de versiones
4. Templates de proyectos predefinidos

## Technical Architecture

### MCP Server (TypeScript)
- Framework: @modelcontextprotocol/sdk
- Transport: StreamableHTTPServerTransport
- Validation: Zod schemas
- Runtime: Node.js 18+

### Agent (Python)
- Framework: FastAPI para API REST
- MCP Client: StreamableHTTPClientTransport
- LLM: Claude API para decisiones

## Success Criteria

- [ ] Servidor MCP inicia y lista herramientas correctamente
- [ ] Puede crear un proyecto en Lovable via MCP
- [ ] Puede editar código en proyecto existente
- [ ] Puede desplegar aplicación
- [ ] Latencia < 2s para operaciones básicas

## Timeline

1. **Fase 1**: Setup MCP Server + herramientas básicas
2. **Fase 2**: Implementar tools de proyecto y código
3. **Fase 3**: Agregar deployment y testing
4. **Fase 4**: Agent Python con orquestación

## References

- [Lovable MCP Docs](https://docs.lovable.dev/integrations/mcp-servers)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP Specification](https://spec.modelcontextprotocol.io)
