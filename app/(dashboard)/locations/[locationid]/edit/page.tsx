import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, MapPinIcon } from "lucide-react";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { buttonVariants } from "@/components/ui/button";
import {
  LocationIdViewError,
  LocationIdViewLoading,
} from "@/features/locations/components/location-id-view";
import { EditLocationForm } from "@/features/locations/components/edit-location-form";
import { prefetchLocation } from "@/features/locations/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { cn } from "@/lib/utils";
import { HydrateClient } from "@/trpc/server";

export default async function EditLocationPage({
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
      <main className="mx-auto w-full max-w-3xl space-y-6 p-4 sm:space-y-7 sm:p-8 lg:p-10">
        <div className="space-y-5">
          <Link
            href={`/locations/${slug}`}
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "-ml-2")}
          >
            <ArrowLeftIcon />
            Back to location
          </Link>
          <header className="space-y-2">
            <div className="inline-flex items-center gap-2 text-sm font-medium text-primary">
              <MapPinIcon className="size-4" />
              Update your collection
            </div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Edit location
            </h1>
            <p className="max-w-xl text-muted-foreground">
              Update the name, notes, search tags, and photos for this saved place.
            </p>
          </header>
        </div>
        <Suspense fallback={<LocationIdViewLoading />}>
          <ErrorBoundary FallbackComponent={LocationIdViewError}>
            <EditLocationForm slug={slug} />
          </ErrorBoundary>
        </Suspense>
      </main>
    </HydrateClient>
  );
}
