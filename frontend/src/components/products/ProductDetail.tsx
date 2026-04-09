'use client';

import React, { useState, memo } from 'react';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import type { Product } from '@/types/product';

// Memoized image — never re-renders when quantity/state changes
const ProductImage = memo(({ src, alt }: { src: string; alt: string }) => (
  <div className="relative flex items-center justify-center bg-gray-100 rounded-lg aspect-square">
    <Image
      src={src}
      alt={alt}
      fill
      priority
      sizes="(max-width: 768px) 100vw, 50vw"
      className="object-cover rounded-lg"
    />
  </div>
));
ProductImage.displayName = 'ProductImage';

// Memoized product info — never re-renders when quantity/state changes
const ProductInfo = memo(({ product }: { product: Product }) => (
  <div>
    <div className="mb-2 inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
      {product.category}
    </div>

    <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

    <div className="flex items-center gap-2 mb-4">
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={i < Math.floor(product.rating ?? 0) ? 'text-yellow-500' : 'text-gray-300'}
          >
            ★
          </span>
        ))}
      </div>
      <span className="text-gray-600">
        {(product.rating ?? 0).toFixed(1)} ({product.reviews ?? 0} reviews)
      </span>
    </div>

    <p className="text-gray-700 text-lg mb-6">{product.description}</p>

    <div className="space-y-4">
      <div className="text-4xl font-bold text-blue-600">{formatPrice(product.price)}</div>

      <div className="flex items-center gap-3">
        <span className="font-medium text-gray-700">Stock:</span>
        <span
          className={`text-lg font-semibold ${
            product.stock > 0 ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
        </span>
      </div>
    </div>
  </div>
));
ProductInfo.displayName = 'ProductInfo';

interface ProductDetailProps {
  product: Product;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const router = useRouter();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = Math.max(1, Math.min(product.stock, parseInt(e.target.value, 10)));
    setQuantity(isNaN(value) ? 1 : value);
  };

  const handleAddToCart = async (): Promise<void> => {
    if (!isAuthenticated) {
      setAddError('Please login to add items to your cart. Redirecting...');
      setTimeout(() => {
        router.push(`/login?redirect=/products/${product.id}`);
      }, 1500);
      return;
    }

    setIsAdding(true);
    setAddError(null);
    try {
      await addItem(product, quantity);
      setAddSuccess(true);
      setTimeout(() => {
        router.push('/cart');
      }, 1000);
    } catch (error) {
      setAddError('Failed to add to cart. Please try again.');
      setTimeout(() => setAddError(null), 3000);
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
        <ProductImage src={product.imageUrl} alt={product.name} />

        <div className="flex flex-col justify-between">
          <ProductInfo product={product} />

          <div className="mt-8 space-y-4">
            {product.stock > 0 && (
              <>
                <div>
                  <label htmlFor="quantity" className="block font-medium text-gray-700 mb-2">
                    Quantity:
                  </label>
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    aria-label="Select quantity"
                  />
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  isLoading={isAdding}
                  onClick={() => void handleAddToCart()}
                  className="w-full"
                  aria-label={`Add ${quantity} ${product.name} to cart`}
                >
                  Add to Cart
                </Button>

                {addSuccess && (
                  <div className="bg-green-100 text-green-800 p-4 rounded-lg text-center font-medium">
                    Added to cart successfully!
                  </div>
                )}

                {addError && (
                  <div className="bg-red-100 text-red-800 p-4 rounded-lg text-center font-medium">
                    {addError}
                  </div>
                )}
              </>
            )}

            {product.stock === 0 && (
              <Button variant="outline" disabled className="w-full">
                Out of Stock
              </Button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
