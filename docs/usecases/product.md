---
title: 4.08. Product Management Use Cases
description: This document outlines the use cases for managing products, including creation, updates, and deletion.
parent: 4. Use Cases
---

## Get All Products

Retrieves a paginated list of all products, with options for searching and filtering by category, vendor, and deletion status.

### Pre-condition

- The user must have permission to view products.

### Post-condition

- A paginated list of products is returned.
- Pagination details are included.

### Actors

- **Main actor**: Admin/User.
- **Secondary actor**: System.

### Basic flow

| Actor                                                                     | System                                                         |
| ------------------------------------------------------------------------- | -------------------------------------------------------------- |
| 1. Submits a request with optional search terms, filters, and pagination. |                                                                |
|                                                                           | 2. Constructs a query based on the provided filters.           |
|                                                                           | 3. Fetches the products and the total count from the database. |
|                                                                           | 4. Returns the list of products and pagination information.    |

---

## Get a Single Product

Retrieves detailed information for a single product by its ID, including its relations (images, variants, etc.).

### Pre-condition

- The product must exist.

### Post-condition

- The full details of the specified product are returned.

### Actors

- **Main actor**: Admin/User.
- **Secondary actor**: System.

### Basic flow

| Actor                                   | System                                                             |
| --------------------------------------- | ------------------------------------------------------------------ |
| 1. Requests a product by its unique ID. |                                                                    |
|                                         | 2. Fetches the product's data and its relations from the database. |
|                                         | 3. Returns the complete product information.                       |

### Exception

**2.1. Product not found:**

1. The system returns a "Not Found" error.

---

## Create Product

Creates a new product with its associated images, attributes, and variants.

### Pre-condition

- The user must have permission to create products.
- If a `categoryId` is provided, it must be valid.

### Post-condition

- A new product is created in the database, along with its images, attributes, and variants.

### Actors

- **Main actor**: Admin/Vendor Owner.
- **Secondary actor**: System.

### Basic flow

| Actor                                                                          | System                                                                            |
| ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| 1. Submits the new product's data, including images, attributes, and variants. |                                                                                   |
|                                                                                | 2. Verifies that the provided `categoryId` is valid.                              |
|                                                                                | 3. Creates the product, images, attributes, and variants in a single transaction. |
|                                                                                | 4. Returns the ID of the newly created product.                                   |

### Exception

**2.1. Invalid category ID:**

1. The system returns a "Bad Request" error.

---

## Update Product

Updates an existing product's information, including its images and attributes.

### Pre-condition

- The user must have permission to update the product.
- The product must exist.
- If a `categoryId` is provided, it must be valid.

### Post-condition

- The product's information is updated.
- Old images are deleted and new ones are created.
- Attributes are updated.

### Actors

- **Main actor**: Admin/Vendor Owner.
- **Secondary actor**: System.

### Basic flow

| Actor                                           | System                                                                        |
| ----------------------------------------------- | ----------------------------------------------------------------------------- |
| 1. Submits the product ID and the updated data. |                                                                               |
|                                                 | 2. Verifies that the product exists and the user has permission to update it. |
|                                                 | 3. Verifies that the provided `categoryId` is valid.                          |
|                                                 | 4. Updates the product details, images, and attributes in a transaction.      |
|                                                 | 5. Returns a success confirmation.                                            |

### Exceptions

**2.1. Product not found or permission denied:**

1. The system returns a "Not Found" error.

**3.1. Invalid category ID:**

1. The system returns a "Bad Request" error.

---

## Delete Product (Soft Delete)

Temporarily deactivates a product by marking it as deleted.

### Pre-condition

- The user must have permission to delete the product.
- The product must not already be deleted.

### Post-condition

- The product's `deletedAt` field is set to the current timestamp.

### Actors

- **Main actor**: Admin/Vendor Owner.
- **Secondary actor**: System.

### Basic flow

| Actor                                           | System                                                          |
| ----------------------------------------------- | --------------------------------------------------------------- |
| 1. Submits the ID of the product to be deleted. |                                                                 |
|                                                 | 2. Verifies that the product exists and is not already deleted. |
|                                                 | 3. Sets the `deletedAt` timestamp for the product.              |
|                                                 | 4. Returns a success confirmation.                              |

### Exceptions

**2.1. Product not found:**

1. The system returns a "Not Found" error.

**2.2. Product is already deleted:**

1. The system returns a "Bad Request" error.

---

## Restore Product

Reactivates a product that was previously soft-deleted.

### Pre-condition

- The user must have permission to restore the product.
- The product must be in a soft-deleted state.

### Post-condition

- The product's `deletedAt` field is set to `null`.

### Actors

- **Main actor**: Admin/Vendor Owner.
- **Secondary actor**: System.

### Basic flow

| Actor                                            | System                                                        |
| ------------------------------------------------ | ------------------------------------------------------------- |
| 1. Submits the ID of the product to be restored. |                                                               |
|                                                  | 2. Verifies that the product exists and is currently deleted. |
|                                                  | 3. Sets the product's `deletedAt` field to `null`.            |
|                                                  | 4. Returns a success confirmation.                            |

### Exceptions

**2.1. Product not found:**

1. The system returns a "Not Found" error.

**2.2. Product is not deleted:**

1. The system returns a "Bad Request" error.

---

## Permanently Delete Product

Permanently removes a product and its associated data.

### Pre-condition

- The user must have permission to permanently delete products.
- The product must be in a soft-deleted state.

### Post-condition

- The product and its images are permanently deleted.

### Actors

- **Main actor**: Admin/Vendor Owner.
- **Secondary actor**: System.

### Basic flow

| Actor                                                       | System                                                   |
| ----------------------------------------------------------- | -------------------------------------------------------- |
| 1. Submits the ID of the product to be permanently deleted. |                                                          |
|                                                             | 2. Verifies that the product exists and is soft-deleted. |
|                                                             | 3. Deletes the product's images from storage.            |
|                                                             | 4. Deletes the product record from the database.         |
|                                                             | 5. Returns a success confirmation.                       |

### Exception

**2.1. Product not found or not soft-deleted:**

1. The system returns a "Not Found" error.
