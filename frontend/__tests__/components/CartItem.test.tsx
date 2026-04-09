import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CartItem } from '@/components/cart/CartItem';
import type { CartItem as CartItemType } from '@/types/cart';

const mockCartItem: CartItemType = {
  id: 1,
  cartId: 1,
  productId: 1,
  product: {
    id: 1,
    name: 'Test Product',
    description: 'Test Description',
    price: 29.99,
    imageUrl:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    category: 'Test',
    stock: 10,
    rating: 4,
    reviews: 5,
  },
  quantity: 2,
};

describe('CartItem', () => {
  it('renders cart item information', () => {
    const onQuantityChange = vi.fn();
    const onRemove = vi.fn();

    render(
      <CartItem
        item={mockCartItem}
        onQuantityChange={onQuantityChange}
        onRemove={onRemove}
      />
    );

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
  });

  it('displays correct quantity', () => {
    const onQuantityChange = vi.fn();
    const onRemove = vi.fn();

    render(
      <CartItem
        item={mockCartItem}
        onQuantityChange={onQuantityChange}
        onRemove={onRemove}
      />
    );

    const quantityInput = screen.getByLabelText(/Quantity/);
    expect(quantityInput).toHaveValue(2);
  });

  it('calls onQuantityChange when quantity is updated', () => {
    const onQuantityChange = vi.fn();
    const onRemove = vi.fn();

    render(
      <CartItem
        item={mockCartItem}
        onQuantityChange={onQuantityChange}
        onRemove={onRemove}
      />
    );

    const quantityInput = screen.getByLabelText(/Quantity/);
    fireEvent.change(quantityInput, { target: { value: '3' } });

    expect(onQuantityChange).toHaveBeenCalledWith(1, 3);
  });

  it('calls onRemove when remove button is clicked', () => {
    const onQuantityChange = vi.fn();
    const onRemove = vi.fn();

    render(
      <CartItem
        item={mockCartItem}
        onQuantityChange={onQuantityChange}
        onRemove={onRemove}
      />
    );

    const removeButton = screen.getByText('Remove');
    fireEvent.click(removeButton);

    expect(onRemove).toHaveBeenCalledWith(1);
  });

  it('calculates total price correctly', () => {
    const onQuantityChange = vi.fn();
    const onRemove = vi.fn();

    render(
      <CartItem
        item={mockCartItem}
        onQuantityChange={onQuantityChange}
        onRemove={onRemove}
      />
    );

    const totalPrice = mockCartItem.product.price * mockCartItem.quantity;
    expect(screen.getByText(`$${totalPrice.toFixed(2)}`)).toBeInTheDocument();
  });
});
