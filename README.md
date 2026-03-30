# Server (Express + Prisma)

JWT-authenticated API for todos and tags.

## Scripts
- `npm run dev`
- `npm run start`
- `npm run lint`
- `npm test`
- `npm run prisma:generate`
- `npm run prisma:push`

## Environment
Create `.env` from `.env.example`.

```bash
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret"
PORT=3000
CORS_ORIGIN="http://localhost:5173"
```
