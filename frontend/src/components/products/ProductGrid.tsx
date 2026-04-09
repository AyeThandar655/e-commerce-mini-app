'use client';

import React from 'react';
import { ProductCard } from './ProductCard';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import type { Product } from '@/types/product';

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  error: string | null;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading,
  isLoadingMore,
  hasMore,
  onLoadMore,
  error,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" label="Loading products..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-lg font-semibold">{error}</p>
        <p className="text-gray-600 mt-2">Please try again later.</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">No products found.</p>
      </div>
    );
  }

  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Load More button — infinite scroll */}
      {hasMore && (
        <div className="flex justify-center py-8">
          {isLoadingMore ? (
            <Spinner size="md" label="Loading more products..." />
          ) : (
            <Button variant="outline" size="lg" onClick={onLoadMore} className="min-w-[200px]">
              Load More Products
            </Button>
          )}
        </div>
      )}

      {!hasMore && products.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">You have reached the end — all products loaded.</p>
        </div>
      )}
    </section>
  );
};
