"use client";

import { ErrorState } from "@/components/states/error-state";

export default function LocationsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      title="We couldn’t load your locations"
      description="Something went wrong while loading your collection. Please try again."
      onRetry={reset}
    />
  );
}
