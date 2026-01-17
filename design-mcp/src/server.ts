#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import * as cheerio from 'cheerio';

const server = new McpServer({
    name: 'design-inspiration',
    version: '1.0.0',
});

// User agent to avoid being blocked
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

interface DesignResult {
    title: string;
    url: string;
    imageUrl: string;
    author?: string;
    likes?: number;
    tags?: string[];
    description?: string;
}

interface DesignSearchResult {
    source: string;
    query: string;
    results: DesignResult[];
    totalFound: number;
}

// ============================================
// DRIBBBLE SEARCH
// ============================================
async function searchDribbble(query: string, limit: number = 12): Promise<DesignSearchResult> {
    const searchUrl = `https://dribbble.com/search/${encodeURIComponent(query)}`;

    try {
        const response = await fetch(searchUrl, {
            headers: {
                'User-Agent': USER_AGENT,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
            },
        });

        if (!response.ok) {
            throw new Error(`Dribbble returned ${response.status}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);
        const results: DesignResult[] = [];

        // Parse shot cards from Dribbble
        $('li.shot-thumbnail, div[data-thumbnail-id]').each((i, el) => {
            if (i >= limit) return false;

            const $el = $(el);
            const $link = $el.find('a[href*="/shots/"]').first();
            const $img = $el.find('img').first();
            const $author = $el.find('a[href*="/"]').filter((_, a) => {
                const href = $(a).attr('href') || '';
                return !href.includes('/shots/') && href.startsWith('/');
            }).first();

            const title = $img.attr('alt') || $link.attr('title') || 'Untitled';
            const url = $link.attr('href');
            const imageUrl = $img.attr('src') || $img.attr('data-src') || '';
            const author = $author.text().trim();

            if (url && imageUrl) {
                results.push({
                    title,
                    url: url.startsWith('http') ? url : `https://dribbble.com${url}`,
                    imageUrl,
                    author: author || undefined,
                });
            }
        });

        return {
            source: 'Dribbble',
            query,
            results,
            totalFound: results.length,
        };
    } catch (error) {
        console.error('Dribbble search error:', error);
        return {
            source: 'Dribbble',
            query,
            results: [],
            totalFound: 0,
        };
    }
}

// ============================================
// BEHANCE SEARCH
// ============================================
async function searchBehance(query: string, limit: number = 12): Promise<DesignSearchResult> {
    const searchUrl = `https://www.behance.net/search/projects?search=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(searchUrl, {
            headers: {
                'User-Agent': USER_AGENT,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
            },
        });

        if (!response.ok) {
            throw new Error(`Behance returned ${response.status}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);
        const results: DesignResult[] = [];

        // Parse project cards from Behance
        $('div.ProjectCover-root, div[class*="ProjectCover"]').each((i, el) => {
            if (i >= limit) return false;

            const $el = $(el);
            const $link = $el.find('a[href*="/gallery/"]').first();
            const $img = $el.find('img').first();
            const $title = $el.find('[class*="Title"]').first();
            const $owner = $el.find('[class*="Owner"]').first();

            const title = $title.text().trim() || $img.attr('alt') || 'Untitled';
            const url = $link.attr('href');
            const imageUrl = $img.attr('src') || '';
            const author = $owner.text().trim();

            if (url && imageUrl) {
                results.push({
                    title,
                    url: url.startsWith('http') ? url : `https://www.behance.net${url}`,
                    imageUrl,
                    author: author || undefined,
                });
            }
        });

        return {
            source: 'Behance',
            query,
            results,
            totalFound: results.length,
        };
    } catch (error) {
        console.error('Behance search error:', error);
        return {
            source: 'Behance',
            query,
            results: [],
            totalFound: 0,
        };
    }
}

// ============================================
// AWWWARDS SEARCH
// ============================================
async function searchAwwwards(query: string, limit: number = 12): Promise<DesignSearchResult> {
    const searchUrl = `https://www.awwwards.com/websites/${encodeURIComponent(query)}/`;

    try {
        const response = await fetch(searchUrl, {
            headers: {
                'User-Agent': USER_AGENT,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            },
        });

        if (!response.ok) {
            throw new Error(`Awwwards returned ${response.status}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);
        const results: DesignResult[] = [];

        // Parse website cards from Awwwards
        $('li.js-collectable, article[class*="box-item"]').each((i, el) => {
            if (i >= limit) return false;

            const $el = $(el);
            const $link = $el.find('a').first();
            const $img = $el.find('img').first();
            const $title = $el.find('h2, h3, [class*="title"]').first();

            const title = $title.text().trim() || $img.attr('alt') || 'Untitled';
            const url = $link.attr('href');
            const imageUrl = $img.attr('src') || $img.attr('data-src') || '';

            if (url && imageUrl) {
                results.push({
                    title,
                    url: url.startsWith('http') ? url : `https://www.awwwards.com${url}`,
                    imageUrl,
                });
            }
        });

        return {
            source: 'Awwwards',
            query,
            results,
            totalFound: results.length,
        };
    } catch (error) {
        console.error('Awwwards search error:', error);
        return {
            source: 'Awwwards',
            query,
            results: [],
            totalFound: 0,
        };
    }
}

// ============================================
// UI PATTERNS DATABASE
// ============================================
const UI_PATTERNS: Record<string, { description: string; components: string[]; bestPractices: string[] }> = {
    'dashboard': {
        description: 'Overview screens showing key metrics, charts, and quick actions',
        components: ['Stat cards', 'Charts (line, bar, pie)', 'Recent activity feed', 'Quick action buttons', 'Sidebar navigation', 'Header with user menu'],
        bestPractices: [
            'Show most important metrics at the top',
            'Use consistent card sizes for visual harmony',
            'Provide filters for date ranges',
            'Include refresh/real-time indicators',
            'Make navigation collapsible for more space',
        ],
    },
    'login': {
        description: 'Authentication screens for user sign-in',
        components: ['Email/username input', 'Password input with show/hide', 'Remember me checkbox', 'Forgot password link', 'Social login buttons', 'Sign up link'],
        bestPractices: [
            'Center the form vertically and horizontally',
            'Show password strength indicator on signup',
            'Provide clear error messages inline',
            'Support autofill from password managers',
            'Add loading state to submit button',
        ],
    },
    'pricing': {
        description: 'Pricing pages showing different plans and features',
        components: ['Plan cards (3 typical)', 'Feature comparison list', 'Toggle for monthly/yearly', 'CTA buttons', 'Popular/recommended badge', 'FAQ section'],
        bestPractices: [
            'Highlight the recommended plan visually',
            'Show savings for yearly billing',
            'Use checkmarks for included features',
            'Keep feature lists scannable (5-7 items)',
            'Add social proof near pricing',
        ],
    },
    'settings': {
        description: 'User preferences and configuration screens',
        components: ['Tabs or sidebar navigation', 'Form sections', 'Toggle switches', 'Save/Cancel buttons', 'Danger zone section', 'Profile picture upload'],
        bestPractices: [
            'Group related settings together',
            'Auto-save when possible with confirmation',
            'Use descriptive labels and helper text',
            'Put destructive actions in a separate danger zone',
            'Show current state clearly (on/off)',
        ],
    },
    'table': {
        description: 'Data tables for displaying lists of items',
        components: ['Column headers with sort', 'Search/filter bar', 'Pagination or infinite scroll', 'Row actions (edit, delete)', 'Bulk selection checkboxes', 'Empty state'],
        bestPractices: [
            'Make columns resizable if needed',
            'Highlight rows on hover',
            'Provide quick actions on each row',
            'Show loading skeleton while fetching',
            'Include export functionality',
        ],
    },
    'form': {
        description: 'Input forms for data collection',
        components: ['Input fields with labels', 'Validation messages', 'Required field indicators', 'Submit/Cancel buttons', 'Progress indicator (multi-step)', 'Field groups'],
        bestPractices: [
            'Label above input, not inline',
            'Show validation on blur, not while typing',
            'Use appropriate input types (email, tel, etc.)',
            'Disable submit until valid',
            'Preserve data if user navigates away',
        ],
    },
    'modal': {
        description: 'Overlay dialogs for focused actions',
        components: ['Backdrop overlay', 'Close button (X)', 'Title', 'Content area', 'Action buttons (primary/secondary)', 'Optional icon'],
        bestPractices: [
            'Trap focus inside modal for accessibility',
            'Close on backdrop click and Escape key',
            'Keep content concise, not scrollable',
            'Use for confirmations and quick actions',
            'Animate entrance/exit smoothly',
        ],
    },
    'sidebar': {
        description: 'Vertical navigation menus',
        components: ['Logo/brand', 'Navigation links', 'Active state indicator', 'Collapse toggle', 'User profile section', 'Nested menu items'],
        bestPractices: [
            'Highlight current page clearly',
            'Support keyboard navigation',
            'Collapse on mobile to hamburger menu',
            'Group related links with headers',
            'Show tooltips when collapsed',
        ],
    },
    'card': {
        description: 'Contained content blocks',
        components: ['Image/thumbnail', 'Title', 'Description text', 'Metadata (date, author)', 'Action buttons', 'Badge/tag'],
        bestPractices: [
            'Keep content hierarchy clear',
            'Use consistent card sizes in grids',
            'Add hover effects for interactive cards',
            'Truncate long text with ellipsis',
            'Make entire card clickable if navigating',
        ],
    },
    'notification': {
        description: 'Toast messages and alert banners',
        components: ['Icon (success, error, warning, info)', 'Message text', 'Close button', 'Action link', 'Progress bar (auto-dismiss)'],
        bestPractices: [
            'Position consistently (top-right common)',
            'Auto-dismiss after 5-7 seconds',
            'Stack multiple notifications',
            'Use distinct colors for severity',
            'Allow manual dismiss',
        ],
    },
};

function getUIPattern(patternName: string): string {
    const pattern = UI_PATTERNS[patternName.toLowerCase()];

    if (!pattern) {
        const availablePatterns = Object.keys(UI_PATTERNS).join(', ');
        return `Pattern "${patternName}" not found. Available patterns: ${availablePatterns}`;
    }

    return `
## ${patternName.charAt(0).toUpperCase() + patternName.slice(1)} Pattern

**Description:** ${pattern.description}

### Components typically included:
${pattern.components.map(c => `- ${c}`).join('\n')}

### Best Practices:
${pattern.bestPractices.map(p => `- ${p}`).join('\n')}
`;
}

function listUIPatterns(): string {
    const patterns = Object.entries(UI_PATTERNS).map(([name, info]) => {
        return `- **${name}**: ${info.description}`;
    });

    return `# Available UI Patterns\n\n${patterns.join('\n')}`;
}

// ============================================
// MCP TOOLS
// ============================================

// Search Dribbble for design inspiration
server.tool(
    'search_dribbble',
    'Search Dribbble for design inspiration. Returns shots with titles, URLs, and images.',
    {
        query: z.string().describe('Search query (e.g., "dashboard", "login form", "saas landing")'),
        limit: z.number().optional().default(8).describe('Number of results to return (default: 8, max: 20)'),
    },
    async ({ query, limit }) => {
        const results = await searchDribbble(query, Math.min(limit || 8, 20));

        if (results.results.length === 0) {
            return {
                content: [{
                    type: 'text' as const,
                    text: `No results found on Dribbble for "${query}". Try a different search term.`,
                }],
            };
        }

        const formatted = results.results.map((r, i) => {
            return `${i + 1}. **${r.title}**${r.author ? ` by ${r.author}` : ''}
   - URL: ${r.url}
   - Image: ${r.imageUrl}`;
        }).join('\n\n');

        return {
            content: [{
                type: 'text' as const,
                text: `# Dribbble Results for "${query}"\n\nFound ${results.totalFound} designs:\n\n${formatted}`,
            }],
        };
    }
);

// Search Behance for design inspiration
server.tool(
    'search_behance',
    'Search Behance for design projects. Returns projects with titles, URLs, and images.',
    {
        query: z.string().describe('Search query (e.g., "mobile app ui", "web design", "branding")'),
        limit: z.number().optional().default(8).describe('Number of results to return (default: 8, max: 20)'),
    },
    async ({ query, limit }) => {
        const results = await searchBehance(query, Math.min(limit || 8, 20));

        if (results.results.length === 0) {
            return {
                content: [{
                    type: 'text' as const,
                    text: `No results found on Behance for "${query}". Try a different search term.`,
                }],
            };
        }

        const formatted = results.results.map((r, i) => {
            return `${i + 1}. **${r.title}**${r.author ? ` by ${r.author}` : ''}
   - URL: ${r.url}
   - Image: ${r.imageUrl}`;
        }).join('\n\n');

        return {
            content: [{
                type: 'text' as const,
                text: `# Behance Results for "${query}"\n\nFound ${results.totalFound} projects:\n\n${formatted}`,
            }],
        };
    }
);

// Search Awwwards for award-winning websites
server.tool(
    'search_awwwards',
    'Search Awwwards for award-winning website designs.',
    {
        query: z.string().describe('Search query (e.g., "ecommerce", "portfolio", "agency")'),
        limit: z.number().optional().default(8).describe('Number of results to return (default: 8, max: 20)'),
    },
    async ({ query, limit }) => {
        const results = await searchAwwwards(query, Math.min(limit || 8, 20));

        if (results.results.length === 0) {
            return {
                content: [{
                    type: 'text' as const,
                    text: `No results found on Awwwards for "${query}". Try a different search term.`,
                }],
            };
        }

        const formatted = results.results.map((r, i) => {
            return `${i + 1}. **${r.title}**
   - URL: ${r.url}
   - Image: ${r.imageUrl}`;
        }).join('\n\n');

        return {
            content: [{
                type: 'text' as const,
                text: `# Awwwards Results for "${query}"\n\nFound ${results.totalFound} websites:\n\n${formatted}`,
            }],
        };
    }
);

// Search all sources at once
server.tool(
    'search_design_inspiration',
    'Search multiple design sources (Dribbble, Behance, Awwwards) at once for comprehensive inspiration.',
    {
        query: z.string().describe('Search query (e.g., "fintech dashboard", "healthcare app")'),
        sources: z.array(z.enum(['dribbble', 'behance', 'awwwards'])).optional().default(['dribbble', 'behance']).describe('Which sources to search'),
        limit: z.number().optional().default(5).describe('Results per source (default: 5)'),
    },
    async ({ query, sources, limit }) => {
        const searchPromises: Promise<DesignSearchResult>[] = [];
        const sourcesToSearch = sources || ['dribbble', 'behance'];
        const resultsLimit = Math.min(limit || 5, 10);

        if (sourcesToSearch.includes('dribbble')) {
            searchPromises.push(searchDribbble(query, resultsLimit));
        }
        if (sourcesToSearch.includes('behance')) {
            searchPromises.push(searchBehance(query, resultsLimit));
        }
        if (sourcesToSearch.includes('awwwards')) {
            searchPromises.push(searchAwwwards(query, resultsLimit));
        }

        const allResults = await Promise.all(searchPromises);

        let output = `# Design Inspiration for "${query}"\n\n`;
        let totalFound = 0;

        for (const result of allResults) {
            totalFound += result.totalFound;
            output += `## ${result.source} (${result.totalFound} found)\n\n`;

            if (result.results.length === 0) {
                output += '_No results found_\n\n';
            } else {
                result.results.forEach((r, i) => {
                    output += `${i + 1}. **${r.title}**${r.author ? ` by ${r.author}` : ''}\n`;
                    output += `   - ${r.url}\n\n`;
                });
            }
        }

        output += `---\n_Total: ${totalFound} designs found across ${sourcesToSearch.length} sources_`;

        return {
            content: [{
                type: 'text' as const,
                text: output,
            }],
        };
    }
);

// Get UI pattern information
server.tool(
    'get_ui_pattern',
    'Get best practices and component recommendations for a specific UI pattern (dashboard, login, pricing, etc.)',
    {
        pattern: z.string().describe('Pattern name (e.g., "dashboard", "login", "pricing", "form", "table")'),
    },
    async ({ pattern }) => {
        const result = getUIPattern(pattern);
        return {
            content: [{
                type: 'text' as const,
                text: result,
            }],
        };
    }
);

// List all available UI patterns
server.tool(
    'list_ui_patterns',
    'List all available UI patterns with descriptions',
    {},
    async () => {
        const result = listUIPatterns();
        return {
            content: [{
                type: 'text' as const,
                text: result,
            }],
        };
    }
);

// Get design recommendations for a specific use case
server.tool(
    'get_design_recommendations',
    'Get tailored design recommendations for a specific use case or industry',
    {
        useCase: z.string().describe('Use case description (e.g., "veterinary clinic management", "fintech dashboard", "e-commerce checkout")'),
        style: z.enum(['modern', 'minimal', 'playful', 'corporate', 'luxury']).optional().describe('Desired visual style'),
    },
    async ({ useCase, style }) => {
        const styleGuide = style ? `\n\n**Style preference:** ${style}` : '';

        const recommendations = `# Design Recommendations for: ${useCase}${styleGuide}

## Suggested Search Queries
Try searching these terms on Dribbble/Behance:
- "${useCase} dashboard"
- "${useCase} ui"
- "${useCase} app design"
- "${useCase} web design"

## Recommended UI Patterns
Based on your use case, consider these patterns:

### Primary Screens
1. **Dashboard** - Overview of key metrics and quick actions
2. **Data Tables** - For managing lists of records
3. **Forms** - For data entry and editing

### Supporting Components
- Navigation (sidebar or top nav)
- Search and filters
- Notification system
- User profile/settings

## Color Palette Suggestions
${style === 'modern' ? '- Blues and purples with high contrast accents' : ''}
${style === 'minimal' ? '- Neutral grays with single accent color' : ''}
${style === 'playful' ? '- Bright, saturated colors with rounded shapes' : ''}
${style === 'corporate' ? '- Navy, grays, conservative accents' : ''}
${style === 'luxury' ? '- Black, gold, deep colors with elegant typography' : ''}
${!style ? '- Choose based on industry (healthcare: calming blues/greens, finance: trust-building blues, creative: vibrant accent colors)' : ''}

## Typography Recommendations
- **Headings:** Inter, Plus Jakarta Sans, or Manrope for modern feel
- **Body:** System fonts or Inter for readability
- **Size scale:** 14px base, 1.25 ratio for hierarchy

## Next Steps
1. Use \`search_design_inspiration\` to find visual references
2. Use \`get_ui_pattern\` to get component details for each screen
3. Generate components with UI Agent following these guidelines
`;

        return {
            content: [{
                type: 'text' as const,
                text: recommendations,
            }],
        };
    }
);

// Start the server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('Design Inspiration MCP server running on stdio');
}

main().catch(console.error);
