---
title: 1. Overview
---

## Yukinu Documentation

Welcome to the official documentation for **Yukinu**—a modern **multi-vendor e-commerce platform** that enables buyers to shop from multiple sellers in a unified marketplace experience.

This documentation provides complete technical and product information for the Yukinu ecosystem. Whether you are a developer, a system administrator, or a product manager, these documents offer a comprehensive guide to understanding, operating, and extending the platform.

## Core Documentation Sections

- **[2. System Architecture](./architecture.md)**: A high-level overview of the system's design, components, and the relationships between them.
- **[3. Data Schema](./schema.md)**: Detailed information about the database schema, tables, and data models that power the application.
- **[4. Use Cases](./usecases/index.md)**: A functional breakdown of all services, detailing the preconditions, post-conditions, actors, and flows for every feature.
- **[5. Sequence Diagrams](./sequences/index.md)**: Visual representations of the interaction flows for each use case, illustrating how actors and the system communicate to achieve specific goals.

## About Yukinu

Yukinu is built as a **monorepo** using **Turborepo** to manage all apps and shared packages efficiently.
It is designed to support:

- Multi-vendor product management
- Order processing & inventory mechanics
- Secure authentication & user roles
- Wishlists, reviews, profiles & more
- Scalable deployment using Docker & NGINX

## Tech Stack Overview

| Layer          | Technology                                            |
| -------------- | ----------------------------------------------------- |
| Web App        | Next.js, React, TailwindCSS                           |
| Dashboard      | React, React Router, TailwindCSS                      |
| Mobile App     | React Native, Expo, Uniwind                           |
| Backend API    | tRPC, TypeScript                                      |
| Database & ORM | PostgreSQL + Drizzle ORM                              |
| Authentication | Custom auth + Accounts & Sessions system              |
| Validation     | Zod                                                   |
| Email Services | Resend                                                |
| File Storage   | Uploadthing                                           |
| UI Library     | Base UI, shadcn/ui                                    |
| Deployment     | Vercel or Docker, docker-compose, NGINX Reverse Proxy |

## Project Structure

The repository contains three main sections:

- **apps/** — Web App (Marketplace) + Vendor Dashboard + Mobile App
- **packages/** — Shared modules: API, Auth, Database, Email, UI, Validators
- **tools/** — Dev infrastructure: TypeScript, OXC, NGINX, CI/CD scripts

## Contributing

Guidelines for reporting issues and contributing improvements will be provided later.

## License

This project is licensed under the terms of the [LICENSE](https://raw.githubusercontent.com/tiesen243/yukinu/refs/heads/main/LICENSE).
