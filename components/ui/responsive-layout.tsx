'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface ResponsiveLayoutProps {
  children: ReactNode;
  mobileLayout?: 'stack' | 'scroll' | 'sheet';
  className?: string;
  mobileClassName?: string;
  desktopClassName?: string;
}

export function ResponsiveLayout({
  children,
  mobileLayout = 'stack',
  className,
  mobileClassName,
  desktopClassName,
}: ResponsiveLayoutProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    const mobileLayoutClass = {
      stack: 'flex flex-col space-y-4',
      scroll: 'flex overflow-x-auto space-x-4 pb-4',
      sheet: 'flex flex-col',
    }[mobileLayout];

    return <div className={cn(mobileLayoutClass, mobileClassName, className)}>{children}</div>;
  }

  return <div className={cn('grid gap-6', desktopClassName, className)}>{children}</div>;
}

interface MobileCardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
}

export function MobileCard({ children, title, subtitle, className }: MobileCardProps) {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <div className={cn('bg-card border rounded-lg p-4 shadow-sm', className)}>
      {title && (
        <div className="mb-3 pb-2 border-b">
          <h3 className="font-semibold text-base">{title}</h3>
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
