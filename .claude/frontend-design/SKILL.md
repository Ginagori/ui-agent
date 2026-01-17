---
name: frontend-design
description: |
  Expert frontend design covering UI/UX principles, component architecture, responsive design,
  and accessibility. Use when: (1) designing user interfaces and layouts, (2) building reusable
  components, (3) implementing responsive designs, (4) choosing CSS frameworks or patterns,
  (5) ensuring accessibility compliance, (6) structuring frontend applications.
---

# Frontend Design Expert

## Quick Start

Describe your frontend need. Examples:

> "Necesito un formulario de login responsive con validación"

> "Cómo estructuro los componentes para un dashboard"

> "Dame un navbar con dropdown accesible"

I will:
1. Recommend the appropriate pattern/approach
2. Provide working code
3. Explain design decisions
4. Include accessibility considerations
5. Suggest responsive strategies

## Core Workflow

### Step 1: Identify the Need

| Need Type | Approach |
|-----------|----------|
| Single component | Pattern + Code snippet |
| Page layout | Layout system + Structure |
| Full application | Component architecture |
| Design system | Tokens + Component library |

### Step 2: Choose Technology

| Project Type | Recommended Stack |
|--------------|-------------------|
| Simple/Static | HTML + CSS (Tailwind) |
| Interactive SPA | React + Tailwind/CSS Modules |
| Rapid prototype | React + shadcn/ui or Chakra |
| Enterprise | React/Vue + Design System |
| Content site | Astro/Next + Tailwind |

### Step 3: Apply Design Principles

```
Visual Hierarchy → Layout → Spacing → Color → Typography → Polish
```

See [design-principles.md](references/design-principles.md) for details.

### Step 4: Build Components

```
Atoms → Molecules → Organisms → Templates → Pages

Button → SearchInput → Header → PageLayout → HomePage
```

See [component-architecture.md](references/component-architecture.md) for patterns.

## Design Fundamentals

### Visual Hierarchy

Control what users see first:

```
1. Size        - Larger = more important
2. Color       - Contrast draws attention
3. Position    - Top-left seen first (F-pattern)
4. Whitespace  - Isolation = emphasis
5. Typography  - Weight and style signal importance
```

### The 8pt Grid System

All spacing based on multiples of 8px:

```
4px   - Tight (icons, inline)
8px   - Compact (related items)
16px  - Default (standard spacing)
24px  - Comfortable (sections)
32px  - Loose (major sections)
48px  - Spacious (page sections)
64px+ - Hero areas
```

### Color System

```
Primary    - Brand color, main actions
Secondary  - Supporting actions
Accent     - Highlights, notifications
Neutral    - Text, backgrounds, borders
Semantic   - Success, warning, error, info
```

**Contrast Requirements:**
- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum
- UI components: 3:1 minimum

### Typography Scale

```
xs:   12px / 0.75rem  - Captions, labels
sm:   14px / 0.875rem - Secondary text
base: 16px / 1rem     - Body text
lg:   18px / 1.125rem - Lead text
xl:   20px / 1.25rem  - H4
2xl:  24px / 1.5rem   - H3
3xl:  30px / 1.875rem - H2
4xl:  36px / 2.25rem  - H1
5xl:  48px / 3rem     - Display
```

## Common UI Patterns

### Layout Patterns

| Pattern | Use Case | CSS Approach |
|---------|----------|--------------|
| Stack | Vertical list | `flex-direction: column` |
| Cluster | Horizontal group | `display: flex; gap` |
| Sidebar | Two-column with fixed side | `grid-template-columns: 250px 1fr` |
| Holy Grail | Header, footer, 3 columns | CSS Grid areas |
| Card Grid | Product listings | `grid; auto-fill` |
| Split | 50/50 or ratio | `grid-template-columns: 1fr 2fr` |

### Component Patterns

| Component | Key Considerations |
|-----------|-------------------|
| **Button** | States (hover, active, disabled, loading), sizes, variants |
| **Input** | Labels, placeholders, validation, error states |
| **Card** | Image handling, content structure, actions |
| **Modal** | Focus trap, escape key, overlay click |
| **Dropdown** | Keyboard navigation, positioning, a11y |
| **Table** | Sorting, responsive, pagination |
| **Navigation** | Mobile menu, active states, nested items |
| **Form** | Validation, submission, error handling |

See [ui-patterns.md](references/ui-patterns.md) for implementations.

## Responsive Design

### Breakpoints (Mobile-First)

```css
/* Mobile first - base styles */
.element { ... }

/* Tablet */
@media (min-width: 640px) { ... }

/* Laptop */
@media (min-width: 1024px) { ... }

/* Desktop */
@media (min-width: 1280px) { ... }
```

### Tailwind Breakpoints

```
sm:  640px   - Small tablets
md:  768px   - Tablets
lg:  1024px  - Laptops
xl:  1280px  - Desktops
2xl: 1536px  - Large screens
```

### Responsive Strategies

| Strategy | When to Use |
|----------|-------------|
| Fluid | Content that scales naturally |
| Adaptive | Distinct layouts per breakpoint |
| Container queries | Component-level responsiveness |
| Stack → Grid | Cards, navigation items |
| Show/Hide | Mobile menu, detail panels |

See [responsive-design.md](references/responsive-design.md) for patterns.

## Accessibility Checklist

### Essential A11y

- [ ] Semantic HTML (`<nav>`, `<main>`, `<button>`)
- [ ] Alt text on images
- [ ] Label on form inputs
- [ ] Color contrast 4.5:1+
- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] Skip link to main content

### ARIA When Needed

```html
<!-- Only when semantic HTML isn't enough -->
<div role="button" aria-pressed="false">Toggle</div>
<div aria-live="polite">Dynamic content</div>
<button aria-expanded="false" aria-controls="menu">Menu</button>
```

See [accessibility.md](references/accessibility.md) for complete guide.

## Component Architecture

### File Structure (React)

```
src/
├── components/
│   ├── ui/           # Base components (Button, Input)
│   ├── forms/        # Form-specific (LoginForm)
│   ├── layout/       # Layout (Header, Sidebar)
│   └── features/     # Feature-specific
├── hooks/            # Custom hooks
├── styles/           # Global styles, tokens
├── lib/              # Utilities
└── pages/            # Page components
```

### Component Patterns

**Compound Components:**
```jsx
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>Actions</Card.Footer>
</Card>
```

**Render Props:**
```jsx
<DataFetcher url="/api/users">
  {({ data, loading }) => loading ? <Spinner /> : <UserList users={data} />}
</DataFetcher>
```

**Composition:**
```jsx
<Button variant="primary" size="lg" leftIcon={<PlusIcon />}>
  Add Item
</Button>
```

See [component-architecture.md](references/component-architecture.md) for details.

## CSS Frameworks Guide

### Tailwind CSS

```html
<button class="px-4 py-2 bg-blue-600 text-white rounded-lg
               hover:bg-blue-700 transition-colors">
  Click me
</button>
```

**Pros:** Utility-first, no context switching, tree-shaking
**Cons:** Verbose HTML, learning curve

### CSS Modules

```jsx
import styles from './Button.module.css';
<button className={styles.primary}>Click me</button>
```

**Pros:** Scoped, familiar CSS, no runtime
**Cons:** More files, class name gymnastics

### Styled Components

```jsx
const Button = styled.button`
  padding: 0.5rem 1rem;
  background: ${props => props.primary ? 'blue' : 'gray'};
`;
```

**Pros:** Dynamic, colocated, theming
**Cons:** Runtime cost, learning curve

See [css-frameworks.md](references/css-frameworks.md) for comparisons.

## Performance Considerations

### CSS Performance

- Minimize specificity
- Avoid expensive selectors (`*`, `[attr]`)
- Use `contain` for complex components
- Prefer `transform` and `opacity` for animations

### Image Optimization

```html
<img
  src="image.jpg"
  srcset="image-400.jpg 400w, image-800.jpg 800w"
  sizes="(max-width: 600px) 400px, 800px"
  loading="lazy"
  alt="Description"
/>
```

### Critical CSS

- Inline above-the-fold styles
- Defer non-critical CSS
- Use `font-display: swap`

## Quick Reference

### Spacing Scale (Tailwind)

| Class | Size |
|-------|------|
| p-1 | 4px |
| p-2 | 8px |
| p-3 | 12px |
| p-4 | 16px |
| p-6 | 24px |
| p-8 | 32px |

### Common Flexbox Patterns

```css
/* Center everything */
.center { display: flex; justify-content: center; align-items: center; }

/* Space between */
.spread { display: flex; justify-content: space-between; align-items: center; }

/* Stack with gap */
.stack { display: flex; flex-direction: column; gap: 1rem; }
```

### Common Grid Patterns

```css
/* Auto-fit cards */
.grid-auto {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

/* Sidebar layout */
.sidebar-layout {
  display: grid;
  grid-template-columns: 250px 1fr;
}
```

## References

- [design-principles.md](references/design-principles.md): Color, typography, spacing, visual hierarchy
- [ui-patterns.md](references/ui-patterns.md): Common component patterns with code
- [responsive-design.md](references/responsive-design.md): Breakpoints, strategies, mobile-first
- [accessibility.md](references/accessibility.md): WCAG compliance, ARIA, testing
- [component-architecture.md](references/component-architecture.md): Structure, patterns, best practices
- [css-frameworks.md](references/css-frameworks.md): Tailwind, CSS Modules, Styled Components

## Assets

- [component-snippets.md](assets/component-snippets.md): Ready-to-use component code
