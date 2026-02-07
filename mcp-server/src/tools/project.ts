import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import * as z from 'zod';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { detectPackageManager } from '../utils.js';

/**
 * Register project management tools with the MCP server
 */
export function registerProjectTools(server: McpServer): void {

    // Create a new local React project with Vite + Tailwind
    server.registerTool(
        'create_project',
        {
            title: 'Create Project',
            description: 'Create a new React/Vite project with TypeScript and Tailwind CSS in the local filesystem',
            inputSchema: {
                parentPath: z.string().describe('Parent directory where the project folder will be created'),
                name: z.string().min(1).max(100).describe('Project name (will be the folder name)'),
                description: z.string().max(500).optional().describe('Project description'),
                installDeps: z.boolean().default(true).describe('Run package install after scaffolding'),
            },
            outputSchema: {
                success: z.boolean(),
                projectPath: z.string().optional(),
                message: z.string(),
            }
        },
        async ({ parentPath, name, description }) => {
            try {
                const projectPath = path.resolve(parentPath, name);
                await fs.mkdir(path.join(projectPath, 'src', 'components'), { recursive: true });
                await fs.mkdir(path.join(projectPath, 'public'), { recursive: true });

                const pkgJson = {
                    name,
                    version: '0.1.0',
                    private: true,
                    type: 'module',
                    description: description || '',
                    scripts: {
                        dev: 'vite',
                        build: 'tsc -b && vite build',
                        preview: 'vite preview',
                    },
                    dependencies: {
                        'react': '^19.0.0',
                        'react-dom': '^19.0.0',
                    },
                    devDependencies: {
                        '@types/react': '^19.0.0',
                        '@types/react-dom': '^19.0.0',
                        '@vitejs/plugin-react': '^4.3.0',
                        'autoprefixer': '^10.4.20',
                        'postcss': '^8.4.47',
                        'tailwindcss': '^3.4.0',
                        'typescript': '^5.6.0',
                        'vite': '^6.0.0',
                    },
                };

                const tsconfig = {
                    compilerOptions: {
                        target: 'ES2020',
                        useDefineForClassFields: true,
                        lib: ['ES2020', 'DOM', 'DOM.Iterable'],
                        module: 'ESNext',
                        skipLibCheck: true,
                        moduleResolution: 'bundler',
                        allowImportingTsExtensions: true,
                        isolatedModules: true,
                        moduleDetection: 'force',
                        noEmit: true,
                        jsx: 'react-jsx',
                        strict: true,
                        noUnusedLocals: true,
                        noUnusedParameters: true,
                        noFallthroughCasesInSwitch: true,
                        noUncheckedSideEffectImports: true,
                    },
                    include: ['src'],
                };

                const viteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
`;

                const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {} },
  plugins: [],
}
`;

                const postcssConfig = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`;

                const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${name}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;

                const mainTsx = `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
`;

                const appTsx = `function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">${name}</h1>
        <p className="mt-2 text-gray-600">Ready to build something amazing</p>
      </div>
    </div>
  )
}

export default App
`;

                const indexCss = `@tailwind base;
@tailwind components;
@tailwind utilities;
`;

                const viteEnvDts = `/// <reference types="vite/client" />
`;

                await Promise.all([
                    fs.writeFile(path.join(projectPath, 'package.json'), JSON.stringify(pkgJson, null, 2)),
                    fs.writeFile(path.join(projectPath, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2)),
                    fs.writeFile(path.join(projectPath, 'vite.config.ts'), viteConfig),
                    fs.writeFile(path.join(projectPath, 'tailwind.config.js'), tailwindConfig),
                    fs.writeFile(path.join(projectPath, 'postcss.config.js'), postcssConfig),
                    fs.writeFile(path.join(projectPath, 'index.html'), indexHtml),
                    fs.writeFile(path.join(projectPath, 'src', 'main.tsx'), mainTsx),
                    fs.writeFile(path.join(projectPath, 'src', 'App.tsx'), appTsx),
                    fs.writeFile(path.join(projectPath, 'src', 'index.css'), indexCss),
                    fs.writeFile(path.join(projectPath, 'src', 'vite-env.d.ts'), viteEnvDts),
                ]);

                const output = {
                    success: true,
                    projectPath,
                    message: `Project "${name}" created at ${projectPath}`,
                };

                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(output, null, 2) }],
                    structuredContent: output,
                };
            } catch (error) {
                const output = {
                    success: false,
                    message: `Failed to create project: ${error instanceof Error ? error.message : 'Unknown error'}`,
                };
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(output, null, 2) }],
                    structuredContent: output,
                };
            }
        }
    );

    // List projects in a directory
    server.registerTool(
        'list_projects',
        {
            title: 'List Projects',
            description: 'List local projects (directories with package.json) in a given path',
            inputSchema: {
                parentPath: z.string().describe('Directory to scan for projects'),
            },
            outputSchema: {
                success: z.boolean(),
                projects: z.array(z.object({
                    name: z.string(),
                    path: z.string(),
                    framework: z.string().optional(),
                })),
                total: z.number(),
            }
        },
        async ({ parentPath }) => {
            try {
                const resolvedPath = path.resolve(parentPath);
                const entries = await fs.readdir(resolvedPath, { withFileTypes: true });
                const projects: Array<{ name: string; path: string; framework?: string }> = [];

                for (const entry of entries) {
                    if (!entry.isDirectory()) continue;
                    const dirPath = path.join(resolvedPath, entry.name);
                    try {
                        const pkgPath = path.join(dirPath, 'package.json');
                        const pkgData = await fs.readFile(pkgPath, 'utf-8');
                        const pkg = JSON.parse(pkgData);
                        const deps = { ...pkg.dependencies, ...pkg.devDependencies };
                        let framework: string | undefined;
                        if (deps['next']) framework = 'nextjs';
                        else if (deps['react']) framework = 'react';
                        else if (deps['vue']) framework = 'vue';

                        projects.push({
                            name: pkg.name || entry.name,
                            path: dirPath,
                            framework,
                        });
                    } catch {
                        // No package.json or invalid, skip
                    }
                }

                const output = { success: true, projects, total: projects.length };
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(output, null, 2) }],
                    structuredContent: output,
                };
            } catch (error) {
                const output = { success: false, projects: [], total: 0 };
                return {
                    content: [{ type: 'text' as const, text: `Error listing projects: ${error}` }],
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
            description: 'Get detailed information about a local project (reads package.json and detects configs)',
            inputSchema: {
                projectPath: z.string().describe('Absolute path to the project directory'),
            },
            outputSchema: {
                success: z.boolean(),
                project: z.object({
                    name: z.string(),
                    path: z.string(),
                    description: z.string().optional(),
                    framework: z.string().optional(),
                    packageManager: z.string().optional(),
                    hasTailwind: z.boolean(),
                    hasTypescript: z.boolean(),
                    dependencies: z.record(z.string()).optional(),
                }).optional(),
                message: z.string().optional(),
            }
        },
        async ({ projectPath }) => {
            try {
                const resolvedPath = path.resolve(projectPath);
                const pkgData = await fs.readFile(
                    path.join(resolvedPath, 'package.json'), 'utf-8'
                );
                const pkg = JSON.parse(pkgData);
                const deps = { ...pkg.dependencies, ...pkg.devDependencies };

                let framework: string | undefined;
                if (deps['next']) framework = 'nextjs';
                else if (deps['react']) framework = 'react';
                else if (deps['vue']) framework = 'vue';

                let hasTailwind = false;
                try {
                    await fs.access(path.join(resolvedPath, 'tailwind.config.js'));
                    hasTailwind = true;
                } catch {
                    try {
                        await fs.access(path.join(resolvedPath, 'tailwind.config.ts'));
                        hasTailwind = true;
                    } catch { /* no tailwind */ }
                }

                let hasTypescript = false;
                try {
                    await fs.access(path.join(resolvedPath, 'tsconfig.json'));
                    hasTypescript = true;
                } catch { /* no ts */ }

                const packageManager = await detectPackageManager(resolvedPath);

                const output = {
                    success: true,
                    project: {
                        name: pkg.name || path.basename(resolvedPath),
                        path: resolvedPath,
                        description: pkg.description,
                        framework,
                        packageManager,
                        hasTailwind,
                        hasTypescript,
                        dependencies: pkg.dependencies,
                    },
                };

                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(output, null, 2) }],
                    structuredContent: output,
                };
            } catch (error) {
                const output = {
                    success: false,
                    message: `Project not found or error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                };
                return {
                    content: [{ type: 'text' as const, text: JSON.stringify(output, null, 2) }],
                    structuredContent: output,
                };
            }
        }
    );

    console.log('[MCP] Project tools registered');
}
