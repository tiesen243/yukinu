---
title: 1.1. Development Setup
description: This guide provides instructions for setting up the Yukinu monorepo for local development. Following these steps will allow you to run the web application, dashboard, and all backing services on your local machine.
parent: 1. Overview
---

## Prerequisites

Before you begin, ensure you have the following software installed on your system:

- **Git**: For cloning the repository.
- **Bun**: As the primary package manager and JavaScript runtime.
- **Docker and Docker Compose**: For running the PostgreSQL database and other potential services in a containerized environment.

## Installation

1.  **Clone the Repository**

    Open your terminal and clone the Yukinu repository to your local machine:

    ```bash
    git clone https://github.com/tiesen243/yukinu.git
    cd yukinu
    ```

2.  **Install Dependencies**

    This project uses a `bunfig.toml` file to configure the workspace and ensure dependencies are hoisted to the root `node_modules` directory. Simply run the following command from the root of the project to install all necessary packages for all applications and libraries:

    ```bash
    bun install
    ```

## Environment Variables

The project relies on environment variables for configuration. A starter example file is provided at `.env.example`.

1.  **Create the `.env` file:**

    Copy the example file to create your local configuration:

    ```bash
    cp .env.example .env
    ```

2.  **Populate the `.env` file:**

    Open the newly created `.env` file and fill in the values. For local development, you primarily need to configure the database and generate an `AUTH_SECRET`.

    The database connection is configured using several `POSTGRES_*` variables:

    | Variable            | Description                   | Default for Local Dev |
    | ------------------- | ----------------------------- | --------------------- |
    | `POSTGRES_HOST`     | The database server hostname. | `127.0.0.1`           |
    | `POSTGRES_PORT`     | The port the database is on.  | `5432`                |
    | `POSTGRES_USER`     | The database username.        | `yukinu`              |
    | `POSTGRES_PASSWORD` | The database password.        | **`MUST BE SET`**     |
    | `POSTGRES_DATABASE` | The name of the database.     | `db`                  |

    Other important variables include:

    | Variable            | Description                                | How to Get                                      |
    | ------------------- | ------------------------------------------ | ----------------------------------------------- |
    | `AUTH_SECRET`       | A secret key for NextAuth.js to sign JWTs. | Run `openssl rand -base64 32` in your terminal. |
    | `RESEND_TOKEN`      | API key for the Resend email service.      | From your Resend account dashboard.             |
    | `UPLOADTHING_TOKEN` | API key for UploadThing file service.      | From your UploadThing account dashboard.        |

    **Note**: The `AUTH_FACEBOOK_` and `AUTH_GOOGLE_` variables are optional and only needed if you intend to test social OAuth providers.

## Running the Project

The root `package.json` file contains a number of scripts to simplify the development workflow.

1.  **Start the Database:**

    This command starts the PostgreSQL container in detached mode using Docker Compose.

    ```bash
    bun run db:start
    ```

2.  **Apply the Database Schema:**

    Once the container is running, you need to apply the Prisma schema to the database.

    ```bash
    bun run db:push
    ```

3.  **Start All Applications:**

    To run all applications (web, dashboard, etc.) simultaneously in development mode, use the following command:

    ```bash
    bun run dev
    ```

    This uses `turbo dev` to start all workspace applications, and they will be accessible on different local ports (e.g., `http://localhost:3000` and `http://localhost:3001`).

## Troubleshooting

- **Database Connection Errors:** If you are unable to connect to the database, ensure that your Docker container is running (`docker ps`). Also, double-check that the `DATABASE_URL` in your `.env` file exactly matches the user, password, and port configured in `docker-compose.yml`.
- **"Port is already in use" error:** This means another application is using the port that one of the Next.js apps is trying to use. You can either stop the other application or change the port in the `package.json` for the respective app (`apps/web` or `apps/dashboard`).
