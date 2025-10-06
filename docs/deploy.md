# Deploy

This project supports deployment to both Vercel and Render.

## Vercel

Vercel provides native support for TurboRepo, Next.js, and React Router applications. To deploy, connect your repository to Vercel. The platform will automatically detect your project type and handle the build and deployment process without extra configuration.

## Render

For Render, deployment is handled using a `Dockerfile`. Ensure your repository contains a properly configured `Dockerfile` at the root. When you connect your repository to Render, it will use this file to build and run your application.
