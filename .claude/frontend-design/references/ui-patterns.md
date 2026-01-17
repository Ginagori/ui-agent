# UI Patterns

## Layout Patterns

### Stack (Vertical)

```css
.stack {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
```

```html
<div class="stack">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

### Cluster (Horizontal)

```css
.cluster {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}
```

### Split (Two Columns)

```css
.split {
  display: flex;
  gap: 2rem;
}
.split > :first-child { flex: 1; }
.split > :last-child { flex: 2; }
```

### Sidebar Layout

```css
.sidebar-layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  min-height: 100vh;
}

@media (max-width: 768px) {
  .sidebar-layout {
    grid-template-columns: 1fr;
  }
}
```

### Card Grid (Auto-fit)

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}
```

### Holy Grail Layout

```css
.holy-grail {
  display: grid;
  grid-template:
    "header header header" auto
    "nav    main   aside"  1fr
    "footer footer footer" auto
    / 200px 1fr    200px;
  min-height: 100vh;
}
```

### Center Content

```css
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Or with grid */
.center-grid {
  display: grid;
  place-items: center;
}
```

---

## Navigation Patterns

### Top Navigation Bar

```html
<nav class="navbar">
  <a href="/" class="navbar-brand">Logo</a>
  <ul class="navbar-nav">
    <li><a href="/about">About</a></li>
    <li><a href="/services">Services</a></li>
    <li><a href="/contact">Contact</a></li>
  </ul>
  <button class="navbar-toggle" aria-label="Toggle menu">
    <span class="hamburger"></span>
  </button>
</nav>
```

```css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.navbar-nav {
  display: flex;
  gap: 2rem;
  list-style: none;
}

.navbar-nav a {
  text-decoration: none;
  color: #374151;
  font-weight: 500;
}

.navbar-nav a:hover {
  color: #3b82f6;
}

.navbar-toggle {
  display: none;
}

@media (max-width: 768px) {
  .navbar-nav { display: none; }
  .navbar-toggle { display: block; }
}
```

### Sidebar Navigation

```html
<aside class="sidebar">
  <nav class="sidebar-nav">
    <a href="/dashboard" class="nav-item active">
      <svg><!-- icon --></svg>
      Dashboard
    </a>
    <a href="/analytics" class="nav-item">
      <svg><!-- icon --></svg>
      Analytics
    </a>
    <div class="nav-group">
      <span class="nav-group-title">Settings</span>
      <a href="/profile" class="nav-item">Profile</a>
      <a href="/security" class="nav-item">Security</a>
    </div>
  </nav>
</aside>
```

### Breadcrumbs

```html
<nav aria-label="Breadcrumb">
  <ol class="breadcrumb">
    <li><a href="/">Home</a></li>
    <li><a href="/products">Products</a></li>
    <li aria-current="page">Widget</li>
  </ol>
</nav>
```

```css
.breadcrumb {
  display: flex;
  gap: 0.5rem;
  list-style: none;
}

.breadcrumb li:not(:last-child)::after {
  content: "/";
  margin-left: 0.5rem;
  color: #9ca3af;
}
```

### Tabs

```html
<div class="tabs">
  <div class="tab-list" role="tablist">
    <button role="tab" aria-selected="true" aria-controls="panel-1">Tab 1</button>
    <button role="tab" aria-selected="false" aria-controls="panel-2">Tab 2</button>
    <button role="tab" aria-selected="false" aria-controls="panel-3">Tab 3</button>
  </div>
  <div id="panel-1" role="tabpanel" class="tab-panel">Content 1</div>
  <div id="panel-2" role="tabpanel" class="tab-panel" hidden>Content 2</div>
  <div id="panel-3" role="tabpanel" class="tab-panel" hidden>Content 3</div>
</div>
```

---

## Form Patterns

### Basic Input

```html
<div class="form-group">
  <label for="email" class="form-label">Email</label>
  <input
    type="email"
    id="email"
    class="form-input"
    placeholder="you@example.com"
  />
  <p class="form-hint">We'll never share your email.</p>
</div>
```

```css
.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
}

.form-input {
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input::placeholder {
  color: #9ca3af;
}

.form-hint {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}
```

### Input with Error

```html
<div class="form-group">
  <label for="email" class="form-label">Email</label>
  <input
    type="email"
    id="email"
    class="form-input form-input-error"
    aria-invalid="true"
    aria-describedby="email-error"
  />
  <p id="email-error" class="form-error">Please enter a valid email address.</p>
</div>
```

```css
.form-input-error {
  border-color: #ef4444;
}

.form-input-error:focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.form-error {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #ef4444;
}
```

### Select

```html
<div class="form-group">
  <label for="country" class="form-label">Country</label>
  <div class="select-wrapper">
    <select id="country" class="form-select">
      <option value="">Select a country</option>
      <option value="us">United States</option>
      <option value="uk">United Kingdom</option>
    </select>
  </div>
</div>
```

### Checkbox & Radio

```html
<label class="checkbox">
  <input type="checkbox" />
  <span class="checkbox-label">I agree to the terms</span>
</label>
```

```css
.checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox input {
  width: 1rem;
  height: 1rem;
  accent-color: #3b82f6;
}
```

---

## Button Patterns

### Button Variants

```html
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-outline">Outline</button>
<button class="btn btn-ghost">Ghost</button>
<button class="btn btn-danger">Danger</button>
```

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}
.btn-primary:hover { background: #2563eb; }

.btn-secondary {
  background: #6b7280;
  color: white;
}
.btn-secondary:hover { background: #4b5563; }

.btn-outline {
  background: transparent;
  border-color: #d1d5db;
  color: #374151;
}
.btn-outline:hover { background: #f3f4f6; }

.btn-ghost {
  background: transparent;
  color: #374151;
}
.btn-ghost:hover { background: #f3f4f6; }

.btn-danger {
  background: #ef4444;
  color: white;
}
.btn-danger:hover { background: #dc2626; }
```

### Button Sizes

```css
.btn-sm { padding: 0.375rem 0.75rem; font-size: 0.75rem; }
.btn-md { padding: 0.625rem 1.25rem; font-size: 0.875rem; }
.btn-lg { padding: 0.75rem 1.5rem; font-size: 1rem; }
```

### Button with Icon

```html
<button class="btn btn-primary">
  <svg class="btn-icon"><!-- plus icon --></svg>
  Add Item
</button>
```

```css
.btn-icon {
  width: 1rem;
  height: 1rem;
}
```

### Loading Button

```html
<button class="btn btn-primary btn-loading" disabled>
  <svg class="spinner"><!-- spinner --></svg>
  Loading...
</button>
```

---

## Card Patterns

### Basic Card

```html
<article class="card">
  <img src="image.jpg" alt="" class="card-image" />
  <div class="card-body">
    <h3 class="card-title">Card Title</h3>
    <p class="card-text">Card description goes here.</p>
  </div>
  <div class="card-footer">
    <button class="btn btn-primary">Action</button>
  </div>
</article>
```

```css
.card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.card-body {
  padding: 1.5rem;
}

.card-title {
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.card-text {
  margin: 0;
  color: #6b7280;
}

.card-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
}
```

### Horizontal Card

```css
.card-horizontal {
  display: flex;
}

.card-horizontal .card-image {
  width: 200px;
  height: auto;
}

.card-horizontal .card-body {
  flex: 1;
}
```

---

## Modal Pattern

```html
<div class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <div class="modal">
    <header class="modal-header">
      <h2 id="modal-title" class="modal-title">Modal Title</h2>
      <button class="modal-close" aria-label="Close modal">&times;</button>
    </header>
    <div class="modal-body">
      <p>Modal content goes here.</p>
    </div>
    <footer class="modal-footer">
      <button class="btn btn-outline">Cancel</button>
      <button class="btn btn-primary">Confirm</button>
    </footer>
  </div>
</div>
```

```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal {
  background: white;
  border-radius: 0.5rem;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow: auto;
  box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
}
```

---

## Dropdown Pattern

```html
<div class="dropdown">
  <button class="dropdown-trigger" aria-expanded="false" aria-haspopup="true">
    Options
    <svg class="dropdown-arrow"><!-- chevron --></svg>
  </button>
  <div class="dropdown-menu" role="menu">
    <a href="#" class="dropdown-item" role="menuitem">Edit</a>
    <a href="#" class="dropdown-item" role="menuitem">Duplicate</a>
    <hr class="dropdown-divider" />
    <a href="#" class="dropdown-item dropdown-item-danger" role="menuitem">Delete</a>
  </div>
</div>
```

```css
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 10rem;
  padding: 0.5rem 0;
  background: white;
  border-radius: 0.375rem;
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-0.5rem);
  transition: all 0.15s;
}

.dropdown.open .dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-item {
  display: block;
  padding: 0.5rem 1rem;
  color: #374151;
  text-decoration: none;
}

.dropdown-item:hover {
  background: #f3f4f6;
}

.dropdown-item-danger {
  color: #ef4444;
}

.dropdown-divider {
  margin: 0.5rem 0;
  border: none;
  border-top: 1px solid #e5e7eb;
}
```

---

## Table Pattern

```html
<div class="table-container">
  <table class="table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Role</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>John Doe</td>
        <td>john@example.com</td>
        <td><span class="badge badge-success">Admin</span></td>
        <td>
          <button class="btn btn-sm btn-ghost">Edit</button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

```css
.table-container {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.table th {
  font-weight: 600;
  color: #374151;
  background: #f9fafb;
}

.table tbody tr:hover {
  background: #f9fafb;
}
```

---

## Alert / Toast Pattern

```html
<div class="alert alert-success" role="alert">
  <svg class="alert-icon"><!-- check icon --></svg>
  <div class="alert-content">
    <strong class="alert-title">Success!</strong>
    <p class="alert-message">Your changes have been saved.</p>
  </div>
  <button class="alert-close" aria-label="Dismiss">&times;</button>
</div>
```

```css
.alert {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 0.375rem;
  border: 1px solid;
}

.alert-success {
  background: #ecfdf5;
  border-color: #a7f3d0;
  color: #065f46;
}

.alert-error {
  background: #fef2f2;
  border-color: #fecaca;
  color: #991b1b;
}

.alert-warning {
  background: #fffbeb;
  border-color: #fde68a;
  color: #92400e;
}

.alert-info {
  background: #eff6ff;
  border-color: #bfdbfe;
  color: #1e40af;
}
```

---

## Badge Pattern

```html
<span class="badge badge-primary">New</span>
<span class="badge badge-success">Active</span>
<span class="badge badge-warning">Pending</span>
<span class="badge badge-danger">Expired</span>
```

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 9999px;
}

.badge-primary { background: #dbeafe; color: #1d4ed8; }
.badge-success { background: #d1fae5; color: #065f46; }
.badge-warning { background: #fef3c7; color: #92400e; }
.badge-danger { background: #fee2e2; color: #991b1b; }
```
