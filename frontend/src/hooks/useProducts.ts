'use client';

import { useState, useCallback, useEffect } from 'react';
import { productService } from '@/services/productService';
import type { Product } from '@/types/product';
import { getErrorMessage } from '@/lib/utils';

interface UseProductsOptions {
  initialPageSize?: number;
}

interface UseProductsReturn {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  total: number;
  setPageSize: (size: number) => void;
  goToPage: (page: number) => void;
}

export const useProducts = (options: UseProductsOptions = {}): UseProductsReturn => {
  const { initialPageSize = 10 } = options;

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(initialPageSize);
  const [total, setTotal] = useState(0);

  const totalPages = Math.ceil(total / pageSize);

  const fetchProducts = useCallback(async (page: number, size: number): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await productService.getProducts({
        page,
        pageSize: size,
      });
      setProducts(response.data);
      setTotal(response.total);
      setCurrentPage(page);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setPageSize = useCallback(
    (size: number): void => {
      const validSize = Math.max(5, Math.min(50, size));
      setPageSizeState(validSize);
      // Reset to page 1 when page size changes
      void fetchProducts(1, validSize);
    },
    [fetchProducts]
  );

  const goToPage = useCallback(
    (page: number): void => {
      const validPage = Math.max(1, Math.min(page, totalPages || 1));
      void fetchProducts(validPage, pageSize);
      // Scroll to top when changing pages
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [fetchProducts, pageSize, totalPages]
  );

  // Initial load
  useEffect(() => {
    void fetchProducts(1, pageSize);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    products,
    isLoading,
    error,
    currentPage,
    totalPages,
    pageSize,
    total,
    setPageSize,
    goToPage,
  };
};
