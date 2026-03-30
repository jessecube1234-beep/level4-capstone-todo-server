# Server (Express + Prisma + PostgreSQL)

JWT-authenticated API for the Todo + Tags flow.

## Live Links
- API Base URL: `https://level4-capstone-todo-server.onrender.com`
- Health Check: `https://level4-capstone-todo-server.onrender.com/health`

## Product Description
This server provides authentication and protected CRUD endpoints for todos and tags. It persists data in PostgreSQL through Prisma.

## Architecture Overview
1. React frontend sends requests to this Express API.
2. Auth routes issue JWT tokens on login/register.
3. Protected routes require `Authorization: Bearer <token>`.
4. Controllers use Prisma to read/write PostgreSQL.
5. API returns JSON for the frontend to render.

## Environment Variables
Create `.env` from `.env.example`.

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string used by Prisma |
| `JWT_SECRET` | Yes | Signs and verifies JWT tokens |
| `PORT` | Yes (local) | Local server port (default 3000) |
| `CORS_ORIGINS` | Yes | Allowed frontend origins (comma-separated) |

## Database Schema
Defined in [`prisma/schema.prisma`](./prisma/schema.prisma).

### `User`
- `id` (Int, PK)
- `email` (String, unique)
- `passwordHash` (String)
- `createdAt`, `updatedAt`

### `Todo`
- `id` (Int, PK)
- `title` (String)
- `completed` (Boolean)
- `userId` (FK -> User)
- `tagId` (nullable FK -> Tag)
- `createdAt`, `updatedAt`

### `Tag`
- `id` (Int, PK)
- `name` (String)
- `userId` (FK -> User)
- `createdAt`, `updatedAt`
- unique constraint: `(userId, name)`

## API Endpoints
### Public
- `POST /auth/register`
- `POST /auth/login`
- `GET /health`

### Protected
- `GET /todos`
- `POST /todos`
- `PATCH /todos/:id`
- `DELETE /todos/:id`
- `GET /tags`
- `POST /tags`
- `DELETE /tags/:id`

## Local Setup
1. `npm install`
2. Create `.env` from `.env.example`
3. `npm run prisma:generate`
4. `npm run prisma:push`
5. `npm run dev`

## DB Migration Strategy
This project currently uses Prisma `db push` for schema sync:
- `npm run prisma:push`

If required, you can switch to Prisma migrations later using `prisma migrate`.

## Deployment Notes
- Backend is deployed on Render for this project setup.
- Required deployed env vars: `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGINS`, `PORT`.
- Build command: `npm install && npm run render:build`
- Start command: `npm start`

## Troubleshooting
- CORS errors: ensure `CORS_ORIGINS` includes both `http://localhost:5173` and your CloudFront domain.
- Prisma connection errors: verify `DATABASE_URL` and DB availability.
- Auth 401 errors: confirm Bearer token is present and valid.
- Empty/invalid writes: check request body fields against endpoint validation.
