# /README.md
# K-Group Practicum Team 1

## Environment Setup

This project uses environment files to configure Rails and React communication.

### Step 1: Copy Environment File
```bash
cp .env.development.local.example .env.development.local
```

### Step 2: Edit Your Local Settings

Edit `.env.development.local` with your values:
- `DATABASE_URL` - Your local PostgreSQL connection string
- `DEVISE_JWT_SECRET_KEY` - JWT secret (minimum 32 characters)
- `VITE_API_URL` - Rails backend URL (default: http://localhost:3000)
- `FRONTEND_URL` - React frontend URL (default: http://localhost:5173)

### Step 3: Enable Rails to Read .env Files

Rails does not read `.env` files by default. Choose ONE option:

#### Option 1: Add dotenv-rails Gem (Simpler)

Add to `backend/Gemfile`:
```ruby
gem 'dotenv-rails', groups: [:development, :test]
```

Then run:
```bash
cd backend && bundle install
```

Now you can start Rails directly:
```bash
cd backend && rails s
```

#### Option 2: Use Foreman 

Add `foreman` gem to `backend/Gemfile`:
```ruby
group :development do
  gem 'foreman'
end
```

Create `Procfile.dev` at project root:
```
backend: cd backend && rails s -p 3000
frontend: cd frontend && npm run dev
```

Create `bin/dev` at project root:
```bash
#!/usr/bin/env bash
exec foreman start -f Procfile.dev -e .env.development.local
```

Make it executable and run:
```bash
chmod +x bin/dev
./bin/dev
```

Foreman auto-loads `.env.development.local` before starting Rails.

### Environment Files Reference

| File | Purpose | Committed |
|------|---------|-----------|
| `.env.development.local.example` | Template for local dev | Yes |
| `.env.development.local` | Your local settings | No (gitignored) |

### How Environment Variables Are Used

| Key | Used By | Location |
|-----|---------|----------|
| `DATABASE_URL` | Rails | `config/database.yml` |
| `DEVISE_JWT_SECRET_KEY` | Rails | `config/initializers/devise_jwt.rb` |
| `VITE_API_URL` | Vite/React | `frontend/src/services/api.ts` |
| `FRONTEND_URL` | Rails CORS | `config/initializers/cors.rb` |

**Note:** Never commit files containing actual secrets. Only `.env*.example` files should be committed.

## API Documentation 

### Quick Start with Authentication
1. **Register a new user**: `POST /signup`
2. **Login to get token**: `POST /login`
3. **Use the token**: Add `Authorization: Bearer <token>` header to all protected requests

### Available Endpoints
| Method | Endpoint | Description                 |
|--------|----------|-----------------------------|
| POST   | `/signup` | User registration           |
| POST   | `/login` | User login                  |
| GET    | `/api/v1/users` | List all users              |
| GET    | `/api/v1/users/:id` | Get specific user           |
| GET    | `/api/v1/me` | Get current user profile    |
| PATCH  | `/api/v1/users/:id` | Update specific user profile |
| DELETE | `/api/v1/users/:id` | Delete specific user |
| DELETE | `/logout` | User logout                 |

### Testing with Swagger UI
Visit **[http://localhost:3000/api-docs](http://localhost:3000/api-docs)** to:
- Browse all available endpoints
- Try API calls directly from your browser
- View request/response schemas
