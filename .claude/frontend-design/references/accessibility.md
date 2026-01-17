# Accessibility (a11y)

## Core Principles (POUR)

| Principle | Meaning |
|-----------|---------|
| **Perceivable** | Content can be perceived by all senses |
| **Operable** | Interface can be operated by all users |
| **Understandable** | Content and UI are understandable |
| **Robust** | Works with current and future technologies |

## Semantic HTML

### Use Correct Elements

```html
<!-- Bad -->
<div class="button" onclick="submit()">Submit</div>
<div class="heading">Page Title</div>

<!-- Good -->
<button type="submit">Submit</button>
<h1>Page Title</h1>
```

### Landmark Elements

```html
<header>Site header, logo, nav</header>
<nav>Main navigation</nav>
<main>Primary content</main>
<aside>Sidebar, related content</aside>
<footer>Site footer</footer>
<section>Thematic grouping</section>
<article>Self-contained content</article>
```

### Document Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Descriptive Page Title</title>
</head>
<body>
  <a href="#main" class="skip-link">Skip to main content</a>
  <header>...</header>
  <nav>...</nav>
  <main id="main">...</main>
  <footer>...</footer>
</body>
</html>
```

### Skip Link

```html
<a href="#main" class="skip-link">Skip to main content</a>
```

```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  padding: 8px 16px;
  background: #000;
  color: #fff;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

## Headings

### Proper Hierarchy

```html
<!-- Good: Sequential levels -->
<h1>Page Title</h1>
  <h2>Section 1</h2>
    <h3>Subsection 1.1</h3>
  <h2>Section 2</h2>

<!-- Bad: Skipping levels -->
<h1>Page Title</h1>
  <h3>Section 1</h3>  <!-- Skipped h2 -->
```

### One H1 Per Page

```html
<!-- Good -->
<h1>Product Name</h1>

<!-- Bad -->
<h1>Logo</h1>
<h1>Product Name</h1>
```

## Images

### Alt Text

```html
<!-- Informative image -->
<img src="chart.png" alt="Sales increased 25% from Q1 to Q2" />

<!-- Decorative image -->
<img src="decorative-border.png" alt="" />

<!-- Complex image -->
<figure>
  <img src="diagram.png" alt="System architecture diagram" />
  <figcaption>
    Detailed description of the system architecture...
  </figcaption>
</figure>
```

### Alt Text Guidelines

| Image Type | Alt Text Approach |
|------------|-------------------|
| Informative | Describe the content/purpose |
| Decorative | Empty alt (`alt=""`) |
| Functional | Describe the action |
| Complex | Brief alt + longer description |
| Text in image | Include all text |

## Forms

### Labels

```html
<!-- Explicit label (preferred) -->
<label for="email">Email Address</label>
<input type="email" id="email" name="email" />

<!-- Implicit label -->
<label>
  Email Address
  <input type="email" name="email" />
</label>

<!-- aria-label for icon buttons -->
<button aria-label="Search">
  <svg><!-- search icon --></svg>
</button>
```

### Required Fields

```html
<label for="name">
  Name <span aria-hidden="true">*</span>
  <span class="sr-only">(required)</span>
</label>
<input type="text" id="name" required aria-required="true" />
```

### Error Messages

```html
<div class="form-group">
  <label for="email">Email</label>
  <input
    type="email"
    id="email"
    aria-invalid="true"
    aria-describedby="email-error"
  />
  <p id="email-error" class="error" role="alert">
    Please enter a valid email address.
  </p>
</div>
```

### Form Instructions

```html
<form aria-describedby="form-instructions">
  <p id="form-instructions">Fields marked with * are required.</p>
  <!-- form fields -->
</form>
```

## Keyboard Navigation

### Focus Management

```css
/* Never remove focus outline without replacement */
/* Bad */
*:focus { outline: none; }

/* Good */
*:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Better: Focus-visible for keyboard only */
*:focus { outline: none; }
*:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
```

### Tab Order

```html
<!-- Natural tab order follows DOM order -->
<button>First</button>
<button>Second</button>
<button>Third</button>

<!-- Override with tabindex (use sparingly) -->
<button tabindex="2">Second</button>
<button tabindex="1">First</button>
<button tabindex="3">Third</button>

<!-- Remove from tab order -->
<button tabindex="-1">Not focusable via tab</button>
```

### Interactive Elements

All interactive elements must be keyboard accessible:

```html
<!-- Keyboard accessible by default -->
<button>Click me</button>
<a href="/page">Link</a>
<input type="text" />
<select>...</select>

<!-- Custom interactive elements need keyboard support -->
<div
  role="button"
  tabindex="0"
  onclick="handleClick()"
  onkeydown="handleKeyDown(event)"
>
  Custom Button
</div>
```

```javascript
function handleKeyDown(event) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    handleClick();
  }
}
```

## ARIA

### When to Use ARIA

```
First: Use semantic HTML
Second: Add ARIA only when HTML isn't enough
```

### Common ARIA Attributes

```html
<!-- Labels -->
<button aria-label="Close dialog">X</button>
<div aria-labelledby="section-title">...</div>

<!-- Descriptions -->
<input aria-describedby="password-hint" />
<p id="password-hint">Must be at least 8 characters</p>

<!-- States -->
<button aria-expanded="false">Menu</button>
<button aria-pressed="true">Toggle</button>
<div aria-hidden="true">Decorative content</div>

<!-- Live regions -->
<div aria-live="polite">Status updates</div>
<div aria-live="assertive">Error messages</div>
```

### ARIA Roles

```html
<!-- Landmark roles (prefer semantic HTML) -->
<div role="banner">Header</div>
<div role="navigation">Nav</div>
<div role="main">Main content</div>

<!-- Widget roles -->
<div role="dialog" aria-modal="true">Modal</div>
<div role="tablist">Tabs</div>
<div role="menu">Dropdown menu</div>
<div role="alert">Error message</div>
```

### Modal Dialog Pattern

```html
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="dialog-title"
  aria-describedby="dialog-desc"
>
  <h2 id="dialog-title">Confirm Action</h2>
  <p id="dialog-desc">Are you sure you want to proceed?</p>
  <button>Cancel</button>
  <button>Confirm</button>
</div>
```

```javascript
// Focus trap
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  element.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
    if (e.key === 'Escape') {
      closeModal();
    }
  });
}
```

## Color and Contrast

### Contrast Requirements

| Content | WCAG AA | WCAG AAA |
|---------|---------|----------|
| Normal text | 4.5:1 | 7:1 |
| Large text (18px+) | 3:1 | 4.5:1 |
| UI components | 3:1 | 3:1 |

### Don't Rely on Color Alone

```html
<!-- Bad: Color only -->
<span class="error" style="color: red;">Error</span>

<!-- Good: Color + text/icon -->
<span class="error">
  <svg aria-hidden="true"><!-- error icon --></svg>
  Error: Invalid email
</span>
```

### Links

```css
/* Distinguish links from text */
a {
  color: #2563eb;
  text-decoration: underline;
}

/* Or use other indicators */
a {
  color: #2563eb;
  border-bottom: 1px solid currentColor;
}
```

## Screen Reader Only Content

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

```html
<button>
  <svg aria-hidden="true"><!-- icon --></svg>
  <span class="sr-only">Delete item</span>
</button>
```

## Testing Accessibility

### Automated Tools

- **axe DevTools** - Browser extension
- **WAVE** - Web accessibility evaluation
- **Lighthouse** - Chrome DevTools audit
- **eslint-plugin-jsx-a11y** - React linting

### Manual Testing

1. **Keyboard only**: Navigate without mouse
2. **Screen reader**: Test with NVDA, VoiceOver, or JAWS
3. **Zoom**: Test at 200% zoom
4. **Color**: Test with color blindness simulators
5. **Motion**: Test with reduced motion preference

### Testing Checklist

- [ ] All functionality accessible via keyboard
- [ ] Focus visible and logical order
- [ ] Images have appropriate alt text
- [ ] Form inputs have labels
- [ ] Error messages are announced
- [ ] Color contrast meets requirements
- [ ] Page has proper heading structure
- [ ] Landmark regions are used
- [ ] Skip link present
- [ ] No keyboard traps
- [ ] Dynamic content announced

## Common Patterns

### Accessible Icon Button

```html
<button aria-label="Close" class="icon-button">
  <svg aria-hidden="true" focusable="false">
    <path d="..." />
  </svg>
</button>
```

### Accessible Toggle

```html
<button
  aria-pressed="false"
  onclick="toggle(this)"
>
  Dark Mode
</button>
```

```javascript
function toggle(button) {
  const pressed = button.getAttribute('aria-pressed') === 'true';
  button.setAttribute('aria-pressed', !pressed);
}
```

### Accessible Tabs

```html
<div class="tabs">
  <div role="tablist" aria-label="Features">
    <button
      role="tab"
      aria-selected="true"
      aria-controls="panel-1"
      id="tab-1"
    >
      Tab 1
    </button>
    <button
      role="tab"
      aria-selected="false"
      aria-controls="panel-2"
      id="tab-2"
      tabindex="-1"
    >
      Tab 2
    </button>
  </div>

  <div
    role="tabpanel"
    id="panel-1"
    aria-labelledby="tab-1"
  >
    Panel 1 content
  </div>
  <div
    role="tabpanel"
    id="panel-2"
    aria-labelledby="tab-2"
    hidden
  >
    Panel 2 content
  </div>
</div>
```

### Accessible Dropdown

```html
<div class="dropdown">
  <button
    aria-expanded="false"
    aria-haspopup="true"
    aria-controls="dropdown-menu"
  >
    Options
  </button>
  <ul
    id="dropdown-menu"
    role="menu"
    hidden
  >
    <li role="menuitem"><a href="#">Edit</a></li>
    <li role="menuitem"><a href="#">Delete</a></li>
  </ul>
</div>
```
