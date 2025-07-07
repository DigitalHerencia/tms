import React from 'react';

import { UserRole } from '@/types/auth';

// Accepts UserWithRole[] instead of UserRole[]
export interface UserWithRole {
  id: string;
  name: string;
  role: string;
}

export function UserTable({ users }: { users: UserWithRole[] }) {
  // ...table implementation...
  return <table>{/* ...rows... */}</table>;
}
