---
title: 4.7. Category Management Use Cases
description: This document outlines the use cases related to managing product categories, including creating, retrieving, updating, and deleting categories.
---

## Get All Categories

Retrieves a paginated list of all categories, with options for searching and filtering.

### Pre-condition

- The requesting user has permission to view categories.

### Post-condition

- A paginated list of categories is returned, matching the search and filter criteria.
- Pagination details are included in the response.

### Actors

- **Main actor**: Admin/User.
- **Secondary actor**: System.

### Basic flow

| Actor                                                           | System                                                           |
| --------------------------------------------------------------- | ---------------------------------------------------------------- |
| 1. Submits a request with optional search terms and pagination. |                                                                  |
|                                                                 | 2. Constructs a query based on the provided filters.             |
|                                                                 | 3. Fetches the categories and the total count from the database. |
|                                                                 | 4. Calculates the total number of pages.                         |
|                                                                 | 5. Returns the list of categories and pagination details.        |

---

## Get a Single Category

Retrieves detailed information for a single category by its ID.

### Pre-condition

- The category must exist.

### Post-condition

- The details of the specified category are returned.

### Actors

- **Main actor**: Admin/User.
- **Secondary actor**: System.

### Basic flow

| Actor                                    | System                                                                 |
| ---------------------------------------- | ---------------------------------------------------------------------- |
| 1. Requests a category by its unique ID. |                                                                        |
|                                          | 2. Fetches the category data, including its parent, from the database. |
|                                          | 3. Returns the category information.                                   |

### Exception

**2.1. Category not found:**

1. The system returns a "Not Found" error.

---

## Create Category

Creates a new product category.

### Pre-condition

- The requesting user must have permission to create categories.
- If a `parentId` is provided, it must not create a circular hierarchy.

### Post-condition

- A new category is created in the database.

### Actors

- **Main actor**: Admin.
- **Secondary actor**: System.

### Basic flow

| Admin                                                                                       | System                                                                     |
| ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| 1. Submits the new category's data (name, description, etc.), optionally with a `parentId`. |                                                                            |
|                                                                                             | 2. If a `parentId` is present, the system checks for a circular hierarchy. |
|                                                                                             | 3. Creates the new category record.                                        |
|                                                                                             | 4. Returns the ID of the newly created category.                           |

### Exception

**2.1. Circular hierarchy detected:**

1. The system returns a "Bad Request" error.

---

## Update Category

Updates an existing product category.

### Pre-condition

- The requesting user must have permission to update categories.
- The category to be updated must exist.
- The update must not create a circular hierarchy.

### Post-condition

- The category's information is updated in the database.

### Actors

- **Main actor**: Admin.
- **Secondary actor**: System.

### Basic flow

| Admin                                                  | System                                                                             |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| 1. Submits the category ID and the data to be updated. |                                                                                    |
|                                                        | 2. Verifies that the category exists.                                              |
|                                                        | 3. If the `parentId` is being changed, the system checks for a circular hierarchy. |
|                                                        | 4. Updates the category record in the database.                                    |
|                                                        | 5. Returns a success confirmation.                                                 |

### Exceptions

**2.1. Category not found:**

1. The system returns a "Not Found" error.

**3.1. Circular hierarchy detected:**

1. The system returns a "Bad Request" error.

---

## Delete Category

Permanently deletes a product category.

### Pre-condition

- The requesting user must have permission to delete categories.
- The category must exist.

### Post-condition

- The category is deleted from the database.
- The category's image (if any) is deleted from file storage.

### Actors

- **Main actor**: Admin.
- **Secondary actor**: System.

### Basic flow

| Admin                                            | System                                            |
| ------------------------------------------------ | ------------------------------------------------- |
| 1. Submits the ID of the category to be deleted. |                                                   |
|                                                  | 2. Verifies that the category exists.             |
|                                                  | 3. Deletes the category record from the database. |
|                                                  | 4. Deletes the category's image from storage.     |
|                                                  | 5. Returns a success confirmation.                |

### Exception

**2.1. Category not found:**

1. The system returns a "Not Found" error.
