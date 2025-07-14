'use client';

import { MapPinned, Menu, User } from 'lucide-react';
import Link from 'next/link';
import { NotificationCenter } from '@/components/shared/NotificationCenter';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface User {
  name: string;
  email: string;
  profileImage: string;
}

interface Organization {
  name: string;
}

const handleLogout = () => {
  // Placeholder for logout logic
  console.log('Logout clicked');
};

interface TopNavBarProps {
  user: User;
  organization: Organization;
}

export function TopNavBar({ user, organization }: TopNavBarProps) {
  return (
    <div className="fixed top-0 right-0 left-0 z-[100] h-16 border-b border-gray-200 bg-black shadow-lg">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center">
          <div>
            <div className="flex flex-1 items-center">
              <Link
                className="flex items-center justify-center underline-offset-4 hover:text-blue-500 hover:underline"
                href="/"
              >
                <MapPinned className="mr-1 h-6 w-6 text-blue-500" />
                <span className="text-2xl font-extrabold text-white dark:text-white">
                  FleetFusion
                </span>
              </Link>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Company Name */}
          <span className="hidden text-xl font-medium text-zinc-200 sm:block">
            {organization.name || ' '}
          </span>
        {/* Notifications */}
          <NotificationCenter />
          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2">
                <Button
                  variant="default"
                  size="sm"
                  className="relative h-7 w-7 rounded-4xl border border-zinc-400 p-0 hover:bg-zinc-900"
                >
                  <Menu className="h-4 w-4 text-gray-400" />
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center p-0 text-xs"
                  ></Badge>
                </Button>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-64 border-gray-700 bg-black p-2"
              align="end"
            >
              <div className="flex items-center gap-3 px-2 py-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.profileImage} alt={user.name} />
                  <AvatarFallback className="bg-gray-600 text-gray-200">
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-sm leading-tight font-semibold text-zinc-200">
                    {user.name}
                  </span>
                  <span className="truncate text-xs text-zinc-200">
                    {user.email}
                  </span>
                  <Badge className="mt-1 bg-blue-500 text-center text-xs text-zinc-200">
                    {organization.name}
                  </Badge>
                </div>
              </div>
              <DropdownMenuSeparator className="bg-gray-600" />
              <DropdownMenuItem className="cursor-pointer rounded-md px-3 py-2 text-zinc-200 transition-colors hover:bg-gray-600">
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer rounded-md px-3 py-2 text-zinc-200 transition-colors hover:bg-gray-600">
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-600" />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer rounded-md px-3 py-2 text-red-400 hover:bg-red-500/10"
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
