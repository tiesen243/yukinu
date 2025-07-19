# Contributing to yukinu

Thank you for your interest in contributing to yukinu! This document provides guidelines and information for contributors.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Code Style](#code-style)
- [Testing](#testing)
- [Database Changes](#database-changes)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)

## Getting Started

### Prerequisites

- **Bun** - Package manager and runtime
- **Node.js** - Runtime environment
- **Git** - Version control

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:

```bash
git clone git@github.com:tiesen243/yukinu.git
cd yukinu
```

3. Add the original repository as upstream:

```bash
git remote add upstream git@github.com:tiesen243/yukinu.git
```

## Development Setup

1. Install dependencies:

```bash
bun install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Configure your environment variables in `.env`

4. Set up the database:

```bash
bun run db:push
```

5. Start the development server:

```bash
bun run dev
```

## Project Structure

The project uses a monorepo structure with Turbo:

- **`apps/`** - Applications (Next.js and React Router)
- **`packages/`** - Shared packages (API, DB, UI, Validators)
- **`tools/`** - Configuration and tooling

## Development Workflow

### Branch Naming

Use descriptive branch names:

- `feature/add-user-authentication`
- `fix/resolve-database-connection`
- `docs/update-contributing-guide`
- `refactor/optimize-api-endpoints`

### Making Changes

1. Create a new branch from `main`:

```bash
git checkout main
git pull upstream main
git checkout -b feature/your-feature-name
```

2. Make your changes following the [code style guidelines](#code-style)

3. Test your changes:

```bash
bun run typecheck
bun run lint
bun run build
```

4. Commit your changes with a descriptive message:

```bash
git add .
git commit -m "feat: add user profile management"
```

### Commit Messages

Follow conventional commit format:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## Code Style

The project uses automated formatting and linting:

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` types when possible

### Formatting

Code is automatically formatted with Prettier. Run:

```bash
bun run lint
```

### Linting

ESLint is configured for code quality. Fix linting issues:

```bash
bun run lint --fix
```

## Testing

Currently, the project focuses on type safety and build verification:

```bash
# Type checking
bun run typecheck

# Build verification
bun run build
```

When adding new features, ensure they:

- Pass TypeScript compilation
- Follow existing patterns
- Don't break the build

## Database Changes

When making database schema changes:

1. Modify schema files in `packages/db/src/schema/`
2. Push changes to database:

```bash
cd packages/db
bun run db:push
```

3. Test with Drizzle Studio:

```bash
cd packages/db
bun run db:studio
```

4. Document any breaking changes in your PR description

## Pull Request Process

1. **Update your branch** with the latest changes:

```bash
git checkout main
git pull upstream main
git checkout your-feature-branch
git rebase main
```

2. **Run all checks** before submitting:

```bash
bun run typecheck
bun run lint
bun run build
```

3. **Create a Pull Request** with:
   - Clear title describing the change
   - Detailed description of what was changed and why
   - Screenshots for UI changes
   - Steps to test the changes

4. **Link related issues** using keywords:
   - `Fixes #123`
   - `Closes #456`
   - `Resolves #789`

### PR Review Process

- All PRs require review before merging
- Address review feedback promptly
- Keep PRs focused and reasonably sized
- Update documentation if needed

## Issue Guidelines

### Bug Reports

Include:

- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Browser, Node version)
- Error messages or screenshots

### Feature Requests

Include:

- Clear description of the feature
- Use case and motivation
- Proposed implementation approach
- Alternative solutions considered

### Questions

- Check existing issues and documentation first
- Use GitHub Discussions for general questions
- Be specific about what you need help with

## Getting Help

- **Documentation**: Check the README and code comments
- **Issues**: Search existing issues for similar problems
- **Discussions**: Use GitHub Discussions for general questions
- **Code Review**: Ask for feedback in your PR

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Follow GitHub's community guidelines

Thank you for contributing to yukinu! 🚀
