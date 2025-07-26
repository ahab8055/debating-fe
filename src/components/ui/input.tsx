import clsx from 'clsx';
import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => (
    <div className="w-full">
      <div className="relative">
        <input
          ref={ref}
          className={clsx(
            'block rounded-lg px-3 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 dark:text-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 peer transition',
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '',
            className,
          )}
          placeholder=" "
          aria-invalid={!!error}
          {...props}
        />
        {label && (
          <label
            htmlFor={props.id}
            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-3 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
          >
            {label}
          </label>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  ),
);
