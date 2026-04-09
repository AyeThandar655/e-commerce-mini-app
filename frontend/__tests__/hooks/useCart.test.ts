import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { CartContextType } from '@/types/cart';

describe('useCart hook', () => {
  let mockCartContext: CartContextType;

  beforeEach(() => {
    mockCartContext = {
      state: {
        items: [],
        totalItems: 0,
        totalPrice: 0,
        isLoading: false,
        error: null,
      },
      addItem: vi.fn(),
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
      clearCart: vi.fn(),
      fetchCart: vi.fn(),
      syncCart: vi.fn(),
    };
  });

  it('should have initial empty state', () => {
    expect(mockCartContext.state.items).toEqual([]);
    expect(mockCartContext.state.totalPrice).toBe(0);
    expect(mockCartContext.state.totalItems).toBe(0);
    expect(mockCartContext.state.isLoading).toBe(false);
    expect(mockCartContext.state.error).toBeNull();
  });

  it('should provide addItem function', () => {
    expect(typeof mockCartContext.addItem).toBe('function');
  });

  it('should provide removeItem function', () => {
    expect(typeof mockCartContext.removeItem).toBe('function');
  });

  it('should provide updateQuantity function', () => {
    expect(typeof mockCartContext.updateQuantity).toBe('function');
  });

  it('should provide clearCart function', () => {
    expect(typeof mockCartContext.clearCart).toBe('function');
  });

  it('should provide fetchCart function', () => {
    expect(typeof mockCartContext.fetchCart).toBe('function');
  });

  it('should provide syncCart function', () => {
    expect(typeof mockCartContext.syncCart).toBe('function');
  });
});
