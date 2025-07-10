# Validators

This package contains the Zod schemas for validating data in the application.

## Features

- **Zod**: A TypeScript-first schema declaration and validation library.
- **Data Validation**: A collection of schemas for validating data in the application.

## Schemas

The following schemas are available:

- `address`
- `auth`
- `cart`
- `env`
- `order`
- `product`

## Getting Started

To get started with this package, you can import the schemas you want to use in your application.

```tsx
import { addSchema } from '@yuki/validators/address';

const myData = {
  name: 'My Address',
  phone: '1234567890',
  line1: '123 Main St',
  city: 'Anytown',
  state: 'CA',
  postalCode: '12345',
  country: 'USA',
};

try {
  addSchema.parse(myData);
  console.log('Data is valid!');
} catch (error) {
  console.error(error);
}
```