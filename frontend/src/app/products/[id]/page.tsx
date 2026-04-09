'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProductDetail } from '@/components/products/ProductDetail';
import { Spinner } from '@/components/ui/Spinner';
import { productService } from '@/services/productService';
import { useInactivityTimeout } from '@/hooks/useInactivityTimeout';
import type { Product } from '@/types/product';

interface ProductPageProps {
  params: { id: string };
}

export default function ProductPage({ params }: ProductPageProps): React.ReactElement {
  useInactivityTimeout();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async (): Promise<void> => {
      try {
        const data = await productService.getProductById(params.id);
        setProduct(data);
        setError(null);
      } catch (err) {
        setError('Failed to load product. Please try again later.');
        console.error('Product fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchProduct();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[600px]">
        <Spinner size="lg" label="Loading product..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-semibold">{error || 'Product not found'}</p>
        </div>
        <div className="text-center">
          <Link href="/" className="inline-block text-blue-600 hover:text-blue-700 font-medium">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
        Back to Products
      </Link>
      <ProductDetail product={product} />
    </div>
  );
}
