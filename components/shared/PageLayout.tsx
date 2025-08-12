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
        'mx-auto flex min-h-screen w-full max-w-screen-xl flex-col gap-6 p-4 md:p-6 bg-background text-foreground',
        className,
      )}
    >
      {children}
    </div>
  );
}
