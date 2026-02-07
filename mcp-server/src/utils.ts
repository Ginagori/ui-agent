import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { exec } from 'node:child_process';

/**
 * Detect the package manager used in a project
 */
export async function detectPackageManager(
    projectPath: string
): Promise<'pnpm' | 'yarn' | 'npm'> {
    try {
        await fs.access(path.join(projectPath, 'pnpm-lock.yaml'));
        return 'pnpm';
    } catch { /* not pnpm */ }
    try {
        await fs.access(path.join(projectPath, 'yarn.lock'));
        return 'yarn';
    } catch { /* not yarn */ }
    return 'npm';
}

/**
 * Execute a shell command in a directory with timeout
 */
export function execCommand(
    command: string,
    cwd: string,
    timeoutMs = 60000
): Promise<{ stdout: string; stderr: string }> {
    return new Promise((resolve, reject) => {
        const child = exec(
            command,
            { cwd, encoding: 'utf-8', timeout: timeoutMs },
            (error, stdout, stderr) => {
                if (error) {
                    reject(new Error(
                        `Command failed: ${command}\n${stderr || error.message}`
                    ));
                } else {
                    resolve({ stdout: stdout || '', stderr: stderr || '' });
                }
            }
        );
        child.unref();
    });
}
