---
title: 4.12. Order Management Use Cases
description: Use cases for managing customer orders, including viewing, creating, and updating orders.
parent: 4. Use Cases
---

## View All Orders

This use case describes how a user (either a customer or an admin) can retrieve a list of orders. The implementation for this functionality is not yet complete.

### Pre-condition

- The user is authenticated.

### Post-condition

- A list of orders is returned.

### Actors

- **Main actor**: Customer or Admin.
- **Secondary actor**: System.

### Basic flow

| Actor                         | System                                                   |
| ----------------------------- | -------------------------------------------------------- |
| 1. Requests a list of orders. |                                                          |
|                               | 2. The system processes the request to fetch the orders. |

### Exception

**2.1 Not Implemented:**

1. The system currently throws a "Method not implemented" error.

---

## View a Single Order

This use case outlines how a user can retrieve the details of a specific order. The implementation for this functionality is not yet complete.

### Pre-condition

- The user is authenticated.
- The order ID is provided.

### Post-condition

- The details of the specified order are returned.

### Actors

- **Main actor**: Customer or Admin.
- **Secondary actor**: System.

### Basic flow

| Actor                                           | System                                                          |
| ----------------------------------------------- | --------------------------------------------------------------- |
| 1. Requests to view a specific order by its ID. |                                                                 |
|                                                 | 2. The system processes the request to fetch the order details. |

### Exception

**2.1 Not Implemented:**

1. The system currently throws a "Method not implemented" error.

---

## Checkout

This use case describes the process of a customer finalizing their purchase and converting their shopping cart into a formal order. The implementation for this functionality is not yet complete.

### Pre-condition

- The user is authenticated and has items in their shopping cart.
- Payment and shipping information are provided.

### Post-condition

- The user's shopping cart is converted into a placed order.
- Payment is processed.
- Inventory is updated.

### Actors

- **Main actor**: Customer.
- **Secondary actor**: System.

### Basic flow

| Actor                              | System                                                                                    |
| ---------------------------------- | ----------------------------------------------------------------------------------------- |
| 1. Initiates the checkout process. |                                                                                           |
|                                    | 2. The system processes the cart items, payment, and shipping details to create an order. |

### Exception

**2.1 Not Implemented:**

1. The system currently throws a "Method not implemented" error.

---

## Update an Order

This use case describes how an admin or a user might update the status or details of an existing order (e.g., changing the shipping status). The implementation for this functionality is not yet complete.

### Pre-condition

- The user is authenticated and has the necessary permissions.
- The order to be updated exists.

### Post-condition

- The order's information is updated.

### Actors

- **Main actor**: Admin or Customer.
- **Secondary actor**: System.

### Basic flow

| Actor                                                         | System                                                   |
| ------------------------------------------------------------- | -------------------------------------------------------- |
| 1. Submits a request to update an order with new information. |                                                          |
|                                                               | 2. The system processes the request to update the order. |

### Exception

**2.1 Not Implemented:**

1. The system currently throws a "Method not implemented" error.
