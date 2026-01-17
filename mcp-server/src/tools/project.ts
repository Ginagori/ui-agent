import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import * as z from 'zod';
import { LovableApiClient } from '../client/lovable-api.js';

/**
 * Register project management tools with the MCP server
 */
export function registerProjectTools(server: McpServer): void {
    const client = new LovableApiClient();

    // Create a new Lovable project
    server.registerTool(
        'create_project',
        {
            title: 'Create Lovable Project',
            description: 'Create a new web application project in Lovable. This will initialize a new React/Vite project with Tailwind CSS.',
            inputSchema: {
                name: z.string().min(1).max(100).describe('Project name'),
                description: z.string().max(500).optional().describe('Project description'),
                template: z.enum(['blank', 'dashboard', 'landing', 'saas']).default('blank').describe('Project template to use'),
                features: z.array(z.enum(['auth', 'database', 'api', 'payments'])).optional().describe('Features to include'),
            },
            outputSchema: {
                success: z.boolean(),
                projectId: z.string().optional(),
                projectUrl: z.string().optional(),
                message: z.string(),
            }
        },
        async ({ name, description, template, features }) => {
            try {
                const result = await client.createProject({
                    name,
                    description,
                    template,
                    features: features || [],
                });

                const output = {
                    success: true,
                    projectId: result.id,
                    projectUrl: `https://lovable.dev/projects/${result.id}`,
                    message: `Project "${name}" created successfully!`,
                };

                return {
                    content: [{ type: 'text', text: JSON.stringify(output, null, 2) }],
                    structuredContent: output,
                };
            } catch (error) {
                const output = {
                    success: false,
                    message: `Failed to create project: ${error instanceof Error ? error.message : 'Unknown error'}`,
                };
                return {
                    content: [{ type: 'text', text: JSON.stringify(output, null, 2) }],
                    structuredContent: output,
                };
            }
        }
    );

    // List all projects
    server.registerTool(
        'list_projects',
        {
            title: 'List Lovable Projects',
            description: 'List all projects in your Lovable workspace',
            inputSchema: {
                status: z.enum(['all', 'active', 'archived']).default('active').describe('Filter by project status'),
                limit: z.number().min(1).max(100).default(20).describe('Maximum number of projects to return'),
            },
            outputSchema: {
                success: z.boolean(),
                projects: z.array(z.object({
                    id: z.string(),
                    name: z.string(),
                    status: z.string(),
                    updatedAt: z.string(),
                })),
                total: z.number(),
            }
        },
        async ({ status, limit }) => {
            try {
                const projects = await client.listProjects({ status, limit });

                const output = {
                    success: true,
                    projects: projects.map(p => ({
                        id: p.id,
                        name: p.name,
                        status: p.status,
                        updatedAt: p.updatedAt,
                    })),
                    total: projects.length,
                };

                return {
                    content: [{ type: 'text', text: JSON.stringify(output, null, 2) }],
                    structuredContent: output,
                };
            } catch (error) {
                const output = {
                    success: false,
                    projects: [],
                    total: 0,
                };
                return {
                    content: [{ type: 'text', text: `Error listing projects: ${error}` }],
                    structuredContent: output,
                };
            }
        }
    );

    // Get project details
    server.registerTool(
        'get_project_info',
        {
            title: 'Get Project Info',
            description: 'Get detailed information about a specific Lovable project',
            inputSchema: {
                projectId: z.string().describe('The project ID'),
            },
            outputSchema: {
                success: z.boolean(),
                project: z.object({
                    id: z.string(),
                    name: z.string(),
                    description: z.string().optional(),
                    status: z.string(),
                    framework: z.string(),
                    deployUrl: z.string().optional(),
                    createdAt: z.string(),
                    updatedAt: z.string(),
                }).optional(),
                message: z.string().optional(),
            }
        },
        async ({ projectId }) => {
            try {
                const project = await client.getProject(projectId);

                const output = {
                    success: true,
                    project: {
                        id: project.id,
                        name: project.name,
                        description: project.description,
                        status: project.status,
                        framework: project.framework,
                        deployUrl: project.deployUrl,
                        createdAt: project.createdAt,
                        updatedAt: project.updatedAt,
                    },
                };

                return {
                    content: [{ type: 'text', text: JSON.stringify(output, null, 2) }],
                    structuredContent: output,
                };
            } catch (error) {
                const output = {
                    success: false,
                    message: `Project not found or error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                };
                return {
                    content: [{ type: 'text', text: JSON.stringify(output, null, 2) }],
                    structuredContent: output,
                };
            }
        }
    );

    // Delete/Archive project
    server.registerTool(
        'archive_project',
        {
            title: 'Archive Project',
            description: 'Archive a Lovable project (can be restored later)',
            inputSchema: {
                projectId: z.string().describe('The project ID to archive'),
                confirm: z.boolean().describe('Confirmation flag - must be true to proceed'),
            },
            outputSchema: {
                success: z.boolean(),
                message: z.string(),
            }
        },
        async ({ projectId, confirm }) => {
            if (!confirm) {
                const output = {
                    success: false,
                    message: 'Archive cancelled - confirmation required',
                };
                return {
                    content: [{ type: 'text', text: JSON.stringify(output, null, 2) }],
                    structuredContent: output,
                };
            }

            try {
                await client.archiveProject(projectId);

                const output = {
                    success: true,
                    message: `Project ${projectId} archived successfully`,
                };

                return {
                    content: [{ type: 'text', text: JSON.stringify(output, null, 2) }],
                    structuredContent: output,
                };
            } catch (error) {
                const output = {
                    success: false,
                    message: `Failed to archive: ${error instanceof Error ? error.message : 'Unknown error'}`,
                };
                return {
                    content: [{ type: 'text', text: JSON.stringify(output, null, 2) }],
                    structuredContent: output,
                };
            }
        }
    );

    console.log('[MCP] Project tools registered');
}
