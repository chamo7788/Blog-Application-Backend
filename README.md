# Node Backend - Blog Project

This project is a small Node.js + TypeScript blog API built with Express, Prisma, and PostgreSQL. It provides authentication, blog posts, categories, comments, and Swagger documentation.

## Setup Instructions

Prerequisites:
- Node.js 18 or later
- npm
- PostgreSQL with a database you can connect to

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/blogdb
DIRECT_URL=postgresql://user:pass@localhost:5432/blogdb
JWT_SECRET=someStrongSecret
PORT=5000
```

3. Generate Prisma client and create the initial migration:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

4. Seed sample data if needed:

```bash
node seed-simple.js
```

5. Start the app in development mode:

```bash
npm run dev
```

Production-style run:

```bash
npm run build
npm start
```

## Features Implemented

- User registration and login with JWT authentication
- Password hashing with bcryptjs
- Role-aware authorization for admin-only category creation
- Post creation, update, deletion, and fetch by ID
- Post search and category filtering
- Comment creation and listing for each post
- Prisma-backed PostgreSQL data model for users, categories, posts, and comments
- Swagger/OpenAPI documentation for the API
- Health check endpoint at `/api/health`

## Bonus Features Implemented

- Swagger UI setup for interactive API exploration
- Ownership checks so only the author can update or delete a post
- Comment author details included in comment responses
- Post author and category details included in post listing responses
- Simple seed script for faster local setup

## Approximate Time Spent

- Approximate time spent: 10H

## Folder Structure and Design Decisions

- `src/index.ts` is the app entry point and wires middleware, Swagger, routes, and the health check.
- `src/routes/` keeps HTTP route definitions separate from business logic so the API surface stays easy to scan.
- `src/controllers/` holds the request handlers and Prisma queries, which keeps the route files thin.
- `src/middleware/` contains authentication logic so token validation is reusable across routes.
- `src/lib/prisma.ts` centralizes the Prisma client so the database connection is created in one place.
- `src/config/swagger.ts` isolates API docs setup from the rest of the app bootstrap.
- `prisma/schema.prisma` defines the data model for users, categories, posts, and comments in one source of truth.
- `seed-simple.js` provides a lightweight seed path for demo or development data.

Design decisions:
- The code follows a controller-route split to keep request handling and transport concerns separate from persistence logic.
- Prisma is used as the data access layer to keep queries typed and schema-driven.
- JWT-based auth is used because it fits a stateless API and keeps the backend simple to deploy.
- Swagger is included so the API can be explored without needing a separate client.

## Notes

- `JWT_SECRET` should be set in production and kept out of source control.
- Prisma expects both `DATABASE_URL` and `DIRECT_URL` in the environment.
- If you add new models, update `prisma/schema.prisma`, then run `npx prisma migrate dev` and `npx prisma generate`.
