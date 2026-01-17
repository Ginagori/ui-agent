# Responsive Design

## Mobile-First Approach

Start with mobile styles, then add complexity for larger screens:

```css
/* Mobile base styles */
.container {
  padding: 1rem;
}

/* Tablet and up */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .container {
    padding: 3rem;
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

## Breakpoints

### Standard Breakpoints

| Name | Min Width | Target Devices |
|------|-----------|----------------|
| xs | 0 | Small phones |
| sm | 640px | Large phones |
| md | 768px | Tablets |
| lg | 1024px | Laptops |
| xl | 1280px | Desktops |
| 2xl | 1536px | Large screens |

### CSS Custom Properties

```css
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}
```

### Tailwind Breakpoints

```html
<!-- Mobile first -->
<div class="p-4 md:p-6 lg:p-8">
  <h1 class="text-xl md:text-2xl lg:text-4xl">Responsive Heading</h1>
</div>
```

## Responsive Patterns

### Stack to Grid

Mobile: stacked vertically
Desktop: side by side

```css
.features {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .features {
    flex-direction: row;
  }
}
```

```html
<!-- Tailwind -->
<div class="flex flex-col md:flex-row gap-6">
  <div class="flex-1">Feature 1</div>
  <div class="flex-1">Feature 2</div>
  <div class="flex-1">Feature 3</div>
</div>
```

### Auto-fit Grid

Cards automatically adjust to available space:

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}
```

### Responsive Sidebar

```css
.layout {
  display: grid;
  grid-template-columns: 1fr;
}

@media (min-width: 1024px) {
  .layout {
    grid-template-columns: 250px 1fr;
  }
}

/* Or with CSS variables */
.layout {
  --sidebar-width: 0px;
  display: grid;
  grid-template-columns: var(--sidebar-width) 1fr;
}

@media (min-width: 1024px) {
  .layout {
    --sidebar-width: 250px;
  }
}
```

### Show/Hide Elements

```css
.mobile-only {
  display: block;
}

.desktop-only {
  display: none;
}

@media (min-width: 768px) {
  .mobile-only {
    display: none;
  }
  .desktop-only {
    display: block;
  }
}
```

```html
<!-- Tailwind -->
<nav class="hidden md:flex">Desktop Nav</nav>
<button class="md:hidden">Mobile Menu</button>
```

## Responsive Typography

### Fluid Typography

Scale smoothly between breakpoints:

```css
/* clamp(minimum, preferred, maximum) */
h1 {
  font-size: clamp(1.75rem, 4vw, 3rem);
}

p {
  font-size: clamp(1rem, 2vw, 1.125rem);
}
```

### Responsive Scale

```css
:root {
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;
}

@media (min-width: 768px) {
  :root {
    --text-base: 1.125rem;
    --text-lg: 1.25rem;
    --text-xl: 1.5rem;
    --text-2xl: 1.875rem;
    --text-3xl: 2.25rem;
    --text-4xl: 3rem;
  }
}
```

## Responsive Spacing

### Fluid Spacing

```css
.section {
  padding: clamp(2rem, 5vw, 4rem);
}

.container {
  padding-inline: clamp(1rem, 5vw, 3rem);
}
```

### Breakpoint-Based Spacing

```css
.section {
  padding: 2rem 1rem;
}

@media (min-width: 768px) {
  .section {
    padding: 3rem 2rem;
  }
}

@media (min-width: 1024px) {
  .section {
    padding: 4rem 3rem;
  }
}
```

## Responsive Images

### Basic Responsive Image

```html
<img
  src="image.jpg"
  alt="Description"
  style="max-width: 100%; height: auto;"
/>
```

### Art Direction with Picture

```html
<picture>
  <source media="(min-width: 1024px)" srcset="hero-desktop.jpg" />
  <source media="(min-width: 768px)" srcset="hero-tablet.jpg" />
  <img src="hero-mobile.jpg" alt="Hero image" />
</picture>
```

### Responsive Images with srcset

```html
<img
  src="image-800.jpg"
  srcset="
    image-400.jpg 400w,
    image-800.jpg 800w,
    image-1200.jpg 1200w
  "
  sizes="
    (max-width: 600px) 100vw,
    (max-width: 1200px) 50vw,
    800px
  "
  alt="Description"
/>
```

### Background Images

```css
.hero {
  background-image: url('hero-mobile.jpg');
  background-size: cover;
  background-position: center;
}

@media (min-width: 768px) {
  .hero {
    background-image: url('hero-desktop.jpg');
  }
}
```

## Responsive Navigation

### Mobile Menu Pattern

```html
<header class="header">
  <a href="/" class="logo">Logo</a>

  <!-- Desktop Nav -->
  <nav class="nav-desktop">
    <a href="/about">About</a>
    <a href="/services">Services</a>
    <a href="/contact">Contact</a>
  </nav>

  <!-- Mobile Menu Button -->
  <button class="menu-toggle" aria-label="Toggle menu" aria-expanded="false">
    <span class="hamburger"></span>
  </button>

  <!-- Mobile Nav -->
  <nav class="nav-mobile" aria-hidden="true">
    <a href="/about">About</a>
    <a href="/services">Services</a>
    <a href="/contact">Contact</a>
  </nav>
</header>
```

```css
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}

.nav-desktop {
  display: none;
}

.nav-mobile {
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  padding: 2rem;
  transform: translateX(-100%);
  transition: transform 0.3s;
}

.nav-mobile.open {
  transform: translateX(0);
}

@media (min-width: 768px) {
  .nav-desktop {
    display: flex;
    gap: 2rem;
  }

  .menu-toggle,
  .nav-mobile {
    display: none;
  }
}
```

## Responsive Tables

### Horizontal Scroll

```css
.table-container {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.table {
  min-width: 600px;
}
```

### Stack on Mobile

```css
@media (max-width: 768px) {
  .table thead {
    display: none;
  }

  .table tr {
    display: block;
    margin-bottom: 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
  }

  .table td {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    border: none;
    border-bottom: 1px solid #e5e7eb;
  }

  .table td::before {
    content: attr(data-label);
    font-weight: 600;
  }
}
```

```html
<tr>
  <td data-label="Name">John Doe</td>
  <td data-label="Email">john@example.com</td>
  <td data-label="Role">Admin</td>
</tr>
```

## Container Queries

### Basic Container Query

```css
.card-container {
  container-type: inline-size;
}

.card {
  display: flex;
  flex-direction: column;
}

@container (min-width: 400px) {
  .card {
    flex-direction: row;
  }
}
```

### Named Containers

```css
.sidebar {
  container-type: inline-size;
  container-name: sidebar;
}

@container sidebar (min-width: 300px) {
  .widget {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}
```

## Testing Responsive Designs

### Key Test Points

1. **320px** - Small phones (iPhone SE)
2. **375px** - Standard phones (iPhone X)
3. **768px** - Tablets (iPad)
4. **1024px** - Laptops
5. **1440px** - Desktops
6. **1920px** - Large monitors

### Testing Checklist

- [ ] Text readable without zooming
- [ ] Tap targets at least 44x44px
- [ ] No horizontal scroll on mobile
- [ ] Images scale properly
- [ ] Navigation accessible on all sizes
- [ ] Forms usable on mobile
- [ ] Modals fit in viewport
- [ ] Tables readable on mobile

## Responsive Utilities (Tailwind)

```html
<!-- Responsive display -->
<div class="hidden md:block">Desktop only</div>
<div class="md:hidden">Mobile only</div>

<!-- Responsive flex direction -->
<div class="flex flex-col md:flex-row">...</div>

<!-- Responsive grid columns -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">...</div>

<!-- Responsive spacing -->
<div class="p-4 md:p-6 lg:p-8">...</div>

<!-- Responsive text -->
<h1 class="text-2xl md:text-4xl lg:text-5xl">...</h1>

<!-- Responsive width -->
<div class="w-full md:w-1/2 lg:w-1/3">...</div>
```
