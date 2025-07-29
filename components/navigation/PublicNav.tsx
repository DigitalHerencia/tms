'use client';
import Link from 'next/link';
import { MapPinned } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function PublicNav() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-black px-4 lg:px-6 dark:bg-black">
      <div className="flex flex-1 items-center">
        <Link
          className="flex items-center justify-center underline-offset-4 hover:text-blue-500 hover:underline"
          href="/"
        >
          <MapPinned className="mr-1 h-6 w-6 text-blue-500" />
          <span className="text-2xl font-extrabold text-white dark:text-white">FleetFusion</span>
        </Link>
      </div>
      <nav className="flex items-center gap-6 text-white">
        <Link
          className="text-sm font-medium underline-offset-4 hover:text-blue-500 hover:underline"
          href="/features"
        >
          Features
        </Link>
        <Link
          className="text-sm font-medium underline-offset-4 hover:text-blue-500 hover:underline"
          href="/pricing"
        >
          Pricing
        </Link>
        <Link
          className="text-sm font-medium underline-offset-4 hover:text-blue-500 hover:underline"
          href="/about"
        >
          About
        </Link>
        <Button asChild className="bg-blue-500 text-sm font-medium text-white hover:bg-blue-800">
          <Link href="/sign-in">Sign In</Link>
        </Button>
      </nav>
    </header>
  );
}
