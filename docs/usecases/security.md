---
title: 4.3. Security Use Cases
description: This document outlines use cases related to user account security, such as managing sessions, changing credentials, and deleting accounts.
---

## Get All Sessions

Retrieves all active sessions for a given user.

### Pre-condition

- The user must be authenticated.

### Post-condition

- A list of all active sessions for the user is returned.

### Actors

- **Main actor**: User.
- **Secondary actor**: System.

### Basic flow

| User                                           | System                                                                   |
| ---------------------------------------------- | ------------------------------------------------------------------------ |
| 1. Requests to view all their active sessions. |                                                                          |
|                                                | 2. Fetches all sessions associated with the user's ID from the database. |
|                                                | 3. Returns the list of sessions.                                         |

---

## Delete Session

Allows a user to terminate a specific session, effectively logging out that device or browser.

### Pre-condition

- The user must be authenticated.
- The session to be deleted must exist and belong to the user.

### Post-condition

- The specified session is deleted from the database.

### Actors

- **Main actor**: User.
- **Secondary actor**: System.

### Basic flow

| User                                            | System                                                                  |
| ----------------------------------------------- | ----------------------------------------------------------------------- |
| 1. Submits the ID of the session to be deleted. |                                                                         |
|                                                 | 2. Verifies that the session exists and belongs to the requesting user. |
|                                                 | 3. Deletes the session from the database.                               |
|                                                 | 4. Returns a success confirmation.                                      |

### Exceptions

**2.1. Session not found:**

1. The system returns a "Not Found" error.

**2.2. User does not have permission:**

1. The system returns a "Forbidden" error if the session does not belong to the user.

---

## Change Username

Allows a user to change their username.

### Pre-condition

- The user must be authenticated and have a password set.
- The new username must not already be in use.

### Post-condition

- The user's username is updated in the database.

### Actors

- **Main actor**: User.
- **Secondary actor**: System.

### Basic flow

| User                                                              | System                                                  |
| ----------------------------------------------------------------- | ------------------------------------------------------- |
| 1. Submits their new desired username and their current password. |                                                         |
|                                                                   | 2. Verifies that the new username is not already taken. |
|                                                                   | 3. Verifies that the user has a password set.           |
|                                                                   | 4. Verifies that the provided password is correct.      |
|                                                                   | 5. Updates the username in the user's record.           |
|                                                                   | 6. Returns a success confirmation.                      |

### Exceptions

**2.1. Username already exists:**

1. The system returns a "Conflict" error.

**3.1. User does not have a password:**

1. The system returns a "Bad Request" error.

**4.1. Incorrect password:**

1. The system returns a "Forbidden" error.

---

## Change Password

Allows a user to change their account password.

### Pre-condition

- The user must be authenticated.
- If a password is already set, the current password must be provided.

### Post-condition

- The user's password is changed.
- An email notification is sent to the user.
- Optionally, all other active sessions for the user are terminated.

### Actors

- **Main actor**: User.
- **Secondary actor**: System.

### Basic flow

| User                                                  | System                                                               |
| ----------------------------------------------------- | -------------------------------------------------------------------- | --- |
| 1. Submits their current password and a new password. |                                                                      |
|                                                       | 2. Optionally includes a flag to log out of all other devices.       |     |
|                                                       | 3. Verifies that the new password is different from the old one.     |
|                                                       | 4. Verifies the current password is correct.                         |
|                                                       | 5. Hashes the new password.                                          |
|                                                       | 6. Updates the account with the new password hash.                   |
|                                                       | 7. If requested, deletes all other sessions for the user.            |
|                                                       | 8. Sends a notification email to the user about the password change. |
|                                                       | 9. Returns a success confirmation.                                   |

### Exceptions

**3.1. New password is the same as the old one:**

1. The system returns a "Bad Request" error.

**4.1. Current password incorrect:**

1. The system returns a "Forbidden" error.

---

## Delete Account

Permanently deletes a user's account and all associated data.

### Pre-condition

- The user must be authenticated and have a password set.
- The user must provide their correct password to confirm the action.

### Post-condition

- The user's account, sessions, and other associated data are permanently deleted.

### Actors

- **Main actor**: User.
- **Secondary actor**: System.

### Basic flow

| User                                                                                     | System                                        |
| ---------------------------------------------------------------------------------------- | --------------------------------------------- |
| 1. Submits a request to delete their account, providing their password for confirmation. |                                               |
|                                                                                          | 2. Verifies the provided password is correct. |
|                                                                                          | 3. Deletes all user sessions.                 |
|                                                                                          | 4. Deletes the user's account record.         |
|                                                                                          | 5. Deletes the user's main record.            |
|                                                                                          | 6. Returns a success confirmation.            |

### Exceptions

**2.1. Incorrect password:**

1. The system returns a "Forbidden" error.

**2.2. User has no password set:**

1. The system returns a "Bad Request" error.
