import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import * as z from 'zod';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { detectPackageManager, execCommand } from '../utils.js';

const IGNORED_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '.next', '.cache']);

/**
 * Register code editing tools with the MCP server
 */
export function registerCodeTools(server: McpServer): void {

    // Edit/create a file in the project
    server.registerTool(
        'edit_file',
        {
            title: 'Edit File',
            description: 'Create or update a file in a local project. Creates parent directories automatically.',
            inputSchema: {
                projectPath: z.string().describe('Absolute path to the project root'),
                filePath: z.string().describe('File path relative to project root (e.g., "src/components/Button.tsx")'),
                content: z.string().describe('The complete file content'),
            },
            outputSchema: {
                success: z.boolean(),
                filePath: z.string(),
                message: z.string(),
            }
        },
        async ({ projectPath, filePath, content }) => {
            try {
                const fullPath = path.resolve(projectPath, filePath);
                await fs.mkdir(path.dirname(fullPath), { recursive: true });
                await fs.writeFile(fullPath, content, 'utf-8');

                const output = {
                    success: true,
                    filePath,
                    message: `File "${filePath}" saved successfully`,
                };
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(output, null, 2) }],
                    structuredContent: output,
                };
            } catch (error) {
                const output = {
                    success: false,
                    filePath,
                    message: `Failed to edit file: ${error instanceof Error ? error.message : 'Unknown error'}`,
                };
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(output, null, 2) }],
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
            description: 'Create a new React component file with TypeScript, props interface, and Tailwind styling',
            inputSchema: {
                projectPath: z.string().describe('Absolute path to the project root'),
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
        async ({ projectPath, componentName, directory, props, includeStyles }) => {
            try {
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
                const fullPath = path.resolve(projectPath, filePath);
                await fs.mkdir(path.dirname(fullPath), { recursive: true });
                await fs.writeFile(fullPath, componentCode, 'utf-8');

                const output = {
                    success: true,
                    filePath,
                    componentCode,
                    message: `Component "${componentName}" created at ${filePath}`,
                };
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(output, null, 2) }],
                    structuredContent: output,
                };
            } catch (error) {
                const output = {
                    success: false,
                    filePath: '',
                    message: `Failed to create component: ${error instanceof Error ? error.message : 'Unknown error'}`,
                };
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(output, null, 2) }],
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
            description: 'Read the content of a file from a local project',
            inputSchema: {
                projectPath: z.string().describe('Absolute path to the project root'),
                filePath: z.string().describe('File path relative to project root'),
            },
            outputSchema: {
                success: z.boolean(),
                filePath: z.string(),
                content: z.string().optional(),
                message: z.string().optional(),
            }
        },
        async ({ projectPath, filePath }) => {
            try {
                const fullPath = path.resolve(projectPath, filePath);
                const content = await fs.readFile(fullPath, 'utf-8');

                const output = { success: true, filePath, content };
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(output, null, 2) }],
                    structuredContent: output,
                };
            } catch (error) {
                const output = {
                    success: false,
                    filePath,
                    message: `File not found or error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                };
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(output, null, 2) }],
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
            description: 'List files in a local project directory (excludes node_modules, .git, dist)',
            inputSchema: {
                projectPath: z.string().describe('Absolute path to the project root'),
                directory: z.string().default('').describe('Subdirectory to list (empty for root)'),
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
        async ({ projectPath, directory }) => {
            try {
                const targetDir = path.resolve(projectPath, directory);
                const files: Array<{ path: string; type: 'file' | 'directory'; size?: number }> = [];

                async function walk(dir: string, prefix: string): Promise<void> {
                    const entries = await fs.readdir(dir, { withFileTypes: true });
                    for (const entry of entries) {
                        if (IGNORED_DIRS.has(entry.name)) continue;
                        const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
                        if (entry.isDirectory()) {
                            files.push({ path: relativePath, type: 'directory' });
                            await walk(path.join(dir, entry.name), relativePath);
                        } else {
                            const stat = await fs.stat(path.join(dir, entry.name));
                            files.push({ path: relativePath, type: 'file', size: stat.size });
                        }
                    }
                }

                await walk(targetDir, '');

                const output = { success: true, files, total: files.length };
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(output, null, 2) }],
                    structuredContent: output,
                };
            } catch (error) {
                const output = { success: false, files: [], total: 0 };
                return {
                    content: [{ type: 'text' as const, text: `Error listing files: ${error}` }],
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
            description: 'Install an npm package in a local project using the detected package manager (pnpm/yarn/npm)',
            inputSchema: {
                projectPath: z.string().describe('Absolute path to the project root'),
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
        async ({ projectPath, packageName, version, isDev }) => {
            try {
                const resolvedPath = path.resolve(projectPath);
                const pm = await detectPackageManager(resolvedPath);
                const pkg = version ? `${packageName}@${version}` : packageName;

                let command: string;
                if (pm === 'pnpm') {
                    command = `pnpm add ${isDev ? '-D ' : ''}${pkg}`;
                } else if (pm === 'yarn') {
                    command = `yarn add ${isDev ? '--dev ' : ''}${pkg}`;
                } else {
                    command = `npm install ${isDev ? '--save-dev ' : ''}${pkg}`;
                }

                await execCommand(command, resolvedPath);

                // Read installed version from package.json
                const pkgData = JSON.parse(
                    await fs.readFile(path.join(resolvedPath, 'package.json'), 'utf-8')
                );
                const deps = isDev ? pkgData.devDependencies : pkgData.dependencies;
                const installedVersion = deps?.[packageName] || version || 'latest';

                const output = {
                    success: true,
                    packageName,
                    version: installedVersion,
                    message: `Package "${packageName}@${installedVersion}" installed with ${pm}`,
                };
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(output, null, 2) }],
                    structuredContent: output,
                };
            } catch (error) {
                const output = {
                    success: false,
                    packageName,
                    message: `Failed to install package: ${error instanceof Error ? error.message : 'Unknown error'}`,
                };
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(output, null, 2) }],
                    structuredContent: output,
                };
            }
        }
    );

    console.log('[MCP] Code tools registered');
}
