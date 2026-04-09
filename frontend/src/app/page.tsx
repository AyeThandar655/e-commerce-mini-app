'use client';

import React from 'react';
import { ProductGrid } from '@/components/products/ProductGrid';
import { PageSizeSelector } from '@/components/ui/PageSizeSelector';
import { useInfiniteProducts } from '@/hooks/useInfiniteProducts';
import { useInactivityTimeout } from '@/hooks/useInactivityTimeout';

export default function HomePage(): React.ReactElement {
  useInactivityTimeout();

  const {
    products,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    total,
    pageSize,
    setPageSize,
    loadMore,
  } = useInfiniteProducts({ initialPageSize: 10 });

  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to E-Shop</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover our curated collection of quality products. Shop with confidence and enjoy
          seamless checkout.
        </p>
      </section>

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
          {!isLoading && (
            <p className="text-sm text-gray-500 mt-1">
              Showing {products.length} of {total} products
            </p>
          )}
        </div>
        <PageSizeSelector
          currentSize={pageSize}
          onSizeChange={setPageSize}
          minSize={5}
          maxSize={50}
        />
      </div>

      <ProductGrid
        products={products}
        isLoading={isLoading}
        isLoadingMore={isLoadingMore}
        hasMore={hasMore}
        onLoadMore={loadMore}
        error={error}
      />
    </div>
  );
}
