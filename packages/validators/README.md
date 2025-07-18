# Validators ✅

A comprehensive validation package for the Yukinu e-commerce platform. This package provides type-safe Zod schemas for validating data across all applications, ensuring data integrity and consistent validation rules throughout the ecosystem.

## 📋 Description

The Validators package centralizes all data validation logic for the Yukinu e-commerce platform. Built with Zod, it provides runtime type checking and validation schemas that are shared across the API, frontend applications, and database operations. This ensures consistent data validation and type safety throughout the entire application stack.

## ✨ Features

### Validation Schemas

- **E-commerce Entities**: Complete validation for all business objects
- **Type Safety**: Runtime validation with TypeScript inference
- **Consistent Rules**: Shared validation logic across all applications
- **Error Messages**: Descriptive validation error messages
- **Nested Validation**: Support for complex object validation

### Business Domain Coverage

- **Authentication**: User registration, login, and profile validation
- **Products**: Product creation, updates, and catalog management
- **Orders**: Order processing and status validation
- **Addresses**: Shipping and billing address validation
- **Shopping Cart**: Cart item and quantity validation
- **Environment**: Configuration and environment variable validation

### Developer Experience

- **TypeScript Integration**: Automatic type inference from schemas
- **Reusable Schemas**: Composable validation building blocks
- **Custom Validators**: Extended validation for business rules
- **Error Handling**: Structured error responses for API integration

## 🚀 Getting Started

### Installation

The package is included in the workspace and used across all applications.

### Basic Usage

```tsx
import { addSchema } from '@yuki/validators/address'

const addressData = {
  name: 'Home Address',
  phone: '+1-555-0123',
  line1: '123 Main Street',
  city: 'San Francisco',
  state: 'CA',
  postalCode: '94105',
  country: 'USA',
}

try {
  // Validate and parse data
  const validAddress = addSchema.parse(addressData)
  console.log('Address is valid:', validAddress)
} catch (error) {
  console.error('Validation errors:', error.errors)
}
```

### Type Inference

```tsx
import { z } from 'zod'

import { productCreateSchema } from '@yuki/validators/product'

// Automatically infer TypeScript types
type ProductCreate = z.infer<typeof productCreateSchema>

const createProduct = (data: ProductCreate) => {
  // data is fully typed based on the schema
  console.log(data.name) // string
  console.log(data.price) // number
}
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
└── "./*" (src/*.ts)    # Individual schema modules
```

### Schema Organization

```
src/
├── address.ts       # Address validation schemas
├── auth.ts          # Authentication schemas
├── cart.ts          # Shopping cart schemas
├── env.ts           # Environment variable schemas
├── order.ts         # Order processing schemas
└── product.ts       # Product catalog schemas
```

## 📋 Available Schemas

### Address Validation (`address.ts`)

#### `addSchema`

Validates new address creation:

```tsx
import { addSchema } from '@yuki/validators/address'

const newAddress = addSchema.parse({
  name: 'Home', // required: string
  phone: '+1-555-0123', // required: phone format
  line1: '123 Main St', // required: string
  line2: 'Apt 4B', // optional: string
  city: 'New York', // required: string
  state: 'NY', // required: string
  postalCode: '10001', // required: string
  country: 'USA', // required: string
})
```

#### `updateSchema`

Validates address updates with optional fields:

```tsx
import { updateSchema } from '@yuki/validators/address'

const addressUpdate = updateSchema.parse({
  id: 'addr_123', // required: string
  name: 'Updated Name', // optional updates
  phone: '+1-555-9999',
})
```

### Authentication (`auth.ts`)

#### `signUpSchema`

Validates user registration:

```tsx
import { signUpSchema } from '@yuki/validators/auth'

const registration = signUpSchema.parse({
  email: 'user@example.com', // required: valid email
  password: 'SecurePass123!', // required: min 8 chars, complexity rules
  name: 'John Doe', // required: string
  confirmPassword: 'SecurePass123!', // required: must match password
})
```

#### `signInSchema`

Validates user login:

```tsx
import { signInSchema } from '@yuki/validators/auth'

const loginData = signInSchema.parse({
  email: 'user@example.com', // required: valid email
  password: 'SecurePass123!', // required: string
  rememberMe: true, // optional: boolean
})
```

#### `profileUpdateSchema`

Validates profile updates:

```tsx
import { profileUpdateSchema } from '@yuki/validators/auth'

const profileData = profileUpdateSchema.parse({
  name: 'Updated Name', // optional: string
  email: 'new@example.com', // optional: valid email
  currentPassword: 'current', // required if changing password
  newPassword: 'NewPass123!', // optional: new password
})
```

### Product Management (`product.ts`)

#### `productCreateSchema`

Validates new product creation:

```tsx
import { productCreateSchema } from '@yuki/validators/product'

const newProduct = productCreateSchema.parse({
  name: 'Premium Widget', // required: string
  description: 'High quality widget for...', // required: string
  price: 29.99, // required: positive number
  stock: 100, // required: non-negative integer
  categoryId: 'cat_123', // required: string
  imageUrl: 'https://...', // optional: valid URL
  isActive: true, // optional: boolean, default true
})
```

#### `productUpdateSchema`

Validates product updates:

```tsx
import { productUpdateSchema } from '@yuki/validators/product'

const productUpdate = productUpdateSchema.parse({
  id: 'prod_123', // required: string
  price: 34.99, // optional: positive number
  stock: 75, // optional: non-negative integer
  isActive: false, // optional: boolean
})
```

#### `productSearchSchema`

Validates product search parameters:

```tsx
import { productSearchSchema } from '@yuki/validators/product'

const searchParams = productSearchSchema.parse({
  query: 'widget', // optional: search term
  categoryId: 'cat_123', // optional: category filter
  minPrice: 10.0, // optional: minimum price
  maxPrice: 100.0, // optional: maximum price
  page: 1, // optional: page number, default 1
  limit: 20, // optional: items per page, default 20
  sortBy: 'price', // optional: sort field
  sortOrder: 'asc', // optional: sort direction
})
```

### Shopping Cart (`cart.ts`)

#### `cartItemSchema`

Validates cart item operations:

```tsx
import { cartItemSchema } from '@yuki/validators/cart'

const cartItem = cartItemSchema.parse({
  productId: 'prod_123', // required: string
  quantity: 2, // required: positive integer
})
```

#### `cartUpdateSchema`

Validates cart updates:

```tsx
import { cartUpdateSchema } from '@yuki/validators/cart'

const cartUpdate = cartUpdateSchema.parse({
  items: [
    { productId: 'prod_123', quantity: 2 },
    { productId: 'prod_456', quantity: 1 },
  ], // required: array of cart items
})
```

### Order Processing (`order.ts`)

#### `orderCreateSchema`

Validates new order creation:

```tsx
import { orderCreateSchema } from '@yuki/validators/order'

const newOrder = orderCreateSchema.parse({
  items: [{ productId: 'prod_123', quantity: 2, price: 29.99 }], // required: array of order items
  shippingAddressId: 'addr_123', // required: string
  billingAddressId: 'addr_456', // optional: string
  paymentMethod: 'credit_card', // required: enum
  notes: 'Special instructions', // optional: string
})
```

#### `orderStatusSchema`

Validates order status updates:

```tsx
import { orderStatusSchema } from '@yuki/validators/order'

const statusUpdate = orderStatusSchema.parse({
  id: 'order_123', // required: string
  status: 'shipped', // required: enum (pending, processing, shipped, delivered, cancelled)
  trackingNumber: 'TRK123456', // optional: string
  notes: 'Package shipped via UPS', // optional: string
})
```

### Environment Configuration (`env.ts`)

#### `envSchema`

Validates environment variables:

```tsx
import { envSchema } from '@yuki/validators/env'

const env = envSchema.parse(process.env)
// Validates all required environment variables
// Provides type-safe access to configuration
```

## 🛠️ Schema Development

### Creating New Schemas

1. **Create schema file:**

   ```tsx
   // src/new-entity.ts
   import { z } from 'zod'

   export const newEntitySchema = z.object({
     id: z.string().min(1),
     name: z.string().min(1).max(100),
     isActive: z.boolean().default(true),
     createdAt: z.date().optional(),
   })

   export const createNewEntitySchema = newEntitySchema.omit({
     id: true,
     createdAt: true,
   })

   export const updateNewEntitySchema = createNewEntitySchema.partial()
   ```

2. **Add validation rules:**

   ```tsx
   // Custom validation
   export const emailSchema = z.string().email('Invalid email format')

   export const passwordSchema = z
     .string()
     .min(8, 'Password must be at least 8 characters')
     .regex(
       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
       'Password must contain uppercase, lowercase, and number',
     )
   ```

3. **Compose schemas:**

   ```tsx
   // Reuse existing schemas
   import { addressSchema } from './address'

   export const userProfileSchema = z.object({
     name: z.string().min(1),
     email: emailSchema,
     shippingAddress: addressSchema.optional(),
   })
   ```

### Validation Patterns

#### Input Sanitization

```tsx
const sanitizedStringSchema = z
  .string()
  .trim() // Remove whitespace
  .min(1, 'Required field') // Ensure not empty after trim
  .max(255, 'Too long') // Limit length
```

#### Conditional Validation

```tsx
const conditionalSchema = z
  .object({
    type: z.enum(['individual', 'business']),
    name: z.string(),
    businessName: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.type === 'business') {
        return !!data.businessName
      }
      return true
    },
    {
      message: 'Business name required for business accounts',
      path: ['businessName'],
    },
  )
```

#### Array Validation

```tsx
const orderItemsSchema = z
  .array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().positive(),
    }),
  )
  .min(1, 'At least one item required')
  .max(100, 'Too many items')
```

## 📦 Dependencies

### Core Dependencies

- `zod` - TypeScript-first schema validation library

### Development Dependencies

- TypeScript for type definitions
- ESLint and Prettier for code quality

## 🌐 Usage Across Applications

### tRPC API Integration

```tsx
// In API procedures
import { productCreateSchema } from '@yuki/validators/product'

export const createProduct = publicProcedure
  .input(productCreateSchema)
  .mutation(({ input }) => {
    // input is fully typed and validated
    return db.products.create(input)
  })
```

### Frontend Form Validation

```tsx
// In React forms
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { signUpSchema } from '@yuki/validators/auth'

function SignUpForm() {
  const form = useForm({
    resolver: zodResolver(signUpSchema),
  })

  // Form automatically validates using schema
}
```

### Database Operations

```tsx
// Before database operations
import { productUpdateSchema } from '@yuki/validators/product'

async function updateProduct(data: unknown) {
  const validData = productUpdateSchema.parse(data)
  return db.products.update(validData)
}
```

## 🔗 Integration

This package is used by:

- **API** (`@yuki/api`) - Input validation in tRPC procedures
- **Auth** (`@yuki/auth`) - User and authentication validation
- **DB** (`@yuki/db`) - Data validation before database operations
- All frontend applications for form validation and type inference

## 🎯 Validation Best Practices

### Error Handling

- Provide clear, user-friendly error messages
- Include field-specific validation feedback
- Handle multiple validation errors gracefully

### Performance

- Use lazy evaluation for complex validations
- Cache parsed schemas when possible
- Validate only necessary fields for updates

### Security

- Sanitize input data to prevent injection attacks
- Validate file uploads and external URLs
- Implement rate limiting on validation-heavy endpoints
