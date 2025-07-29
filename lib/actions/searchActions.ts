'use server';

import type { GlobalSearchResultItem } from '@/types/search';
import { globalSearch } from '@/lib/fetchers/searchFetchers';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth/auth';
import { handleError } from '@/lib/errors/handleError';

const searchSchema = z.object({
  orgId: z.string().min(1),
  query: z.string().min(1),
});

export async function globalSearchAction(
  data: z.infer<typeof searchSchema>,
): Promise<GlobalSearchResultItem[]> {
  try {
    const { orgId, query } = searchSchema.parse(data);
    const user = await getCurrentUser();
    if (!user?.userId || user.organizationId !== orgId) {
      throw new Error('Unauthorized');
    }

    return await globalSearch(orgId, query);
  } catch (error) {
    handleError(error, 'Global Search Action');
    return [];
  }
}
