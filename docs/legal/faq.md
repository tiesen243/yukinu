---
nav_order: 15
---

# Frequently Asked Questions (FAQ)

## 1. What is Yukinu?

Yukinu is a learning-oriented multi-vendor e-commerce platform built using a modern web development stack such as Next.js, React, tRPC, PostgreSQL, Docker, and more.

Yukinu is **not** a real commercial service.

## 2. Can I make real purchases or sell products here?

No. All interactions are for simulation and education only.
There is **no real payment processing**, and vendors are not actual businesses.

## 3. Why does authentication require Google or Facebook?

OAuth login is included to demonstrate real-world authentication flows.  
You can disable OAuth and use basic email login during development if needed.

## 4. Why do I see limited features?

Because the project is still under development.  
You can check the current feature list here: [docs/features.md](../features.md)

Upcoming improvements are listed in the todo list: [docs/todo.md](../todo.md)

## 5. I'm running this project locally — why does the database fail to connect?

Check these common issues:

- `.env` values may be incorrect
- PostgreSQL is not running
- Docker hasn’t finished initializing the DB
- SSL mode should be disabled locally (`POSTGRES_SSL_MODE=false`)

More info:

- [docs/env.md](../env.md)
- [docs/docker.md](../docker.md)

## 6. How do I become a vendor?

Currently, accounts do not automatically become vendors.  
A manual role assignment is required for testing (admin-side toggle).

Future versions will include:

- Vendor onboarding workflow
- Verification process

## 7. Can I contribute or fork the project?

Absolutely!  
This project is open for learning, experimentation, and contributions.

Repository: [yukinu](https://github.com/tiesen243/yukinu.git)

You can submit:

- Bug fixes
- Feature proposals
- Documentation improvements

## 8. Why are emails not delivered?

You need to configure Resend API or disable email sending during development.  
Some actions may be simulated without actual delivery.

## 9. How do I reset everything?

If using Docker:

```bash
docker compose down --remove-orphans --volumes
docker compose up --build -d
```

This resets the database and all persisted data in volumes.

## 10. Who maintains Yukinu?

This project is created and maintained by [Trần Tiến](https://tiesen.id.vn) for educational purposes.

If you have additional questions, feel free to create an issue on GitHub.
