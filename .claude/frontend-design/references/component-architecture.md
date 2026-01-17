# Component Architecture

## Project Structure

### React Project Structure

```
src/
├── components/
│   ├── ui/                 # Base UI components
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.styles.ts
│   │   │   └── index.ts
│   │   ├── Input/
│   │   ├── Card/
│   │   └── index.ts        # Barrel export
│   │
│   ├── layout/             # Layout components
│   │   ├── Header/
│   │   ├── Sidebar/
│   │   ├── Footer/
│   │   └── PageLayout/
│   │
│   ├── forms/              # Form components
│   │   ├── LoginForm/
│   │   ├── SearchForm/
│   │   └── ContactForm/
│   │
│   └── features/           # Feature-specific
│       ├── Dashboard/
│       ├── UserProfile/
│       └── Settings/
│
├── hooks/                  # Custom hooks
│   ├── useAuth.ts
│   ├── useForm.ts
│   └── useMediaQuery.ts
│
├── lib/                    # Utilities
│   ├── utils.ts
│   ├── api.ts
│   └── constants.ts
│
├── styles/                 # Global styles
│   ├── globals.css
│   ├── variables.css
│   └── reset.css
│
├── types/                  # TypeScript types
│   └── index.ts
│
└── pages/                  # Page components
    ├── Home/
    ├── About/
    └── Dashboard/
```

### Component File Structure

```
Button/
├── Button.tsx              # Component logic
├── Button.styles.ts        # Styled components / CSS
├── Button.test.tsx         # Tests
├── Button.stories.tsx      # Storybook stories
└── index.ts                # Export
```

## Component Patterns

### Basic Component

```tsx
// Button/Button.tsx
import { ReactNode, ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
```

### Compound Components

```tsx
// Card/Card.tsx
import { createContext, useContext, ReactNode } from 'react';

const CardContext = createContext<{ variant?: string }>({});

interface CardProps {
  variant?: 'default' | 'elevated';
  children: ReactNode;
}

function Card({ variant = 'default', children }: CardProps) {
  return (
    <CardContext.Provider value={{ variant }}>
      <div className={`card card-${variant}`}>{children}</div>
    </CardContext.Provider>
  );
}

function CardHeader({ children }: { children: ReactNode }) {
  return <div className="card-header">{children}</div>;
}

function CardBody({ children }: { children: ReactNode }) {
  return <div className="card-body">{children}</div>;
}

function CardFooter({ children }: { children: ReactNode }) {
  return <div className="card-footer">{children}</div>;
}

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export { Card };

// Usage
<Card variant="elevated">
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>Actions</Card.Footer>
</Card>
```

### Render Props

```tsx
// DataFetcher.tsx
interface DataFetcherProps<T> {
  url: string;
  children: (props: {
    data: T | null;
    loading: boolean;
    error: Error | null;
  }) => ReactNode;
}

function DataFetcher<T>({ url, children }: DataFetcherProps<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);

  return <>{children({ data, loading, error })}</>;
}

// Usage
<DataFetcher url="/api/users">
  {({ data, loading, error }) => {
    if (loading) return <Spinner />;
    if (error) return <Error message={error.message} />;
    return <UserList users={data} />;
  }}
</DataFetcher>
```

### Polymorphic Components

```tsx
// Box.tsx
import { ElementType, ComponentPropsWithoutRef, ReactNode } from 'react';

type BoxProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
} & ComponentPropsWithoutRef<T>;

function Box<T extends ElementType = 'div'>({
  as,
  children,
  ...props
}: BoxProps<T>) {
  const Component = as || 'div';
  return <Component {...props}>{children}</Component>;
}

// Usage
<Box as="article" className="post">Content</Box>
<Box as="section">Section</Box>
<Box as="a" href="/page">Link Box</Box>
```

### Controlled vs Uncontrolled

```tsx
// Controlled
function ControlledInput({ value, onChange }) {
  return <input value={value} onChange={onChange} />;
}

// Uncontrolled
function UncontrolledInput({ defaultValue }) {
  const inputRef = useRef<HTMLInputElement>(null);
  return <input ref={inputRef} defaultValue={defaultValue} />;
}

// Hybrid (supports both)
function Input({ value, defaultValue, onChange, ...props }) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue || '');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setInternalValue(e.target.value);
    }
    onChange?.(e);
  };

  return (
    <input
      value={isControlled ? value : internalValue}
      onChange={handleChange}
      {...props}
    />
  );
}
```

## Custom Hooks

### useToggle

```tsx
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => setValue(v => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return { value, toggle, setTrue, setFalse };
}

// Usage
const { value: isOpen, toggle, setFalse: close } = useToggle();
```

### useMediaQuery

```tsx
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

// Usage
const isMobile = useMediaQuery('(max-width: 768px)');
```

### useLocalStorage

```tsx
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    window.localStorage.setItem(key, JSON.stringify(valueToStore));
  };

  return [storedValue, setValue] as const;
}

// Usage
const [theme, setTheme] = useLocalStorage('theme', 'light');
```

### useClickOutside

```tsx
function useClickOutside(ref: RefObject<HTMLElement>, handler: () => void) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

// Usage
const dropdownRef = useRef(null);
useClickOutside(dropdownRef, () => setIsOpen(false));
```

## State Management Patterns

### Context + Reducer

```tsx
// ThemeContext.tsx
type Theme = 'light' | 'dark';
type ThemeAction = { type: 'TOGGLE' } | { type: 'SET'; payload: Theme };

interface ThemeState {
  theme: Theme;
}

const ThemeContext = createContext<{
  state: ThemeState;
  dispatch: Dispatch<ThemeAction>;
} | null>(null);

function themeReducer(state: ThemeState, action: ThemeAction): ThemeState {
  switch (action.type) {
    case 'TOGGLE':
      return { theme: state.theme === 'light' ? 'dark' : 'light' };
    case 'SET':
      return { theme: action.payload };
    default:
      return state;
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(themeReducer, { theme: 'light' });

  return (
    <ThemeContext.Provider value={{ state, dispatch }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

### Prop Drilling Alternatives

```tsx
// Instead of prop drilling
<App user={user}>
  <Layout user={user}>
    <Header user={user}>
      <UserMenu user={user} />  // Deep prop drilling
    </Header>
  </Layout>
</App>

// Use Context
const UserContext = createContext<User | null>(null);

function App() {
  const [user, setUser] = useState<User | null>(null);
  return (
    <UserContext.Provider value={user}>
      <Layout>
        <Header>
          <UserMenu />  // Access via useContext
        </Header>
      </Layout>
    </UserContext.Provider>
  );
}

function UserMenu() {
  const user = useContext(UserContext);
  // ...
}
```

## Component Composition

### Slot Pattern

```tsx
interface PageLayoutProps {
  header: ReactNode;
  sidebar?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

function PageLayout({ header, sidebar, children, footer }: PageLayoutProps) {
  return (
    <div className="layout">
      <header className="layout-header">{header}</header>
      <div className="layout-body">
        {sidebar && <aside className="layout-sidebar">{sidebar}</aside>}
        <main className="layout-main">{children}</main>
      </div>
      {footer && <footer className="layout-footer">{footer}</footer>}
    </div>
  );
}

// Usage
<PageLayout
  header={<Header />}
  sidebar={<Sidebar />}
  footer={<Footer />}
>
  <Dashboard />
</PageLayout>
```

### Higher-Order Components (HOC)

```tsx
function withAuth<P extends object>(Component: ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { user, loading } = useAuth();

    if (loading) return <Spinner />;
    if (!user) return <Redirect to="/login" />;

    return <Component {...props} />;
  };
}

// Usage
const ProtectedDashboard = withAuth(Dashboard);
```

## Best Practices

### Component Guidelines

1. **Single Responsibility**: One component, one job
2. **Props Interface**: Always type props
3. **Default Props**: Provide sensible defaults
4. **Composition over Inheritance**: Prefer composition
5. **Colocation**: Keep related files together

### Performance

```tsx
// Memoize expensive components
const MemoizedList = memo(function List({ items }) {
  return items.map(item => <Item key={item.id} {...item} />);
});

// Memoize callbacks
function Parent() {
  const handleClick = useCallback(() => {
    // handler
  }, []);

  return <Child onClick={handleClick} />;
}

// Memoize computed values
function Component({ items }) {
  const sortedItems = useMemo(
    () => [...items].sort((a, b) => a.name.localeCompare(b.name)),
    [items]
  );
}
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `UserProfile` |
| Props | PascalCase + Props | `UserProfileProps` |
| Hooks | camelCase, use prefix | `useUserData` |
| Utilities | camelCase | `formatDate` |
| Constants | UPPER_SNAKE | `MAX_ITEMS` |
| CSS Classes | kebab-case | `user-profile` |
| Event Handlers | on/handle prefix | `onClick`, `handleSubmit` |

### Export Pattern

```tsx
// components/ui/index.ts (Barrel export)
export { Button } from './Button';
export { Input } from './Input';
export { Card } from './Card';
export type { ButtonProps } from './Button';
export type { InputProps } from './Input';

// Usage
import { Button, Input, Card } from '@/components/ui';
```
