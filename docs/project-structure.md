# Project Structure

This document describes the structure of the Yukinu monorepo, including the organization of applications and shared packages.

## Monorepo Overview

The repository is organized as a monorepo, containing multiple applications and shared packages:

```plaintext
. (git root)
├── apps/
│   ├── web/
│   │    └── package.json              (name: '@yukinu/web')
│   └── [...other apps]
├── packages/
│   ├── api/
│   │    └── package.json              (name: '@yukinu/api')
│   └── [...other shared packages]
└── package.json
```

## Applications (`apps/`)

Applications are user-facing projects (websites, dashboards, etc):

```plaintext
apps/
├── web/
│   ├── app/                           (Next.js app directory)
│   ├── lib/                           (shared utilities)
│   ├── public/                        (framework optional static assets)
│   ├── trpc/                          (tRPC client and hooks)
│   ├── next.config.ts
│   ├── [...other config files]
│   └── package.json
└── dashboard/
    ├── public/                        (framework optional static assets)
    ├── src/
    │   ├── components/                (React components)
    │   ├── lib/                       (shared utilities)
    │   ├── routes/                    (React Router routes)
    │   ├── trpc/                      (tRPC client and hooks)
    │   ├── root.tsx                   (app entry point)
    │   └── routes.ts                  (route definitions)
    ├── vite.config.ts
    ├── [...other config files]
    └── package.json
```

## Packages (`packages/`)

Packages provide shared logic, APIs, database, and UI components:

```plaintext
packages/
├── api/
│   ├── src/
│   │   ├── routers/                   (tRPC routers)
│   │   ├── services/                  (business logic)
│   │   ├── index.ts                   (entry point)
│   │   └── trpc.ts                    (tRPC server setup)
│   └── package.json
├── auth/
│   ├── src/
│   │   ├── core/                      (authentication logic)
│   │   ├── providers/                 (oauth providers)
│   │   ├── config.ts                  (auth configuration)
│   │   ├── index.ts                   (entry point)
│   │   └── react.tsx                  (react hooks)
│   └── package.json
├── db/
│   ├── drizzle/                       (database migrations)
│   ├── src/
│   │   ├── schemas/                   (database schema definitions)
│   │   ├── index.ts                   (entry point)
│   │   └── utils.ts                   (db utilities)
│   └── package.json
├── ui/
│   ├── src/
│   │   ├── components/                (shared UI components)
│   │   ├── hooks/                     (custom React hooks)
│   │   ├── lib/                       (shared utilities)
│   │   └── tailwind.css               (Tailwind CSS setup with shadcn/ui)
│   ├── components.json                (shadcn/ui config)
│   └── package.json
└── [...other shared packages]
```
