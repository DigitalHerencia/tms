import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils/utils';

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

export function PageLayout({ children, className }: PageLayoutProps) {
  return (
    <div
      className={cn(
        'flex min-h-screen flex-col gap-6 p-6 bg-background text-foreground',
        className,
      )}
    >
      {children}
    </div>
  );
}
