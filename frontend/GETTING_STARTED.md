# Getting Started with E-Commerce Mini App Frontend

This guide will help you set up and run the frontend application locally.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.0.0 or higher (20+ recommended)
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version && npm --version`

- **Git**: For version control
  - Download from [git-scm.com](https://git-scm.com/)

## Quick Start

### 1. Clone or Navigate to the Project

If you haven't already navigated to the project directory:

```bash
cd /sessions/busy-sharp-cray/mnt/Technical_Test/e-commerce-mini-app/frontend
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages listed in `package.json`.

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Edit `.env.local` and ensure the API URL matches your backend:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=E-Commerce Mini App
NEXT_PUBLIC_INACTIVITY_TIMEOUT=1800000
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at: `http://localhost:3000`

### 5. Access the Application

Open your browser and navigate to:
- **Home/Products**: `http://localhost:3000/`
- **Login**: `http://localhost:3000/login`
- **Register**: `http://localhost:3000/register`

## First Run Checks

### Verify Installation

Run the following commands to verify everything is set up correctly:

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# List installed packages
npm list
```

### Run Type Checking

```bash
npm run type-check
```

### Run Linter

```bash
npm run lint:check
```

### Run Tests

```bash
npm run test
```

## Project Structure Overview

Key directories to be aware of:

- **`src/app/`** - Next.js pages and layouts
- **`src/components/`** - Reusable React components
- **`src/hooks/`** - Custom React hooks
- **`src/services/`** - API communication layer
- **`src/context/`** - React Context providers
- **`src/types/`** - TypeScript type definitions
- **`__tests__/`** - Unit tests

## Common Development Tasks

### Adding a New Feature

1. Create a new component in `src/components/`
2. Add types in `src/types/` if needed
3. Create tests in `__tests__/`
4. Run `npm run lint` to ensure code quality

### Debugging

**Browser DevTools:**
- Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
- Check the Console tab for errors
- Use the React DevTools extension for component inspection

**Next.js DevTools:**
- The dev server includes hot module replacement (HMR)
- Changes save and refresh automatically

### Making API Calls

All API communication goes through `src/services/`:

```typescript
import { productService } from '@/services/productService';

const products = await productService.getProducts({ page: 1, pageSize: 10 });
```

## API Integration

The frontend expects a backend API running on `NEXT_PUBLIC_API_URL`. Ensure:

1. Backend is running (usually on `http://localhost:3001`)
2. `.env.local` points to the correct API URL
3. CORS is configured on the backend to allow frontend requests

### Expected API Endpoints

- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user
- `POST /auth/refresh` - Refresh token
- `GET /products` - Get products list (paginated)
- `GET /products/:id` - Get product details
- `GET /cart` - Get cart items
- `POST /cart/items` - Add item to cart
- `PUT /cart/items/:productId` - Update cart item
- `DELETE /cart/items/:productId` - Remove cart item
- `DELETE /cart` - Clear cart

## Building for Production

### Create Production Build

```bash
npm run build
```

This generates optimized bundles in the `.next` directory.

### Start Production Server

```bash
npm run start
```

The application will run on `http://localhost:3000` by default.

### Build Output Verification

After building, you should see:

```
Created .next directory
Built in XXs
```

## Troubleshooting

### Issue: Port 3000 is Already in Use

**Solution 1: Use Different Port**
```bash
npm run dev -- --port 3001
```

**Solution 2: Kill Process Using Port**
```bash
# On macOS/Linux
lsof -ti:3000 | xargs kill -9

# On Windows (PowerShell as Admin)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Issue: Module Not Found

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: TypeScript Errors

**Solution:**
```bash
# Run type check to see detailed errors
npm run type-check
```

### Issue: ESLint Errors

**Solution:**
```bash
# Auto-fix linting issues
npm run lint
```

### Issue: Blank Page or Errors

1. **Check Browser Console**: Press `F12` and look for error messages
2. **Check Terminal**: Look for errors in the development server output
3. **Verify Backend**: Ensure the API server is running
4. **Check Network Tab**: Look for failed API requests

### Issue: Dependencies Installation Fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
npm install
```

## Code Quality

### Run All Quality Checks

```bash
npm run lint:check && npm run format:check && npm run type-check
```

### Auto-fix Code

```bash
npm run lint && npm run format
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

## Husky Pre-commit Hooks

The project uses Husky to run checks before commits:

1. ESLint and Prettier format code
2. TypeScript type checking
3. Tests run on changed files

To install git hooks:

```bash
npm run prepare
```

## Environment Variables Reference

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001` | Backend API base URL |
| `NEXT_PUBLIC_APP_NAME` | `E-Commerce Mini App` | Application name |
| `NEXT_PUBLIC_INACTIVITY_TIMEOUT` | `1800000` | Logout timeout in milliseconds (30 min) |

## Testing Guide

### Run Tests in Watch Mode

```bash
npm run test
```

### Run Tests Once

```bash
npm run test -- --run
```

### Run Specific Test File

```bash
npm run test -- ProductCard.test.tsx
```

### Generate Coverage Report

```bash
npm run test:coverage
```

## Performance Optimization Tips

1. **Image Optimization**: Images are lazy-loaded
2. **Code Splitting**: Components are code-split automatically
3. **Caching**: Next.js handles caching intelligently
4. **Bundle Analysis**: Check bundle size with `npm run build`

## Browser Support

The application supports:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Mobile)

## IDE Configuration

### VS Code Setup

1. Install extensions:
   - ESLint
   - Prettier - Code formatter
   - Tailwind CSS IntelliSense

2. Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

## Next Steps

1. **Review Components**: Look at `src/components/` to understand the component structure
2. **Check API Layer**: Review `src/services/` to see how API calls are made
3. **Explore Hooks**: Check `src/hooks/` for custom hooks
4. **Run Tests**: Execute `npm run test` to see how tests are structured

## Getting Help

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Common Commands Quick Reference

```bash
# Development
npm run dev              # Start dev server

# Building
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Fix linting issues
npm run lint:check       # Check without fixing
npm run format           # Format code
npm run format:check     # Check formatting
npm run type-check       # TypeScript type checking

# Testing
npm run test             # Run tests in watch mode
npm run test:ui          # Run tests with UI
npm run test:coverage    # Coverage report
```

## Useful Tips

1. **Hot Module Replacement (HMR)**: Changes are reflected instantly - no need to restart
2. **Fast Refresh**: React components update without losing state
3. **TypeScript Intellisense**: Full type support in VS Code
4. **Network Tab**: Use browser DevTools to inspect API calls
5. **React DevTools**: Browser extension for component inspection

## Monitoring

Check logs for:
- API connection issues
- Runtime errors
- Console warnings
- Performance metrics

Logs are printed in the terminal where `npm run dev` is running.

## What's Next?

Once you're up and running:

1. **Explore the Code**: Review the structure and patterns used
2. **Run Tests**: Execute `npm run test` to see the test suite
3. **Make Changes**: Try modifying a component and see HMR in action
4. **Check Backend**: Ensure the API server is running for full functionality

---

For detailed information, refer to the main [README.md](./README.md).
