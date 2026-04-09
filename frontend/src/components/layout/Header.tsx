'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';

export const Header: React.FC = () => {
  const { isAuthenticated, user, logout, isLoading: authLoading } = useAuth();
  const { state: cartState } = useCart();

  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const itemCount = cartState.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition"
          >
            E-Shop
          </Link>

          <div className="flex items-center gap-4">
            {authLoading ? (
              <div className="w-20 h-10 bg-gray-200 rounded animate-pulse" />
            ) : isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-700">Welcome, {user?.name}</span>
                <Link
                  href="/cart"
                  className="relative text-gray-700 hover:text-blue-600 transition"
                  aria-label={`Shopping cart with ${itemCount} items`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-6 h-6"
                  >
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Link>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => void handleLogout()}
                  aria-label="Logout"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex gap-2 items-center">
                <Link href="/login">
                  <Button variant="outline" size="sm" className="min-w-[100px] h-10">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm" className="min-w-[100px] h-10">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};
