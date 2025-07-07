import Image from 'next/image';

import { UserNav } from '@/components/navigation/UserNav';

interface PageHeaderProps {
  className?: string;
}

export function PageHeader({ className }: PageHeaderProps) {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-zinc-200 bg-black">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Image
            src="/white_logo.png"
            alt="FleetFusion Logo"
            width={200}
            height={100}
            priority
            className="dark:invert-0"
          />
        </div>
        <UserNav />
      </div>
    </header>
  );
}
