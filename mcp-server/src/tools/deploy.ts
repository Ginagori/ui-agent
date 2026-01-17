import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import * as z from 'zod';
import { LovableApiClient } from '../client/lovable-api.js';

/**
 * Register deployment tools with the MCP server
 */
export function registerDeployTools(server: McpServer): void {
    const client = new LovableApiClient();

    // Deploy project
    server.registerTool(
        'deploy_project',
        {
            title: 'Deploy Project',
            description: 'Deploy a Lovable project to production or preview environment',
            inputSchema: {
                projectId: z.string().describe('The project ID to deploy'),
                environment: z.enum(['preview', 'production']).default('preview').describe('Deployment environment'),
                waitForCompletion: z.boolean().default(true).describe('Wait for deployment to complete'),
            },
            outputSchema: {
                success: z.boolean(),
                deploymentId: z.string().optional(),
                status: z.enum(['pending', 'building', 'deploying', 'success', 'failed']),
                url: z.string().optional(),
                message: z.string(),
            }
        },
        async ({ projectId, environment, waitForCompletion }) => {
            try {
                const deployment = await client.deploy(projectId, {
                    environment,
                    waitForCompletion,
                });

                const output = {
                    success: deployment.status === 'success',
                    deploymentId: deployment.id,
                    status: deployment.status,
                    url: deployment.url,
                    message: deployment.status === 'success'
                        ? `Deployed successfully to ${deployment.url}`
                        : `Deployment ${deployment.status}`,
                };

                return {
                    content: [{ type: 'text', text: JSON.stringify(output, null, 2) }],
                    structuredContent: output,
                };
            } catch (error) {
                const output = {
                    success: false,
                    status: 'failed' as const,
                    message: `Deployment failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                };
                return {
                    content: [{ type: 'text', text: JSON.stringify(output, null, 2) }],
                    structuredContent: output,
                };
            }
        }
    );

    // Get deployment status
    server.registerTool(
        'get_deploy_status',
        {
            title: 'Get Deployment Status',
            description: 'Check the status of a deployment',
            inputSchema: {
                projectId: z.string().describe('The project ID'),
                deploymentId: z.string().optional().describe('Specific deployment ID (latest if not provided)'),
            },
            outputSchema: {
                success: z.boolean(),
                deployment: z.object({
                    id: z.string(),
                    status: z.string(),
                    environment: z.string(),
                    url: z.string().optional(),
                    startedAt: z.string(),
                    completedAt: z.string().optional(),
                    error: z.string().optional(),
                }).optional(),
                message: z.string().optional(),
            }
        },
        async ({ projectId, deploymentId }) => {
            try {
                const deployment = await client.getDeploymentStatus(projectId, deploymentId);

                const output = {
                    success: true,
                    deployment: {
                        id: deployment.id,
                        status: deployment.status,
                        environment: deployment.environment,
                        url: deployment.url,
                        startedAt: deployment.startedAt,
                        completedAt: deployment.completedAt,
                        error: deployment.error,
                    },
                };

                return {
                    content: [{ type: 'text', text: JSON.stringify(output, null, 2) }],
                    structuredContent: output,
                };
            } catch (error) {
                const output = {
                    success: false,
                    message: `Failed to get status: ${error instanceof Error ? error.message : 'Unknown error'}`,
                };
                return {
                    content: [{ type: 'text', text: JSON.stringify(output, null, 2) }],
                    structuredContent: output,
                };
            }
        }
    );

    // List deployments
    server.registerTool(
        'list_deployments',
        {
            title: 'List Deployments',
            description: 'List deployment history for a project',
            inputSchema: {
                projectId: z.string().describe('The project ID'),
                limit: z.number().min(1).max(50).default(10).describe('Maximum deployments to return'),
                environment: z.enum(['all', 'preview', 'production']).default('all').describe('Filter by environment'),
            },
            outputSchema: {
                success: z.boolean(),
                deployments: z.array(z.object({
                    id: z.string(),
                    status: z.string(),
                    environment: z.string(),
                    url: z.string().optional(),
                    createdAt: z.string(),
                })),
                total: z.number(),
            }
        },
        async ({ projectId, limit, environment }) => {
            try {
                const deployments = await client.listDeployments(projectId, { limit, environment });

                const output = {
                    success: true,
                    deployments: deployments.map(d => ({
                        id: d.id,
                        status: d.status,
                        environment: d.environment,
                        url: d.url,
                        createdAt: d.startedAt,
                    })),
                    total: deployments.length,
                };

                return {
                    content: [{ type: 'text', text: JSON.stringify(output, null, 2) }],
                    structuredContent: output,
                };
            } catch (error) {
                const output = {
                    success: false,
                    deployments: [],
                    total: 0,
                };
                return {
                    content: [{ type: 'text', text: `Error: ${error}` }],
                    structuredContent: output,
                };
            }
        }
    );

    // Rollback deployment
    server.registerTool(
        'rollback_deployment',
        {
            title: 'Rollback Deployment',
            description: 'Rollback to a previous deployment version',
            inputSchema: {
                projectId: z.string().describe('The project ID'),
                targetDeploymentId: z.string().describe('The deployment ID to rollback to'),
                confirm: z.boolean().describe('Confirmation flag - must be true to proceed'),
            },
            outputSchema: {
                success: z.boolean(),
                newDeploymentId: z.string().optional(),
                message: z.string(),
            }
        },
        async ({ projectId, targetDeploymentId, confirm }) => {
            if (!confirm) {
                const output = {
                    success: false,
                    message: 'Rollback cancelled - confirmation required',
                };
                return {
                    content: [{ type: 'text', text: JSON.stringify(output, null, 2) }],
                    structuredContent: output,
                };
            }

            try {
                const result = await client.rollbackDeployment(projectId, targetDeploymentId);

                const output = {
                    success: true,
                    newDeploymentId: result.newDeploymentId,
                    message: `Successfully rolled back to deployment ${targetDeploymentId}`,
                };

                return {
                    content: [{ type: 'text', text: JSON.stringify(output, null, 2) }],
                    structuredContent: output,
                };
            } catch (error) {
                const output = {
                    success: false,
                    message: `Rollback failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                };
                return {
                    content: [{ type: 'text', text: JSON.stringify(output, null, 2) }],
                    structuredContent: output,
                };
            }
        }
    );

    // Get deployment logs
    server.registerTool(
        'get_deploy_logs',
        {
            title: 'Get Deployment Logs',
            description: 'Retrieve build and deployment logs',
            inputSchema: {
                projectId: z.string().describe('The project ID'),
                deploymentId: z.string().describe('The deployment ID'),
                logType: z.enum(['build', 'runtime', 'all']).default('all').describe('Type of logs to retrieve'),
            },
            outputSchema: {
                success: z.boolean(),
                logs: z.array(z.object({
                    timestamp: z.string(),
                    level: z.string(),
                    message: z.string(),
                })),
                message: z.string().optional(),
            }
        },
        async ({ projectId, deploymentId, logType }) => {
            try {
                const logs = await client.getDeploymentLogs(projectId, deploymentId, logType);

                const output = {
                    success: true,
                    logs,
                };

                return {
                    content: [{ type: 'text', text: JSON.stringify(output, null, 2) }],
                    structuredContent: output,
                };
            } catch (error) {
                const output = {
                    success: false,
                    logs: [],
                    message: `Failed to get logs: ${error instanceof Error ? error.message : 'Unknown error'}`,
                };
                return {
                    content: [{ type: 'text', text: JSON.stringify(output, null, 2) }],
                    structuredContent: output,
                };
            }
        }
    );

    console.log('[MCP] Deploy tools registered');
}
