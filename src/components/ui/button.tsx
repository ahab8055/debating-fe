'use client';

import React, { forwardRef, JSX } from 'react';

interface IButtonComponent {
  onClick?: () => void;
  type?: 'button' | 'submit';
  color?: string;
  leftIcon?: JSX.Element | JSX.Element[];
  rightIcon?: JSX.Element | JSX.Element[];
  className?: string;
  isFullWidth?: boolean;
  disabled?: boolean;
  children: string | JSX.Element | JSX.Element[];
}

export const Button = forwardRef<HTMLButtonElement, IButtonComponent>((
  {
    isFullWidth = false,
    type = 'button',
    leftIcon,
    rightIcon,
    className = '',
    disabled = false,
    onClick = () => {},
    children,
  },
  ref,
) => {
  let btnClassName = `disabled:cursor-not-allowed disabled:opacity-70 font-semibold text-base not-italic rounded-lg border-solid border box-border flex flex-row items-center justify-center h-10 py-2.5 px-4 gap-2 ${className}`;
  btnClassName += ` ${isFullWidth ? 'w-full' : ''}`;

  return (
    <button ref={ref} className={btnClassName} type={type} onClick={onClick} disabled={disabled}>
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  );
});
