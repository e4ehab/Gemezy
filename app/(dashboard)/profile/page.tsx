import { Suspense } from 'react';
import { HydrateClient } from '@/trpc/server';
import { prefetchProfile } from '@/features/profile/server/prefetch';
import { Profile } from '@/features/profile/components/profile';
import { requireAuth } from '@/lib/auth-utils';

export default async function ProfilePage() {
  await requireAuth();
  prefetchProfile();

  return (
    <HydrateClient>
      <Suspense fallback={<p className="p-6 text-muted-foreground">Loading profile...</p>}>
        <Profile />
      </Suspense>
    </HydrateClient>
  );
}
