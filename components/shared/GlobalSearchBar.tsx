'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { globalSearchAction } from '@/lib/actions/searchActions';
import type { GlobalSearchResultItem } from '@/types/search';
import { useOrganizationContext } from '@/components/auth/context';

export function GlobalSearchBar() {
  const org = useOrganizationContext();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GlobalSearchResultItem[]>([]);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!org) return;
    startTransition(async () => {
      const data = await globalSearchAction({ orgId: org.id, query });
      setResults(data);
    });
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex items-center gap-1">
        <Input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search..."
          className="h-7 w-32 md:w-48"
        />
        <button
          type="submit"
          className="rounded-md p-1 text-zinc-300 hover:text-white"
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </button>
      </form>
      {results.length > 0 && (
        <div className="absolute left-0 right-0 z-20 mt-1 space-y-1 rounded-md border border-gray-700 bg-black p-2 shadow-lg">
          {results.map(r => (
            <Link
              key={`${r.type}-${r.id}`}
              href={r.url}
              className="block rounded-sm px-2 py-1 text-sm hover:bg-gray-800"
            >
              {r.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
