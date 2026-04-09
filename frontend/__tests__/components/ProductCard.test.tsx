import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProductCard } from '@/components/products/ProductCard';
import type { Product } from '@/types/product';

const mockProduct: Product = {
  id: 1,
  name: 'Test Product',
  description: 'This is a test product',
  price: 99.99,
  imageUrl:
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
  category: 'Electronics',
  stock: 10,
  rating: 4.5,
  reviews: 25,
};

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('This is a test product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('(25)')).toBeInTheDocument();
  });

  it('renders product image with correct alt text', () => {
    render(<ProductCard product={mockProduct} />);

    const image = screen.getByAltText('Test Product');
    expect(image).toBeInTheDocument();
  });

  it('renders "View Details" link', () => {
    render(<ProductCard product={mockProduct} />);

    const link = screen.getByText('View Details');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', `/products/${mockProduct.id}`);
  });

  it('shows out of stock message when stock is 0', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };
    render(<ProductCard product={outOfStockProduct} />);

    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
  });
});
