# Node Backend — Blog Project

> Maintainer notes: This README is written for the next developer who will maintain and extend this service. It contains project overview, quick setup, important commands, folder map, and pointers for common maintenance tasks.

## Project overview

A small Node.js + TypeScript backend for a blog application using Express and Prisma (PostgreSQL). Implements users, posts, categories, and comments with JWT-based auth.

## Quickstart (development)

Prerequisites:
- Node.js (>= 18)
- npm or yarn
- PostgreSQL accessible and a connection URL

1. Install dependencies

```bash
npm install
```

2. Create an `.env` file at the repository root with at least these variables:

- `DATABASE_URL` — primary connection string used by Prisma
- `DIRECT_URL` — direct DB URL used by Prisma (if used in your environment)
- `JWT_SECRET` — secret used to sign JWTs (default falls back to a dev value in code)
- `PORT` — optional, defaults to `5000`

Example `.env` (do not commit secrets):

```
DATABASE_URL=postgresql://user:pass@localhost:5432/blogdb
DIRECT_URL=postgresql://user:pass@localhost:5432/blogdb
JWT_SECRET=someStrongSecret
PORT=5000
```

3. Initialize Prisma (first-time setup)

```bash
npx prisma generate
npx prisma migrate dev --name init
```

4. Optionally seed the database

```bash
node seed-simple.js
```

5. Run in development

```bash
npm run dev
```

Build and run (production-like):

```bash
npm run build
npm start
```

## Important scripts (from package.json)

- `npm run dev` — run TypeScript entry directly with `ts-node` (`src/index.ts`)
- `npm run build` — compile TypeScript with `tsc` to `dist/`
- `npm start` — run compiled `dist/index.js`

## Database

This project uses Prisma with PostgreSQL (see `prisma/schema.prisma`) — provider is `postgresql` and the schema is placed under the `public` schema. Prisma expects `DATABASE_URL` and `DIRECT_URL` env vars.

Common Prisma commands:

- `npx prisma migrate dev --name <desc>` — create & apply migrations locally
- `npx prisma migrate deploy` — apply migrations in CI/production
- `npx prisma generate` — regenerate Prisma client

## Folder structure

- `src/` — TypeScript source
  - `controllers/` — route handlers
  - `routes/` — express route definitions
  - `middleware/` — Express middlewares (auth, etc.)
  - `lib/` — utilities (Prisma client)
  - `config/` — configuration such as Swagger setup
  - `index.ts` — app entrypoint
- `prisma/` — Prisma schema and migrations
- `seed-simple.js` — quick seed script to populate sample data

When maintaining: reference `src/index.ts` to see how the app is wired and `src/lib/prisma.ts` for the Prisma client usage.

## Maintenance pointers

- Authentication secret: `JWT_SECRET` is read from env in `src/middleware/auth.middleware.ts` and `src/controllers/auth.controller.ts`. Rotate carefully; existing tokens will be invalidated.
- Swagger: API docs configured under `config/swagger.ts` and referenced by `debug-swagger.ts`.
- When adding new Prisma models: update `prisma/schema.prisma`, run `npx prisma migrate dev`, and update TypeScript types by running `npx prisma generate`.
- Keep `@prisma/client` and `prisma` devDependency versions in sync.

## Tests

No automated tests are included. Consider adding unit tests (Jest/ts-jest) and request CI to run `npm run build` and Prisma migrations as part of PR validation.

## Deploy / Production notes

- Use `npm run build` and `npm start` for production container images.
- Ensure your production environment sets `DATABASE_URL`, `DIRECT_URL`, and `JWT_SECRET` securely (e.g., secrets manager or environment configuration).
- Run `npx prisma migrate deploy` during deployment to apply migrations non-interactively.

## Contacts & Handoff

If you need context about why decisions were made, check commit history. For questions, reach out to the original implementer or open an issue describing what you need.

---

If you'd like, I can also:
- add a `Makefile` or `npm` scripts for common tasks,
- add a `.env.example` file,
- or scaffold basic unit tests.
