---
title: 6.1. Database Schema
description: A detailed breakdown of every table, including columns, data types, and constraints.
parent: 6. Database
---

This document provides a detailed reference for every table in the Yukinu database, detailing the columns, types, and constraints for each table.

## `users` table

Stores the core user accounts and their status.

| Column          | Type                         | Constraints                 | Description                                              |
| --------------- | ---------------------------- | --------------------------- | -------------------------------------------------------- |
| `id`            | `varchar(24)`                | Primary Key                 | Unique identifier for the user.                          |
| `username`      | `varchar(20)`                | Not Null, Unique            | The user's chosen username.                              |
| `email`         | `varchar(255)`               | Not Null, Unique            | The user's email address.                                |
| `emailVerified` | `timestamp`                  | -                           | Timestamp indicating when the user verified their email. |
| `role`          | `enum('user', 'admin')`      | Not Null, Default: `user`   | The user's role in the system.                           |
| `status`        | `enum('active', 'inactive')` | Not Null, Default: `active` | The user's account status.                               |
| `image`         | `varchar(500)`               | -                           | URL for the user's profile image.                        |
| `createdAt`     | `timestamp`                  | Not Null, Default: `now()`  | Timestamp of when the user was created.                  |
| `updatedAt`     | `timestamp`                  | Not Null, Default: `now()`  | Timestamp of the last update to the user.                |
| `deletedAt`     | `timestamp`                  | -                           | Timestamp of when the user was soft-deleted.             |

## `accounts` table

Stores different authentication methods linked to a user.

| Column      | Type           | Constraints                      | Description                                            |
| ----------- | -------------- | -------------------------------- | ------------------------------------------------------ |
| `id`        | `varchar(24)`  | Primary Key                      | Unique identifier for the account.                     |
| `userId`    | `varchar(24)`  | Not Null, Foreign Key (users.id) | The ID of the user this account belongs to.            |
| `provider`  | `varchar(50)`  | Not Null                         | The authentication provider (e.g., 'email', 'google'). |
| `accountId` | `varchar(100)` | Not Null                         | The user's ID from the provider.                       |
| `password`  | `text`         | -                                | The user's hashed password (for email provider).       |

## `verifications` table

Stores tokens for email verification and password resets.

| Column      | Type          | Constraints                      | Description                                                 |
| ----------- | ------------- | -------------------------------- | ----------------------------------------------------------- |
| `token`     | `varchar(64)` | Primary Key                      | The verification token.                                     |
| `userId`    | `varchar(24)` | Not Null, Foreign Key (users.id) | The ID of the user this token belongs to.                   |
| `expiresAt` | `timestamp`   | Not Null                         | Timestamp of when the token expires.                        |
| `type`      | `varchar(50)` | Not Null                         | The type of verification (e.g., 'email', 'password_reset'). |

## `sessions` table

Stores user session information for authentication.

| Column      | Type          | Constraints                      | Description                                        |
| ----------- | ------------- | -------------------------------- | -------------------------------------------------- |
| `id`        | `varchar(24)` | Primary Key                      | Unique identifier for the session.                 |
| `userId`    | `varchar(24)` | Not Null, Foreign Key (users.id) | The ID of the user this session belongs to.        |
| `token`     | `varchar(64)` | Not Null                         | The session token.                                 |
| `expiresAt` | `timestamp`   | Not Null                         | Timestamp of when the session expires.             |
| `ipAddress` | `varchar(45)` | -                                | The IP address from which the session was created. |
| `userAgent` | `text`        | -                                | The user agent of the client.                      |
| `createdAt` | `timestamp`   | Not Null, Default: `now()`       | Timestamp of when the session was created.         |

## `profiles` table

Stores extended profile information for users.

| Column        | Type           | Constraints                         | Description                        |
| ------------- | -------------- | ----------------------------------- | ---------------------------------- |
| `id`          | `varchar(24)`  | Primary Key, Foreign Key (users.id) | The user's ID.                     |
| `fullName`    | `varchar(255)` | -                                   | The user's full name.              |
| `banner`      | `varchar(500)` | -                                   | URL for the user's profile banner. |
| `bio`         | `text`         | -                                   | A short biography of the user.     |
| `gender`      | `varchar(50)`  | -                                   | The user's gender.                 |
| `dateOfBirth` | `date`         | -                                   | The user's date of birth.          |

## `addresses` table

Stores shipping addresses for users.

| Column          | Type           | Constraints                      | Description                                 |
| --------------- | -------------- | -------------------------------- | ------------------------------------------- |
| `id`            | `varchar(24)`  | Primary Key                      | Unique identifier for the address.          |
| `userId`        | `varchar(24)`  | Not Null, Foreign Key (users.id) | The ID of the user this address belongs to. |
| `recipientName` | `varchar(255)` | Not Null                         | The name of the recipient.                  |
| `phoneNumber`   | `varchar(20)`  | Not Null                         | The recipient's phone number.               |
| `street`        | `varchar(255)` | Not Null                         | The street address.                         |
| `city`          | `varchar(100)` | Not Null                         | The city.                                   |
| `state`         | `varchar(100)` | Not Null                         | The state or province.                      |
| `postalCode`    | `varchar(20)`  | Not Null                         | The postal code.                            |
| `country`       | `varchar(100)` | Not Null                         | The country.                                |

## `vendors` table

Stores information about vendors.

| Column                | Type           | Constraints                  | Description                                        |
| --------------------- | -------------- | ---------------------------- | -------------------------------------------------- |
| `id`                  | `varchar(24)`  | Primary Key                  | Unique identifier for the vendor.                  |
| `ownerId`             | `varchar(24)`  | Foreign Key (users.id)       | The user who owns the vendor.                      |
| `name`                | `varchar(255)` | Not Null                     | The name of the vendor.                            |
| `description`         | `text`         | -                            | A description of the vendor.                       |
| `image`               | `varchar(500)` | -                            | URL for the vendor's image.                        |
| `address`             | `varchar(500)` | -                            | The vendor's address.                              |
| `contact`             | `varchar(100)` | -                            | The vendor's contact information.                  |
| `payoutBankName`      | `varchar(50)`  | -                            | The name of the bank for payouts.                  |
| `payoutAccountName`   | `varchar(255)` | -                            | The name of the account holder for payouts.        |
| `payoutAccountNumber` | `varchar(100)` | -                            | The account number for payouts.                    |
| `status`              | `enum(...)`    | Not Null, Default: `pending` | The vendor's status (e.g., 'pending', 'approved'). |
| `createdAt`           | `timestamp`    | Not Null, Default: `now()`   | Timestamp of when the vendor was created.          |
| `updatedAt`           | `timestamp`    | Not Null, Default: `now()`   | Timestamp of the last update to the vendor.        |

## `vendorStaffs` table

Manages the staff members of a vendor.

| Column       | Type          | Constraints                                     | Description                                       |
| ------------ | ------------- | ----------------------------------------------- | ------------------------------------------------- |
| `vendorId`   | `varchar(24)` | Not Null, Foreign Key (vendors.id), Primary Key | The vendor's ID.                                  |
| `userId`     | `varchar(24)` | Not Null, Foreign Key (users.id), Primary Key   | The user's ID.                                    |
| `assignedAt` | `timestamp`   | Not Null, Default: `now()`                      | Timestamp of when the user was assigned as staff. |

## `vendorBalances` table

Stores the current balance for each vendor.

| Column      | Type             | Constraints                                     | Description                           |
| ----------- | ---------------- | ----------------------------------------------- | ------------------------------------- |
| `vendorId`  | `varchar(24)`    | Not Null, Foreign Key (vendors.id), Primary Key | The vendor's ID.                      |
| `balance`   | `numeric(10, 2)` | Not Null, Default: `0.00`                       | The current balance of the vendor.    |
| `updatedAt` | `timestamp`      | Not Null, Default: `now()`                      | Timestamp of the last balance update. |

## `vendorTransfers` table

Records balance transfers for vendors.

| Column      | Type             | Constraints                        | Description                                 |
| ----------- | ---------------- | ---------------------------------- | ------------------------------------------- |
| `id`        | `varchar(24)`    | Primary Key                        | Unique identifier for the transfer.         |
| `vendorId`  | `varchar(24)`    | Not Null, Foreign Key (vendors.id) | The vendor's ID.                            |
| `reference` | `varchar(100)`   | Not Null                           | A reference for the transfer.               |
| `amountIn`  | `numeric(10, 2)` | -                                  | The amount transferred in.                  |
| `amountOut` | `numeric(10, 2)` | -                                  | The amount transferred out.                 |
| `createdAt` | `timestamp`      | Not Null, Default: `now()`         | Timestamp of when the transfer was created. |

## `products` table

Stores the main product information.

| Column        | Type             | Constraints                 | Description                                     |
| ------------- | ---------------- | --------------------------- | ----------------------------------------------- |
| `id`          | `varchar(24)`    | Primary Key                 | Unique identifier for the product.              |
| `vendorId`    | `varchar(24)`    | Foreign Key (vendors.id)    | The vendor who owns the product.                |
| `categoryId`  | `varchar(24)`    | Foreign Key (categories.id) | The category of the product.                    |
| `name`        | `varchar(255)`   | Not Null                    | The name of the product.                        |
| `description` | `text`           | -                           | A description of the product.                   |
| `price`       | `numeric(10, 2)` | Not Null, Default: `0.00`   | The price of the product.                       |
| `stock`       | `integer`        | Not Null, Default: `0`      | The available stock of the product.             |
| `sold`        | `integer`        | Not Null, Default: `0`      | The number of units sold.                       |
| `createdAt`   | `timestamp`      | Not Null, Default: `now()`  | Timestamp of when the product was created.      |
| `updatedAt`   | `timestamp`      | Not Null, Default: `now()`  | Timestamp of the last update to the product.    |
| `deletedAt`   | `timestamp`      | -                           | Timestamp of when the product was soft-deleted. |

## `productImages` table

Stores images for products.

| Column      | Type           | Constraints                         | Description                                  |
| ----------- | -------------- | ----------------------------------- | -------------------------------------------- |
| `id`        | `varchar(24)`  | Primary Key                         | Unique identifier for the image.             |
| `productId` | `varchar(24)`  | Not Null, Foreign Key (products.id) | The ID of the product this image belongs to. |
| `url`       | `varchar(500)` | Not Null                            | The URL of the image.                        |

## `attributes` table

Defines product attributes (e.g., 'Color', 'Size').

| Column | Type           | Constraints      | Description                          |
| ------ | -------------- | ---------------- | ------------------------------------ |
| `id`   | `varchar(24)`  | Primary Key      | Unique identifier for the attribute. |
| `name` | `varchar(100)` | Not Null, Unique | The name of the attribute.           |

## `productAttributes` table

Links attributes to products with specific values.

| Column        | Type           | Constraints                                        | Description                                 |
| ------------- | -------------- | -------------------------------------------------- | ------------------------------------------- |
| `productId`   | `varchar(24)`  | Not Null, Foreign Key (products.id), Primary Key   | The product's ID.                           |
| `attributeId` | `varchar(24)`  | Not Null, Foreign Key (attributes.id), Primary Key | The attribute's ID.                         |
| `value`       | `varchar(255)` | Not Null                                           | The value of the attribute for the product. |

## `variants` table

Defines product variants (e.g., 'Size', 'Color').

| Column | Type           | Constraints      | Description                        |
| ------ | -------------- | ---------------- | ---------------------------------- |
| `id`   | `varchar(24)`  | Primary Key      | Unique identifier for the variant. |
| `name` | `varchar(100)` | Not Null, Unique | The name of the variant.           |

## `variantOptions` table

Stores the options for variants (e.g., 'Small', 'Medium', 'Large' for 'Size').

| Column      | Type           | Constraints                         | Description                         |
| ----------- | -------------- | ----------------------------------- | ----------------------------------- |
| `id`        | `integer`      | Primary Key, Identity               | Unique identifier for the option.   |
| `variantId` | `varchar(24)`  | Not Null, Foreign Key (variants.id) | The variant this option belongs to. |
| `value`     | `varchar(100)` | Not Null                            | The value of the option.            |

## `productVariants` table

Stores the different variants of a product (e.g., a t-shirt that comes in different sizes and colors).

| Column      | Type             | Constraints                         | Description                                |
| ----------- | ---------------- | ----------------------------------- | ------------------------------------------ |
| `id`        | `varchar(24)`    | Primary Key                         | Unique identifier for the product variant. |
| `productId` | `varchar(24)`    | Not Null, Foreign Key (products.id) | The product this variant belongs to.       |
| `sku`       | `varchar(100)`   | Not Null                            | The stock keeping unit for the variant.    |
| `price`     | `numeric(10, 2)` | Not Null, Default: `0.00`           | The price of the variant.                  |
| `stock`     | `integer`        | Not Null, Default: `0`              | The available stock of the variant.        |

## `productReviews` table

Stores customer reviews for products.

| Column      | Type          | Constraints                         | Description                               |
| ----------- | ------------- | ----------------------------------- | ----------------------------------------- |
| `id`        | `varchar(24)` | Primary Key                         | Unique identifier for the review.         |
| `productId` | `varchar(24)` | Not Null, Foreign Key (products.id) | The product being reviewed.               |
| `userId`    | `varchar(24)` | Not Null, Foreign Key (users.id)    | The user who wrote the review.            |
| `rating`    | `integer`     | Not Null                            | The rating given by the user (e.g., 1-5). |
| `comment`   | `text`        | -                                   | The user's comment.                       |
| `createdAt` | `timestamp`   | Not Null, Default: `now()`          | Timestamp of when the review was created. |

## `orders` table

Stores order information.

| Column        | Type             | Constraints                  | Description                                |
| ------------- | ---------------- | ---------------------------- | ------------------------------------------ |
| `id`          | `integer`        | Primary Key, Identity        | Unique identifier for the order.           |
| `userId`      | `varchar(24)`    | Foreign Key (users.id)       | The user who placed the order.             |
| `addressId`   | `varchar(24)`    | Foreign Key (addresses.id)   | The shipping address for the order.        |
| `voucherId`   | `varchar(24)`    | Foreign Key (vouchers.id)    | The voucher used for the order.            |
| `totalAmount` | `numeric(10, 2)` | Not Null, Default: `0.00`    | The total amount of the order.             |
| `status`      | `enum(...)`      | Not Null, Default: `pending` | The status of the order.                   |
| `createdAt`   | `timestamp`      | Not Null, Default: `now()`   | Timestamp of when the order was created.   |
| `updatedAt`   | `timestamp`      | Not Null, Default: `now()`   | Timestamp of the last update to the order. |

## `orderItems` table

Stores the items within an order.

| Column             | Type             | Constraints                       | Description                                           |
| ------------------ | ---------------- | --------------------------------- | ----------------------------------------------------- |
| `id`               | `varchar(24)`    | Primary Key                       | Unique identifier for the order item.                 |
| `orderId`          | `integer`        | Not Null, Foreign Key (orders.id) | The order this item belongs to.                       |
| `vendorId`         | `varchar(24)`    | Foreign Key (vendors.id)          | The vendor of the item.                               |
| `productId`        | `varchar(24)`    | Foreign Key (products.id)         | The product.                                          |
| `productVariantId` | `varchar(24)`    | Foreign Key (productVariants.id)  | The product variant.                                  |
| `quantity`         | `integer`        | Not Null                          | The quantity of the item.                             |
| `unitPrice`        | `numeric(10, 2)` | Not Null                          | The price of a single unit.                           |
| `note`             | `text`           | -                                 | A note for the item.                                  |
| `isCompleted`      | `boolean`        | Not Null, Default: `false`        | Whether the vendor has completed processing the item. |

## `payments` table

Stores payment information for orders.

| Column            | Type             | Constraints                       | Description                                  |
| ----------------- | ---------------- | --------------------------------- | -------------------------------------------- |
| `id`              | `varchar(24)`    | Primary Key                       | Unique identifier for the payment.           |
| `orderId`         | `integer`        | Not Null, Foreign Key (orders.id) | The order this payment is for.               |
| `method`          | `enum(...)`      | Not Null                          | The payment method.                          |
| `amount`          | `numeric(10, 2)` | Not Null                          | The amount of the payment.                   |
| `methodReference` | `varchar(255)`   | -                                 | A reference from the payment provider.       |
| `status`          | `enum(...)`      | Not Null, Default: `pending`      | The status of the payment.                   |
| `createdAt`       | `timestamp`      | Not Null, Default: `now()`        | Timestamp of when the payment was created.   |
| `updatedAt`       | `timestamp`      | Not Null, Default: `now()`        | Timestamp of the last update to the payment. |

## `transactions` table

Stores financial transactions.

| Column               | Type             | Constraints                         | Description                                    |
| -------------------- | ---------------- | ----------------------------------- | ---------------------------------------------- |
| `id`                 | `varchar(24)`    | Primary Key                         | Unique identifier for the transaction.         |
| `paymentId`          | `varchar(24)`    | Not Null, Foreign Key (payments.id) | The payment this transaction is for.           |
| `gateway`            | `varchar(100)`   | Not Null                            | The payment gateway used.                      |
| `transactionDate`    | `timestamp`      | Not Null, Default: `now()`          | The date of the transaction.                   |
| `amountIn`           | `numeric(20, 2)` | Not Null, Default: `0.00`           | The amount transferred in.                     |
| `amountOut`          | `numeric(20, 2)` | Not Null, Default: `0.00`           | The amount transferred out.                    |
| `transactionContent` | `text`           | -                                   | The content of the transaction.                |
| `referenceNumber`    | `varchar(255)`   | Unique                              | A reference number for the transaction.        |
| `body`               | `text`           | -                                   | The body of the transaction response.          |
| `createdAt`          | `timestamp`      | Not Null, Default: `now()`          | Timestamp of when the transaction was created. |

## `banners` table

Stores promotional banners.

| Column      | Type           | Constraints                | Description                               |
| ----------- | -------------- | -------------------------- | ----------------------------------------- |
| `id`        | `varchar(24)`  | Primary Key                | Unique identifier for the banner.         |
| `url`       | `varchar(500)` | Not Null                   | The URL of the banner image.              |
| `createdAt` | `timestamp`    | Not Null, Default: `now()` | Timestamp of when the banner was created. |

## `categories` table

Stores product categories.

| Column        | Type           | Constraints                 | Description                              |
| ------------- | -------------- | --------------------------- | ---------------------------------------- |
| `id`          | `varchar(24)`  | Primary Key                 | Unique identifier for the category.      |
| `parentId`    | `varchar(24)`  | Foreign Key (categories.id) | The parent category, for sub-categories. |
| `name`        | `varchar(100)` | Not Null, Unique            | The name of the category.                |
| `description` | `text`         | -                           | A description of the category.           |
| `image`       | `varchar(500)` | -                           | URL for the category's image.            |

## `vouchers` table

Stores discount vouchers.

| Column               | Type             | Constraints      | Description                        |
| -------------------- | ---------------- | ---------------- | ---------------------------------- |
| `id`                 | `varchar(24)`    | Primary Key      | Unique identifier for the voucher. |
| `code`               | `varchar(50)`    | Not Null, Unique | The voucher code.                  |
| `discountAmount`     | `numeric(10, 2)` | -                | The fixed discount amount.         |
| `discountPercentage` | `integer`        | -                | The discount percentage.           |
| `expiryDate`         | `timestamp`      | Not Null         | The expiry date of the voucher.    |

## `wishlistItems` table

Stores items in users' wishlists.

| Column      | Type          | Constraints                         | Description                              |
| ----------- | ------------- | ----------------------------------- | ---------------------------------------- |
| `id`        | `varchar(24)` | Primary Key                         | Unique identifier for the wishlist item. |
| `userId`    | `varchar(24)` | Not Null, Foreign Key (users.id)    | The user's ID.                           |
| `productId` | `varchar(24)` | Not Null, Foreign Key (products.id) | The product's ID.                        |
| `addedAt`   | `timestamp`   | Not Null, Default: `now()`          | Timestamp of when the item was added.    |

## `tickets` table

Stores support tickets.

| Column        | Type           | Constraints                      | Description                               |
| ------------- | -------------- | -------------------------------- | ----------------------------------------- |
| `id`          | `varchar(24)`  | Primary Key                      | Unique identifier for the ticket.         |
| `userId`      | `varchar(24)`  | Not Null, Foreign Key (users.id) | The user who created the ticket.          |
| `subject`     | `varchar(255)` | Not Null                         | The subject of the ticket.                |
| `description` | `text`         | Not Null                         | A description of the issue.               |
| `status`      | `enum(...)`    | Not Null, Default: `open`        | The status of the ticket.                 |
| `createdAt`   | `timestamp`    | Not Null, Default: `now()`       | Timestamp of when the ticket was created. |
