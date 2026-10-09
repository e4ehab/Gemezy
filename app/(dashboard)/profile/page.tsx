import { Suspense } from 'react';
import { LoadingState } from '@/components/states/loading-state';
import { HydrateClient } from '@/trpc/server';
import { prefetchProfile } from '@/features/profile/server/prefetch';
import { Profile } from '@/features/profile/components/profile';
import { requireAuth } from '@/lib/auth-utils';

export default async function ProfilePage() {
  await requireAuth();
  prefetchProfile();

  return (
    <HydrateClient>
      <Suspense
        fallback={
          <LoadingState
            title="Loading your profile"
            description="Getting your account details ready."
          />
        }
      >
        <Profile />
      </Suspense>
    </HydrateClient>
  );
}
