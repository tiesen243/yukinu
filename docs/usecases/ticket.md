---
title: 4.14. Support Ticket Management Use Cases
description: Use cases for creating, viewing, and managing customer support tickets.
---

## View All Support Tickets

This use case describes how a user (a customer or a support admin) can retrieve a paginated list of support tickets. The list can be filtered by user ID and ticket status.

### Pre-condition

- The user is authenticated.
- The user provides filter criteria such as status, page number, and limit. A customer can only view their own tickets, while an admin can view all tickets.

### Post-condition

- A paginated list of tickets matching the filter criteria is returned, along with pagination details (total pages, current page, etc.).

### Actors

- **Main actor**: Customer or Support Admin.
- **Secondary actor**: System.

### Basic flow

| Actor                                                                                                                         | System                                                                                                                     |
| ----------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| 1. Requests a list of support tickets, optionally providing filters for `status` and pagination parameters (`page`, `limit`). |                                                                                                                            |
|                                                                                                                               | 2. Constructs a query based on the provided filters. If the user is a customer, the query is restricted to their `userId`. |
|                                                                                                                               | 3. Fetches the total count of matching tickets for pagination purposes.                                                    |
|                                                                                                                               | 4. Fetches the paginated list of tickets, ordered by creation date.                                                        |
|                                                                                                                               | 5. Returns the list of tickets and pagination metadata.                                                                    |

---

## View a Single Support Ticket

This use case outlines how a user can retrieve the complete details of a single support ticket, including its message history.

### Pre-condition

- The user is authenticated.
- The user has the ID of the ticket they wish to view.
- The user has permission to view the ticket (it belongs to them or they are an admin).

### Post-condition

- The full details of the specified support ticket are returned.

### Actors

- **Main actor**: Customer or Support Admin.
- **Secondary actor**: System.

### Basic flow

| Actor                                                              | System                                   |
| ------------------------------------------------------------------ | ---------------------------------------- |
| 1. Requests to view a specific support ticket by providing its ID. |                                          |
|                                                                    | 2. Fetches the ticket from the database. |
|                                                                    | 3. Returns the ticket's details.         |

### Exception

**2.1 Ticket not found:**

1. The system throws a "NOT_FOUND" error with the message "Ticket not found".

---

## Create a New Support Ticket

This use case describes how a customer creates a new support ticket to ask a question or report an issue.

### Pre-condition

- The user is authenticated and has a valid user ID.
- The user provides a subject and a message for the ticket.

### Post-condition

- A new support ticket is created with the status "open".

### Actors

- **Main actor**: Customer.
- **Secondary actor**: System.

### Basic flow

| Actor                                                                                         | System                                                                                                                      |
| --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| 1. Submits the details for a new support ticket, including a subject and the initial message. |                                                                                                                             |
|                                                                                               | 2. Creates a new ticket record in the database, associating it with the user's ID and setting the initial status to "open". |
|                                                                                               | 3. Confirms the creation was successful and returns the ID of the new ticket.                                               |

---

## Update Support Ticket Status

This use case describes how a support admin can change the status of a ticket (e.g., from "open" to "in-progress" or "closed").

### Pre-condition

- The user is an authenticated Support Admin.
- The ticket to be updated exists.
- A new, valid status is provided.

### Post-condition

- The status of the specified support ticket is updated.

### Actors

- **Main actor**: Support Admin.
- **Secondary actor**: System.

### Basic flow

| Actor                                                                                              | System                                                           |
| -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| 1. Submits a request to update the status of a ticket, providing the ticket ID and the new status. |                                                                  |
|                                                                                                    | 2. Verifies that the ticket exists.                              |
|                                                                                                    | 3. Updates the ticket's status in the database.                  |
|                                                                                                    | 4. Confirms the update was successful and returns the ticket ID. |

### Exception

**2.1 Ticket not found:**

1. The system throws a "NOT_FOUND" error with the message "Ticket not found".
