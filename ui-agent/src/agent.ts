import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs/promises';
import * as path from 'path';
import { glob } from 'glob';
import { buildDesignSystemPrompt } from './prompts/design-system.js';

export interface GenerateOptions {
    projectPath: string;
    outputDir: string;
    framework: 'react' | 'nextjs' | 'vue';
    styling: 'tailwind' | 'css' | 'styled-components';
    typescript: boolean;
}

export interface ComponentSpec {
    name: string;
    description: string;
    props?: Array<{ name: string; type: string; required: boolean; description?: string }>;
    children?: boolean;
    variants?: string[];
}

export interface GeneratedComponent {
    filePath: string;
    content: string;
    componentName: string;
}

export interface PlaybookContext {
    sessionId?: string;
    prd?: string;
    claudeMd?: string;
    techStack?: string[];
    currentPhase?: string;
}

/**
 * UI Agent - Generates React components using Claude AI
 * Integrates with Playbook Agent for coordinated project development
 */
export class UIAgent {
    private client: Anthropic;
    private options: GenerateOptions;
    private playbookContext: PlaybookContext | null = null;

    constructor(apiKey: string, options: Partial<GenerateOptions> = {}) {
        this.client = new Anthropic({ apiKey });
        this.options = {
            projectPath: process.cwd(),
            outputDir: 'src/components',
            framework: 'react',
            styling: 'tailwind',
            typescript: true,
            ...options,
        };
    }

    /**
     * Set Playbook context for integrated workflow
     */
    setPlaybookContext(context: PlaybookContext): void {
        this.playbookContext = context;
    }

    /**
     * Get current Playbook context
     */
    getPlaybookContext(): PlaybookContext | null {
        return this.playbookContext;
    }

    /**
     * Generate a component from a natural language description
     */
    async generateComponent(prompt: string): Promise<GeneratedComponent> {
        const projectContext = await this.getProjectContext();

        const systemPrompt = this.buildSystemPrompt(projectContext);

        const response = await this.client.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 4096,
            system: systemPrompt,
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
        });

        const content = response.content[0];
        if (content.type !== 'text') {
            throw new Error('Unexpected response type');
        }

        return this.parseGeneratedComponent(content.text);
    }

    /**
     * Generate multiple components for a page/feature
     */
    async generatePage(description: string): Promise<GeneratedComponent[]> {
        const projectContext = await this.getProjectContext();

        const systemPrompt = `${this.buildSystemPrompt(projectContext)}

When generating a page, create ALL necessary components:
1. The main page component
2. All child components used by the page
3. Any shared UI components needed

Return each component in a separate code block with the filename as a comment at the top.`;

        const response = await this.client.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 8192,
            system: systemPrompt,
            messages: [
                {
                    role: 'user',
                    content: `Create a complete page: ${description}`,
                },
            ],
        });

        const content = response.content[0];
        if (content.type !== 'text') {
            throw new Error('Unexpected response type');
        }

        return this.parseMultipleComponents(content.text);
    }

    /**
     * Modify an existing component
     */
    async modifyComponent(filePath: string, instruction: string): Promise<GeneratedComponent> {
        const absolutePath = path.resolve(this.options.projectPath, filePath);
        const existingCode = await fs.readFile(absolutePath, 'utf-8');
        const projectContext = await this.getProjectContext();

        const response = await this.client.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 4096,
            system: this.buildSystemPrompt(projectContext),
            messages: [
                {
                    role: 'user',
                    content: `Modify this existing component:

\`\`\`tsx
${existingCode}
\`\`\`

Instruction: ${instruction}

Return the complete modified component code.`,
                },
            ],
        });

        const content = response.content[0];
        if (content.type !== 'text') {
            throw new Error('Unexpected response type');
        }

        const result = this.parseGeneratedComponent(content.text);
        result.filePath = filePath;
        return result;
    }

    /**
     * Save generated component to file
     */
    async saveComponent(component: GeneratedComponent): Promise<string> {
        const fullPath = path.resolve(this.options.projectPath, component.filePath);
        const dir = path.dirname(fullPath);

        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(fullPath, component.content, 'utf-8');

        return fullPath;
    }

    /**
     * Get context about the existing project
     * Includes Playbook context if available (PRD, CLAUDE.md, tech stack)
     */
    private async getProjectContext(): Promise<string> {
        const projectPath = this.options.projectPath;
        let context = '';

        // === PLAYBOOK INTEGRATION ===
        // If we have Playbook context, include it for better generation
        if (this.playbookContext) {
            context += '=== PLAYBOOK PROJECT CONTEXT ===\n';

            if (this.playbookContext.currentPhase) {
                context += `Current Phase: ${this.playbookContext.currentPhase}\n`;
            }

            if (this.playbookContext.techStack && this.playbookContext.techStack.length > 0) {
                context += `Tech Stack: ${this.playbookContext.techStack.join(', ')}\n`;
            }

            if (this.playbookContext.claudeMd) {
                context += `\nProject Rules (CLAUDE.md):\n${this.playbookContext.claudeMd.slice(0, 2000)}\n`;
            }

            if (this.playbookContext.prd) {
                context += `\nProject Requirements (PRD excerpt):\n${this.playbookContext.prd.slice(0, 1500)}\n`;
            }

            context += '=== END PLAYBOOK CONTEXT ===\n\n';
        }

        // === AUTO-DETECT PLAYBOOK FILES ===
        // Check for CLAUDE.md in project root (created by Playbook)
        try {
            const claudeMdPath = path.join(projectPath, 'CLAUDE.md');
            const claudeMd = await fs.readFile(claudeMdPath, 'utf-8');
            if (!this.playbookContext?.claudeMd) {
                context += `=== PROJECT CLAUDE.md ===\n${claudeMd.slice(0, 2000)}\n=== END CLAUDE.md ===\n\n`;
            }
        } catch {
            // No CLAUDE.md found
        }

        // Check for PRD.md in docs/ (created by Playbook)
        try {
            const prdPath = path.join(projectPath, 'docs', 'PRD.md');
            const prd = await fs.readFile(prdPath, 'utf-8');
            if (!this.playbookContext?.prd) {
                context += `=== PROJECT PRD (excerpt) ===\n${prd.slice(0, 1500)}\n=== END PRD ===\n\n`;
            }
        } catch {
            // No PRD found
        }

        // Check for package.json
        try {
            const packageJson = await fs.readFile(
                path.join(projectPath, 'package.json'),
                'utf-8'
            );
            const pkg = JSON.parse(packageJson);
            context += `Project: ${pkg.name || 'Unknown'}\n`;
            context += `Dependencies: ${Object.keys(pkg.dependencies || {}).join(', ')}\n`;
        } catch {
            // No package.json found
        }

        // Check for tailwind config
        try {
            await fs.access(path.join(projectPath, 'tailwind.config.js'));
            context += 'Tailwind CSS: Yes\n';
        } catch {
            try {
                await fs.access(path.join(projectPath, 'tailwind.config.ts'));
                context += 'Tailwind CSS: Yes\n';
            } catch {
                // No tailwind
            }
        }

        // Get existing components for reference
        try {
            const componentFiles = await glob('**/components/**/*.{tsx,jsx}', {
                cwd: projectPath,
                ignore: ['node_modules/**'],
            });

            if (componentFiles.length > 0) {
                context += `\nExisting components:\n`;
                for (const file of componentFiles.slice(0, 5)) {
                    context += `- ${file}\n`;
                }
                if (componentFiles.length > 5) {
                    context += `... and ${componentFiles.length - 5} more\n`;
                }
            }
        } catch {
            // Glob failed
        }

        // Sample an existing component for style reference
        try {
            const sampleFiles = await glob('**/components/**/*.tsx', {
                cwd: projectPath,
                ignore: ['node_modules/**'],
            });

            if (sampleFiles.length > 0) {
                const sampleContent = await fs.readFile(
                    path.join(projectPath, sampleFiles[0]),
                    'utf-8'
                );
                context += `\nSample component style:\n\`\`\`tsx\n${sampleContent.slice(0, 1000)}\n\`\`\`\n`;
            }
        } catch {
            // Sample failed
        }

        return context;
    }

    /**
     * Build the system prompt for Claude using the professional design system
     */
    private buildSystemPrompt(projectContext: string): string {
        return buildDesignSystemPrompt({
            framework: this.options.framework,
            styling: this.options.styling,
            typescript: this.options.typescript,
            projectContext,
        });
    }

    /**
     * Parse generated component from Claude's response
     */
    private parseGeneratedComponent(response: string): GeneratedComponent {
        // Extract code block
        const codeMatch = response.match(/```(?:tsx?|jsx?|typescript|javascript)?\n([\s\S]*?)```/);
        if (!codeMatch) {
            throw new Error('No code block found in response');
        }

        const code = codeMatch[1].trim();

        // Extract filepath from comment
        const pathMatch = code.match(/\/\/\s*filepath:\s*(.+\.(?:tsx?|jsx?))/i);
        let filePath = pathMatch ? pathMatch[1].trim() : '';

        // Extract component name
        const nameMatch = code.match(/(?:export\s+(?:default\s+)?function|const)\s+(\w+)/);
        const componentName = nameMatch ? nameMatch[1] : 'Component';

        // Generate filepath if not found
        if (!filePath) {
            const ext = this.options.typescript ? 'tsx' : 'jsx';
            filePath = `${this.options.outputDir}/${componentName}.${ext}`;
        }

        // Remove filepath comment from code
        const cleanCode = code.replace(/\/\/\s*filepath:.*\n?/i, '').trim();

        return {
            filePath,
            content: cleanCode,
            componentName,
        };
    }

    /**
     * Parse multiple components from response
     */
    private parseMultipleComponents(response: string): GeneratedComponent[] {
        const components: GeneratedComponent[] = [];
        const codeBlocks = response.matchAll(/```(?:tsx?|jsx?|typescript|javascript)?\n([\s\S]*?)```/g);

        for (const match of codeBlocks) {
            try {
                const code = match[1].trim();
                const parsed = this.parseGeneratedComponent('```tsx\n' + code + '\n```');
                components.push(parsed);
            } catch {
                // Skip invalid blocks
            }
        }

        return components;
    }
}
