#!/usr/bin/env node

import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import * as fs from 'fs/promises';
import * as path from 'path';
import 'dotenv/config';

import { UIAgent, GenerateOptions, PlaybookContext } from './agent.js';

const program = new Command();

/**
 * Detect and load Playbook context from the project
 * Looks for CLAUDE.md and docs/PRD.md created by Playbook Agent
 */
async function loadPlaybookContext(projectPath: string): Promise<PlaybookContext | null> {
    const context: PlaybookContext = {};
    let hasContext = false;

    // Try to load CLAUDE.md
    try {
        const claudeMdPath = path.join(projectPath, 'CLAUDE.md');
        context.claudeMd = await fs.readFile(claudeMdPath, 'utf-8');
        hasContext = true;

        // Extract tech stack from CLAUDE.md if present
        const stackMatch = context.claudeMd.match(/Tech Stack[:\s]*([^\n]+)/i);
        if (stackMatch) {
            context.techStack = stackMatch[1].split(/[,|]/).map(s => s.trim()).filter(Boolean);
        }
    } catch {
        // No CLAUDE.md found
    }

    // Try to load PRD
    try {
        const prdPath = path.join(projectPath, 'docs', 'PRD.md');
        context.prd = await fs.readFile(prdPath, 'utf-8');
        hasContext = true;
    } catch {
        // No PRD found
    }

    // Try to load playbook session info
    try {
        const playbookPath = path.join(projectPath, '.playbook', 'session.json');
        const sessionData = await fs.readFile(playbookPath, 'utf-8');
        const session = JSON.parse(sessionData);
        context.sessionId = session.id;
        context.currentPhase = session.phase;
        hasContext = true;
    } catch {
        // No playbook session found
    }

    return hasContext ? context : null;
}

/**
 * Create UIAgent with automatic Playbook integration
 */
async function createAgent(apiKey: string, options: Partial<GenerateOptions>): Promise<UIAgent> {
    const agent = new UIAgent(apiKey, options);

    // Auto-detect and load Playbook context
    const projectPath = options.projectPath || process.cwd();
    const playbookContext = await loadPlaybookContext(projectPath);

    if (playbookContext) {
        agent.setPlaybookContext(playbookContext);
        console.log(chalk.dim('  ℹ Playbook context detected - using project rules'));
    }

    return agent;
}

program
    .name('ui-agent')
    .description('AI-powered UI component generator for React projects')
    .version('1.0.0');

/**
 * Generate a single component
 */
program
    .command('generate')
    .alias('g')
    .description('Generate a new React component from a description')
    .option('-p, --project <path>', 'Project path', process.cwd())
    .option('-o, --output <dir>', 'Output directory', 'src/components')
    .option('--no-typescript', 'Generate JavaScript instead of TypeScript')
    .option('-s, --styling <type>', 'Styling approach (tailwind, css, styled-components)', 'tailwind')
    .action(async (options) => {
        const apiKey = process.env.ANTHROPIC_API_KEY;
        if (!apiKey) {
            console.error(chalk.red('Error: ANTHROPIC_API_KEY environment variable is required'));
            console.log(chalk.gray('Set it with: export ANTHROPIC_API_KEY=your_key'));
            process.exit(1);
        }

        // Interactive prompt for component description
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'description',
                message: 'Describe the component you want to create:',
                validate: (input) => input.length > 0 || 'Please enter a description',
            },
            {
                type: 'input',
                name: 'name',
                message: 'Component name (optional, will be inferred):',
            },
        ]);

        const spinner = ora('Generating component...').start();

        try {
            const agent = await createAgent(apiKey, {
                projectPath: options.project,
                outputDir: options.output,
                typescript: options.typescript !== false,
                styling: options.styling,
            });

            let prompt = answers.description;
            if (answers.name) {
                prompt = `Create a component called "${answers.name}": ${prompt}`;
            }

            const component = await agent.generateComponent(prompt);
            spinner.text = 'Saving component...';

            const savedPath = await agent.saveComponent(component);
            spinner.succeed(chalk.green(`Component created: ${savedPath}`));

            console.log('\n' + chalk.cyan('Generated code preview:'));
            console.log(chalk.gray('─'.repeat(50)));
            console.log(component.content.slice(0, 500) + (component.content.length > 500 ? '\n...' : ''));
            console.log(chalk.gray('─'.repeat(50)));

        } catch (error) {
            spinner.fail(chalk.red('Failed to generate component'));
            console.error(error instanceof Error ? error.message : error);
            process.exit(1);
        }
    });

/**
 * Generate a complete page with multiple components
 */
program
    .command('page')
    .description('Generate a complete page with all necessary components')
    .option('-p, --project <path>', 'Project path', process.cwd())
    .option('-o, --output <dir>', 'Output directory', 'src/pages')
    .action(async (options) => {
        const apiKey = process.env.ANTHROPIC_API_KEY;
        if (!apiKey) {
            console.error(chalk.red('Error: ANTHROPIC_API_KEY environment variable is required'));
            process.exit(1);
        }

        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'description',
                message: 'Describe the page you want to create:',
                validate: (input) => input.length > 0 || 'Please enter a description',
            },
        ]);

        const spinner = ora('Generating page and components...').start();

        try {
            const agent = await createAgent(apiKey, {
                projectPath: options.project,
                outputDir: options.output,
            });

            const components = await agent.generatePage(answers.description);
            spinner.text = `Saving ${components.length} components...`;

            const savedPaths: string[] = [];
            for (const component of components) {
                const savedPath = await agent.saveComponent(component);
                savedPaths.push(savedPath);
            }

            spinner.succeed(chalk.green(`Created ${components.length} files:`));

            for (const filePath of savedPaths) {
                console.log(chalk.cyan(`  ✓ ${filePath}`));
            }

        } catch (error) {
            spinner.fail(chalk.red('Failed to generate page'));
            console.error(error instanceof Error ? error.message : error);
            process.exit(1);
        }
    });

/**
 * Modify an existing component
 */
program
    .command('modify <file>')
    .alias('m')
    .description('Modify an existing component with AI assistance')
    .option('-p, --project <path>', 'Project path', process.cwd())
    .action(async (file, options) => {
        const apiKey = process.env.ANTHROPIC_API_KEY;
        if (!apiKey) {
            console.error(chalk.red('Error: ANTHROPIC_API_KEY environment variable is required'));
            process.exit(1);
        }

        // Check if file exists
        const filePath = path.resolve(options.project, file);
        try {
            await fs.access(filePath);
        } catch {
            console.error(chalk.red(`File not found: ${filePath}`));
            process.exit(1);
        }

        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'instruction',
                message: 'What changes do you want to make?',
                validate: (input) => input.length > 0 || 'Please enter an instruction',
            },
            {
                type: 'confirm',
                name: 'backup',
                message: 'Create backup before modifying?',
                default: true,
            },
        ]);

        const spinner = ora('Modifying component...').start();

        try {
            // Create backup if requested
            if (answers.backup) {
                const backupPath = filePath + '.backup';
                await fs.copyFile(filePath, backupPath);
                spinner.text = 'Backup created, modifying...';
            }

            const agent = await createAgent(apiKey, {
                projectPath: options.project,
            });

            const modified = await agent.modifyComponent(file, answers.instruction);
            await agent.saveComponent(modified);

            spinner.succeed(chalk.green(`Modified: ${filePath}`));

            if (answers.backup) {
                console.log(chalk.gray(`Backup saved to: ${filePath}.backup`));
            }

        } catch (error) {
            spinner.fail(chalk.red('Failed to modify component'));
            console.error(error instanceof Error ? error.message : error);
            process.exit(1);
        }
    });

/**
 * Interactive chat mode - Lovable-style experience
 */
program
    .command('chat')
    .description('Interactive chat mode for component generation (Lovable-style)')
    .option('-p, --project <path>', 'Project path', process.cwd())
    .action(async (options) => {
        const apiKey = process.env.ANTHROPIC_API_KEY;
        if (!apiKey) {
            console.error(chalk.red('Error: ANTHROPIC_API_KEY environment variable is required'));
            process.exit(1);
        }

        console.log(chalk.cyan('\n╭─────────────────────────────────────────────────────╮'));
        console.log(chalk.cyan('│') + chalk.bold('  🎨 UI Agent - Build beautiful UI with AI          ') + chalk.cyan('│'));
        console.log(chalk.cyan('╰─────────────────────────────────────────────────────╯'));
        console.log();
        console.log(chalk.gray('  Just describe what you want to build in plain language.'));
        console.log(chalk.gray('  I\'ll create professional, production-ready components.\n'));
        console.log(chalk.gray('  Examples:'));
        console.log(chalk.white('    • "A pricing page with 3 plans: Free, Pro, Enterprise"'));
        console.log(chalk.white('    • "A login form with email and password"'));
        console.log(chalk.white('    • "A dashboard sidebar with navigation links"'));
        console.log(chalk.white('    • "A user profile card with avatar and stats"\n'));
        console.log(chalk.gray('  Type "exit" to quit.\n'));

        const agent = await createAgent(apiKey, {
            projectPath: options.project,
        });

        while (true) {
            const { input } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'input',
                    message: chalk.blue('What do you want to build?'),
                },
            ]);

            if (input.toLowerCase() === 'exit' || input.toLowerCase() === 'quit') {
                console.log(chalk.cyan('\n✨ Thanks for using UI Agent! Happy coding!\n'));
                break;
            }

            if (!input.trim()) continue;

            // Determine if it's a page or component request
            const isPageRequest = /page|dashboard|landing|home|about|contact|settings|profile page/i.test(input);

            const spinner = ora({
                text: chalk.gray('Designing your UI...'),
                spinner: 'dots12',
            }).start();

            try {
                if (isPageRequest) {
                    spinner.text = chalk.gray('Creating page with all components...');
                    const components = await agent.generatePage(input);
                    spinner.stop();

                    console.log(chalk.green(`\n✨ Created ${components.length} components:\n`));

                    for (const component of components) {
                        console.log(chalk.cyan(`  📦 ${component.componentName}`));
                        console.log(chalk.gray(`     ${component.filePath}`));
                    }

                    const { save } = await inquirer.prompt([
                        {
                            type: 'confirm',
                            name: 'save',
                            message: 'Save all components to your project?',
                            default: true,
                        },
                    ]);

                    if (save) {
                        for (const component of components) {
                            const savedPath = await agent.saveComponent(component);
                            console.log(chalk.green(`  ✓ ${savedPath}`));
                        }
                        console.log(chalk.green('\n✨ All components saved!\n'));
                    } else {
                        // Show code preview option
                        const { preview } = await inquirer.prompt([
                            {
                                type: 'confirm',
                                name: 'preview',
                                message: 'Would you like to see the code?',
                                default: false,
                            },
                        ]);

                        if (preview) {
                            for (const component of components) {
                                console.log(chalk.cyan(`\n── ${component.componentName} ──`));
                                console.log(component.content);
                            }
                        }
                        console.log();
                    }
                } else {
                    const component = await agent.generateComponent(input);
                    spinner.stop();

                    console.log(chalk.green(`\n✨ ${component.componentName}\n`));
                    console.log(chalk.gray('─'.repeat(60)));
                    console.log(component.content);
                    console.log(chalk.gray('─'.repeat(60)));

                    const { action } = await inquirer.prompt([
                        {
                            type: 'list',
                            name: 'action',
                            message: 'What would you like to do?',
                            choices: [
                                { name: '💾 Save to project', value: 'save' },
                                { name: '📋 Copy to clipboard (manual)', value: 'skip' },
                                { name: '🔄 Try again with different design', value: 'retry' },
                            ],
                        },
                    ]);

                    if (action === 'save') {
                        const savedPath = await agent.saveComponent(component);
                        console.log(chalk.green(`\n✨ Saved to: ${savedPath}\n`));
                    } else if (action === 'retry') {
                        continue;
                    } else {
                        console.log(chalk.gray('\nCode displayed above - copy what you need!\n'));
                    }
                }

            } catch (error) {
                spinner.fail(chalk.red('Oops! Something went wrong'));
                console.error(chalk.gray(error instanceof Error ? error.message : String(error)));
                console.log(chalk.yellow('\nTip: Try rephrasing your request or be more specific.\n'));
            }
        }
    });

/**
 * Quick generation without prompts
 */
program
    .command('quick <description>')
    .alias('q')
    .description('Quickly generate a component without interactive prompts')
    .option('-p, --project <path>', 'Project path', process.cwd())
    .option('-o, --output <dir>', 'Output directory', 'src/components')
    .option('-n, --name <name>', 'Component name')
    .option('--dry-run', 'Show generated code without saving')
    .action(async (description, options) => {
        const apiKey = process.env.ANTHROPIC_API_KEY;
        if (!apiKey) {
            console.error(chalk.red('Error: ANTHROPIC_API_KEY environment variable is required'));
            process.exit(1);
        }

        const spinner = ora('Generating...').start();

        try {
            const agent = await createAgent(apiKey, {
                projectPath: options.project,
                outputDir: options.output,
            });

            let prompt = description;
            if (options.name) {
                prompt = `Create a component called "${options.name}": ${prompt}`;
            }

            const component = await agent.generateComponent(prompt);

            if (options.dryRun) {
                spinner.stop();
                console.log(component.content);
            } else {
                const savedPath = await agent.saveComponent(component);
                spinner.succeed(chalk.green(savedPath));
            }

        } catch (error) {
            spinner.fail(chalk.red('Failed'));
            console.error(error instanceof Error ? error.message : error);
            process.exit(1);
        }
    });

program.parse();
