'use client';

import React, { useEffect, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CartItem } from '@/components/cart/CartItem';
import { CartSummary } from '@/components/cart/CartSummary';
import { Spinner } from '@/components/ui/Spinner';
import { SuccessModal } from '@/components/ui/SuccessModal';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useInactivityTimeout } from '@/hooks/useInactivityTimeout';

export default function CartPage(): React.ReactElement {
  useInactivityTimeout();

  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const {
    state: cartState,
    fetchCart,
    updateQuantity,
    removeItem,
    syncCart,
    clearCart,
  } = useCart();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleQuantityChange = useCallback(
    (cartItemId: number, quantity: number) => {
      updateQuantity(cartItemId, quantity);
    },
    [updateQuantity]
  );

  const handleRemove = useCallback(
    (cartItemId: number) => {
      removeItem(cartItemId);
    },
    [removeItem]
  );

  const handleCheckout = useCallback(async () => {
    try {
      await syncCart();
      await clearCart();
      setShowSuccess(true);
    } catch {
      alert('Failed to process checkout. Please try again.');
    }
  }, [syncCart, clearCart]);

  const handleSuccessClose = useCallback(() => {
    setShowSuccess(false);
    router.push('/');
  }, [router]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/cart');
      return;
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart().catch(error => {
        console.error('Failed to fetch cart:', error);
      });
    }
  }, [isAuthenticated, fetchCart]);

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" label="Loading..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" label="Redirecting to login..." />
      </div>
    );
  }

  const itemCount = cartState.items.reduce((sum, item) => sum + item.quantity, 0);
  const isEmpty = cartState.items.length === 0;

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-gray-900">Shopping Cart</h1>

      {cartState.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
          {cartState.error}
        </div>
      )}

      {isEmpty ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-6">Your cart is empty</p>
          <a
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Continue Shopping
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Items ({cartState.items.length})
              </h2>

              <div
                className={`divide-y ${cartState.isLoading ? 'opacity-60 pointer-events-none' : ''}`}
              >
                {cartState.items.map(item => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemove}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <CartSummary
              itemCount={itemCount}
              totalPrice={cartState.totalPrice}
              isLoading={cartState.isLoading}
              onCheckout={() => void handleCheckout()}
            />
          </div>
        </div>
      )}

      <SuccessModal
        isOpen={showSuccess}
        onClose={handleSuccessClose}
        title="Order Placed Successfully!"
        message="Thank you for your purchase! Your order has been confirmed and will be delivered soon."
      />
    </div>
  );
}
