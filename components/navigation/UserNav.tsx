'use client';

import { User } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/components/auth/context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function UserNav() {
  const { user, organization } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    // Using Clerk's signOut from the useClerk hook
    router.push('/login');
  };

  if (!user || !organization) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="border-border focus:ring-primary/50 relative flex h-10 w-10 items-center justify-center rounded-full border bg-black shadow-sm transition-all hover:shadow-lg focus:ring-2 focus:outline-none"
            aria-label="Open user menu"
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src="/black_logo.png" alt={user.name} />
              <AvatarFallback>
                <User className="text-muted-foreground h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            {/* Status dot */}
            <span className="border-background absolute right-0 bottom-0 block h-2.5 w-2.5 rounded-full border-2 bg-green-500" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 p-2" align="end" forceMount>
          <div className="flex items-center gap-3 px-2 py-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/black_logo.png" alt={user.name} />
              <AvatarFallback>
                <User className="text-muted-foreground h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm leading-tight font-semibold">
                {user.name}
              </span>
              <span className="text-muted-foreground truncate text-xs">
                {user.email}
              </span>
              <span className="bg-accent text-accent-foreground mt-1 inline-block rounded px-2 py-0.5 text-xs font-medium">
                {organization.name}
              </span>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="hover:bg-accent/60 cursor-pointer rounded-md px-3 py-2 transition-colors">
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-accent/60 cursor-pointer rounded-md px-3 py-2 transition-colors">
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="text-destructive hover:bg-destructive/10 cursor-pointer rounded-md px-3 py-2"
          >
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
