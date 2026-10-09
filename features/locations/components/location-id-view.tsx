"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  ArrowUpRightIcon,
  AlertTriangleIcon,
  CalendarDaysIcon,
  LoaderCircleIcon,
  MapPinIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "@/components/ui/toast";
import { ErrorState } from "@/components/states/error-state";
import { LoadingState } from "@/components/states/loading-state";
import { buttonVariants } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getGoogleMapsUrl } from "@/features/locations/utils";
import { cn } from "@/lib/utils";
import {
  useDeleteLocation,
  useSuspenseLocation,
} from "@/features/locations/hooks/use-locations";
import { LocationSharingPanel } from "@/features/locations/components/location-sharing-panel";
import type { FallbackProps } from "react-error-boundary";
import { useState } from "react";

type LocationIdViewProps = {
  slug: string;
};

export function LocationIdViewLoading() {
  return (
    <LoadingState
      title="Loading location"
      description="Preparing your saved place details."
    />
  );
}

export function LocationIdViewError({ resetErrorBoundary }: FallbackProps) {
  return (
    <ErrorState
      title="Error loading location"
      description="Could not load this location. It may not exist or may not be available to your account."
      onRetry={resetErrorBoundary}
    />
  );
}

export function LocationIdView({ slug }: LocationIdViewProps) {
  const router = useRouter();
  const { data: location } = useSuspenseLocation(slug);
  const deleteLocation = useDeleteLocation();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const images = location.images ?? [];
  const createdAt = new Intl.DateTimeFormat(undefined, { dateStyle: "long" }).format(location.createdAt);
  const handleDelete = async () => {
    try {
      await deleteLocation.mutateAsync({ slug });
      setIsDeleteDialogOpen(false);
      toast.success("Location deleted");
      router.push("/locations");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not delete this location");
    }
  };

  return (
    <div className="scrollbar-hidden w-full min-h-screen overflow-y-auto overscroll-y-contain">
      <div className="w-full px-4 py-7 sm:px-6 lg:px-10">
        <div className="mx-auto w-full max-w-6xl space-y-6">
          <Link
            href="/locations"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "-ml-2")}
          >
            <ArrowLeftIcon />
            My locations
          </Link>

          <Card className="overflow-hidden rounded-3xl border-border bg-card text-card-foreground shadow-xl shadow-black/10">
            <div className="relative flex aspect-4/3 max-h-128 w-full items-center justify-center overflow-hidden bg-linear-to-br from-primary/15 via-accent/25 to-muted sm:aspect-2/1">
              {images[0] ? (
                <>
                  <Image
                    src={images[0]}
                    alt=""
                    aria-hidden="true"
                    fill
                    unoptimized
                    priority
                    sizes="(max-width: 768px) 100vw, 1152px"
                    className="scale-110 object-cover opacity-60 blur-2xl"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  <Image
                    src={images[0]}
                    alt={location.name}
                    fill
                    unoptimized
                    priority
                    sizes="(max-width: 768px) 100vw, 1152px"
                    className="z-10 object-contain p-2 drop-shadow-2xl sm:p-4"
                  />
                </>
              ) : (
                <>
                  <div className="absolute inset-0 opacity-45 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[28px_28px]" />
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 1200 240"
                    className="absolute inset-0 size-full text-primary/45"
                    fill="none"
                    preserveAspectRatio="xMidYMid slice"
                  >
                    <path d="M-30 180C170 150 230 45 430 75s210 145 390 100 210-130 410-105" stroke="currentColor" strokeWidth="16" />
                    <path d="M-30 180C170 150 230 45 430 75s210 145 390 100 210-130 410-105" stroke="var(--card)" strokeDasharray="4 14" strokeLinecap="round" strokeWidth="3" />
                    <path d="M190 260c30-85 80-95 90-180s-30-120-20-200M800 280c-35-80 10-145 60-175s100-40 120-160" stroke="currentColor" strokeOpacity=".65" strokeWidth="4" />
                  </svg>
                  <div className="relative flex size-20 items-center justify-center rounded-3xl border border-primary/25 bg-card/90 text-primary shadow-lg shadow-primary/10 backdrop-blur-sm">
                    <MapPinIcon className="size-10" />
                  </div>
                </>
              )}
            </div>

            <CardHeader className="gap-3 px-6 pt-6 sm:px-8 sm:pt-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-primary">
                  Saved location
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {location.publicId}
                </span>
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-card-foreground sm:text-4xl">
                {location.name}
              </h1>
            </CardHeader>

            <CardContent className="space-y-6 px-6 pb-7 sm:px-8">
              {location.description && (
                <p className="max-w-3xl whitespace-pre-wrap text-sm leading-7 text-muted-foreground sm:text-base">
                  {location.description}
                </p>
              )}

              {location.tags.length > 0 && (
                <section className="space-y-3">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Tags
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {location.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {location.address && (
                <div className="rounded-xl border border-border bg-muted/50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Place
                  </p>
                  <p className="mt-1 text-sm font-medium text-card-foreground">{location.address}</p>
                </div>
              )}

              {location.latitude !== null && location.longitude !== null && (
                <div className="rounded-xl border border-border bg-muted/50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Coordinates
                  </p>
                  <p className="mt-1 font-mono text-sm text-card-foreground">
                    {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
                  </p>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDaysIcon className="size-4 text-primary" />
                Saved {createdAt}
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/locations/${slug}/edit`}
                  className={buttonVariants({ variant: "outline" })}
                >
                  <PencilIcon />
                  Edit location
                </Link>
                <AlertDialog
                  open={isDeleteDialogOpen}
                  onOpenChange={(open) => {
                    if (!deleteLocation.isPending) setIsDeleteDialogOpen(open);
                  }}
                >
                  <AlertDialogTrigger
                    render={
                      <button
                        type="button"
                        className={buttonVariants({ variant: "destructive" })}
                        disabled={deleteLocation.isPending}
                      />
                    }
                  >
                    <Trash2Icon />
                    Delete
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogMedia className="bg-destructive/10 text-destructive">
                        <AlertTriangleIcon />
                      </AlertDialogMedia>
                      <AlertDialogTitle>Delete this location?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete <strong>{location.name}</strong> from your
                        collection. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={deleteLocation.isPending}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        variant="destructive"
                        disabled={deleteLocation.isPending}
                        onClick={handleDelete}
                      >
                        {deleteLocation.isPending ? (
                          <LoaderCircleIcon className="animate-spin" />
                        ) : (
                          <Trash2Icon />
                        )}
                        {deleteLocation.isPending ? "Deleting..." : "Delete location"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <a
                  className={buttonVariants({ className: "shadow-md shadow-primary/15" })}
                  href={getGoogleMapsUrl(location.mapsUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open in Google Maps
                  <ArrowUpRightIcon />
                </a>
              </div>

              <LocationSharingPanel
                slug={slug}
                shareId={location.shareId}
                name={location.name}
                mapsUrl={getGoogleMapsUrl(location.mapsUrl)}
                visibility={location.visibility}
              />
            </CardContent>
          </Card>

          {images.length > 1 && (
            <section className="space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Photos
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {images.slice(1).map((imageUrl, index) => (
                  <div
                    key={`${imageUrl}-${index + 1}`}
                    className="group relative h-56 overflow-hidden rounded-2xl border border-border bg-card shadow-lg shadow-black/10 sm:h-72"
                  >
                    <Image
                      src={imageUrl}
                      alt={`${location.name} photo ${index + 2}`}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-transparent opacity-70" />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
