'use client';

import React, { useState, FormEvent } from 'react';
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
  Cpu,
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import FloatingInput from './FloatingInput';
import { LoginResponse } from '../../types/auth';

export default function LoginPage() {
  const router = useRouter();

  // Form State
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Validation & Feedback State
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Validate form fields
  const validateForm = (): boolean => {
    const newErrors: { identifier?: string; password?: string } = {};

    // Validate Identifier (Email or Username)
    const trimmedId = identifier.trim();
    if (!trimmedId) {
      newErrors.identifier = 'Mail ID or Username is required';
    } else if (trimmedId.includes('@')) {
      // Basic email regex validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedId)) {
        newErrors.identifier = 'Please provide a valid email address';
      }
    } else {
      // Username validation: min 3 alphanumeric/underscore characters
      if (trimmedId.length < 3) {
        newErrors.identifier = 'Username must contain at least 3 characters';
      }
    }

    // Validate Password
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Form Submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: identifier.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle NestJS error response formats (string or array of messages)
        const errorMessage = Array.isArray(data.message)
          ? data.message.join(', ')
          : data.message || 'Authentication failed. Please verify your credentials.';
        throw new Error(errorMessage);
      }

      const loginResult = data as LoginResponse;

      const isDeveloper =
        (loginResult.user as any)?.role === 'DEVELOPER' ||
        identifier.trim().toLowerCase() === 'erp@devel.com';

      // Store token (or rely on HttpOnly cookie if configured in backend)
      if (loginResult.accessToken) {
        localStorage.setItem('access_token', loginResult.accessToken);
        if (isDeveloper) {
          localStorage.setItem('developer_token', loginResult.accessToken);
        }
        if (loginResult.user) {
          localStorage.setItem('auth_user', JSON.stringify(loginResult.user));
        }
      }

      setIsSuccess(true);

      // Redirect to Developer or ERP Dashboard
      setTimeout(() => {
        if (isDeveloper) {
          router.push('/developer/dashboard');
        } else {
          router.push('/dashboard');
        }
      }, 1000);
    } catch (err: any) {
      setServerError(
        err.message || 'Unable to connect to the manufacturing authentication service.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 overflow-hidden">
      {/* Background Industrial Decorative Accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        
        {/* Ambient Gradient Glows */}
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-600/15 rounded-full blur-3xl" />
      </div>

      {/* Top Floating Controls Bar */}
      <header className="absolute top-6 left-0 right-0 max-w-7xl mx-auto px-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            ERP Gateway Active
          </span>
        </div>

        {/* Floating Dark / Light Mode Switch */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </header>

      {/* Main Login Card Container */}
      <div className="relative w-full max-w-md z-10 my-12">
        <div className="relative rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl p-6 sm:p-8 transition-all duration-300 hover:shadow-blue-500/5">
          {/* Header Branding */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 mb-3 ring-4 ring-blue-500/10 dark:ring-blue-400/10">
              <Factory className="w-6 h-6 text-white" />
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Manufacturing ERP
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Sign in to manage plant operations & resources
            </p>
          </div>

          {/* Server Error Alert Banner */}
          {serverError && (
            <div
              className="mb-5 p-3 rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50/80 dark:bg-red-950/40 text-red-700 dark:text-red-300 flex items-start gap-2.5 text-xs sm:text-sm animate-fadeIn"
              role="alert"
            >
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1 text-xs sm:text-sm">{serverError}</div>
              <button
                type="button"
                onClick={() => setServerError(null)}
                className="text-red-400 hover:text-red-600 dark:hover:text-red-200 text-xs font-bold px-1"
                aria-label="Dismiss error"
              >
                ✕
              </button>
            </div>
          )}

          {/* Success Banner */}
          {isSuccess && (
            <div
              className="mb-5 p-3 rounded-lg border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 flex items-center gap-2.5 text-xs sm:text-sm animate-fadeIn"
              role="status"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium">
                Authentication verified! Directing to operational dashboard...
              </span>
            </div>
          )}

          {/* Authentication Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Mail ID / Username Field */}
            <FloatingInput
              id="identifier"
              name="identifier"
              type="text"
              label="Mail ID / Username"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                if (errors.identifier) {
                  setErrors((prev) => ({ ...prev, identifier: undefined }));
                }
              }}
              error={errors.identifier}
              leftIcon={<Mail className="w-4 h-4" />}
              autoComplete="username"
              disabled={isLoading || isSuccess}
            />

            {/* Password Field with Eye Toggle */}
            <FloatingInput
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              label="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) {
                  setErrors((prev) => ({ ...prev, password: undefined }));
                }
              }}
              error={errors.password}
              leftIcon={<Lock className="w-4 h-4" />}
              autoComplete="current-password"
              disabled={isLoading || isSuccess}
              rightAction={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none p-1 rounded-md"
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              }
            />

            {/* Options: Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500/30 dark:bg-slate-800"
                  disabled={isLoading || isSuccess}
                />
                Remember this terminal
              </label>

              <Link
                href="/auth/forgot-password"
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Primary Sign In Button */}
            <button
              type="submit"
              disabled={isLoading || isSuccess}
              className="w-full mt-2 py-2.5 px-4 rounded-lg font-semibold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 shadow-sm shadow-blue-500/25 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Verifying Credentials...</span>
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Authenticated</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Visual Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 dark:text-slate-500 font-medium">
                New Enterprise Setup
              </span>
            </div>
          </div>

          {/* Secondary Action: New Company Registration Navigation */}
          <div>
            <Link
              href="/auth/register"
              className="w-full group flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all duration-200 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    New Company Registration
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Register a manufacturing organization & plant facility
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
            </Link>
          </div>

          {/* Bottom Security Footer */}
          <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
            <Cpu className="w-3.5 h-3.5" />
            <span>Industrial IoT & Industry 4.0 Standard Encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
}
