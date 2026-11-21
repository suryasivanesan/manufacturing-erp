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
      newErrors.identifier = 'Mail ID or Username is required';
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
          : data.message || 'Authentication failed. Please verify your credentials.';
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
      }, 1000);
    } catch (err: any) {
      setServerError(
        err.message || 'Unable to connect to the manufacturing ERP server.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 overflow-hidden">
      {/* Background Decorative Industrial Tech Pattern */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:36px_36px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-600/15 rounded-full blur-3xl" />
      </div>

      {/* Top Floating Header with Dark/Light Mode Switch */}
      <header className="absolute top-6 left-0 right-0 max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between z-20">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25 text-sm sm:text-base font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Manufacturing ERP Portal
          </span>
        </div>

        {/* Dark/Light Mode Toggle Switch */}
        {mounted && (
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme mode"
          >
            {isDark ? (
              <Sun className="w-6 h-6 text-amber-400 transition-transform duration-300 hover:rotate-45" />
            ) : (
              <Moon className="w-6 h-6 text-slate-700 transition-transform duration-300 hover:-rotate-12" />
            )}
          </button>
        )}
      </header>

      {/* Login Card Container (Enlarged with Increased Font Sizes) */}
      <div className="relative w-full max-w-xl z-10 my-16">
        <div className="relative rounded-3xl border border-slate-200/90 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl shadow-2xl p-8 sm:p-10 transition-all duration-300">
          {/* ERP Branding & Title */}
          <div className="text-center mb-9">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/25 mb-4 ring-4 ring-blue-500/10 dark:ring-blue-400/10">
              <Factory className="w-8 h-8 text-white" />
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Manufacturing ERP
            </h1>
            <p className="mt-2 text-base sm:text-lg text-slate-600 dark:text-slate-300">
              Sign in to access plant operations & production data
            </p>
          </div>

          {/* Server Error Alert Banner */}
          {serverError && (
            <div
              className="mb-7 p-4 sm:p-5 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50/90 dark:bg-red-950/40 text-red-700 dark:text-red-300 flex items-start gap-3.5 text-base sm:text-lg animate-fadeIn"
              role="alert"
            >
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1 font-medium leading-relaxed">{serverError}</div>
              <button
                type="button"
                onClick={() => setServerError(null)}
                className="text-red-400 hover:text-red-600 dark:hover:text-red-200 text-base font-bold px-1.5 py-0.5"
                aria-label="Dismiss error"
              >
                ✕
              </button>
            </div>
          )}

          {/* Success Banner */}
          {isSuccess && (
            <div
              className="mb-7 p-4 sm:p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/90 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 flex items-center gap-3.5 text-base sm:text-lg animate-fadeIn"
              role="status"
            >
              <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
              <span className="font-semibold">
                Authentication verified! Redirecting to ERP Dashboard...
              </span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* Mail ID / Username Field */}
            <div className="relative w-full">
              <label
                htmlFor="identifier"
                className="block text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2"
              >
                Mail ID / Username
              </label>
              <div className="relative flex items-center rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/60 backdrop-blur-md focus-within:border-blue-600 dark:focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/20 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all">
                <div className="pl-4 pr-2 text-slate-400 dark:text-slate-500">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  placeholder="name@company.com or username"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (errors.identifier) setErrors((prev) => ({ ...prev, identifier: undefined }));
                  }}
                  disabled={isLoading || isSuccess}
                  className="w-full py-3.5 sm:py-4 pr-4 text-base sm:text-lg font-medium text-slate-900 dark:text-slate-100 bg-transparent placeholder-slate-400 focus:outline-none disabled:opacity-50"
                  autoComplete="username"
                />
              </div>
              {errors.identifier && (
                <p className="mt-2 text-sm sm:text-base font-medium text-red-500 dark:text-red-400 flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
                  {errors.identifier}
                </p>
              )}
            </div>

            {/* Password Field with Eye Toggle */}
            <div className="relative w-full">
              <label
                htmlFor="password"
                className="block text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2"
              >
                Password
              </label>
              <div className="relative flex items-center rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/60 backdrop-blur-md focus-within:border-blue-600 dark:focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/20 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all">
                <div className="pl-4 pr-2 text-slate-400 dark:text-slate-500">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  disabled={isLoading || isSuccess}
                  className="w-full py-3.5 sm:py-4 pr-2 text-base sm:text-lg font-medium text-slate-900 dark:text-slate-100 bg-transparent placeholder-slate-400 focus:outline-none disabled:opacity-50"
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
                <p className="mt-2 text-sm sm:text-base font-medium text-red-500 dark:text-red-400 flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password Row */}
            <div className="flex items-center justify-between text-sm sm:text-base font-medium pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer select-none text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-5 h-5 rounded-md border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500/30 dark:bg-slate-800"
                  disabled={isLoading || isSuccess}
                />
                Remember this device
              </label>

              <Link
                href="/auth/forgot-password"
                className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Primary Sign In Button */}
            <button
              type="submit"
              disabled={isLoading || isSuccess}
              className="w-full mt-3 py-4 px-6 rounded-2xl font-bold text-base sm:text-lg text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 shadow-xl shadow-blue-500/25 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2.5"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 sm:w-6 h-6 animate-spin text-white" />
                  <span>Verifying Credentials...</span>
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle2 className="w-5 h-5 sm:w-6 h-6 text-white" />
                  <span>Authenticated</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5 sm:w-6 h-6" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-sm sm:text-base uppercase">
              <span className="bg-white dark:bg-slate-900 px-4 text-slate-500 dark:text-slate-400 font-bold tracking-wider">
                New Enterprise Setup
              </span>
            </div>
          </div>

          {/* New Company Registration Link / Button */}
          <div>
            <Link
              href="/auth/register"
              className="w-full group flex items-center justify-between p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all duration-200 text-left"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
                    New Company Registration
                  </div>
                  <div className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-0.5">
                    Onboard a manufacturing facility & organization
                  </div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 sm:w-6 h-6 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>

          {/* Bottom Industrial Badge */}
          <div className="mt-7 pt-5 border-t border-slate-200/70 dark:border-slate-800/60 flex items-center justify-center gap-2 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
            <Cpu className="w-4 h-4 sm:w-5 h-5" />
            <span>Industrial IoT & Industry 4.0 Standard Encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
}
