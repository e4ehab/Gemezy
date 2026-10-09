import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { LocationsView, LocationsViewError, LocationsViewLoading } from "@/features/locations/components/locations-view";
import { prefetchLocations } from "@/features/locations/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";

type LocationsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LocationsPage({ searchParams }: LocationsPageProps) {
  await requireAuth();
  const rawSearch = (await searchParams).search;
  const search = typeof rawSearch === "string" ? rawSearch.trim() : "";
  prefetchLocations(search || undefined);

  return (
    <HydrateClient>
      <Suspense fallback={<LocationsViewLoading />}>
        <ErrorBoundary FallbackComponent={LocationsViewError}>
          <LocationsView />
        </ErrorBoundary>
      </Suspense>
    </HydrateClient>
  );
}
