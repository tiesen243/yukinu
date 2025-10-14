# Contributing to Yukinu

Thank you for your interest in contributing! Please review this guide before submitting a pull request. Check for open issues and PRs to avoid duplicating work.

Need help? Reach out to [@tiesen243](https://twitter.com/tiesen243).

## Repository Overview

- Monorepo managed with [bun](https://bun.sh/) workspaces.
- Build system: [Turborepo](https://turbo.build/repo).
- Release management: [changesets](https://github.com/changesets/changesets).

## Getting Started

### Fork the repository

You can fork this repo by clicking the fork button in the top right corner of this page.

### Clone your fork

```bash
git clone https://github.com/your-username/yukinu.git
cd yukinu
```

### Create a branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b bugfix/your-bugfix-name
```

### Install dependencies

```bash
bun install
```

### Configure environment

You need to create a `.env` file in the root of the project. You can copy the `.env.example` file and rename it to `.env`.

```bash
cp .env.example .env
```

### Set up the database

1. Ensure [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/install/) are installed.
2. Start the database using Docker Compose:

   ```bash
   docker-compose up db -d
   ```

3. Run the database migrations:

   ```bash
   bun run db:migrate
   ```

### Run a workspace

You can use the `bun --filter=[WORKSPACE]` command to start the development process for a workspace.

#### Examples

```bash
# Run only the web app
bun --filter=@yukinu/web dev

# Or run the web app along with its dependencies
bun dev -F @yukinu/web...
```

## Commit Convention

Before you create a Pull Request, please check whether your commits comply with the commit conventions used in this repository.

When you create a commit we kindly ask you to follow the convention `category(scope or module): message` in your commit message while using one of the following categories:

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `chore`: Changes to the build process or auxiliary tools and libraries such as documentation generation

e.g. `feat(web): add new login feature`
