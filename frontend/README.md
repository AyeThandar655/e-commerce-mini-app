# E-Commerce Mini App - Frontend

A production-ready, senior-level Next.js 14 frontend for a full-featured e-commerce application. Built with TypeScript, Tailwind CSS, and modern React patterns.

## Features

- **Authentication**: Login/Register with JWT-based sessions stored in httpOnly cookies
- **Session Management**: 30-minute inactivity timeout with automatic logout
- **Product Listing**: Infinite scroll with configurable page size (5-50 items)
- **Product Details**: Rich product information with ratings and reviews
- **Shopping Cart**: Add, remove, and update quantities with persistent state
- **Responsive Design**: Mobile-first approach with full responsive support
- **SEO Optimized**: Meta tags, semantic HTML, accessibility-first implementation
- **Type Safe**: Strict TypeScript configuration with no implicit any
- **Testing**: Unit tests with Vitest and React Testing Library
- **Quality Assurance**: ESLint, Prettier, Commitlint, and pre-commit hooks
- **CI/CD**: GitHub Actions workflow with automated checks

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Testing**: Vitest, React Testing Library
- **Code Quality**: ESLint, Prettier, Commitlint
- **Package Manager**: npm

## Getting Started

### Prerequisites

- Node.js 18+ (20+ recommended)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create environment files:

```bash
cp .env.example .env.local
```

4. Configure the API URL in `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=E-Commerce Mini App
NEXT_PUBLIC_INACTIVITY_TIMEOUT=1800000
```

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

Build the application:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

## Available Scripts

### Development

```bash
npm run dev          # Start development server
npm run dev --port 3000  # Start on specific port
```

### Building

```bash
npm run build        # Build for production
npm run start        # Start production server
```

### Code Quality

```bash
npm run lint         # Run ESLint with auto-fix
npm run lint:check   # Check without fixing
npm run format       # Format with Prettier
npm run format:check # Check formatting
npm run type-check   # TypeScript type checking
```

### Testing

```bash
npm run test              # Run tests in watch mode
npm run test:ui           # Run tests with UI
npm run test:coverage     # Generate coverage report
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home/product listing
│   ├── products/[id]/     # Product detail page
│   ├── cart/              # Shopping cart page
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── layout/           # Layout components (Header, Footer)
│   ├── products/         # Product-related components
│   ├── cart/             # Cart-related components
│   └── ui/               # UI components (Button, Input, etc.)
├── context/              # React Context providers
│   ├── AuthContext.tsx
│   └── CartContext.tsx
├── hooks/                # Custom React hooks
│   ├── useAuth.ts
│   ├── useCart.ts
│   ├── useInfiniteProducts.ts
│   └── useInactivityTimeout.ts
├── services/             # API service layer
│   ├── api.ts           # Axios configuration
│   ├── authService.ts
│   ├── productService.ts
│   └── cartService.ts
├── types/               # TypeScript type definitions
│   ├── auth.ts
│   ├── product.ts
│   └── cart.ts
└── lib/                 # Utility functions
    └── utils.ts
__tests__/              # Unit tests
public/                 # Static assets
```

## Authentication Flow

1. User logs in via the `/login` page
2. Credentials are sent to the backend API
3. JWT token is received and stored in httpOnly cookie
4. Authenticated requests include the cookie automatically
5. 30-minute inactivity timeout triggers automatic logout
6. Session is refreshed on page load if valid

## Infinite Scroll Implementation

The product listing uses the Intersection Observer API for efficient infinite scroll:

- Initial load fetches the first batch of products
- When user scrolls near the bottom, more products are automatically loaded
- Page size is configurable (5-50 items) with the page size selector
- Loading states provide clear feedback

## Responsive Breakpoints

- Mobile: < 640px (tailwind's `sm`)
- Tablet: 640px - 1024px (tailwind's `md`, `lg`)
- Desktop: 1024px+ (tailwind's `lg`, `xl`)

## Accessibility Features

- Semantic HTML (header, main, section, nav, article)
- ARIA labels and descriptions
- Form validation with error messages
- Keyboard navigation support
- Focus management
- Alt text for images
- Proper heading hierarchy

## SEO Optimizations

- Meta tags (title, description, keywords)
- Open Graph tags for social sharing
- Semantic HTML structure
- Dynamic title generation per page
- Proper image optimization with lazy loading
- Robots meta tag for indexing

## Security Features

- JWT tokens in httpOnly cookies (XSS protection)
- CORS-aware API client configuration
- Input validation on frontend and backend
- Password confirmation on registration
- Automatic logout on inactivity
- Protected routes (cart, checkout)

## Testing

### Running Tests

```bash
# Watch mode
npm run test

# UI mode
npm run test:ui

# Coverage report
npm run test:coverage
```

### Test Files Location

- Component tests: `__tests__/components/`
- Hook tests: `__tests__/hooks/`

### Example Test

```typescript
import { render, screen } from '@testing-library/react';
import { ProductCard } from '@/components/products/ProductCard';

test('renders product card', () => {
  render(<ProductCard product={mockProduct} />);
  expect(screen.getByText('Product Name')).toBeInTheDocument();
});
```

## Code Quality Standards

### ESLint Rules

- No `any` types (strict TypeScript)
- React hooks rules enforced
- Consistent naming conventions
- No unused variables
- No console logs in production

### Prettier Configuration

- Single quotes
- 100-character line width
- 2-space indentation
- Trailing commas

### Commit Rules (Commitlint)

Valid commit types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Test changes
- `chore`: Build/dependency changes

Example: `feat: add product search functionality`

## Performance Optimization

- Code splitting via dynamic imports
- Image lazy loading
- Intersection Observer for infinite scroll
- Efficient state management
- Memoization where appropriate
- CSS compression and minification

## Deployment

### Build Output

The production build generates optimized bundles:
- Server-side components
- Client-side JavaScript
- Static assets
- CSS modules

### Environment Variables

Set these in your production environment:
- `NEXT_PUBLIC_API_URL`: Backend API URL
- `NEXT_PUBLIC_APP_NAME`: Application name
- `NEXT_PUBLIC_INACTIVITY_TIMEOUT`: Logout timeout in ms

### Hosting

The app can be deployed to:
- Vercel (recommended for Next.js)
- AWS Amplify
- Netlify
- Docker containers
- Traditional Node.js hosting

## Troubleshooting

### Port Already in Use

```bash
npm run dev -- --port 3001
```

### Clear Next.js Cache

```bash
rm -rf .next node_modules
npm install
npm run build
```

### Test Failures

```bash
npm run test -- --clearCache
```

## Contributing

1. Create a feature branch: `git checkout -b feature/feature-name`
2. Make changes and run: `npm run lint && npm run type-check`
3. Commit with conventional commits: `git commit -m "feat: add feature"`
4. Push and create a pull request

## License

MIT License - See LICENSE file for details

## Support

For issues or questions:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Include error messages and steps to reproduce

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
