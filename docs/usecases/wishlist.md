---
title: 4.10. Wishlist Management Use Cases
description: Use cases for retrieving and managing items in a user's wishlist.
---

## 1. Get Wishlist Items

This use case describes how a user retrieves all the products currently in their wishlist.

### Pre-condition

- The user is authenticated and has a valid user ID.

### Post-condition

- A list of all items in the user's wishlist, including full product details for each item, is returned.

### Actors

- **Main actor**: Customer.
- **Secondary actor**: System.

### Basic flow

| Actor                               | System                                                                |
| ----------------------------------- | --------------------------------------------------------------------- |
| 1. Requests to view their wishlist. |                                                                       |
|                                     | 2. Fetches all wishlist items associated with the user's ID.          |
|                                     | 3. For each item, retrieves the corresponding product details.        |
|                                     | 4. Returns the list of wishlist items with their product information. |

---

## 2. Add or Remove Item from Wishlist

This use case outlines how a user can add a product to their wishlist or remove it if it's already present. The system toggles the item's state in the wishlist.

### Pre-condition

- The user is authenticated and has a valid user ID.
- The product to be added or removed exists in the system.

### Post-condition

- If the item was not in the wishlist, it is added.
- If the item was already in the wishlist, it is removed.

### Actors

- **Main actor**: Customer.
- **Secondary actor**: System.

### Basic flow

| Actor                                                                              | System                                                                                                           |
| ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| 1. Submits a request to add a product to the wishlist by providing the product ID. |                                                                                                                  |
|                                                                                    | 2. Checks if the product is already in the user's wishlist.                                                      |
|                                                                                    | 3. The product is not found in the wishlist, so the system creates a new entry linking the user and the product. |
|                                                                                    | 4. Confirms that the item has been added to the wishlist.                                                        |

### Alternative flow

**3.1 Product already exists in wishlist:**

1. The system finds the existing wishlist item.
2. The system deletes the item from the user's wishlist.
3. The system confirms that the item has been removed from the wishlist.
