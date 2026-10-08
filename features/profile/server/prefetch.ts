import { prefetch, trpc } from '@/trpc/server';

export const prefetchProfile = () => {
  prefetch(trpc.profile.me.queryOptions());
};
