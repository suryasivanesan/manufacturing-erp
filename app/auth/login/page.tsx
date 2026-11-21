'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Factory,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building2,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Sun,
  Moon,
  Cpu,
  Layers,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  // Dark / Light Mode State (strictly defaults to Light)
  const [isDark, setIsDark] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  // Form State
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Status and Validation State
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Strictly initialize to Light theme unless 'dark' is explicitly stored in localStorage
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
      if (!savedTheme) {
        localStorage.setItem('theme', 'light');
      }
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);

    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Validate form fields on the client
  const validateForm = (): boolean => {
    const newErrors: { identifier?: string; password?: string } = {};
    const trimmedId = identifier.trim();

    if (!trimmedId) {
      newErrors.identifier = 'Corporate email or username is required';
    } else if (trimmedId.includes('@')) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedId)) {
        newErrors.identifier = 'Please provide a valid email address';
      }
    } else if (trimmedId.length < 3) {
      newErrors.identifier = 'Username must contain at least 3 characters';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: identifier.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = Array.isArray(data.message)
          ? data.message.join(', ')
          : data.message || 'Authentication failed. Please check your credentials.';
        throw new Error(errorMsg);
      }

      if (data.accessToken) {
        localStorage.setItem('access_token', data.accessToken);
        if (data.user) {
          localStorage.setItem('auth_user', JSON.stringify(data.user));
        }
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 800);
    } catch (err: any) {
      setServerError(
        err.message || 'Unable to connect to the manufacturing ERP server.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Background Subtle Tech Grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-60 dark:opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Top Header with Portal Badge and Theme Switcher */}
      <header className="absolute top-6 left-0 right-0 max-w-6xl mx-auto px-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-base font-bold text-slate-700 dark:text-slate-300">
              Manufacturing ERP Portal
            </span>
          </div>
        </div>

        {/* Theme Toggle Button */}
        {mounted && (
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme mode"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600" />
            )}
          </button>
        )}
      </header>

      {/* Main Centered Authentication Card */}
      <div className="relative w-full max-w-lg z-10 my-16">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none p-8 sm:p-10 transition-all">
          {/* Brand Logo & Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/30 mb-4">
              <Factory className="w-8 h-8" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Manufacturing ERP
            </h1>
            <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
              Sign in to manage plant operations &amp; workforce roles
            </p>
          </div>

          {/* Error Banner */}
          {serverError && (
            <div
              className="mb-6 p-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 flex items-start gap-3 text-base"
              role="alert"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1 font-medium leading-relaxed">{serverError}</div>
              <button
                type="button"
                onClick={() => setServerError(null)}
                className="text-red-400 hover:text-red-600 dark:hover:text-red-200 font-bold"
                aria-label="Dismiss error"
              >
                ✕
              </button>
            </div>
          )}

          {/* Success Banner */}
          {isSuccess && (
            <div
              className="mb-6 p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 flex items-center gap-3 text-base"
              role="status"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <span className="font-semibold">
                Credentials verified! Loading ERP Dashboard...
              </span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Identifier Input */}
            <div>
              <label
                htmlFor="identifier"
                className="block text-base font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
              >
                Corporate Email or Username
              </label>
              <div className="relative flex items-center rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                <div className="pl-4 pr-2 text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  placeholder="Enter corporate email or username"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (errors.identifier) setErrors((prev) => ({ ...prev, identifier: undefined }));
                  }}
                  disabled={isLoading || isSuccess}
                  className="w-full py-3.5 pr-4 text-base font-medium text-slate-900 dark:text-slate-100 bg-transparent placeholder-slate-400 focus:outline-none disabled:opacity-50"
                  autoComplete="username"
                />
              </div>
              {errors.identifier && (
                <p className="mt-1.5 text-sm font-medium text-red-500 dark:text-red-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  {errors.identifier}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-base font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
              >
                Password
              </label>
              <div className="relative flex items-center rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                <div className="pl-4 pr-2 text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  disabled={isLoading || isSuccess}
                  className="w-full py-3.5 pr-2 text-base font-medium text-slate-900 dark:text-slate-100 bg-transparent placeholder-slate-400 focus:outline-none disabled:opacity-50"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="pr-4 pl-2 py-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-sm font-medium text-red-500 dark:text-red-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me & Help Links */}
            <div className="flex items-center justify-between text-base pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer select-none text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 dark:bg-slate-800"
                  disabled={isLoading || isSuccess}
                />
                Remember me
              </label>

              <span className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 cursor-pointer">
                Forgot password?
              </span>
            </div>

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={isLoading || isSuccess}
              className="w-full mt-2 py-3.5 px-6 rounded-xl font-bold text-base sm:text-lg text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 shadow-md shadow-blue-600/20 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150 flex items-center justify-center gap-2.5"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                  <span>Verifying Credentials...</span>
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-white" />
                  <span>Access Granted</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white dark:bg-slate-900 px-4 text-slate-400 font-bold uppercase tracking-wider">
                Enterprise Onboarding
              </span>
            </div>
          </div>

          {/* New Company Registration Card */}
          <Link
            href="/auth/register"
            className="group flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-all text-left"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-base font-bold text-slate-800 dark:text-slate-100">
                  New Company Registration
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Register a manufacturing facility &amp; configure sector
                </div>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
          </Link>

          {/* Security & Multi-Tenancy Badge */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-center gap-2 text-xs sm:text-sm font-medium text-slate-400">
            <Cpu className="w-4 h-4" />
            <span>Strict Multi-Tenant Isolation &bull; End-to-End Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
}
