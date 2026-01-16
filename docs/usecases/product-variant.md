---
title: 4.09. Product Variant Management Use Cases
description: Use cases for recreating, updating, and deleting product variants.
parent: 4. Use Cases
---

## Recreate Product Variants

This use case describes the process of replacing all existing variants for a specific product with a new set of variants. This is useful when a complete overhaul of the product's variations is required.

### Pre-condition

- The user (Vendor Staff or Admin) is authenticated and has the necessary permissions.
- The product for which variants are being recreated exists in the system.

### Post-condition

- All previously existing variants for the product are deleted.
- The new set of variants and their options are created and associated with the product.

### Actors

- **Main actor**: Vendor Staff or Admin.
- **Secondary actor**: System.

### Basic flow

| Actor                                                                                                                      | System                                                                                              |
| -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| 1. Submits a request to recreate the variants for a specific product, providing the product ID and a new list of variants. |                                                                                                     |
|                                                                                                                            | 2. Verifies that the product exists and belongs to the user's vendor (unless the user is an Admin). |
|                                                                                                                            | 3. Deletes all existing variants associated with the product.                                       |
|                                                                                                                            | 4. Creates the new variants and their associated options based on the provided list.                |
|                                                                                                                            | 5. Confirms that the variants have been successfully recreated and returns the product ID.          |

### Exception

**2.1 Product not found:**

1. The system throws a "NOT_FOUND" error with the message "Product with ID {id} not found".

---

## Update a Product Variant

This use case outlines how a user can modify the details of a single product variant, such as its price, stock level, or SKU.

### Pre-condition

- The user (Vendor Staff or Admin) is authenticated and has the necessary permissions.
- The product variant to be updated exists in the system.

### Post-condition

- The specified product variant's information is updated with the new data.

### Actors

- **Main actor**: Vendor Staff or Admin.
- **Secondary actor**: System.

### Basic flow

| Actor                                                                                                           | System                                                                                                                             |
| --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| 1. Submits a request to update a specific product variant, providing the variant ID and the data to be changed. |                                                                                                                                    |
|                                                                                                                 | 2. Verifies that the variant exists and is associated with a product belonging to the user's vendor (unless the user is an Admin). |
|                                                                                                                 | 3. Updates the variant's details in the database.                                                                                  |
|                                                                                                                 | 4. Confirms the update was successful and returns the variant ID.                                                                  |

### Exception

**2.1 Variant not found:**

1. The system throws a "NOT_FOUND" error with the message "Variant with ID {id} not found".

---

## Delete a Product Variant

This use case describes how a user can permanently remove a specific product variant from the system.

### Pre-condition

- The user (Vendor Staff or Admin) is authenticated and has the necessary permissions.
- The product variant to be deleted exists in the system.

### Post-condition

- The specified product variant is deleted from the system.

### Actors

- **Main actor**: Vendor Staff or Admin.
- **Secondary actor**: System.

### Basic flow

| Actor                                                                          | System                                                                                                                             |
| ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| 1. Submits a request to delete a specific product variant by providing its ID. |                                                                                                                                    |
|                                                                                | 2. Verifies that the variant exists and is associated with a product belonging to the user's vendor (unless the user is an Admin). |
|                                                                                | 3. Deletes the variant from the database.                                                                                          |
|                                                                                | 4. Confirms the deletion was successful and returns the ID of the deleted variant.                                                 |

### Exception

**2.1 Variant not found:**

1. The system throws a "NOT_FOUND" error with the message "Variant with ID {id} not found".
