# Next.js + Express.js + Vercel Postgres Monorepo

A full-stack monorepo application using Next.js, Express.js, and Vercel Postgres with Prisma ORM.

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router) with Tailwind CSS and Shadcn/UI
- **Backend**: Express.js (Node.js) with TypeScript
- **Database**: Vercel Postgres with Prisma ORM
- **State Management**: TanStack Query (React Query)
- **Deployment**: Vercel (Frontend & DB) + Render/Railway (Backend)

## 📁 Project Structure

```
root/
├── apps/
│   ├── web/ (Next.js Frontend)
│   │   ├── src/app/ (Pages & Layouts)
│   │   ├── src/components/ (UI Components)
│   │   ├── src/lib/ (Fetch utilities)
│   │   └── next.config.mjs
│   └── api/ (Express Backend)
│       ├── src/controllers/ (Logic)
│       ├── src/routes/ (API Endpoints)
│       ├── src/models/ (Database Schemas)
│       ├── prisma/ (ORM Schema)
│       └── server.ts
├── packages/ (Shared Types/Utils)
│   └── shared-types/
└── package.json
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL database (or Vercel Postgres)

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd next-express-vercel-postgres-monorepo

# Install dependencies
npm install
```

### 2. Environment Setup

```bash
# Copy environment files
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# Update environment variables
# Edit .env files with your database URL and configuration
```

### 3. Database Setup

```bash
# Navigate to API directory
cd apps/api

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# (Optional) Open Prisma Studio
npm run db:studio
```

### 4. Start Development Servers

```bash
# From root directory - starts both frontend and backend
npm run dev

# Or start individually:
npm run dev:api  # Express backend on port 3001
npm run dev:web  # Next.js frontend on port 3000
```

## 📊 API Endpoints

### Express Backend (Port 3001)

- `GET /api/v1/data` - Fetch sample data from database
- `GET /health` - Health check endpoint

### Next.js API Proxy

- `GET /app/api/proxy?path=/api/v1/data` - Proxy to Express API

## 🎯 Features

- ✅ **Type Safety**: End-to-end TypeScript with shared types
- ✅ **Real-time Data**: Auto-refreshing dashboard with React Query
- ✅ **Modern UI**: Tailwind CSS with Shadcn/UI components
- ✅ **CORS Handling**: Built-in proxy to avoid CORS issues
- ✅ **Error Handling**: Comprehensive error handling throughout
- ✅ **Security**: Helmet, CORS, and environment-based configuration
- ✅ **Scalable Architecture**: Clean separation of concerns

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Render/Railway)
1. Connect your GitHub repository
2. Configure build command: `npm run build`
3. Set start command: `npm run start`
4. Add environment variables

### Database (Vercel Postgres)
1. Create a new Postgres database in Vercel
2. Copy the connection string to your environment variables
3. Run migrations on deployment

## 📝 Development Notes

### Adding New API Endpoints

1. Create controller in `apps/api/src/controllers/`
2. Add route in `apps/api/src/routes/`
3. Update types in `packages/shared-types/src/`
4. Consume in frontend using the API proxy

### Database Schema Changes

1. Update `apps/api/prisma/schema.prisma`
2. Run `npm run db:generate`
3. Run `npm run db:migrate`
4. Update shared types accordingly

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `POSTGRES_PRISMA_URL` | PostgreSQL connection string | ✅ |
| `EXPRESS_API_URL` | Express API URL | ✅ |
| `JWT_SECRET` | JWT signing secret | ✅ |
| `NODE_ENV` | Environment (development/production) | ✅ |
| `FRONTEND_URL` | Frontend URL for CORS | ❌ |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this template for your projects!
