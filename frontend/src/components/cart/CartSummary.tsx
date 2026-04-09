import React from 'react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface CartSummaryProps {
  itemCount: number;
  totalPrice: number;
  isLoading: boolean;
  onCheckout: () => void;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  itemCount,
  totalPrice,
  isLoading,
  onCheckout,
}) => {
  return (
    <aside className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

      <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal ({itemCount} items)</span>
          <span className="font-semibold text-gray-900">{formatPrice(totalPrice)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="font-semibold text-gray-900">Free</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Tax</span>
          <span className="font-semibold text-gray-900">{formatPrice(totalPrice * 0.1)}</span>
        </div>
      </div>

      <div className="flex justify-between mb-6">
        <span className="text-lg font-bold text-gray-900">Total</span>
        <span className="text-2xl font-bold text-blue-600">{formatPrice(totalPrice * 1.1)}</span>
      </div>

      <Button
        variant="primary"
        size="lg"
        className="w-full mb-3"
        onClick={onCheckout}
        disabled={itemCount === 0 || isLoading}
        isLoading={isLoading}
        aria-label="Proceed to checkout"
      >
        Checkout
      </Button>

      <Link href="/">
        <Button variant="outline" size="lg" className="w-full" aria-label="Continue shopping">
          Continue Shopping
        </Button>
      </Link>
    </aside>
  );
};
