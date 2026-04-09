# E-Commerce Mini App

A production-ready, full-stack e-commerce product catalog built with **Next.js**, **NestJS**, and **PostgreSQL**. Designed with a focus on security, performance, and clean architecture.

---

## Architecture Overview

```
e-commerce-mini-app/
├── frontend/          → Next.js 14 (App Router) + TypeScript + Tailwind CSS
├── backend/           → NestJS + TypeScript + Prisma ORM + PostgreSQL
├── .github/workflows/ → Unified CI/CD pipeline
└── README.md          → You are here
```

### Tech Stack

| Layer      | Technology                              |
|------------|----------------------------------------|
| Frontend   | Next.js 14, TypeScript 5, Tailwind CSS |
| Backend    | NestJS 10, TypeScript 5, Prisma ORM    |
| Database   | PostgreSQL 16                          |
| Auth       | JWT (Bearer Token), bcrypt             |
| Testing    | Vitest (frontend), Jest (backend)      |
| CI/CD      | GitHub Actions                         |

---

## Features

### Authentication & Security
- JWT-based authentication with Bearer token
- Token stored in localStorage with auto-attach via Axios interceptor
- Secure login with brute-force protection (rate limiting via @nestjs/throttler)
- 30-minute inactivity timeout with automatic logout
- Password hashing with bcrypt
- Password visibility toggle (show/hide) on all password fields
- Helmet middleware for HTTP security headers
- CORS configuration with specific origin
- Input validation with class-validator DTOs
- Auth-aware UI (login required alerts with auto-redirect)

### Product Catalog
- Product listing with **infinite scroll** (Load More button appends products)
- Configurable page size (5, 10, 20, 30, 50 items per request)
- "Showing X of Y products" counter
- Product detail pages with full information
- 50 products across 5 categories with real Unsplash images
- Optimized images via Next.js Image component with `priority` loading
- Memoized components to prevent unnecessary re-renders

### Shopping Cart
- Database-backed cart (not localStorage)
- Add items from product detail page (with auth check)
- **Local-first quantity updates** — no API calls on quantity change
- Remove items instantly (local state)
- Cart syncs with server only on Checkout
- Real-time price/total recalculation (local)
- Beautiful success modal on checkout completion
- Auto-redirect to product list after checkout
- Cart badge with item count in header

### UI/UX
- Responsive design (mobile, tablet, desktop)
- Sticky header with navigation
- Footer always at bottom of page (`min-h-screen` flex layout)
- Consistent button sizes (Login/Register)
- Shopping cart icon in header with badge count
- Loading states and error handling throughout
- Success/error alerts with auto-dismiss
- Smooth page transitions

### Code Quality
- TypeScript strict mode (no `any`, strict null checks)
- ESLint with strict rules
- Prettier for consistent formatting
- Conventional Commits enforced via Commitlint
- Pre-commit hooks via Husky + lint-staged

---

## Prerequisites

- **Node.js** >= 18
- **npm** >= 9
- **PostgreSQL** >= 14
- **Git**

---

## Quick Start

### 1. Clone the repository

```bash
git clone <repository-url>
cd e-commerce-mini-app
```

### 2. Set up the backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your PostgreSQL credentials
```

```env
DATABASE_URL=postgresql://postgres:@localhost:5432/ecommerce
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRATION=30m
PORT=3001
```

```bash
# Generate Prisma client, run migrations, and seed data
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed

# Start the backend
npm run start:dev
```

The backend will be available at `http://localhost:3001`.

### 3. Set up the frontend

```bash
cd ../frontend
npm install
cp .env.example .env.local
```

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=E-Commerce Mini App
NEXT_PUBLIC_INACTIVITY_TIMEOUT=1800000
```

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`.

---

## Running Tests

### Backend (Jest)

```bash
cd backend
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:cov      # Coverage report
```

### Frontend (Vitest)

```bash
cd frontend
npm test                        # Run all tests
npx vitest --changed HEAD~1    # Only changed files
npm run test:coverage           # Coverage report
```

---

## API Endpoints

### Authentication

| Method | Endpoint             | Description          | Auth |
|--------|---------------------|----------------------|------|
| POST   | `/auth/register`     | Register new user    | No   |
| POST   | `/auth/login`        | Login & get JWT      | No   |
| POST   | `/auth/logout`       | Invalidate session   | Yes  |
| GET    | `/auth/me`           | Get current user     | Yes  |

### Products

| Method | Endpoint             | Description                      | Auth |
|--------|---------------------|----------------------------------|------|
| GET    | `/products`          | List products (paginated)        | No   |
| GET    | `/products/:id`      | Get product detail               | No   |

**Query Parameters for `/products`:**
- `page` (default: 1)
- `pageSize` (default: 10, min: 5, max: 50)

### Cart

| Method | Endpoint             | Description            | Auth |
|--------|---------------------|------------------------|------|
| GET    | `/cart`              | Get user's cart        | Yes  |
| POST   | `/cart/items`        | Add item to cart       | Yes  |
| PATCH  | `/cart/items/:id`    | Update item quantity   | Yes  |
| DELETE | `/cart/items/:id`    | Remove item from cart  | Yes  |

---

## CI/CD Pipeline

The unified GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every push to `main`/`develop` and on pull requests:

### Backend Jobs
1. **Lint** — ESLint with strict rules, zero warnings allowed
2. **Type Check** — `tsc --noEmit` with strict TypeScript
3. **Unit Tests** — Jest with coverage reporting
4. **Build** — Ensures `npm run build` succeeds (depends on lint + typecheck + tests)
5. **DB Schema Validation** — Spins up PostgreSQL service, runs `prisma migrate deploy` and `prisma validate`

### Frontend Jobs
1. **Lint** — ESLint auto-fixes, then fails on remaining errors
2. **Type Check** — `tsc --noEmit` with strict TypeScript
3. **Tests** — Vitest runs only tests related to changed files (`--changed HEAD~1`)
4. **Build** — Ensures `npm run build` succeeds (depends on lint + typecheck + tests)

### Shared Jobs
- **Commitlint** — Validates all commit messages in PRs follow Conventional Commits

---

## Project Structure

### Frontend (`/frontend`)

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Home — product listing with infinite scroll
│   ├── globals.css         # Global styles + animations
│   ├── login/page.tsx      # Login page
│   ├── register/page.tsx   # Registration page
│   ├── products/[id]/      # Product detail (dynamic route)
│   └── cart/page.tsx       # Cart page with checkout
├── components/
│   ├── layout/             # Header, Footer
│   ├── products/           # ProductCard, ProductGrid, ProductDetail
│   ├── cart/               # CartItem, CartSummary
│   └── ui/                 # Button, Input, Spinner, PageSizeSelector, SuccessModal
├── hooks/                  # useAuth, useCart, useInfiniteProducts, useInactivityTimeout
├── services/               # API client (with JWT interceptor), auth/product/cart services
├── context/                # AuthContext, CartContext
├── types/                  # TypeScript interfaces
└── lib/                    # Utility functions
```

### Backend (`/backend`)

```
src/
├── auth/                   # Authentication module
│   ├── controller, service, module
│   ├── strategies/         # JWT strategy (returns id, email, name)
│   ├── guards/             # JWT auth guard
│   └── dto/                # Login, Register DTOs
├── products/               # Products module
│   ├── controller, service, repository, module
│   └── dto/                # Product list, detail DTOs
├── cart/                   # Cart module
│   ├── controller, service, repository, module
│   └── dto/                # Add/update/cart DTOs
├── prisma/                 # Prisma service & module
├── common/types/           # Shared TypeScript interfaces
├── app.module.ts           # Root module
└── main.ts                 # Bootstrap with Helmet, CORS, validation
prisma/
├── schema.prisma           # Database schema (auto-increment IDs)
├── migrations/             # Database migrations
└── seed.ts                 # 50 sample products + test user
```

---

## Database Schema

All tables use **auto-increment integer IDs** (1, 2, 3...).

| Table       | Key Fields                                            |
|-------------|-------------------------------------------------------|
| `users`     | id, email (unique), password (bcrypt), name           |
| `products`  | id, name, description, price, imageUrl, stock, category |
| `carts`     | id, userId (unique, cascade)                          |
| `cart_items` | id, cartId, productId, quantity, unique(cartId+productId) |
| `sessions`  | id, userId, expiresAt                                 |

---

## Design Decisions

**Why NestJS?** Provides enterprise-grade structure with dependency injection, modules, and decorators — ideal for scalable APIs with clean architecture.

**Why Prisma over TypeORM?** Type-safe database queries with auto-generated client, intuitive schema language, and excellent migration tooling.

**Why App Router (Next.js 14)?** Server components for SEO and performance, built-in metadata API, streaming/suspense support, and the future direction of Next.js.

**Why Bearer Token for JWT?** Simple, stateless authentication. Token stored in localStorage and attached via Axios request interceptor. Combined with CORS origin restrictions for security.

**Why database-backed cart?** Persists across devices and sessions, enables server-side stock validation, and avoids the reliability issues of client-side storage.

**Why local-first cart updates?** Quantity changes and item removal happen instantly in local state with no API calls. The cart syncs with the server only on checkout, providing a snappy user experience with no flickering or loading states.

**Why infinite scroll with Load More?** A "Load More" button provides the infinite scroll experience (products append to the list) while giving users explicit control over when to load more. Combined with configurable page size (5–50 items per request), this delivers smooth browsing without the complexity and timing issues of IntersectionObserver-based auto-loading.

**Why auto-increment IDs?** Clean sequential integers (1, 2, 3...) are easy to read in database tools, debug in logs, and use in URLs.

---

## Environment Variables

### Backend (`.env`)

| Variable         | Description                    | Default                                             |
|-----------------|--------------------------------|-----------------------------------------------------|
| `DATABASE_URL`   | PostgreSQL connection string   | `postgresql://postgres:@localhost:5432/ecommerce`    |
| `JWT_SECRET`     | Secret key for JWT signing     | (required)                                          |
| `JWT_EXPIRATION` | Token expiry duration          | `30m`                                               |
| `PORT`           | Server port                    | `3001`                                              |

### Frontend (`.env.local`)

| Variable                         | Description              | Default                   |
|----------------------------------|--------------------------|---------------------------|
| `NEXT_PUBLIC_API_URL`            | Backend API URL          | `http://localhost:3001`   |
| `NEXT_PUBLIC_APP_NAME`           | Application name         | `E-Commerce Mini App`     |
| `NEXT_PUBLIC_INACTIVITY_TIMEOUT` | Inactivity timeout (ms)  | `1800000` (30 min)        |

---

## Demo Credentials

| Field    | Value              |
|----------|--------------------|
| Email    | test@example.com   |
| Password | password123        |

