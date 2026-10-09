import { prefetch, trpc } from '@/trpc/server';

export const prefetchLocations = (search?: string) => {
  prefetch(trpc.locations.getMany.queryOptions({ search }));
};

export const prefetchLocation = (slug: string) => {
  prefetch(trpc.locations.getBySlug.queryOptions({ slug }));
};
