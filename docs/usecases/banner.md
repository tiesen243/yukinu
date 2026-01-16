---
title: 4.13. Banner Management Use Cases
description: Use cases for managing promotional banners, including creating, deleting, and viewing all banners.
parent: 4. Use Cases
---

## View All Banners

This use case describes how a user or the system can retrieve a list of all active promotional banners. This is typically used to display banners on the storefront.

### Pre-condition

- There may be zero or more banners stored in the system.

### Post-condition

- A list of all banners is returned.

### Actors

- **Main actor**: Any User (Customer, Admin) or System.
- **Secondary actor**: System.

### Basic flow

| Actor                                | System                                           |
| ------------------------------------ | ------------------------------------------------ |
| 1. Requests the list of all banners. |                                                  |
|                                      | 2. Fetches all banner records from the database. |
|                                      | 3. Returns the complete list of banners.         |

---

## Create a New Banner

This use case outlines how an administrator creates a new promotional banner to be displayed in the application.

### Pre-condition

- The user is an authenticated Admin with the necessary permissions.
- The banner details (e.g., image URL, link, title) are provided.

### Post-condition

- A new banner is created and stored in the system.

### Actors

- **Main actor**: Admin.
- **Secondary actor**: System.

### Basic flow

| Actor                                                                                           | System                                                                        |
| ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| 1. Submits the details for a new banner, including the title, image URL, and a navigation link. |                                                                               |
|                                                                                                 | 2. Creates a new banner record in the database with the provided details.     |
|                                                                                                 | 3. Confirms the creation was successful and returns the ID of the new banner. |

---

## Delete a Banner

This use case describes how an administrator can remove a banner from the system.

### Pre-condition

- The user is an authenticated Admin with the necessary permissions.
- The banner to be deleted exists in the system.

### Post-condition

- The specified banner is permanently removed from the system.

### Actors

- **Main actor**: Admin.
- **Secondary actor**: System.

### Basic flow

| Actor                                                        | System                                                                            |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| 1. Submits a request to delete a banner by providing its ID. |                                                                                   |
|                                                              | 2. Finds the specified banner in the database and deletes it.                     |
|                                                              | 3. Confirms the deletion was successful and returns the ID of the deleted banner. |
