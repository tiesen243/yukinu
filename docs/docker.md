# Docker

This document describes how to use Docker for building and running applications in the Yukinu project. It covers installation requirements, project structure, and basic build instructions.

## Requirements

- Docker [installed](https://docs.docker.com/get-docker/)
- Docker Compose [installed](https://docs.docker.com/compose/install/)
- Docker buildx plugin: [installed](https://docs.docker.com/build/concepts/overview/)

**Example installation on Arch Linux:**

```bash
sudo pacman -S docker docker-compose docker-buildx
```

## Introduction

The Yukinu project organizes its applications in the `apps/` directory, with each app containing its own `Dockerfile`. This structure allows you to build and run each app independently using Docker.

```plaintext
. (git root)
├── apps/
│   ├── web/
│   │    └── Dockerfile
│   └── dashboard/
│        └── Dockerfile
└── [...other directories]
```

## Building an App

To build a Docker image for an app (for example, the `web` app), use the following commands:

```bash
cd apps/web
docker build -t yukinu-web .
```

Replace `web` with the name of the app you want to build. The `-t yukinu-web` flag tags the image for easy reference.
