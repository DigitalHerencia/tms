'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Home,
  Truck,
  Users,
  ClipboardList,
  FileText,
  BarChart2,
  Settings,
  ChevronLeft,
  ChevronRight,
  Activity,
  LogOut,
} from 'lucide-react';
import { useClerk } from '@clerk/nextjs';

import { cn } from '@/lib/utils/utils';
import { useUserContext } from '@/components/auth/context';
import { SystemRoles, type SystemRole } from '@/types/abac';

// ── 1) Context + hook for collapse state ───────────────────────────
const SidebarCollapsedContext = React.createContext<boolean>(false);
export const useSidebarCollapsed = () =>
  React.useContext(SidebarCollapsedContext);

// ── 2) Props interface ──────────────────────────────────────────────
export interface MainNavProps {
  className?: string;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  orgId: string;
  userId: string;
}

// ── 3) MainNav component ────────────────────────────────────────────
export function MainNav({
  className,
  collapsed,
  setCollapsed,
  orgId,
  userId,
}: MainNavProps) {
  const { signOut } = useClerk();
  const user = useUserContext();
  const userRole: SystemRole = user?.role || SystemRoles.MEMBER;

  // Navigation links
  const navLinks = [
    {
      key: 'dashboard',
      href: `/${orgId}/dashboard/${userId}`,
      label: 'Dashboard',
      icon: <Home className="h-5 w-5" />,
      roles: [
        SystemRoles.ADMIN,
        SystemRoles.DISPATCHER,
        SystemRoles.DRIVER,
        SystemRoles.COMPLIANCE,
        SystemRoles.MEMBER,
      ],
    },
    {
      key: 'dispatch',
      href: `/${orgId}/dispatch/${userId}`,
      label: 'Dispatch',
      icon: <ClipboardList className="h-5 w-5" />,
      roles: [
        SystemRoles.ADMIN,
        SystemRoles.DISPATCHER,
        SystemRoles.DRIVER,
        SystemRoles.COMPLIANCE,
        SystemRoles.MEMBER,
      ],
    },
    {
      key: 'drivers',
      href: `/${orgId}/drivers`,
      label: 'Drivers',
      icon: <Users className="h-5 w-5" />,
      roles: [
        SystemRoles.ADMIN,
        SystemRoles.DISPATCHER,
        SystemRoles.DRIVER,
        SystemRoles.COMPLIANCE,
        SystemRoles.MEMBER,
      ],
    },
    {
      key: 'vehicles',
      href: `/${orgId}/vehicles`,
      label: 'Vehicles',
      icon: <Truck className="h-5 w-5" />,
      roles: [
        SystemRoles.ADMIN,
        SystemRoles.DISPATCHER,
        SystemRoles.DRIVER,
        SystemRoles.COMPLIANCE,
        SystemRoles.MEMBER,
      ],
    },
    {
      key: 'compliance',
      href: `/${orgId}/compliance/${userId}`,
      label: 'Compliance',
      icon: <FileText className="h-5 w-5" />,
      roles: [
        SystemRoles.ADMIN,
        SystemRoles.DISPATCHER,
        SystemRoles.DRIVER,
        SystemRoles.COMPLIANCE,
        SystemRoles.MEMBER,
      ],
    },
    {
      key: 'ifta',
      href: `/${orgId}/ifta`,
      label: 'IFTA',
      icon: <Activity className="h-5 w-5" />,
      roles: [SystemRoles.ADMIN, SystemRoles.MEMBER],
    },
    {
      key: 'analytics',
      href: `/${orgId}/analytics`,
      label: 'Analytics',
      icon: <BarChart2 className="h-5 w-5" />,
      roles: [SystemRoles.ADMIN, SystemRoles.MEMBER],
    },
    {
      key: 'settings',
      href: `/${orgId}/settings`,
      label: 'Settings',
      icon: <Settings className="h-5 w-5" />,
      roles: [
        SystemRoles.ADMIN,
        SystemRoles.DISPATCHER,
        SystemRoles.DRIVER,
        SystemRoles.COMPLIANCE,
        SystemRoles.MEMBER,
      ],
    },
    {
      key: 'signout',
      href: '#',
      label: 'Sign Out',
      icon: <LogOut className="h-5 w-5" />,
      onClick: async (e: React.MouseEvent) => {
        e.preventDefault();
        await signOut({ redirectUrl: '/' });
      },
    },
  ];

  const visibleLinks = navLinks.filter(
    (link) => !link.roles || link.roles.includes(userRole)
  );

  return (
    // ── wrap in our provider so child components can call useSidebarCollapsed()
    <SidebarCollapsedContext.Provider value={collapsed}>
      <aside
        className={cn(
          'fixed top-16 bottom-0 left-0 z-40 flex flex-col border-r border-gray-200 bg-blue-500/60 shadow-xl transition-all duration-300 ease-in-out',
          collapsed ? 'w-20' : 'w-64',
          className
        )}
        data-collapsed={collapsed}
      >
        <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
          {/* Navigation Links */}
          <nav className="mt-6 flex-1 space-y-4 px-8 py-4">
            {visibleLinks.map((link) =>
              link.key === 'signout' ? (
                <SidebarLink
                  key={link.key}
                  href={link.href}
                  icon={link.icon}
                  collapsed={collapsed}
                  onClick={link.onClick}
                >
                  {link.label}
                </SidebarLink>
              ) : (
                <SidebarLink
                  key={link.key}
                  href={link.href}
                  icon={link.icon}
                  collapsed={collapsed}
                >
                  {link.label}
                </SidebarLink>
              )
            )}
          </nav>

          {/* Collapse/Expand Button */}
          <button
            className="absolute top-3 -right-4 flex h-8 w-8 items-center justify-center rounded-full border border-b bg-black shadow-md hover:bg-gray-900"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4 text-zinc-400" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-zinc-400" />
            )}
          </button>
        </div>
      </aside>
    </SidebarCollapsedContext.Provider>
  );
}

// ── 4) SidebarLink sub‑component ────────────────────────────────────
function SidebarLink({
  href,
  children,
  icon,
  collapsed,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  icon: React.ReactNode;
  collapsed: boolean;
  onClick?: (e: React.MouseEvent) => void;
}) {
  // render as button if it has an onClick (Sign Out)
  if (onClick && href === '#') {
    return (
      <button
        onClick={onClick}
        className={cn(
          'flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left font-medium text-zinc-200 transition-all duration-300 ease-in-out',
          collapsed ? 'justify-center px-2' : 'justify-start',
          'hover:shadow-md'
        )}
        type="button"
      >
        <span className="h-5 w-5 flex-shrink-0 transition-all duration-300 ease-in-out">
          {icon}
        </span>
        {!collapsed && (
          <span className="truncate text-base transition-all duration-300 ease-in-out">
            {children}
          </span>
        )}
      </button>
    );
  }

  // default: render as a Next.js Link
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-xl px-3 py-2 font-medium text-zinc-200 transition-all duration-300 ease-in-out',
        collapsed ? 'justify-center px-2' : 'justify-start',
        'hover:shadow-md'
      )}
    >
      <span className="h-5 w-5 flex-shrink-0 transition-all duration-300 ease-in-out">
        {icon}
      </span>
      {!collapsed && (
        <span className="truncate text-base transition-all duration-300 ease-in-out">
          {children}
        </span>
      )}
    </Link>
  );
}
