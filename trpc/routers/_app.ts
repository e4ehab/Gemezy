import { createTRPCRouter } from '../init';
import { locationsRouter } from '@/features/locations/server/routers';
import { profileRouter } from '@/features/profile/server/routers';

export const appRouter = createTRPCRouter({
  locations: locationsRouter,
  profile: profileRouter,
});

export type AppRouter = typeof appRouter;
