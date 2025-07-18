# UI 🎨

A shadcn/ui component library for the Yukinu e-commerce platform. This package provides beautifully designed, accessible, and customizable components built on top of Radix UI primitives and styled with Tailwind CSS.

## 📋 Description

The UI package is a collection of copy-and-paste components built using the shadcn/ui methodology. It serves as the design foundation for all Yukinu applications, providing a consistent set of high-quality React components that can be customized and themed. The components are designed to be accessible, responsive, and easy to integrate across Next.js (Kaze), Vue.js (Goldenglow), and React Router (Pepe) applications.

## ✨ Features

### shadcn/ui Components

- **Copy-and-Paste Components**: No package dependencies, just copy what you need
- **Radix UI Primitives**: Built on unstyled, accessible components
- **Customizable**: Easily modify styles and behavior to fit your needs
- **Consistent Design**: Unified design language across all applications
- **Accessibility First**: WCAG compliant with proper ARIA attributes

### Design System

- **Tailwind CSS**: Utility-first CSS framework for styling
- **CSS Variables**: Theme-able design tokens for colors and spacing
- **Dark Mode Support**: Built-in dark mode with class-based switching
- **Responsive Design**: Mobile-first components that work on all devices
- **Custom Theme**: Branded color palette and typography scales

### Developer Experience

- **TypeScript Support**: Full type safety for all components
- **Class Variance Authority**: Type-safe component variants
- **Lucide React Icons**: Beautiful and consistent icon library
- **Tailwind Merge**: Intelligent class merging for style composition
- **Zero Runtime**: No JavaScript runtime overhead

## 🚀 Getting Started

### Installation

The package is included in the workspace and shared across all applications.

### Basic Usage

```tsx
import { Button } from '@yuki/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@yuki/ui/card'
import { Input } from '@yuki/ui/input'

function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome to Yukinu</CardTitle>
      </CardHeader>
      <CardContent>
        <Input placeholder='Search products...' />
        <Button>Shop Now</Button>
      </CardContent>
    </Card>
  )
}
```

### Tailwind CSS Integration

```tsx
// Import Tailwind CSS in your application
import '@yuki/ui/tailwind.css'

// Use utility classes with components

;<Button className='bg-primary hover:bg-primary/90'>
  Custom Styled Button
</Button>
```

### Available Scripts

- `bun dev` - Run TypeScript compiler in watch mode
- `bun build` - Build the package for production
- `bun typecheck` - Run TypeScript type checking
- `bun lint` - Run ESLint for code quality
- `bun format` - Check code formatting with Prettier

## 🏗️ Package Structure

### Export Structure

```
exports:
├── "." (lib/utils.ts)        # Utility functions (cn, etc.)
├── "./*" (components/*.tsx)  # Individual shadcn/ui components
├── "./hooks/*" (hooks/*.tsx) # Custom React hooks
└── "./tailwind.css"          # Tailwind CSS base styles
```

### shadcn/ui Component Organization

```
src/
├── components/               # shadcn/ui components
│   ├── ui/                   # Core UI components
│   │   ├── avatar.tsx        # User avatar with fallback
│   │   ├── badge.tsx         # Status badges and indicators
│   │   ├── button.tsx        # Interactive button component
│   │   ├── card.tsx          # Flexible content container
│   │   ├── dropdown-menu.tsx # Accessible dropdown menus
│   │   ├── form.tsx          # Form field components
│   │   ├── input.tsx         # Text input with validation states
│   │   ├── select.tsx        # Dropdown selection component
│   │   ├── tabs.tsx          # Tab navigation interface
│   │   └── ...               # More shadcn/ui components
│   └── icons.tsx             # Lucide React icon exports
├── hooks/                    # Custom React hooks
├── lib/
│   └── utils.ts              # cn() utility and helpers
├──  tailwind.css             # Tailwind base styles and variables
└── components.json           # shadcn/ui configuration
```

## 🧩 shadcn/ui Components

### Form & Input Components

- **Button** - Versatile button with multiple variants (default, destructive, outline, secondary, ghost, link)
- **Input** - Text input field with validation states and proper accessibility
- **Select** - Dropdown selection with search and multi-select capabilities
- **Form** - Form field wrapper with validation, labels, and error handling

### Layout & Container Components

- **Card** - Flexible content container with header, content, and footer sections
- **Tabs** - Accessible tab navigation for organizing content
- **Pagination** - Navigation component for paginated data

### Display & Feedback Components

- **Avatar** - User profile image with automatic fallback text generation
- **Badge** - Small status indicators and labels with semantic variants
- **Typography** - Consistent text styling with heading and paragraph components
- **Sonner** - Beautiful toast notifications with stacking and positioning

### Navigation Components

- **DropdownMenu** - Accessible dropdown menus with keyboard navigation
- **Input** - Text inputs with validation states
- **Select** - Dropdown selectors with search
- **Form** - Form wrappers with validation

### Layout Components

- **Card** - Content containers with header, content, footer
- **Tabs** - Tab navigation for content organization
- **Pagination** - Navigation for paginated content

### Data Display

- **Avatar** - User profile images with fallbacks
- **Badge** - Status indicators and labels
- **Typography** - Headings, paragraphs, and text styles
- **Icons** - Comprehensive icon library

### Navigation

- **DropdownMenu** - Context menus and navigation
- **Pagination** - Page navigation controls

### Feedback

### Icon Components

- **Icons** - Curated set of Lucide React icons with consistent sizing and styling

## 🎨 shadcn/ui Design System

### CSS Variables & Theming

shadcn/ui uses CSS variables for theming, making it easy to customize colors and switch themes:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 84% 4.9%;
  --muted: 210 40% 96%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96%;
  --accent-foreground: 222.2 84% 4.9%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
  --radius: 0.5rem;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... dark mode variables */
}
```

### Component Variants

Components use `class-variance-authority` for type-safe variant management:

```tsx
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'text-destructive-foreground bg-destructive hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)
```

### Accessibility Features

- **ARIA Labels**: Proper labeling for screen readers
- **Keyboard Navigation**: Full keyboard support for interactive components
- **Focus Management**: Visible focus indicators and logical tab order
- **Color Contrast**: WCAG AA compliant color combinations

## 🛠️ Adding shadcn/ui Components

### Using the CLI (Recommended)

```bash
# Add a new component using shadcn/ui CLI
bunx --bun shadcn-ui@latest add button

# Add multiple components
bunx --bun shadcn-ui@latest add card input select
```

### Manual Installation

1. **Copy component code** from the shadcn/ui website
2. **Place in components/ui/** directory
3. **Update exports** in package.json if needed
4. **Install dependencies** if the component requires new packages

### Component Customization

```tsx
// Example: Customizing the Button component
import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center rounded-md text-sm font-medium',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        // Add custom variant
        yukinu: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white',
      },
      size: {
        default: 'h-10 px-4 py-2',
        // Add custom size
        xl: 'h-12 rounded-lg px-10',
      },
    },
  },
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
```

## 📦 Dependencies

### Core Dependencies

- `react` & `react-dom` - React framework
- `@radix-ui/*` - Unstyled, accessible component primitives
- `class-variance-authority` - Type-safe component variant utilities
- `clsx` - Conditional className utility
- `tailwind-merge` - Intelligent Tailwind class merging
- `lucide-react` - Beautiful SVG icon library
- `tailwindcss-animate` - Tailwind CSS animation utilities

### Development Dependencies

- `tailwindcss` - Utility-first CSS framework
- `@types/react` - React TypeScript definitions
- TypeScript for type safety
- ESLint and Prettier for code quality

## 🌐 Usage Across Applications

### Next.js (Kaze)

```tsx
import { Button } from '@yuki/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@yuki/ui/card'

import '@yuki/ui/tailwind.css'

export default function Dashboard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome to Yukinu</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Get Started</Button>
      </CardContent>
    </Card>
  )
}
```

### React Router (Pepe Admin)

```tsx
import { Badge } from '@yuki/ui/badge'
import { Input } from '@yuki/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@yuki/ui/select'

export default function AdminPanel() {
  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-2'>
        <Input placeholder='Search products...' />
        <Select>
          <SelectTrigger>
            <SelectValue placeholder='Category' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='electronics'>Electronics</SelectItem>
            <SelectItem value='clothing'>Clothing</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Badge variant='secondary'>Admin Panel</Badge>
    </div>
  )
}
```

## 🎯 Best Practices

### Component Usage

- **Compose over Configure**: Use multiple small components rather than complex props
- **Maintain Accessibility**: Always include proper ARIA attributes and keyboard navigation
- **Use Semantic HTML**: Choose the right HTML elements for the job
- **Handle Loading States**: Implement proper loading and error states

### Styling Guidelines

- **Use CSS Variables**: Leverage the theme system for consistent colors
- **Responsive Design**: Always test components on different screen sizes
- **Dark Mode**: Ensure components work in both light and dark themes
- **Performance**: Avoid unnecessary re-renders and heavy computations

### Development Workflow

```bash
# Add new shadcn/ui component
bunx --bun shadcn-ui@latest add dialog

# Update existing components
bunx --bun shadcn-ui@latest add --overwrite button

# Generate component.json if missing
bunx --bun shadcn-ui@latest init
```

## 🔧 Configuration

### components.json

This file configures shadcn/ui for your project:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "tsx": true,
  "rsc": true,
  "tailwind": {
    "config": "",
    "css": "src/tailwind.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@yuki/ui",
    "hooks": "@yuki/ui/hooks",
    "lib": "@yuki/ui/lib",
    "utils": "@yuki/ui",
    "ui": "@yuki/ui/components"
  },
  "iconLibrary": "lucide"
}
```

### Component Customization

Override component styles by passing custom classes:

```tsx
<Button className='bg-custom-color hover:bg-custom-color/90'>
  Custom Button
</Button>
```

## 🎯 Best Practices

### Accessibility

- Use semantic HTML elements
- Include proper ARIA attributes
- Ensure keyboard navigation
- Maintain color contrast ratios

### Performance

- Tree shake unused components
- Optimize image and icon usage
- Use CSS-in-JS sparingly
- Leverage Tailwind's purging

### Maintainability

- Follow consistent naming conventions
- Document component APIs
- Write tests for complex components
- Keep components focused and composable

## 🔗 Integration

This package is used by:

- **Kaze** (`apps/kaze`) - Next.js customer frontend
- **Goldenglow** (`apps/goldenglow`) - Vue.js customer frontend (design tokens)
- **Pepe** (`apps/pepe`) - React Router admin dashboard

The components provide a consistent user experience across all applications while allowing for framework-specific adaptations where needed.

To get started with this package, you can import the components you want to use in your application.

```tsx
import { Button } from '@yuki/ui/button'

export default function MyComponent() {
  return <Button>Click me</Button>
}
```
