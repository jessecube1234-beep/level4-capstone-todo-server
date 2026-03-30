# Server (Express + Prisma)

JWT-authenticated API for todos and tags.

## Live API
- Render URL: https://level4-capstone-todo-server.onrender.com
- Health check: https://level4-capstone-todo-server.onrender.com/health

## Scripts
- `npm run dev`
- `npm start`
- `npm run lint`
- `npm test`
- `npm run prisma:generate`
- `npm run prisma:push`
- `npm run render:build`

## Environment
Create `.env` from `.env.example`.

```bash
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret"
PORT=3000
CORS_ORIGINS="http://localhost:5173"
```

## Core Routes
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
