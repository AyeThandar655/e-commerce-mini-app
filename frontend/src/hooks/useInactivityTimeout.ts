'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';

const INACTIVITY_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_INACTIVITY_TIMEOUT || '1800000', 10);

const ACTIVITY_EVENTS = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove', 'click'];

export const useInactivityTimeout = (): void => {
  const { isAuthenticated, logout } = useAuth();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimeout = useCallback((): void => {
    if (!isAuthenticated) {
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      logout().catch(error => {
        console.error('Logout failed:', error);
      });
    }, INACTIVITY_TIMEOUT);
  }, [isAuthenticated, logout]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    resetTimeout();

    const handleActivity = (): void => {
      resetTimeout();
    };

    ACTIVITY_EVENTS.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      ACTIVITY_EVENTS.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [isAuthenticated, resetTimeout]);
};
