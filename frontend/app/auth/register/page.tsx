'use client';

import React, { useState, useEffect, FormEvent, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Factory,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Scale,
  Layers,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Sun,
  Moon,
  Cpu,
  MapPin,
  FileCheck2,
} from 'lucide-react';
import {
  INDUSTRY_CLASSIFICATIONS,
  IndustryClassification,
  IndustrySectorMeta,
} from '../../../types/industry';

export default function RegisterCompanyPage() {
  const router = useRouter();

  // Theme Management (Strictly defaults to Light)
  const [isDark, setIsDark] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  // Form State
  const [companyName, setCompanyName] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');

  // Industry Classification State
  const [industryCategory, setIndustryCategory] = useState(INDUSTRY_CLASSIFICATIONS[0].name);
  const [subCategory, setSubCategory] = useState(INDUSTRY_CLASSIFICATIONS[0].sectors[0].name);
  const [defaultUnit, setDefaultUnit] = useState(INDUSTRY_CLASSIFICATIONS[0].sectors[0].defaultUnit);

  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const activeCategory = useMemo(() => {
    return INDUSTRY_CLASSIFICATIONS.find((cat) => cat.name === industryCategory) || INDUSTRY_CLASSIFICATIONS[0];
  }, [industryCategory]);

  const activeSector = useMemo(() => {
    return activeCategory.sectors.find((sec) => sec.name === subCategory) || activeCategory.sectors[0];
  }, [activeCategory, subCategory]);

  const handleCategoryChange = (newCategoryName: string) => {
    setIndustryCategory(newCategoryName);
    const targetCategory = INDUSTRY_CLASSIFICATIONS.find((c) => c.name === newCategoryName) || INDUSTRY_CLASSIFICATIONS[0];
    const initialSector = targetCategory.sectors[0];
    setSubCategory(initialSector.name);
    setDefaultUnit(initialSector.defaultUnit);
  };

  const handleSubCategoryChange = (newSubCategoryName: string) => {
    setSubCategory(newSubCategoryName);
    const sector = activeCategory.sectors.find((s) => s.name === newSubCategoryName);
    if (sector) {
      setDefaultUnit(sector.defaultUnit);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!companyName.trim()) {
      newErrors.companyName = 'Company / Enterprise Name is required';
    } else if (companyName.trim().length < 2) {
      newErrors.companyName = 'Company Name must be at least 2 characters';
    }

    const cleanGst = gstNumber.trim().toUpperCase();
    if (!cleanGst) {
      newErrors.gstNumber = 'GST Number is required';
    } else if (!/^[A-Z0-9]+$/.test(cleanGst)) {
      newErrors.gstNumber = 'GST Number must contain only letters and numbers';
    }

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      newErrors.email = 'Official corporate email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanEmail)) {
        newErrors.email = 'Please provide a valid email address';
      }
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (!industryCategory) {
      newErrors.industryCategory = 'Industry Category selection is required';
    }

    if (!subCategory) {
      newErrors.subCategory = 'Sub-Category sector is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: companyName.trim(),
          gstNumber: gstNumber.trim().toUpperCase(),
          email: email.trim().toLowerCase(),
          username: username.trim() || undefined,
          password,
          industryCategory,
          subCategory,
          defaultUnit,
          phone: phone.trim() || undefined,
          city: city.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = Array.isArray(data.message)
          ? data.message.join(', ')
          : data.message || 'Registration failed. Please review the form values.';
        throw new Error(errorMsg);
      }

      setIsSuccess(true);

      setTimeout(() => {
        router.push('/auth/login');
      }, 1500);
    } catch (err: any) {
      setServerError(
        err.message || 'Unable to connect to the manufacturing ERP server.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 overflow-x-hidden">
      {/* Background Decorative Tech Pattern */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:36px_36px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-600/15 rounded-full blur-3xl" />
      </div>

      {/* Top Floating Header with Theme Toggle */}
      <header className="absolute top-6 left-0 right-0 max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between z-20">
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Login</span>
        </Link>

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

      {/* Main Registration Card */}
      <div className="relative w-full max-w-3xl z-10 my-16">
        <div className="relative rounded-3xl border border-slate-200/90 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl shadow-2xl p-8 sm:p-12 transition-all duration-300">
          {/* Header Branding */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/25 mb-4 ring-4 ring-blue-500/10 dark:ring-blue-400/10">
              <Building2 className="w-8 h-8 text-white" />
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              New Company Registration
            </h1>
            <p className="mt-2 text-base sm:text-lg text-slate-600 dark:text-slate-300">
              Onboard your manufacturing enterprise with industry classification & default units
            </p>
          </div>

          {/* Server Error Alert Banner */}
          {serverError && (
            <div
              className="mb-8 p-4 sm:p-5 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50/90 dark:bg-red-950/40 text-red-700 dark:text-red-300 flex items-start gap-3.5 text-base sm:text-lg animate-fadeIn"
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
              className="mb-8 p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/90 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 flex items-center gap-3.5 text-base sm:text-lg animate-fadeIn"
              role="status"
            >
              <CheckCircle2 className="w-7 h-7 text-emerald-500 flex-shrink-0" />
              <div>
                <span className="font-bold">Enterprise Registered Successfully!</span>
                <p className="text-sm sm:text-base font-medium mt-0.5 text-emerald-700 dark:text-emerald-400">
                  Redirecting you to the authentication login terminal...
                </p>
              </div>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-7">
            {/* Section 1: Enterprise Identity */}
            <div className="space-y-5">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                <Factory className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                  1. Company & Identity Verification
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Company Name */}
                <div className="relative w-full">
                  <label
                    htmlFor="companyName"
                    className="block text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2"
                  >
                    Company / Plant Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/60 backdrop-blur-md focus-within:border-blue-600 dark:focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/20 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all">
                    <div className="pl-4 pr-2 text-slate-400 dark:text-slate-500">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <input
                      id="companyName"
                      name="companyName"
                      type="text"
                      placeholder="e.g. Apex Steel & Alloys Pvt Ltd"
                      value={companyName}
                      onChange={(e) => {
                        setCompanyName(e.target.value);
                        if (errors.companyName) setErrors((prev) => ({ ...prev, companyName: '' }));
                      }}
                      disabled={isLoading || isSuccess}
                      className="w-full py-3.5 sm:py-4 pr-4 text-base sm:text-lg font-medium text-slate-900 dark:text-slate-100 bg-transparent placeholder-slate-400 focus:outline-none disabled:opacity-50"
                    />
                  </div>
                  {errors.companyName && (
                    <p className="mt-2 text-sm sm:text-base font-medium text-red-500 dark:text-red-400 flex items-center gap-1.5">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
                      {errors.companyName}
                    </p>
                  )}
                </div>

                {/* GST Number */}
                <div className="relative w-full">
                  <label
                    htmlFor="gstNumber"
                    className="block text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2"
                  >
                    GST Number (GSTIN) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/60 backdrop-blur-md focus-within:border-blue-600 dark:focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/20 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all">
                    <div className="pl-4 pr-2 text-slate-400 dark:text-slate-500">
                      <FileCheck2 className="w-5 h-5" />
                    </div>
                    <input
                      id="gstNumber"
                      name="gstNumber"
                      type="text"
                      placeholder="e.g. 27AAAAA0000A1Z5"
                      value={gstNumber}
                      onChange={(e) => {
                        setGstNumber(e.target.value.toUpperCase());
                        if (errors.gstNumber) setErrors((prev) => ({ ...prev, gstNumber: '' }));
                      }}
                      disabled={isLoading || isSuccess}
                      className="w-full py-3.5 sm:py-4 pr-4 text-base sm:text-lg font-medium tracking-wide uppercase text-slate-900 dark:text-slate-100 bg-transparent placeholder-slate-400 focus:outline-none disabled:opacity-50"
                    />
                  </div>
                  {errors.gstNumber && (
                    <p className="mt-2 text-sm sm:text-base font-medium text-red-500 dark:text-red-400 flex items-center gap-1.5">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
                      {errors.gstNumber}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Industry Classification & Unit Mapping */}
            <div className="space-y-5 pt-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                  2. Industry Classification & Unit Mapping
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Industry Category Dropdown */}
                <div className="relative w-full">
                  <label
                    htmlFor="industryCategory"
                    className="block text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2"
                  >
                    Industry Category <span className="text-red-500">*</span>
                  </label>
                  <div className="relative rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/60 backdrop-blur-md focus-within:border-blue-600 dark:focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/20 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all">
                    <select
                      id="industryCategory"
                      value={industryCategory}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      disabled={isLoading || isSuccess}
                      className="w-full py-3.5 sm:py-4 px-4 text-base sm:text-lg font-medium text-slate-900 dark:text-slate-100 bg-transparent focus:outline-none cursor-pointer disabled:opacity-50"
                    >
                      {INDUSTRY_CLASSIFICATIONS.map((cat, idx) => (
                        <option
                          key={cat.id}
                          value={cat.name}
                          className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 py-2"
                        >
                          {idx + 1}. {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Sub-Category Sector Dropdown (Dynamically Filtered) */}
                <div className="relative w-full">
                  <label
                    htmlFor="subCategory"
                    className="block text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2"
                  >
                    Sub-Category / Manufacturing Sector <span className="text-red-500">*</span>
                  </label>
                  <div className="relative rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/60 backdrop-blur-md focus-within:border-blue-600 dark:focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/20 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all">
                    <select
                      id="subCategory"
                      value={subCategory}
                      onChange={(e) => handleSubCategoryChange(e.target.value)}
                      disabled={isLoading || isSuccess}
                      className="w-full py-3.5 sm:py-4 px-4 text-base sm:text-lg font-medium text-slate-900 dark:text-slate-100 bg-transparent focus:outline-none cursor-pointer disabled:opacity-50"
                    >
                      {activeCategory.sectors.map((sec) => (
                        <option
                          key={sec.name}
                          value={sec.name}
                          className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 py-2"
                        >
                          {sec.name} ({sec.defaultUnit})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Automatic Unit Mapping Live Preview Card */}
              <div className="p-4 sm:p-5 rounded-2xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/70 dark:bg-blue-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/30">
                    <Scale className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm uppercase tracking-wider font-bold text-blue-700 dark:text-blue-300">
                      Configured Production & Inventory Unit
                    </div>
                    <div className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                      {activeSector.unitLabel}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                      Applied to raw materials & finished goods ({activeSector.examples})
                    </div>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 text-sm sm:text-base font-bold text-blue-700 dark:text-blue-300 self-start sm:self-center shadow-sm">
                  <span>Standard Unit:</span>
                  <span className="font-mono text-base sm:text-lg font-black text-blue-600 dark:text-blue-400">
                    {defaultUnit}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 3: Credentials & Access */}
            <div className="space-y-5 pt-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                  3. Administrator Credentials
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Corporate Email */}
                <div className="relative w-full">
                  <label
                    htmlFor="email"
                    className="block text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2"
                  >
                    Corporate Email ID <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/60 backdrop-blur-md focus-within:border-blue-600 dark:focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/20 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all">
                    <div className="pl-4 pr-2 text-slate-400 dark:text-slate-500">
                      <Mail className="w-5 h-5" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="admin@yourcompany.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                      }}
                      disabled={isLoading || isSuccess}
                      className="w-full py-3.5 sm:py-4 pr-4 text-base sm:text-lg font-medium text-slate-900 dark:text-slate-100 bg-transparent placeholder-slate-400 focus:outline-none disabled:opacity-50"
                      autoComplete="email"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm sm:text-base font-medium text-red-500 dark:text-red-400 flex items-center gap-1.5">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="relative w-full">
                  <label
                    htmlFor="password"
                    className="block text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2"
                  >
                    Admin Password <span className="text-red-500">*</span>
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
                        if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                      }}
                      disabled={isLoading || isSuccess}
                      className="w-full py-3.5 sm:py-4 pr-2 text-base sm:text-lg font-medium text-slate-900 dark:text-slate-100 bg-transparent placeholder-slate-400 focus:outline-none disabled:opacity-50"
                      autoComplete="new-password"
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
              </div>

              {/* Optional Username & City Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Optional Username */}
                <div className="relative w-full">
                  <label
                    htmlFor="username"
                    className="block text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2"
                  >
                    Username <span className="text-xs text-slate-500 font-normal">(Optional)</span>
                  </label>
                  <div className="relative flex items-center rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/60 backdrop-blur-md focus-within:border-blue-600 dark:focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/20 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all">
                    <div className="pl-4 pr-2 text-slate-400 dark:text-slate-500">
                      <User className="w-5 h-5" />
                    </div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="e.g. apex_superadmin"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={isLoading || isSuccess}
                      className="w-full py-3.5 sm:py-4 pr-4 text-base sm:text-lg font-medium text-slate-900 dark:text-slate-100 bg-transparent placeholder-slate-400 focus:outline-none disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Optional City */}
                <div className="relative w-full">
                  <label
                    htmlFor="city"
                    className="block text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2"
                  >
                    Plant Location / City <span className="text-xs text-slate-500 font-normal">(Optional)</span>
                  </label>
                  <div className="relative flex items-center rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/60 backdrop-blur-md focus-within:border-blue-600 dark:focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/20 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all">
                    <div className="pl-4 pr-2 text-slate-400 dark:text-slate-500">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      placeholder="e.g. Pune, Maharashtra"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      disabled={isLoading || isSuccess}
                      className="w-full py-3.5 sm:py-4 pr-4 text-base sm:text-lg font-medium text-slate-900 dark:text-slate-100 bg-transparent placeholder-slate-400 focus:outline-none disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading || isSuccess}
                className="w-full py-4 px-6 rounded-2xl font-bold text-base sm:text-lg text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 shadow-xl shadow-blue-500/25 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2.5"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 sm:w-6 h-6 animate-spin text-white" />
                    <span>Registering Enterprise Facility...</span>
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 sm:w-6 h-6 text-white" />
                    <span>Registration Successful</span>
                  </>
                ) : (
                  <>
                    <Building2 className="w-5 h-5 sm:w-6 h-6" />
                    <span>Create Account & Register Enterprise</span>
                    <ArrowRight className="w-5 h-5 sm:w-6 h-6 ml-1" />
                  </>
                )}
              </button>
            </div>

            {/* Footer Navigation */}
            <div className="text-center pt-2">
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                Already registered your enterprise?{' '}
                <Link
                  href="/auth/login"
                  className="font-bold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors inline-flex items-center gap-1"
                >
                  Sign in here
                </Link>
              </p>
            </div>

            {/* Bottom Industrial Badge */}
            <div className="pt-4 border-t border-slate-200/70 dark:border-slate-800/60 flex items-center justify-center gap-2 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
              <Cpu className="w-4 h-4 sm:w-5 h-5" />
              <span>GSTIN Verified • Multi-Tenant Enterprise Encryption • Industry 4.0</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
