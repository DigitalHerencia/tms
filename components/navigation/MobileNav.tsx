'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <div className="flex items-center justify-between px-4 py-2">
          <p className="text-sm font-medium">Theme</p>
        </div>
        <nav className="grid gap-2 text-lg font-medium">
          <Link
            href="/dashboard"
            className="hover:bg-accent hover:text-accent-foreground flex w-full items-center rounded-md px-3 py-2"
            onClick={() => setOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="/dispatch"
            className="hover:bg-accent hover:text-accent-foreground flex w-full items-center rounded-md px-3 py-2"
            onClick={() => setOpen(false)}
          >
            Dispatch
          </Link>
          <Link
            href="/drivers"
            className="hover:bg-accent hover:text-accent-foreground flex w-full items-center rounded-md px-3 py-2"
            onClick={() => setOpen(false)}
          >
            Drivers
          </Link>
          <Link
            href="/vehicles"
            className="hover:bg-accent hover:text-accent-foreground flex w-full items-center rounded-md px-3 py-2"
            onClick={() => setOpen(false)}
          >
            Vehicles
          </Link>
          <Link
            href="/compliance"
            className="hover:bg-accent hover:text-accent-foreground flex w-full items-center rounded-md px-3 py-2"
            onClick={() => setOpen(false)}
          >
            Compliance
          </Link>
          <Link
            href="/compliance/hos-logs"
            className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex w-full items-center rounded-md py-2 pl-6 text-sm"
            onClick={() => setOpen(false)}
          >
            HOS Logs
          </Link>
          <Link
            href="/ifta"
            className="hover:bg-accent hover:text-accent-foreground flex w-full items-center rounded-md px-3 py-2"
            onClick={() => setOpen(false)}
          >
            IFTA
          </Link>
          <Link
            href="/analytics"
            className="hover:bg-accent hover:text-accent-foreground flex w-full items-center rounded-md px-3 py-2"
            onClick={() => setOpen(false)}
          >
            Analytics
          </Link>
          <Link
            href="/settings"
            className="hover:bg-accent hover:text-accent-foreground flex w-full items-center rounded-md px-3 py-2"
            onClick={() => setOpen(false)}
          >
            Settings
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
