import { notFound } from "next/navigation";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import {
  LocationIdView,
  LocationIdViewError,
  LocationIdViewLoading,
} from "@/features/locations/components/location-id-view";
import { prefetchLocation } from "@/features/locations/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";

export default async function LocationDetailPage({
  params,
}: {
  params: Promise<{ locationid: string }>;
}) {
  await requireAuth();
  const { locationid: slug } = await params;

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(slug) && !/^LOC@\d{8}$/i.test(slug)) {
    notFound();
  }
  prefetchLocation(slug);

  return (
    <HydrateClient>
      <Suspense fallback={<LocationIdViewLoading />}>
        <ErrorBoundary FallbackComponent={LocationIdViewError}>
          <LocationIdView slug={slug} />
        </ErrorBoundary>
      </Suspense>
    </HydrateClient>
  );
}