# /README.md
# K-Group Practicum Team 1

## Environment Setup

This project uses environment files to configure Rails and React communication.

### For Local Development (No Docker)

1. Copy the example file:
```bash
   cp .env.development.local.example .env.development.local
```

2. Edit `.env.development.local` with your local settings:
   - `DATABASE_URL` - Your local PostgreSQL connection string
   - `DEVISE_JWT_SECRET_KEY` - JWT secret (minimum 32 characters)
   - `VITE_API_URL` - Rails backend URL (default: http://localhost:3000)
   - `FRONTEND_URL` - React frontend URL (default: http://localhost:5173)

### Environment Files Reference

| File | Purpose | Committed |
|------|---------|-----------|
| `.env.development.local.example` | Template for local dev | Yes |
| `.env.development.local` | Your local settings | No (gitignored) |

**Note:** Never commit files containing actual secrets. Only `.env*.example` files should be committed.
