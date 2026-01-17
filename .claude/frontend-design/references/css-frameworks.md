# CSS Frameworks Comparison

## Overview

| Framework | Approach | Bundle Size | Learning Curve |
|-----------|----------|-------------|----------------|
| Tailwind CSS | Utility-first | ~10KB (purged) | Medium |
| CSS Modules | Scoped CSS | 0 (just CSS) | Low |
| Styled Components | CSS-in-JS | ~12KB | Medium |
| Emotion | CSS-in-JS | ~7KB | Medium |
| Bootstrap | Component-based | ~25KB | Low |
| Vanilla CSS | Native | 0 | Low |

---

## Tailwind CSS

### Setup

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

```js
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#3b82f6',
      },
    },
  },
  plugins: [],
}
```

### Basic Usage

```html
<button class="px-4 py-2 bg-blue-600 text-white rounded-lg
               hover:bg-blue-700 focus:ring-2 focus:ring-blue-500
               disabled:opacity-50 transition-colors">
  Click me
</button>
```

### Component Example

```tsx
function Card({ children, className }) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {children}
    </div>
  );
}

function Button({ variant = 'primary', size = 'md', children, ...props }) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors';

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    outline: 'border border-gray-300 hover:bg-gray-50',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]}`}
      {...props}
    >
      {children}
    </button>
  );
}
```

### Tailwind with clsx/cn

```tsx
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

function Button({ variant, className, ...props }) {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded-lg',
        variant === 'primary' && 'bg-blue-600 text-white',
        variant === 'secondary' && 'bg-gray-200',
        className
      )}
      {...props}
    />
  );
}
```

### Pros & Cons

**Pros:**
- No context switching
- Highly customizable
- Great developer experience
- Tree-shaking removes unused styles
- Responsive utilities built-in

**Cons:**
- Verbose HTML
- Learning utility names
- Can be harder to read
- Requires build step

---

## CSS Modules

### Setup

Built into most bundlers (Next.js, Vite, CRA).

### Basic Usage

```css
/* Button.module.css */
.button {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
}

.primary {
  background-color: #3b82f6;
  color: white;
}

.primary:hover {
  background-color: #2563eb;
}

.secondary {
  background-color: #e5e7eb;
  color: #1f2937;
}
```

```tsx
// Button.tsx
import styles from './Button.module.css';

function Button({ variant = 'primary', children, ...props }) {
  return (
    <button
      className={`${styles.button} ${styles[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
}
```

### With classnames Library

```tsx
import cn from 'classnames';
import styles from './Button.module.css';

function Button({ variant, disabled, className }) {
  return (
    <button
      className={cn(
        styles.button,
        styles[variant],
        { [styles.disabled]: disabled },
        className
      )}
    />
  );
}
```

### Composition

```css
/* base.module.css */
.reset {
  margin: 0;
  padding: 0;
  border: none;
}

/* Button.module.css */
.button {
  composes: reset from './base.module.css';
  padding: 0.5rem 1rem;
}
```

### Pros & Cons

**Pros:**
- Scoped by default
- Standard CSS syntax
- No runtime cost
- Works with any CSS features

**Cons:**
- More files to manage
- Class name concatenation
- No dynamic styles (without inline)

---

## Styled Components

### Setup

```bash
npm install styled-components
npm install -D @types/styled-components
```

### Basic Usage

```tsx
import styled from 'styled-components';

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  background-color: ${props => props.$primary ? '#3b82f6' : '#e5e7eb'};
  color: ${props => props.$primary ? 'white' : '#1f2937'};

  &:hover {
    background-color: ${props => props.$primary ? '#2563eb' : '#d1d5db'};
  }
`;

// Usage
<Button $primary>Primary</Button>
<Button>Secondary</Button>
```

### With Props

```tsx
interface ButtonProps {
  $variant?: 'primary' | 'secondary';
  $size?: 'sm' | 'md' | 'lg';
}

const Button = styled.button<ButtonProps>`
  padding: ${props => {
    switch (props.$size) {
      case 'sm': return '0.25rem 0.5rem';
      case 'lg': return '0.75rem 1.5rem';
      default: return '0.5rem 1rem';
    }
  }};

  background-color: ${props =>
    props.$variant === 'primary' ? '#3b82f6' : '#e5e7eb'
  };
`;
```

### Extending Styles

```tsx
const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
`;

const PrimaryButton = styled(Button)`
  background-color: #3b82f6;
  color: white;
`;

const IconButton = styled(Button)`
  padding: 0.5rem;
  border-radius: 50%;
`;
```

### Theme Provider

```tsx
import { ThemeProvider } from 'styled-components';

const theme = {
  colors: {
    primary: '#3b82f6',
    secondary: '#6b7280',
  },
  spacing: {
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
  },
};

const Button = styled.button`
  background-color: ${props => props.theme.colors.primary};
  padding: ${props => props.theme.spacing.md};
`;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Button>Themed Button</Button>
    </ThemeProvider>
  );
}
```

### Pros & Cons

**Pros:**
- Dynamic styling
- Theming support
- Component-scoped
- Full CSS power
- TypeScript support

**Cons:**
- Runtime cost
- Larger bundle
- SSR complexity
- Learning curve

---

## Vanilla CSS

### Modern CSS Features

```css
/* Custom Properties */
:root {
  --color-primary: #3b82f6;
  --spacing-md: 1rem;
  --radius-md: 0.375rem;
}

.button {
  background-color: var(--color-primary);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
}

/* Container Queries */
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    display: flex;
  }
}

/* :has() Selector */
.form-group:has(:invalid) {
  border-color: red;
}

/* Nesting (Chrome 120+) */
.card {
  padding: 1rem;

  & .title {
    font-size: 1.25rem;
  }

  &:hover {
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }
}
```

### CSS Layers

```css
@layer reset, base, components, utilities;

@layer reset {
  * { margin: 0; padding: 0; box-sizing: border-box; }
}

@layer base {
  body { font-family: system-ui; }
}

@layer components {
  .button { /* ... */ }
}

@layer utilities {
  .mt-4 { margin-top: 1rem; }
}
```

### Pros & Cons

**Pros:**
- No dependencies
- Browser-native
- Best performance
- Future-proof

**Cons:**
- No scoping (need BEM or similar)
- Manual organization
- Less tooling support

---

## Comparison by Use Case

| Use Case | Recommended |
|----------|-------------|
| Rapid prototyping | Tailwind |
| Large team, strict conventions | CSS Modules |
| Dynamic theming needs | Styled Components |
| Maximum performance | Vanilla CSS |
| Component library | Tailwind + CVA or Styled |
| Small project | Tailwind or Vanilla |

---

## Class Variance Authority (CVA)

For managing component variants with Tailwind:

```tsx
import { cva, type VariantProps } from 'class-variance-authority';

const button = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors',
  {
    variants: {
      variant: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
        outline: 'border border-gray-300 hover:bg-gray-50',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-12 px-6 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {}

function Button({ variant, size, className, ...props }: ButtonProps) {
  return (
    <button className={button({ variant, size, className })} {...props} />
  );
}

// Usage
<Button variant="secondary" size="lg">Click me</Button>
```

---

## Decision Guide

```
Need dynamic styles based on props?
├─ Yes → Styled Components or Emotion
└─ No
   │
   Want utility classes?
   ├─ Yes → Tailwind CSS
   └─ No
      │
      Need strict scoping?
      ├─ Yes → CSS Modules
      └─ No → Vanilla CSS
```
