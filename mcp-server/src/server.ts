#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import express from 'express';
import { randomUUID } from 'node:crypto';
import 'dotenv/config';

import { registerProjectTools } from './tools/project.js';
import { registerCodeTools } from './tools/code.js';
import { registerDeployTools } from './tools/deploy.js';

const SERVER_NAME = 'lovable-mcp-agent';
const SERVER_VERSION = '1.0.0';

/**
 * Create and configure the MCP server with all tools
 */
function createMcpServer(): McpServer {
    const server = new McpServer({
        name: SERVER_NAME,
        version: SERVER_VERSION,
    });

    // Register all tool categories
    registerProjectTools(server);
    registerCodeTools(server);
    registerDeployTools(server);

    console.log(`[${SERVER_NAME}] MCP Server initialized with tools`);

    return server;
}

/**
 * Start server with stdio transport (for CLI/local use)
 */
async function startStdioServer(): Promise<void> {
    const server = createMcpServer();
    const transport = new StdioServerTransport();

    await server.connect(transport);
    console.error(`[${SERVER_NAME}] Running on stdio transport`);
}

/**
 * Start server with HTTP transport (for remote connections)
 */
async function startHttpServer(port: number): Promise<void> {
    const app = express();
    app.use(express.json());

    // Store active sessions
    const sessions: Map<string, StreamableHTTPServerTransport> = new Map();

    // Health check endpoint
    app.get('/health', (_req, res) => {
        res.json({
            status: 'healthy',
            server: SERVER_NAME,
            version: SERVER_VERSION,
            activeSessions: sessions.size
        });
    });

    // MCP endpoint
    app.post('/mcp', async (req, res) => {
        const sessionId = req.headers['mcp-session-id'] as string | undefined;

        let transport: StreamableHTTPServerTransport;

        if (sessionId && sessions.has(sessionId)) {
            // Reuse existing session
            transport = sessions.get(sessionId)!;
        } else {
            // Create new session
            transport = new StreamableHTTPServerTransport({
                sessionIdGenerator: () => randomUUID(),
                onsessioninitialized: (id) => {
                    sessions.set(id, transport);
                    console.log(`[${SERVER_NAME}] Session initialized: ${id}`);
                },
                onsessionclosed: (id) => {
                    sessions.delete(id);
                    console.log(`[${SERVER_NAME}] Session closed: ${id}`);
                }
            });

            transport.onclose = () => {
                if (transport.sessionId) {
                    sessions.delete(transport.sessionId);
                }
            };

            const server = createMcpServer();
            await server.connect(transport);
        }

        await transport.handleRequest(req, res, req.body);
    });

    // Handle GET for SSE streams
    app.get('/mcp', async (req, res) => {
        const sessionId = req.headers['mcp-session-id'] as string;
        const transport = sessions.get(sessionId);

        if (transport) {
            await transport.handleRequest(req, res);
        } else {
            res.status(400).json({ error: 'Invalid session' });
        }
    });

    // Handle DELETE to close sessions
    app.delete('/mcp', async (req, res) => {
        const sessionId = req.headers['mcp-session-id'] as string;
        const transport = sessions.get(sessionId);

        if (transport) {
            await transport.handleRequest(req, res);
        } else {
            res.status(400).json({ error: 'Invalid session' });
        }
    });

    app.listen(port, () => {
        console.log(`[${SERVER_NAME}] HTTP server running on http://localhost:${port}/mcp`);
        console.log(`[${SERVER_NAME}] Health check: http://localhost:${port}/health`);
    });
}

/**
 * Main entry point
 */
async function main(): Promise<void> {
    const args = process.argv.slice(2);

    if (args.includes('--stdio')) {
        await startStdioServer();
    } else {
        const port = parseInt(process.env.MCP_SERVER_PORT || '3000', 10);
        await startHttpServer(port);
    }
}

main().catch((error) => {
    console.error('Failed to start MCP server:', error);
    process.exit(1);
});
