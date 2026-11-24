'use client';

import React, { useState, InputHTMLAttributes } from 'react';

interface FloatingInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightAction?: React.ReactNode;
  containerClassName?: string;
}

export default function FloatingInput({
  id,
  label,
  error,
  leftIcon,
  rightAction,
  value,
  onChange,
  onFocus,
  onBlur,
  placeholder = ' ',
  className = '',
  containerClassName = '',
  type = 'text',
  ...rest
}: FloatingInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value !== undefined && value !== null && String(value).length > 0;

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  const isFloating = isFocused || hasValue;

  return (
    <div className={`relative w-full ${containerClassName}`}>
      <div
        className={`relative flex items-center rounded-lg border bg-white/70 dark:bg-slate-900/60 backdrop-blur-md transition-all duration-200 ${
          error
            ? 'border-red-500/80 focus-within:ring-2 focus-within:ring-red-500/30'
            : isFocused
            ? 'border-blue-600 dark:border-blue-500 ring-2 ring-blue-500/20'
            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
        }`}
      >
        {/* Left Icon */}
        {leftIcon && (
          <div className="pl-3.5 pr-1 text-slate-400 dark:text-slate-500 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}

        {/* Input Wrapper */}
        <div className="relative flex-1">
          <input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={`peer w-full pt-5 pb-1.5 px-3 text-xs sm:text-sm font-normal text-slate-900 dark:text-slate-100 bg-transparent placeholder-transparent focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            {...rest}
          />

          {/* Floating Label */}
          <label
            htmlFor={id}
            className={`absolute left-3 pointer-events-none transition-all duration-200 select-none ${
              isFloating
                ? 'top-1 text-[10px] sm:text-xs font-medium ' +
                  (error
                    ? 'text-red-500 dark:text-red-400'
                    : isFocused
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-slate-500 dark:text-slate-400')
                : 'top-3 text-xs sm:text-sm font-normal text-slate-500 dark:text-slate-400'
            }`}
          >
            {label}
          </label>
        </div>

        {/* Right Action (e.g., Show/Hide Password Eye Button) */}
        {rightAction && (
          <div className="pr-3 pl-1 flex items-center">{rightAction}</div>
        )}
      </div>

      {/* Field Error Message */}
      {error && (
        <p className="mt-1 text-xs font-normal text-red-500 dark:text-red-400 flex items-center gap-1 animate-fadeIn">
          <span className="inline-block w-1 h-1 rounded-full bg-red-500"></span>
          {error}
        </p>
      )}
    </div>
  );
}
