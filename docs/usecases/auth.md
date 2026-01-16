---
title: 4.01. Authentication Use Cases
description: This document details the use cases related to user authentication, including registration, email verification, and password management.
parent: 4. Use Cases
---

## User Login

Allows a user to log in to their account using their credentials (email/username and password).

### Pre-condition

- The user must have an existing and verified account.

### Post-condition

- A new session is created for the user.
- A session token and an access token are generated and returned to the user.

### Actors

- **Main actor**: User.
- **Secondary actor**: System.

### Basic flow

| User                                                          | System                                                           |
| ------------------------------------------------------------- | ---------------------------------------------------------------- |
| 1. Submits their identifier (email or username) and password. |                                                                  |
|                                                               | 2. Finds the user by the provided identifier.                    |
|                                                               | 3. Verifies that the user's email is verified.                   |
|                                                               | 4. Retrieves the user's account and password hash.               |
|                                                               | 5. Verifies that the submitted password matches the stored hash. |
|                                                               | 6. Creates a new session for the user.                           |
|                                                               | 7. Generates a session token and an access token.                |
|                                                               | 8. Returns the tokens to the user.                               |

### Exceptions

**2.1. Invalid credentials:**

1. The system returns an "Invalid credentials" error.

**3.1. Email not verified:**

1. The system returns an "Email is not verified" error.

**5.1. Invalid password:**

1. The system returns an "Invalid credentials" error.

---

## User Registration

Allows a new user to create an account by providing a username, email, and password. After registration, a verification email is sent to confirm their email address.

### Pre-condition

- The user must not have an existing account with the provided email or username.
- The provided email address must be valid.

### Post-condition

- A new user record is created in the database with an unverified email status.
- An associated account with a hashed password and a user profile is created.
- A unique, time-sensitive email verification token is generated and stored.
- A verification email containing a unique link is sent to the user's email address.

### Actors

- **Main actor**: Guest (any unauthenticated user).
- **Secondary actor**: System.

### Basic flow

| Guest                                                   | System                                                                            |
| ------------------------------------------------------- | --------------------------------------------------------------------------------- |
| 1. Submits their desired username, email, and password. |                                                                                   |
|                                                         | 2. Validates that no user exists with the given email or username.                |
|                                                         | 3. Hashes the user's password for secure storage.                                 |
|                                                         | 4. Creates a new user, account, and profile within a single database transaction. |
|                                                         | 5. Generates a unique email verification token with a 10-minute expiry.           |
|                                                         | 6. Sends a "Welcome" email containing the verification link.                      |
|                                                         | 7. Returns a success response with the new user's ID.                             |

### Alternative flow

**2.1. User already exists:**

1. The system aborts the process and returns a "Conflict" error, indicating that the email or username is already taken.

---

## Get Current User Information

Retrieves profile information for the currently authenticated user.

### Pre-condition

- The user must have a valid, active session.

### Post-condition

- The user's profile information is returned.

### Actors

- **Main actor**: User (authenticated).
- **Secondary actor**: System.

### Basic flow

| User                                              | System                                                                       |
| ------------------------------------------------- | ---------------------------------------------------------------------------- |
| 1. Makes an authenticated request to an endpoint. |                                                                              |
|                                                   | 2. Retrieves the user's ID from the session.                                 |
|                                                   | 3. Fetches the user's details from the database.                             |
|                                                   | 4. Returns the user's public information (ID, username, email, role, image). |

### Alternative flow

**3.1. User not found:**

1. The system returns a "Not Found" error.

---

## Email Verification

Allows a user to verify their email address by using a token received after registration.

### Pre-condition

- The user has already registered but their email is not yet verified.
- An email verification token has been generated and sent to the user.

### Post-condition

- The user's `emailVerified` status is updated with the current timestamp.
- The used verification token is deleted from the system.

### Actors

- **Main actor**: User.
- **Secondary actor**: System.

### Basic flow

| User                                              | System                                                     |
| ------------------------------------------------- | ---------------------------------------------------------- |
| 1. Clicks the verification link from their email. |                                                            |
|                                                   | 2. Receives the request with the verification token.       |
|                                                   | 3. Finds the token in the database.                        |
|                                                   | 4. Checks if the token is still valid and has not expired. |
|                                                   | 5. Updates the user's `emailVerified` field.               |
|                                                   | 6. Deletes the verification token.                         |
|                                                   | 7. Confirms successful verification to the user.           |

### Alternative flows

**3.1. Token is invalid or not found:**

1. The system returns a "Bad Request" error.

**4.1. Token has expired:**

1. The system deletes the expired token.
2. The system returns a "Forbidden" error, indicating the token is expired.

---

## Forgot Password

Initiates the password reset process for a user who has forgotten their password.

### Pre-condition

- The user must have an existing and verified account.

### Post-condition

- A unique, time-sensitive password reset token is generated and stored.
- A password reset email containing a unique link is sent to the user's email address.

### Actors

- **Main actor**: User.
- **Secondary actor**: System.

### Basic flow

| User                                                                  | System                                                              |
| --------------------------------------------------------------------- | ------------------------------------------------------------------- |
| 1. Submits their account email address to the "Forgot Password" form. |                                                                     |
|                                                                       | 2. Finds the user associated with the provided email.               |
|                                                                       | 3. Generates a unique password reset token with a 10-minute expiry. |
|                                                                       | 4. Sends a password reset email containing the reset link.          |
|                                                                       | 5. Returns a success response.                                      |

### Alternative flow

**2.1. No user found:**

1. The system returns a standard success response to prevent leaking information about registered emails, but no email is sent.

---

## Reset Password

Allows a user to set a new password using a valid reset token.

### Pre-condition

- A password reset process has been initiated and the user has a valid token.

### Post-condition

- The user's password is updated with the new hashed password.
- The used password reset token is deleted.

### Actors

- **Main actor**: User.
- **Secondary actor**: System.

### Basic flow

| User                                                    | System                                                |
| ------------------------------------------------------- | ----------------------------------------------------- |
| 1. Submits the new password along with the reset token. |                                                       |
|                                                         | 2. Finds the password reset token in the database.    |
|                                                         | 3. Checks if the token is valid and has not expired.  |
|                                                         | 4. Hashes the new password.                           |
|                                                         | 5. Updates the user's account with the new password.  |
|                                                         | 6. Deletes the used reset token.                      |
|                                                         | 7. Confirms the password has been successfully reset. |

### Alternative flows

**2.1. Token is invalid or not found:**

1. The system returns a "Bad Request" error.

**3.1. Token has expired:**

1. The system deletes the expired token.
2. The system returns a "Forbidden" error.
