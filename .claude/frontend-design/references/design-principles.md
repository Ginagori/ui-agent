# Design Principles

## Visual Hierarchy

### The Hierarchy Stack

Control attention through layered importance:

```
Level 1: Primary Action / Main Headline
         ↓
Level 2: Secondary Information / Subheadings
         ↓
Level 3: Supporting Content / Body Text
         ↓
Level 4: Metadata / Tertiary Info
```

### Tools for Creating Hierarchy

| Tool | How It Creates Hierarchy |
|------|-------------------------|
| **Size** | Larger = more important |
| **Weight** | Bolder = more important |
| **Color** | Higher contrast = more prominent |
| **Position** | Top/Left seen first |
| **Whitespace** | Isolation = emphasis |
| **Depth** | Shadows elevate elements |

### Example: Card Hierarchy

```
┌────────────────────────────────┐
│ [Image - Level 1 visual]       │
├────────────────────────────────┤
│ Product Name        ← Level 1  │
│ $99.00             ← Level 2   │
│ Short description  ← Level 3   │
│ ★★★★☆ (42 reviews) ← Level 4   │
│                                │
│ [Add to Cart]      ← Level 1   │
└────────────────────────────────┘
```

---

## Color Theory

### Color System Structure

```
┌─────────────────────────────────────────────────┐
│ PRIMARY                                         │
│ Brand color, main CTAs, active states           │
│ primary-50 → primary-900 (light to dark)        │
├─────────────────────────────────────────────────┤
│ SECONDARY                                       │
│ Supporting actions, secondary buttons           │
│ secondary-50 → secondary-900                    │
├─────────────────────────────────────────────────┤
│ NEUTRAL                                         │
│ Text, backgrounds, borders, disabled states     │
│ gray-50 → gray-900                              │
├─────────────────────────────────────────────────┤
│ SEMANTIC                                        │
│ success (green), warning (yellow),              │
│ error (red), info (blue)                        │
└─────────────────────────────────────────────────┘
```

### Color Scale (Example: Blue)

```css
--blue-50:  #eff6ff;  /* Backgrounds */
--blue-100: #dbeafe;  /* Hover backgrounds */
--blue-200: #bfdbfe;  /* Borders */
--blue-300: #93c5fd;  /* Disabled text */
--blue-400: #60a5fa;  /* Icons */
--blue-500: #3b82f6;  /* Primary buttons */
--blue-600: #2563eb;  /* Hover state */
--blue-700: #1d4ed8;  /* Active state */
--blue-800: #1e40af;  /* Dark mode primary */
--blue-900: #1e3a8a;  /* Dark text on light */
```

### Contrast Requirements (WCAG)

| Content Type | Minimum Ratio | Target Ratio |
|--------------|---------------|--------------|
| Body text | 4.5:1 | 7:1 (AAA) |
| Large text (18px+) | 3:1 | 4.5:1 |
| UI components | 3:1 | 4.5:1 |
| Non-essential graphics | No requirement | 3:1 |

### Color Combinations

**Safe Combinations:**
```
Dark text on light background: gray-900 on white
Light text on dark background: white on gray-900
Primary on white: blue-600 on white (check contrast)
```

**Avoid:**
- Red on green (colorblind)
- Low contrast combinations
- Color as only indicator

---

## Typography

### Type Scale

```css
/* Modular scale: 1.25 ratio */
--text-xs:   0.75rem;   /* 12px */
--text-sm:   0.875rem;  /* 14px */
--text-base: 1rem;      /* 16px - body */
--text-lg:   1.125rem;  /* 18px */
--text-xl:   1.25rem;   /* 20px */
--text-2xl:  1.5rem;    /* 24px */
--text-3xl:  1.875rem;  /* 30px */
--text-4xl:  2.25rem;   /* 36px */
--text-5xl:  3rem;      /* 48px */
```

### Font Weights

| Weight | Use Case |
|--------|----------|
| 400 (Regular) | Body text |
| 500 (Medium) | Emphasis, subheadings |
| 600 (Semibold) | Headings, buttons |
| 700 (Bold) | Strong emphasis |

### Line Height

| Content Type | Line Height |
|--------------|-------------|
| Headings | 1.2 - 1.3 |
| Body text | 1.5 - 1.6 |
| UI elements | 1 - 1.25 |

### Font Pairing

**Safe Combinations:**
```
Headings: Inter, Poppins, Montserrat
Body: Inter, Open Sans, Roboto
Mono: JetBrains Mono, Fira Code

Common pairings:
- Inter (all weights)
- Poppins (headings) + Open Sans (body)
- System fonts (fastest load)
```

### Typography Hierarchy Example

```css
h1 { font-size: 2.25rem; font-weight: 700; line-height: 1.2; }
h2 { font-size: 1.875rem; font-weight: 600; line-height: 1.25; }
h3 { font-size: 1.5rem; font-weight: 600; line-height: 1.3; }
h4 { font-size: 1.25rem; font-weight: 600; line-height: 1.4; }
p  { font-size: 1rem; font-weight: 400; line-height: 1.6; }
small { font-size: 0.875rem; line-height: 1.5; }
```

---

## Spacing System

### The 8pt Grid

All spacing based on 8px increments:

```
Base unit: 8px

4px  (0.5) - Tight: icon padding, inline spacing
8px  (1)   - Compact: related elements
12px (1.5) - Default small
16px (2)   - Default: component padding
24px (3)   - Comfortable: card padding
32px (4)   - Loose: section spacing
48px (6)   - Spacious: major sections
64px (8)   - Hero: page sections
```

### Spacing Relationships

```
Related items:    8px - 16px
Grouped items:    16px - 24px
Distinct groups:  24px - 32px
Sections:         48px - 64px
Page margins:     16px (mobile) - 64px (desktop)
```

### Component Spacing

```css
/* Button */
.button {
  padding: 8px 16px;      /* Compact */
  padding: 12px 24px;     /* Default */
  padding: 16px 32px;     /* Large */
}

/* Card */
.card {
  padding: 16px;          /* Compact */
  padding: 24px;          /* Default */
  gap: 16px;              /* Between elements */
}

/* Form */
.form-group {
  margin-bottom: 24px;    /* Between fields */
}
.form-label {
  margin-bottom: 8px;     /* Label to input */
}
```

---

## Layout Principles

### Alignment

```
┌─────────────────────────────────────┐
│ ████████████████████               │  Left-aligned
│ ████████████                       │  (Default for LTR)
│ ████████████████                   │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│        ████████████████            │  Center-aligned
│          ████████████              │  (Hero sections)
│        ████████████████            │
└─────────────────────────────────────┘
```

**Rules:**
- Pick one alignment per section
- Left align body text (easier to read)
- Center align short content (headings, CTAs)
- Right align numbers in tables

### Proximity

Related items should be closer together:

```
Good:                          Bad:
┌────────────────────┐        ┌────────────────────┐
│ Label              │        │ Label              │
│ [Input field    ]  │        │                    │
│                    │        │                    │
│ Label              │        │ [Input field    ]  │
│ [Input field    ]  │        │                    │
└────────────────────┘        └────────────────────┘
```

### Repetition

Consistent patterns across the interface:

- Same button style everywhere
- Same card structure
- Same spacing between sections
- Same icon style

### Contrast

Create visual difference between elements:

```
┌─────────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓ Primary Button           │  High contrast
│ ░░░░░░░░░░ Secondary Button         │  Lower contrast
│ __________ Tertiary/Link            │  Minimal
└─────────────────────────────────────┘
```

---

## Visual Design Elements

### Borders and Dividers

```css
/* Subtle border */
border: 1px solid rgba(0, 0, 0, 0.1);

/* Visible border */
border: 1px solid #e5e7eb;  /* gray-200 */

/* Strong border */
border: 1px solid #d1d5db;  /* gray-300 */

/* Divider */
border-top: 1px solid #e5e7eb;
```

### Shadows

```css
/* Subtle (cards, inputs) */
box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

/* Default (dropdowns, popovers) */
box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

/* Medium (modals, dialogs) */
box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);

/* Large (floating elements) */
box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
```

### Border Radius

```css
--radius-none: 0;
--radius-sm: 0.125rem;   /* 2px - Subtle */
--radius-md: 0.375rem;   /* 6px - Default */
--radius-lg: 0.5rem;     /* 8px - Cards */
--radius-xl: 0.75rem;    /* 12px - Modals */
--radius-2xl: 1rem;      /* 16px - Large cards */
--radius-full: 9999px;   /* Pills, avatars */
```

---

## Design Tokens

### Defining Tokens

```css
:root {
  /* Colors */
  --color-primary: #3b82f6;
  --color-primary-hover: #2563eb;
  --color-text: #111827;
  --color-text-muted: #6b7280;
  --color-background: #ffffff;
  --color-surface: #f9fafb;
  --color-border: #e5e7eb;

  /* Typography */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;

  /* Radii */
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
```

### Dark Mode Tokens

```css
[data-theme="dark"] {
  --color-text: #f9fafb;
  --color-text-muted: #9ca3af;
  --color-background: #111827;
  --color-surface: #1f2937;
  --color-border: #374151;
}
```

---

## Design Checklist

Before finalizing a design:

**Visual Hierarchy**
- [ ] Clear primary action
- [ ] Obvious reading order
- [ ] Proper heading levels

**Color**
- [ ] Consistent color usage
- [ ] Sufficient contrast (4.5:1+)
- [ ] Not relying on color alone

**Typography**
- [ ] Readable font size (16px+ body)
- [ ] Appropriate line height
- [ ] Limited font variations (2-3)

**Spacing**
- [ ] Consistent spacing scale
- [ ] Related items grouped
- [ ] Adequate whitespace

**Polish**
- [ ] Aligned elements
- [ ] Consistent border radius
- [ ] Appropriate shadows
- [ ] Smooth transitions
