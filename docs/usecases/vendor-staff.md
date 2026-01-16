---
title: 4.6. Vendor Staff Management Use Cases
description: This document outlines the use cases for managing staff members associated with a vendor account, including invitations and removals.
---

## Get All Staff

Retrieves a list of all staff members for a specific vendor.

### Pre-condition

- The user must be the vendor owner or have permission to view staff.

### Post-condition

- A list of staff members for the specified vendor is returned.

### Actors

- **Main actor**: Vendor Owner.
- **Secondary actor**: System.

### Basic flow

| Vendor Owner                                    | System                                                                      |
| ----------------------------------------------- | --------------------------------------------------------------------------- |
| 1. Requests to view all staff for their vendor. |                                                                             |
|                                                 | 2. Fetches all users associated with the vendor as staff from the database. |
|                                                 | 3. Returns the list of staff members.                                       |

---

## Invite Staff

Invites an existing user to become a staff member for a vendor.

### Pre-condition

- The inviting user must be the vendor owner.
- The invited user must exist and have the `user` role.
- The invited user must not already be a staff member of the vendor.

### Post-condition

- A unique, time-sensitive invitation token is generated and stored.
- An invitation email with a unique link is sent to the invited user.

### Actors

- **Main actor**: Vendor Owner.
- **Secondary actor**: System.

### Basic flow

| Vendor Owner                                        | System                                                          |
| --------------------------------------------------- | --------------------------------------------------------------- |
| 1. Submits the email address of the user to invite. |                                                                 |
|                                                     | 2. Verifies the user exists and has the appropriate role.       |
|                                                     | 3. Verifies the user is not already a staff member.             |
|                                                     | 4. Generates a unique invitation token (valid for 7 days).      |
|                                                     | 5. Sends an invitation email to the user with a link to accept. |
|                                                     | 6. Returns a success confirmation.                              |

### Exceptions

**2.1. User not found:**

1. The system returns a "Not Found" error.

**2.2. User cannot be added as staff:**

1. The system returns a "Bad Request" error if the user's role is not `user`.

**3.1. User is already a staff member:**

1. The system returns a "Bad Request" error.

---

## Accept Staff Invitation

Allows a user to accept an invitation to become a vendor staff member.

### Pre-condition

- The user must be authenticated.
- The invitation token must be valid and not expired.

### Post-condition

- The user's role is updated to `vendor_staff`.
- The user is added to the vendor's staff list.
- The invitation token is deleted.

### Actors

- **Main actor**: User.
- **Secondary actor**: System.

### Basic flow

| User                                                                | System                                                                    |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| 1. Clicks the invitation link from the email, submitting the token. |                                                                           |
|                                                                     | 2. Verifies the token is valid, belongs to the user, and has not expired. |
|                                                                     | 3. Identifies the vendor from the token.                                  |
|                                                                     | 4. Updates the user's role to `vendor_staff`.                             |
|                                                                     | 5. Adds the user to the vendor's staff list.                              |
|                                                                     | 6. Deletes the used invitation token.                                     |
|                                                                     | 7. Returns a success confirmation.                                        |

### Exceptions

**2.1. Invalid or expired token:**

1. The system deletes the token and returns a "Forbidden" error.

**3.1. Vendor not found:**

1. The system returns a "Not Found" error.

---

## Remove Staff

Removes a staff member from a vendor.

### Pre-condition

- The user performing the action must be the vendor owner.
- The staff member to be removed must exist in the vendor's staff list.

### Post-condition

- The staff member's role is reverted to `user`.
- The staff member is removed from the vendor's staff list.

### Actors

- **Main actor**: Vendor Owner.
- **Secondary actor**: System.

### Basic flow

| Vendor Owner                                          | System                                                      |
| ----------------------------------------------------- | ----------------------------------------------------------- |
| 1. Submits the user ID of the staff member to remove. |                                                             |
|                                                       | 2. Verifies that the staff member exists within the vendor. |
|                                                       | 3. Updates the user's role back to `user`.                  |
|                                                       | 4. Removes the user from the vendor's staff list.           |
|                                                       | 5. Returns a success confirmation.                          |

### Exception

**2.1. Staff member not found:**

1. The system returns a "Not Found" error.
