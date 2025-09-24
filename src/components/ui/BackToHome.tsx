'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from './button';
import Link from 'next/link';

interface BackToHomeProps {
  variant?: 'button' | 'link';
  className?: string;
  text?: string;
}

export function BackToHome({
  variant = 'button',
  className = '',
  text = 'Back to Home'
}: BackToHomeProps) {
  const router = useRouter();

  if (variant === 'link') {
    return (
      <Link
        href="/"
        className={`inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors ${className}`}
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        {text}
      </Link>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={() => router.push('/')}
      className={className}
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      {text}
    </Button>
  );
}