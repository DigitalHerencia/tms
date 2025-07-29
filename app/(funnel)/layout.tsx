import type React from 'react';

import { PublicNav } from '@/components/navigation/PublicNav';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicNav />
      <main className="flex-1">{children}</main>
    </div>
  );
}
