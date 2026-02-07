import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import * as z from 'zod';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { detectPackageManager, execCommand } from '../utils.js';

/**
 * Register build tools with the MCP server
 */
export function registerDeployTools(server: McpServer): void {

    // Build the project locally
    server.registerTool(
        'build_project',
        {
            title: 'Build Project',
            description: 'Run the build script (pnpm build / npm run build) in a local project',
            inputSchema: {
                projectPath: z.string().describe('Absolute path to the project root'),
            },
            outputSchema: {
                success: z.boolean(),
                outputDir: z.string().optional(),
                buildOutput: z.string().optional(),
                message: z.string(),
            }
        },
        async ({ projectPath }) => {
            try {
                const resolvedPath = path.resolve(projectPath);
                const pm = await detectPackageManager(resolvedPath);

                // Verify build script exists
                const pkgData = JSON.parse(
                    await fs.readFile(path.join(resolvedPath, 'package.json'), 'utf-8')
                );
                if (!pkgData.scripts?.build) {
                    const output = {
                        success: false,
                        message: 'No "build" script found in package.json',
                    };
                    return {
                        content: [{ type: 'text' as const, text: JSON.stringify(output, null, 2) }],
                        structuredContent: output,
                    };
                }

                const command = pm === 'pnpm' ? 'pnpm build'
                    : pm === 'yarn' ? 'yarn build'
                    : 'npm run build';

                const startTime = Date.now();
                const { stdout, stderr } = await execCommand(command, resolvedPath, 120000);
                const duration = Date.now() - startTime;

                // Detect output directory
                let outputDir: string | undefined;
                for (const dir of ['dist', 'build', '.next', 'out']) {
                    try {
                        await fs.access(path.join(resolvedPath, dir));
                        outputDir = dir;
                        break;
                    } catch { /* not found */ }
                }

                const output = {
                    success: true,
                    outputDir,
                    buildOutput: (stdout + stderr).slice(0, 2000),
                    message: `Build completed in ${(duration / 1000).toFixed(1)}s${outputDir ? ` → ${outputDir}/` : ''}`,
                };
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(output, null, 2) }],
                    structuredContent: output,
                };
            } catch (error) {
                const output = {
                    success: false,
                    message: `Build failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                };
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(output, null, 2) }],
                    structuredContent: output,
                };
            }
        }
    );

    // Check if project has been built
    server.registerTool(
        'get_build_status',
        {
            title: 'Get Build Status',
            description: 'Check if a local project has a build output directory (dist/, build/, etc.)',
            inputSchema: {
                projectPath: z.string().describe('Absolute path to the project root'),
            },
            outputSchema: {
                success: z.boolean(),
                exists: z.boolean(),
                outputDir: z.string().optional(),
                lastModified: z.string().optional(),
                message: z.string(),
            }
        },
        async ({ projectPath }) => {
            try {
                const resolvedPath = path.resolve(projectPath);

                for (const dir of ['dist', 'build', '.next', 'out']) {
                    try {
                        const dirPath = path.join(resolvedPath, dir);
                        const stat = await fs.stat(dirPath);
                        const output = {
                            success: true,
                            exists: true,
                            outputDir: dir,
                            lastModified: stat.mtime.toISOString(),
                            message: `Build output found at ${dir}/ (last modified: ${stat.mtime.toLocaleString()})`,
                        };
                        return {
                            content: [{ type: 'text' as const, text: JSON.stringify(output, null, 2) }],
                            structuredContent: output,
                        };
                    } catch { /* not found, try next */ }
                }

                const output = {
                    success: true,
                    exists: false,
                    message: 'No build output found. Run build_project first.',
                };
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(output, null, 2) }],
                    structuredContent: output,
                };
            } catch (error) {
                const output = {
                    success: false,
                    exists: false,
                    message: `Error checking build status: ${error instanceof Error ? error.message : 'Unknown error'}`,
                };
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(output, null, 2) }],
                    structuredContent: output,
                };
            }
        }
    );

    console.log('[MCP] Build tools registered');
}
