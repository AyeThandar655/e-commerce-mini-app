# E-Commerce Mini App - Backend

A production-ready NestJS backend for an e-commerce application with authentication, product management, and shopping cart functionality.

## Tech Stack

- **Framework**: NestJS 10.3
- **Runtime**: Node.js 18+
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with session management
- **Testing**: Jest
- **Code Quality**: ESLint, Prettier, Commitlint
- **Security**: Helmet, CORS, Rate Limiting (Throttler)

## Prerequisites

- Node.js 18.x or 20.x
- PostgreSQL 12+
- npm or yarn

## Installation

1. Clone the repository and navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

4. Update `.env` with your database connection and JWT secret:

```
DATABASE_URL=postgresql://user:password@localhost:5432/ecommerce
JWT_SECRET=your-secret-key-min-32-chars-long
JWT_EXPIRATION=30m
PORT=3001
NODE_ENV=development
```

5. Generate Prisma Client and run migrations:

```bash
npm run db:generate
npm run db:migrate
```

6. Seed the database with sample data:

```bash
npm run db:seed
```

## Running the Application

### Development

```bash
npm run start:dev
```

The application will start on `http://localhost:3001`

### Production

```bash
npm run build
npm run start:prod
```

## Project Structure

```
src/
├── auth/              # Authentication module (JWT, sessions, guards)
├── products/          # Products module (list, detail)
├── cart/             # Shopping cart module (add, update, remove items)
├── prisma/           # Prisma service and module
├── common/           # Shared utilities, decorators, interceptors
├── app.module.ts     # Root application module
└── main.ts           # Application entry point

prisma/
├── schema.prisma     # Database schema
└── seed.ts           # Database seeding script

test/
├── auth.service.spec.ts
├── products.service.spec.ts
└── cart.service.spec.ts
```

## API Documentation

### Authentication

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <access_token>
```

### Products

#### List Products (with pagination)
```http
GET /products?page=1&pageSize=10
```

Query Parameters:
- `page` (default: 1) - Page number (min: 1)
- `pageSize` (default: 10) - Items per page (min: 5, max: 50)

Response:
```json
{
  "data": [
    {
      "id": 1,
      "name": "Wireless Headphones",
      "description": "High-quality wireless headphones",
      "price": 79.99,
      "imageUrl": "https://...",
      "stock": 50,
      "category": "Electronics",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "pageSize": 10,
  "hasMore": true
}
```

#### Get Product Details
```http
GET /products/:id
```

### Cart

#### Get Cart
```http
GET /cart
Authorization: Bearer <access_token>
```

Response:
```json
{
  "id": 1,
  "userId": 1,
  "items": [
    {
      "id": 1,
      "cartId": 1,
      "productId": 1,
      "quantity": 2,
      "product": { ... },
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "totalItems": 2,
  "totalPrice": 159.98,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

#### Add to Cart
```http
POST /cart/items
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "productId": 1,
  "quantity": 2
}
```

#### Update Cart Item Quantity
```http
PATCH /cart/items/:cartItemId
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "quantity": 5
}
```

#### Remove from Cart
```http
DELETE /cart/items/:cartItemId
Authorization: Bearer <access_token>
```

## Database Schema

### Users
- `id` - Primary key (auto-increment integer)
- `email` - Unique email address
- `password` - Bcrypt hashed password
- `name` - User's name
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### Products
- `id` - Primary key (auto-increment integer)
- `name` - Product name
- `description` - Product description
- `price` - Product price
- `imageUrl` - Product image URL
- `stock` - Available stock quantity
- `category` - Product category
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### Cart
- `id` - Primary key (auto-increment integer)
- `userId` - User ID (foreign key, unique)
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### CartItem
- `id` - Primary key (auto-increment integer)
- `cartId` - Cart ID (foreign key)
- `productId` - Product ID (foreign key)
- `quantity` - Item quantity
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### Session
- `id` - Primary key (auto-increment integer)
- `userId` - User ID (foreign key)
- `expiresAt` - Session expiration time
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

## Features

### Security
- **JWT Authentication** - Token-based authentication with 30-minute expiration
- **Session Management** - Persistent sessions with automatic cleanup
- **Inactivity Timeout** - Sessions extend 30 minutes on activity
- **Rate Limiting** - Throttling on authentication endpoints
- **Brute Force Protection** - Limited login/register attempts per minute
- **Helmet Middleware** - Security headers
- **CORS Configuration** - Configurable cross-origin requests
- **Password Hashing** - Bcrypt with 10 salt rounds

### API Features
- **Pagination** - Configurable page size (5-50 items)
- **Infinite Scroll Support** - `hasMore` indicator in responses
- **Data Validation** - Class-validator DTOs with strict validation
- **Error Handling** - Comprehensive exception handling
- **Repository Pattern** - Clean data access layer

### Code Quality
- **TypeScript Strict Mode** - Full strict type checking
- **ESLint** - Strict linting rules
- **Prettier** - Code formatting
- **Commitlint** - Conventional commit enforcement
- **Husky Hooks** - Pre-commit lint validation
- **Jest Tests** - Comprehensive unit tests

## Testing

Run all tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Generate coverage report:

```bash
npm run test:cov
```

## Linting and Formatting

Check code quality:

```bash
npm run lint
```

Format code:

```bash
npm run format
```

Type checking:

```bash
npm run type-check
```

## Database Commands

Generate Prisma Client:

```bash
npm run db:generate
```

Create and run migrations:

```bash
npm run db:migrate
```

Deploy migrations in production:

```bash
npm run db:migrate:prod
```

Seed database with sample data:

```bash
npm run db:seed
```

Open Prisma Studio (database GUI):

```bash
npm run db:studio
```

Reset database (development only):

```bash
npm run db:reset
```

## CI/CD Pipeline

The project includes a GitHub Actions workflow that runs on every push and pull request:

1. **Lint Check** - ESLint validation
2. **Type Check** - TypeScript compilation without emit
3. **Unit Tests** - Jest test suite
4. **Build** - NestJS application build
5. **Database Validation** - Migration and schema validation

## Configuration Files

### ESLint (.eslintrc.js)
- Strict TypeScript rules
- No `any` types allowed
- Unsafe assignments and calls disabled
- Floating promises detection

### Prettier (.prettierrc)
- 2-space indentation
- Single quotes
- Trailing commas
- 80-character line width

### TypeScript (tsconfig.json)
- Strict mode enabled
- No implicit any
- Strict null checks
- Unused variable detection

## Environment Variables

```
DATABASE_URL=postgresql://user:password@localhost:5432/ecommerce
JWT_SECRET=your-secret-key-min-32-chars-long
JWT_EXPIRATION=30m
PORT=3001
NODE_ENV=development
```

## Production Deployment

1. Set production environment variables
2. Build the application: `npm run build`
3. Run migrations: `npm run db:migrate:prod`
4. Start the application: `npm run start:prod`
5. Monitor logs and health endpoints

## Error Handling

All endpoints return consistent error responses:

```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "BadRequest"
}
```

Common error codes:
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid credentials)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (duplicate email)
- `500` - Internal Server Error

## Performance Considerations

- Database queries use pagination to reduce memory usage
- Infinite scroll support for better UX
- Session cleanup on startup
- Connection pooling via Prisma
- Request validation before database queries

## Future Enhancements

- Order management module
- Payment processing integration
- Wishlist functionality
- Product reviews and ratings
- Search and filtering
- Inventory management
- Admin dashboard
- Email notifications
- Two-factor authentication

## License

Proprietary - All rights reserved

## Support

For issues and questions, please create a GitHub issue or contact the development team.
