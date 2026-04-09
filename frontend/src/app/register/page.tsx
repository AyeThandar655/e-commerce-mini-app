'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { isValidEmail } from '@/lib/utils';
import type { RegisterCredentials } from '@/types/auth';

interface Errors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export default function RegisterPage(): React.ReactElement {
  const router = useRouter();
  const { isAuthenticated, register, isLoading } = useAuth();

  const [credentials, setCredentials] = useState<RegisterCredentials & { confirmPassword: string }>(
    {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    }
  );
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    if (!credentials.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (credentials.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!credentials.email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(credentials.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!credentials.password) {
      newErrors.password = 'Password is required';
    } else if (credentials.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!credentials.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (credentials.password !== credentials.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const { confirmPassword: _confirmPassword, ...registerData } = credentials;
      await register(registerData);
      router.push('/');
    } catch {
      setErrors({
        general: 'Registration failed. Please try again or contact support.',
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof Errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Create Account</h1>
          <p className="text-gray-600 text-center mb-8">
            Sign up to start shopping and enjoy exclusive offers
          </p>

          <form
            onSubmit={e => {
              void handleSubmit(e);
            }}
            noValidate
            className="space-y-6"
          >
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-sm">
                {errors.general}
              </div>
            )}

            <Input
              id="name"
              type="text"
              name="name"
              label="Full Name"
              value={credentials.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="John Doe"
              disabled={isLoading}
              autoComplete="name"
              required
            />

            <Input
              id="email"
              type="email"
              name="email"
              label="Email Address"
              value={credentials.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="john@example.com"
              disabled={isLoading}
              autoComplete="email"
              required
            />

            <Input
              id="password"
              type="password"
              name="password"
              label="Password"
              value={credentials.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="••••••"
              disabled={isLoading}
              autoComplete="new-password"
              helperText="At least 6 characters"
              required
            />

            <Input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              label="Confirm Password"
              value={credentials.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              placeholder="••••••"
              disabled={isLoading}
              autoComplete="new-password"
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
              disabled={isLoading}
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                Sign in here
              </Link>
            </p>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200 text-sm text-blue-900">
            <p className="font-semibold mb-2">By creating an account, you agree to our:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Terms of Service</li>
              <li>Privacy Policy</li>
              <li>Data Protection Agreement</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
