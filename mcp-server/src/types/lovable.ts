import * as z from 'zod';

/**
 * Lovable project schema
 */
export const LovableProjectSchema = z.object({
    id: z.string().describe('Unique project identifier'),
    name: z.string().describe('Project name'),
    description: z.string().optional().describe('Project description'),
    status: z.enum(['active', 'archived', 'deleted']).describe('Project status'),
    framework: z.enum(['react', 'nextjs', 'vue']).default('react').describe('Frontend framework'),
    createdAt: z.string().datetime().describe('Creation timestamp'),
    updatedAt: z.string().datetime().describe('Last update timestamp'),
    deployUrl: z.string().url().optional().describe('Deployed application URL'),
});

export type LovableProject = z.infer<typeof LovableProjectSchema>;

/**
 * File operation schema
 */
export const FileOperationSchema = z.object({
    path: z.string().describe('File path relative to project root'),
    content: z.string().describe('File content'),
    operation: z.enum(['create', 'update', 'delete']).describe('Operation type'),
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
 * Deployment configuration
 */
export const DeployConfigSchema = z.object({
    projectId: z.string().describe('Project ID to deploy'),
    environment: z.enum(['preview', 'production']).default('preview'),
    branch: z.string().default('main').describe('Git branch to deploy'),
});

export type DeployConfig = z.infer<typeof DeployConfigSchema>;

/**
 * Deployment status
 */
export const DeployStatusSchema = z.object({
    id: z.string().describe('Deployment ID'),
    projectId: z.string(),
    status: z.enum(['pending', 'building', 'deploying', 'success', 'failed']),
    url: z.string().url().optional(),
    error: z.string().optional(),
    startedAt: z.string().datetime(),
    completedAt: z.string().datetime().optional(),
});

export type DeployStatus = z.infer<typeof DeployStatusSchema>;

/**
 * API Response wrapper
 */
export interface LovableApiResponse<T> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
    };
}
