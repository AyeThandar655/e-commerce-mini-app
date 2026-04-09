'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { productService } from '@/services/productService';
import type { Product } from '@/types/product';
import { getErrorMessage } from '@/lib/utils';

interface UseInfiniteProductsOptions {
  initialPageSize?: number;
}

interface UseInfiniteProductsReturn {
  products: Product[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  total: number;
  pageSize: number;
  setPageSize: (size: number) => void;
  loadMore: () => void;
}

export const useInfiniteProducts = (
  options: UseInfiniteProductsOptions = {}
): UseInfiniteProductsReturn => {
  const { initialPageSize = 10 } = options;

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSizeState] = useState(initialPageSize);

  const currentPageRef = useRef(1);
  const isFetchingRef = useRef(false);

  // Fetch a specific page
  const fetchPage = useCallback(
    async (page: number, size: number, append: boolean): Promise<void> => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;

      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      try {
        const response = await productService.getProducts({ page, pageSize: size });

        setProducts(prev => {
          if (!append) return response.data;
          const existingIds = new Set(prev.map(p => p.id));
          const newProducts = response.data.filter(p => !existingIds.has(p.id));
          return [...prev, ...newProducts];
        });

        setTotal(response.total);
        setHasMore(response.hasMore);
        currentPageRef.current = page + 1;
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
        isFetchingRef.current = false;
      }
    },
    []
  );

  // Load more — appends next page
  const loadMore = useCallback((): void => {
    if (!hasMore || isFetchingRef.current) return;
    void fetchPage(currentPageRef.current, pageSize, true);
  }, [hasMore, pageSize, fetchPage]);

  // Change page size — resets and loads fresh
  const setPageSize = useCallback(
    (size: number): void => {
      const validSize = Math.max(5, Math.min(50, size));
      setPageSizeState(validSize);
      setProducts([]);
      setHasMore(true);
      currentPageRef.current = 1;
      isFetchingRef.current = false;
      void fetchPage(1, validSize, false);
    },
    [fetchPage]
  );

  // Initial load
  useEffect(() => {
    void fetchPage(1, pageSize, false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    products,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    total,
    pageSize,
    setPageSize,
    loadMore,
  };
};
