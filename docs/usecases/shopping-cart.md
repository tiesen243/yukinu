---
title: 4.11. Shopping Cart Management Use Cases
description: Use cases for managing items in a user's shopping cart, including adding, removing, and viewing items.
parent: 4. Use Cases
---

## View Shopping Cart

This use case describes how a customer can view the contents of their current shopping cart, including all items and the total cost.

### Pre-condition

- The user is authenticated and has a valid user ID.

### Post-condition

- A list of all items in the user's cart, along with the calculated total amount, is returned.
- If no cart exists, an empty cart is implicitly created for the user.

### Actors

- **Main actor**: Customer.
- **Secondary actor**: System.

### Basic flow

| Actor                                    | System                                                                                                                      |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| 1. Requests to view their shopping cart. |                                                                                                                             |
|                                          | 2. Retrieves the user's `pending` order, which functions as their cart. If one does not exist, the system creates it first. |
|                                          | 3. Fetches all items associated with the cart, including their product details.                                             |
|                                          | 4. Calculates the total amount by summing up the price of each item multiplied by its quantity.                             |
|                                          | 5. Returns the list of cart items and the final total amount.                                                               |

---

## Add Item to Shopping Cart

This use case outlines how a customer adds a product or a specific product variant to their shopping cart.

### Pre-condition

- The user is authenticated and has a valid user ID.
- The product variant to be added exists in the system.

### Post-condition

- The specified item is added to the user's shopping cart with the given quantity and price.

### Actors

- **Main actor**: Customer.
- **Secondary actor**: System.

### Basic flow

| Actor                                                                                            | System                                                                                      |
| ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| 1. Submits a request to add an item, providing the product variant ID, quantity, and unit price. |                                                                                             |
|                                                                                                  | 2. Retrieves the user's `pending` order (cart), creating one if it doesn't exist.           |
|                                                                                                  | 3. Creates a new order item and associates it with the user's cart.                         |
|                                                                                                  | 4. Confirms that the item has been added and returns the ID of the newly created cart item. |

---

## Remove Item from Shopping Cart

This use case describes how a customer can remove a specific item from their shopping cart.

### Pre-condition

- The user is authenticated and has a valid user ID.
- The item to be removed exists in the user's shopping cart.

### Post-condition

- The specified item is removed from the shopping cart.

### Actors

- **Main actor**: Customer.
- **Secondary actor**: System.

### Basic flow

| Actor                                                              | System                                                                          |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| 1. Submits a request to remove an item by providing the item's ID. |                                                                                 |
|                                                                    | 2. Retrieves the user's `pending` order (cart).                                 |
|                                                                    | 3. Verifies that the item to be removed belongs to the user's cart.             |
|                                                                    | 4. Deletes the item from the cart.                                              |
|                                                                    | 5. Confirms the deletion was successful and returns the ID of the removed item. |
