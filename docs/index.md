---
title: 1. Overview
description: Introduction to the Yukinu multi-vendor e-commerce platform, its features, and project roadmap.
has_children: true
---

## Yukinu Documentation

Welcome to the official documentation for **Yukinu**—a modern **multi-vendor e-commerce platform** that enables buyers to shop from multiple sellers in a unified marketplace experience.

This documentation provides complete technical and product information for the Yukinu ecosystem. Whether you are a developer, a system administrator, or a product manager, these documents offer a comprehensive guide to understanding, operating, and extending the platform.

## Live Previews

- **Web App**: [https://yukinu.vercel.app](https://yukinu.vercel.app)
- **Dashboard**: [https://yukinu-dashboard.vercel.app](https://yukinu-dashboard.vercel.app)
- **Mobile App**: [Download APK from GitHub Releases](https://github.com/tiesen243/yukinu/releases?q=mobile)
- **This Documentation**: [https://tiesen243.github.io/yukinu](https://tiesen243.github.io/yukinu)

## Core Documentation Sections

- **[1. Overview](./index.md)**: Introduction to the Yukinu project, its purpose, and key features.
- **[1.1. Development Setup](./development-setup.md)**: A step-by-step guide for setting up the project for local development.
- **[1.2. System Architecture](./architecture.md)**: A high-level overview of the system's design, components, and the relationships between them.
- **[2. User Guide](./guide/index.md)**: A practical, role-based guide to using the platform's features.
- **[3. Legal](./legal/index.md)**: Terms of Service, Privacy Policy, and other legal documentation.
- **[4. Use Cases](./usecases/index.md)**: A functional breakdown of all services, detailing the preconditions, post-conditions, actors, and flows for every feature.
- **[5. Sequence Diagrams](./sequences/index.md)**: Visual representations of the interaction flows for each use case, illustrating how actors and the system communicate to achieve specific goals.

## Key Features

The Yukinu platform is designed with a rich set of features to support a complete multi-vendor marketplace experience.

### For Customers

- **Unified Shopping Cart**: Purchase items from multiple vendors in a single checkout transaction.
- **Advanced Search & Filtering**: Easily find products with powerful search and attribute-based filtering.
- **Wishlist**: Save products for later and track desired items.
- **Order Management**: View order history, track shipping status, and manage returns.
- **Account Management**: Update profiles, manage shipping addresses, and view personal data.
- **Vendor Discovery**: Browse products by specific vendors and explore different storefronts.

### For Vendors

- **Vendor Dashboard**: A dedicated interface for managing products, orders, and staff.
- **Product Management**: Full CRUD (Create, Read, Update, Delete) for products, including variants like size and color.
- **Order Processing**: View and update the status of orders from processing to shipped.
- **Staff Management**: Invite and manage team members with access to the vendor dashboard.
- **Storefront Profile**: Manage public-facing store information and branding.

### For Administrators

- **Centralized Admin Dashboard**: A powerful interface to oversee the entire marketplace.
- **User & Vendor Management**: Approve, suspend, or manage users and vendors.
- **Content Moderation**: Moderate products and other content across the platform.
- **Category Management**: Define and organize the product categories available in the marketplace.
- **System-wide Analytics**: (Planned) Access to key metrics and dashboards for monitoring platform health and growth.

## Project To-Do List

### Guest

- [x] Register an account
- [x] Login
- [x] Browse product list
- [x] View product details
- [x] Search and filter products
- [x] View products by vendor
- [x] Reset password (forgot password)

### User (Customer)

- [x] Update personal profile
- [x] Manage shipping addresses (CRUD)
- [x] Add product to wishlist
- [x] Remove product from wishlist
- [x] Add product to cart
- [ ] Place an order (checkout)
- [ ] Make payment
- [ ] Track order status
- [ ] Cancel order (if not processed yet)
- [ ] Review products
- [ ] View order history

### Vendor Owner / Manager

- [x] Apply to become a vendor
- [x] Manage store information
- [x] Manage products (list/create/update)
- [x] Manage product images
- [x] Manage product variants (size, color, etc.)
- [ ] Manage vendor-specific orders
- [ ] Update order status (processing → shipped → delivered)
- [x] Manage vendor members (add / remove)

### Admin

- [x] Manage users (activate / deactivate)
- [x] Manage vendors (approve / suspend)
- [x] Manage product categories (CRUD)
- [x] Moderate products across the system
- [ ] System analytics & dashboards
- [x] Manage roles & permissions _(optional)_

### Payment System Integration

- [ ] Initialize payment transaction
- [ ] Confirm successful payment
      -- [ ] Handle failed or refunded payments

### Optional Enhancements

- [ ] Vendor payout system
- [ ] Coupon / voucher management
- [x] Email notifications & marketing automation

## Contributing

Guidelines for reporting issues and contributing improvements will be provided later.

## License

This project is licensed under the terms of the [LICENSE](https://raw.githubusercontent.com/tiesen243/yukinu/refs/heads/main/LICENSE).
