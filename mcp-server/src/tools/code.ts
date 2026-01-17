import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import * as z from 'zod';
import { LovableApiClient } from '../client/lovable-api.js';

/**
 * Register code editing tools with the MCP server
 */
export function registerCodeTools(server: McpServer): void {
    const client = new LovableApiClient();

    // Edit a file in the project
    server.registerTool(
        'edit_file',
        {
            title: 'Edit File',
            description: 'Create or update a file in a Lovable project. Supports all file types (tsx, ts, css, json, etc.)',
            inputSchema: {
                projectId: z.string().describe('The project ID'),
                filePath: z.string().describe('File path relative to project root (e.g., "src/components/Button.tsx")'),
                content: z.string().describe('The complete file content'),
                commitMessage: z.string().optional().describe('Optional commit message for the change'),
            },
            outputSchema: {
                success: z.boolean(),
                filePath: z.string(),
                message: z.string(),
            }
        },
        async ({ projectId, filePath, content, commitMessage }) => {
            try {
                await client.editFile(projectId, {
                    path: filePath,
                    content,
                    operation: 'update',
                }, commitMessage);

                const output = {
                    success: true,
                    filePath,
                    message: `File "${filePath}" updated successfully`,
                };

                return {
                    content: [{ type: 'text', text: JSON.stringify(output, null, 2) }],
                    structuredContent: output,
                };
            } catch (error) {
                const output = {
                    success: false,
                    filePath,
                    message: `Failed to edit file: ${error instanceof Error ? error.message : 'Unknown error'}`,
                };
                return {
                    content: [{ type: 'text', text: JSON.stringify(output, null, 2) }],
                    structuredContent: output,
                };
            }
        }
    );

    // Add a new React component
    server.registerTool(
        'add_component',
        {
            title: 'Add React Component',
            description: 'Create a new React component with boilerplate code. Automatically sets up TypeScript, props interface, and styling.',
            inputSchema: {
                projectId: z.string().describe('The project ID'),
                componentName: z.string().describe('Component name in PascalCase (e.g., "UserProfile")'),
                componentType: z.enum(['page', 'component', 'layout']).default('component').describe('Type of component'),
                directory: z.string().default('src/components').describe('Directory to create the component in'),
                props: z.array(z.object({
                    name: z.string(),
                    type: z.string(),
                    required: z.boolean().default(true),
                })).optional().describe('Component props to define'),
                includeStyles: z.boolean().default(true).describe('Include Tailwind styling'),
            },
            outputSchema: {
                success: z.boolean(),
                filePath: z.string(),
                componentCode: z.string().optional(),
                message: z.string(),
            }
        },
        async ({ projectId, componentName, componentType: _componentType, directory, props, includeStyles }) => {
            try {
                // Generate component code
                const propsInterface = props && props.length > 0
                    ? `interface ${componentName}Props {\n${props.map(p =>
                        `  ${p.name}${p.required ? '' : '?'}: ${p.type};`
                      ).join('\n')}\n}\n\n`
                    : '';

                const propsParam = props && props.length > 0
                    ? `{ ${props.map(p => p.name).join(', ')} }: ${componentName}Props`
                    : '';

                const styling = includeStyles
                    ? 'className="p-4 rounded-lg bg-white shadow-md"'
                    : '';

                const componentCode = `${propsInterface}export function ${componentName}(${propsParam}) {
  return (
    <div ${styling}>
      <h2 className="text-xl font-semibold">${componentName}</h2>
      {/* Add your component content here */}
    </div>
  );
}

export default ${componentName};
`;

                const filePath = `${directory}/${componentName}.tsx`;

                await client.editFile(projectId, {
                    path: filePath,
                    content: componentCode,
                    operation: 'create',
                }, `Add ${componentName} component`);

                const output = {
                    success: true,
                    filePath,
                    componentCode,
                    message: `Component "${componentName}" created at ${filePath}`,
                };

                return {
                    content: [{ type: 'text', text: JSON.stringify(output, null, 2) }],
                    structuredContent: output,
                };
            } catch (error) {
                const output = {
                    success: false,
                    filePath: '',
                    message: `Failed to create component: ${error instanceof Error ? error.message : 'Unknown error'}`,
                };
                return {
                    content: [{ type: 'text', text: JSON.stringify(output, null, 2) }],
                    structuredContent: output,
                };
            }
        }
    );

    // Get file content
    server.registerTool(
        'get_file',
        {
            title: 'Get File Content',
            description: 'Read the content of a file from a Lovable project',
            inputSchema: {
                projectId: z.string().describe('The project ID'),
                filePath: z.string().describe('File path relative to project root'),
            },
            outputSchema: {
                success: z.boolean(),
                filePath: z.string(),
                content: z.string().optional(),
                message: z.string().optional(),
            }
        },
        async ({ projectId, filePath }) => {
            try {
                const content = await client.getFileContent(projectId, filePath);

                const output = {
                    success: true,
                    filePath,
                    content,
                };

                return {
                    content: [{ type: 'text', text: JSON.stringify(output, null, 2) }],
                    structuredContent: output,
                };
            } catch (error) {
                const output = {
                    success: false,
                    filePath,
                    message: `File not found or error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                };
                return {
                    content: [{ type: 'text', text: JSON.stringify(output, null, 2) }],
                    structuredContent: output,
                };
            }
        }
    );

    // List project files
    server.registerTool(
        'list_files',
        {
            title: 'List Project Files',
            description: 'List all files in a Lovable project or a specific directory',
            inputSchema: {
                projectId: z.string().describe('The project ID'),
                directory: z.string().default('').describe('Directory to list (empty for root)'),
                pattern: z.string().optional().describe('Glob pattern to filter files (e.g., "**/*.tsx")'),
            },
            outputSchema: {
                success: z.boolean(),
                files: z.array(z.object({
                    path: z.string(),
                    type: z.enum(['file', 'directory']),
                    size: z.number().optional(),
                })),
                total: z.number(),
            }
        },
        async ({ projectId, directory, pattern }) => {
            try {
                const files = await client.listFiles(projectId, directory, pattern);

                const output = {
                    success: true,
                    files,
                    total: files.length,
                };

                return {
                    content: [{ type: 'text', text: JSON.stringify(output, null, 2) }],
                    structuredContent: output,
                };
            } catch (error) {
                const output = {
                    success: false,
                    files: [],
                    total: 0,
                };
                return {
                    content: [{ type: 'text', text: `Error listing files: ${error}` }],
                    structuredContent: output,
                };
            }
        }
    );

    // Install npm dependency
    server.registerTool(
        'install_dependency',
        {
            title: 'Install NPM Dependency',
            description: 'Install an npm package in a Lovable project',
            inputSchema: {
                projectId: z.string().describe('The project ID'),
                packageName: z.string().describe('NPM package name (e.g., "lodash", "@tanstack/react-query")'),
                version: z.string().optional().describe('Specific version (e.g., "^4.0.0")'),
                isDev: z.boolean().default(false).describe('Install as dev dependency'),
            },
            outputSchema: {
                success: z.boolean(),
                packageName: z.string(),
                version: z.string().optional(),
                message: z.string(),
            }
        },
        async ({ projectId, packageName, version, isDev }) => {
            try {
                const result = await client.installDependency(projectId, {
                    name: packageName,
                    version,
                    isDev,
                });

                const output = {
                    success: true,
                    packageName,
                    version: result.installedVersion,
                    message: `Package "${packageName}@${result.installedVersion}" installed successfully`,
                };

                return {
                    content: [{ type: 'text', text: JSON.stringify(output, null, 2) }],
                    structuredContent: output,
                };
            } catch (error) {
                const output = {
                    success: false,
                    packageName,
                    message: `Failed to install package: ${error instanceof Error ? error.message : 'Unknown error'}`,
                };
                return {
                    content: [{ type: 'text', text: JSON.stringify(output, null, 2) }],
                    structuredContent: output,
                };
            }
        }
    );

    console.log('[MCP] Code tools registered');
}
