---
title: 3.5. Frequently Asked Questions (FAQ)
description: This document provides answers to frequently asked questions about the Yukinu project, including its purpose, features, and contribution guidelines.
parent: 3. Legal
---

# Frequently Asked Questions (FAQ)

## About the Project

### 1. What is Yukinu?

Yukinu is a portfolio project demonstrating a multi-vendor e-commerce platform. It is built for educational purposes using a modern tech stack including Next.js, React, tRPC, and PostgreSQL. It is **not a real commercial service**.

### 2. Can I make real purchases or sell products here?

No. All products, vendors, and transactions are for demonstration only. **No real payments are processed**, and no real goods can be sold or purchased.

### 3. Why are some features missing or incomplete?

As a portfolio project, some features are not fully implemented (e.g., order checkout). You can see the current development status on the main `README.md` of the project repository.

### 4. Who maintains Yukinu?

This project is created and maintained by [Trần Tiến](https://tiesen.id.vn) for educational and demonstration purposes.

## Contributing

### 5. Can I contribute or fork the project?

Absolutely! This project is open-source and available for learning, experimentation, and contributions. You can find the repository on [GitHub](https://github.com/tiesen243/yukinu). We welcome bug fixes, feature proposals, and documentation improvements.

### 6. How do I get involved?

The best way to get involved is to:

- **Fork the repository** and experiment with the code.
- **Open an issue** on GitHub to report a bug or suggest a feature.
- **Submit a pull request** to contribute your own improvements.

## For Developers

### 7. Why does the app use third-party authentication (e.g., Google)?

OAuth (Open-Source Authorization) is included to demonstrate how real-world social login flows can be integrated into a modern application. You can disable this and use the standard email/password login during local development if you prefer.

### 8. How do I become a vendor for testing?

In the current version, user roles must be assigned manually for testing purposes. There is no public-facing vendor application workflow. An administrator can assign the `vendor_owner` role to a user account directly in the database or through a future admin panel.

If you have other questions, please feel free to **[open an issue on GitHub](https://github.com/tiesen243/yukinu/issues)**.
