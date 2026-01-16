---
title: 6.02. Entity-Relationship Diagram
description: A visual representation of the database structure.
parent: 6. Database
---

This diagram illustrates how tables are interconnected through primary and foreign keys, providing a clear map of the data relationships across the entire system.

```mermaid
erDiagram
    users {
        varchar(24) id PK
        varchar(20) username "Unique"
        varchar(255) email "Unique"
        timestamp emailVerified
        user_role role "Default: 'user'"
        user_status status "Default: 'active'"
        varchar(500) image
        timestamp createdAt
        timestamp updatedAt
        timestamp deletedAt
    }

    accounts {
        varchar(24) id PK
        varchar(24) userId FK
        varchar(50) provider
        varchar(100) accountId
        text password
    }

    verifications {
        varchar(64) token PK
        varchar(24) userId FK
        timestamp expiresAt
        varchar(50) type
    }

    sessions {
        varchar(24) id PK
        varchar(24) userId FK
        varchar(64) token
        timestamp expiresAt
        varchar(45) ipAddress
        text userAgent
        timestamp createdAt
    }

    profiles {
        varchar(24) id PK
        varchar(255) fullName
        varchar(500) banner
        text bio
        varchar(50) gender
        date dateOfBirth
    }

    addresses {
        varchar(24) id PK
        varchar(24) userId FK
        varchar(255) recipientName
        varchar(20) phoneNumber
        varchar(255) street
        varchar(100) city
        varchar(100) state
        varchar(20) postalCode
        varchar(100) country
    }

    vendors {
        varchar(24) id PK
        varchar(24) ownerId FK
        varchar(255) name
        text description
        varchar(500) image
        varchar(500) address
        varchar(100) contact
        varchar(50) payoutBankName
        varchar(255) payoutAccountName
        varchar(100) payoutAccountNumber
        vendor_status status "Default: 'pending'"
        timestamp createdAt
        timestamp updatedAt
    }

    vendorStaffs {
        varchar(24) vendorId PK, FK
        varchar(24) userId PK, FK
        timestamp assignedAt
    }

    vendorBalances {
        varchar(24) vendorId PK, FK
        numeric(10,2) balance "Default: 0.00"
        timestamp updatedAt
    }

    vendorTransfers {
        varchar(24) id PK
        varchar(24) vendorId FK
        varchar(100) reference
        numeric(10,2) amountIn
        numeric(10,2) amountOut
        timestamp createdAt
    }

    products {
        varchar(24) id PK
        varchar(24) vendorId FK
        varchar(24) categoryId FK
        varchar(255) name
        text description
        numeric(10,2) price "Default: 0.00"
        integer stock "Default: 0"
        integer sold "Default: 0"
        timestamp createdAt
        timestamp updatedAt
        timestamp deletedAt
    }

    productImages {
        varchar(24) id PK
        varchar(24) productId FK
        varchar(500) url
    }

    attributes {
        varchar(24) id PK
        varchar(100) name "Unique"
    }

    productAttributes {
        varchar(24) productId PK, FK
        varchar(24) attributeId PK, FK
        varchar(255) value
    }

    variants {
        varchar(24) id PK
        varchar(100) name "Unique"
    }

    variantOptions {
        integer id PK
        varchar(24) variantId FK
        varchar(100) value
    }

    productVariants {
        varchar(24) id PK
        varchar(24) productId FK
        varchar(100) sku
        numeric(10,2) price "Default: 0.00"
        integer stock "Default: 0"
    }

    productReviews {
        varchar(24) id PK
        varchar(24) productId FK
        varchar(24) userId FK
        integer rating
        text comment
        timestamp createdAt
    }

    orders {
        integer id PK
        varchar(24) userId FK
        varchar(24) addressId FK
        varchar(24) voucherId FK
        numeric(10,2) totalAmount "Default: 0.00"
        order_status status "Default: 'pending'"
        timestamp createdAt
        timestamp updatedAt
    }

    orderItems {
        varchar(24) id PK
        integer orderId FK
        varchar(24) vendorId FK
        varchar(24) productId FK
        varchar(24) productVariantId FK
        integer quantity
        numeric(10,2) unitPrice
        text note
        boolean isCompleted "Default: false"
    }

    payments {
        varchar(24) id PK
        integer orderId FK
        payment_method method
        numeric(10,2) amount
        varchar(255) methodReference
        payment_status status "Default: 'pending'"
        timestamp createdAt
        timestamp updatedAt
    }

    transactions {
        varchar(24) id PK
        varchar(24) paymentId FK
        varchar(100) gateway
        timestamp transactionDate
        numeric(20,2) amountIn "Default: 0.00"
        numeric(20,2) amountOut "Default: 0.00"
        text transactionContent
        varchar(255) referenceNumber "Unique"
        text body
        timestamp createdAt
    }

    banners {
        varchar(24) id PK
        varchar(500) url
        timestamp createdAt
    }

    categories {
        varchar(24) id PK
        varchar(24) parentId FK
        varchar(100) name "Unique"
        text description
        varchar(500) image
    }

    vouchers {
        varchar(24) id PK
        varchar(50) code "Unique"
        numeric(10,2) discountAmount
        integer discountPercentage
        timestamp expiryDate
    }

    wishlistItems {
        varchar(24) id PK
        varchar(24) userId FK
        varchar(24) productId FK
        timestamp addedAt
    }

    tickets {
        varchar(24) id PK
        varchar(24) userId FK
        varchar(255) subject
        text description
        ticket_status status "Default: 'open'"
        timestamp createdAt
    }

    users ||--|{ accounts : "has"
    users ||--|{ verifications : "has"
    users ||--|{ sessions : "has"
    users ||--|| profiles : "has"
    users ||--|{ addresses : "has"
    users ||--|{ vendors : "owns"
    users ||--|{ productReviews : "writes"
    users ||--|{ orders : "places"
    users ||--|{ wishlistItems : "has"
    users ||--|{ tickets : "creates"

    vendors ||--|{ vendorStaffs : "has"
    users ||--|{ vendorStaffs : "is"
    vendors ||--|| vendorBalances : "has"
    vendors ||--|{ vendorTransfers : "has"
    vendors ||--|{ products : "sells"

    products ||--|{ productImages : "has"
    products ||--|{ productAttributes : "has"
    attributes ||--|{ productAttributes : "is"
    products ||--|{ productVariants : "has"
    variants ||--|{ variantOptions : "has"
    products ||--|{ productReviews : "has"
    products ||--|{ wishlistItems : "is_in"

    categories ||--|{ products : "has"
    categories ||--o| categories : "is_child_of"

    orders ||--|{ orderItems : "contains"
    orders ||--|{ payments : "has"
    orders ||--o| vouchers : "uses"
    addresses ||--o| orders : "ships_to"

    orderItems ||--o| products : "is"
    orderItems ||--o| productVariants : "is"
    orderItems ||--o| vendors : "from"

    payments ||--|{ transactions : "has"
```
