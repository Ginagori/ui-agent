import * as z from 'zod';

/**
 * Local project info read from filesystem
 */
export const ProjectSchema = z.object({
    name: z.string().describe('Project name'),
    path: z.string().describe('Absolute path to project directory'),
    description: z.string().optional().describe('Project description'),
    framework: z.enum(['react', 'nextjs', 'vue']).default('react').describe('Frontend framework'),
    dependencies: z.record(z.string()).optional(),
    devDependencies: z.record(z.string()).optional(),
});

export type Project = z.infer<typeof ProjectSchema>;

/**
 * File operation schema
 */
export const FileOperationSchema = z.object({
    path: z.string().describe('File path relative to project root'),
    content: z.string().describe('File content'),
});

export type FileOperation = z.infer<typeof FileOperationSchema>;

/**
 * Component schema for React components
 */
export const ComponentSchema = z.object({
    name: z.string().describe('Component name (PascalCase)'),
    type: z.enum(['page', 'component', 'layout', 'hook']).describe('Component type'),
    props: z.array(z.object({
        name: z.string(),
        type: z.string(),
        required: z.boolean().default(false),
    })).optional().describe('Component props'),
    styling: z.enum(['tailwind', 'css', 'styled-components']).default('tailwind'),
});

export type Component = z.infer<typeof ComponentSchema>;

/**
 * Build result from running local build command
 */
export const BuildResultSchema = z.object({
    success: z.boolean(),
    outputDir: z.string().optional(),
    duration: z.number().optional().describe('Build time in ms'),
    error: z.string().optional(),
});

export type BuildResult = z.infer<typeof BuildResultSchema>;
