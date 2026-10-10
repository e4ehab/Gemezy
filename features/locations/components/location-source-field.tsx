"use client";

import { useState } from "react";
import { toast } from "@/components/ui/toast";
import {
  CheckIcon,
  CrosshairIcon,
  ExternalLinkIcon,
  MapIcon,
  MapPinIcon,
  NavigationIcon,
  type LucideIcon,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isGoogleMapsShareUrl } from "@/features/locations/utils";
import { cn } from "@/lib/utils";

export type LocationSource = "CURRENT" | "MAPS";
export type Coordinates = { latitude: number; longitude: number };

type LocationSourceFieldProps = {
  source: LocationSource;
  onSourceChange: (source: LocationSource) => void;
  coordinates: Coordinates | null;
  onCoordinatesChange: (coordinates: Coordinates) => void;
  mapsShareUrl: string;
  onMapsShareUrlChange: (value: string) => void;
};

const sourceOptions: {
  id: LocationSource;
  title: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    id: "CURRENT",
    title: "Use my location",
    description: "Save the place you are at right now",
    icon: CrosshairIcon,
  },
  {
    id: "MAPS",
    title: "Find on Google Maps",
    description: "Paste a Google Maps share link",
    icon: MapIcon,
  },
];

export function LocationSourceField({
  source,
  onSourceChange,
  coordinates,
  onCoordinatesChange,
  mapsShareUrl,
  onMapsShareUrlChange,
}: LocationSourceFieldProps) {
  const [isLocating, setIsLocating] = useState(false);

  const detectCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Your browser does not support location access");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        onCoordinatesChange({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
        setIsLocating(false);
        toast.success("Current location found");
      },
      (error) => {
        setIsLocating(false);
        const message =
          error.code === error.PERMISSION_DENIED
            ? "Allow location access in your browser to save your current location"
            : error.code === error.TIMEOUT
              ? "Finding your location timed out. Please try again"
              : "Could not find your location. Check your device settings and try again";
        toast.error(message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 },
    );
  };

  return (
    <section className="rounded-2xl bg-card p-4 shadow-sm ring-1 ring-foreground/10 sm:p-7">
      <div className="mb-5 flex items-center gap-3 sm:mb-6">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <MapPinIcon className="size-5" />
        </div>
        <div>
          <h2 className="font-semibold">Choose a place</h2>
          <p className="text-sm text-muted-foreground">
            Where should we pin your new gem?
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {sourceOptions.map(({ id, title, description, icon: Icon }) => {
          const selected = source === id;
          return (
            <button
              key={id}
              type="button"
              aria-pressed={selected}
              onClick={() => onSourceChange(id)}
              className={cn(
                "flex min-h-24 items-start gap-3 rounded-xl border p-4 text-left transition-colors",
                selected
                  ? "border-primary bg-primary/5 ring-2 ring-primary/15"
                  : "border-border bg-background hover:border-primary/40 hover:bg-muted/50",
              )}
            >
              <span
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-lg",
                  selected
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                )}
              >
                <Icon className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2 font-medium">
                  {title}
                  {selected && <CheckIcon className="size-4 shrink-0 text-primary" />}
                </span>
                <span className="mt-1 block text-sm leading-5 text-muted-foreground">
                  {description}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {source === "CURRENT" ? (
        <div className="mt-5 rounded-xl border border-dashed bg-muted/30 p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <NavigationIcon className="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <p className="font-medium">
                  {coordinates ? "Current position ready" : "Use your device location"}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {coordinates
                    ? `${coordinates.latitude.toFixed(5)}, ${coordinates.longitude.toFixed(5)}`
                    : "Your browser will ask for permission. Your coordinates stay private to your account."}
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={detectCurrentLocation}
              disabled={isLocating}
              className="min-h-11 w-full sm:w-auto"
            >
              <CrosshairIcon className={cn(isLocating && "animate-spin")} />
              {isLocating
                ? "Finding you..."
                : coordinates
                  ? "Refresh location"
                  : "Find me"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          <label htmlFor="maps-share-url" className="text-sm font-medium">
            Google Maps share link
          </label>
          <Input
            id="maps-share-url"
            className="min-h-11"
            type="url"
            inputMode="url"
            value={mapsShareUrl}
            onChange={(event) => onMapsShareUrlChange(event.currentTarget.value)}
            placeholder="https://share.google/..."
            maxLength={2000}
            autoComplete="off"
            aria-describedby="maps-share-help"
          />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p
              id="maps-share-help"
              className="max-w-lg text-xs leading-5 text-muted-foreground"
            >
              In Google Maps, open the place, choose Share, then Copy link and paste it here.
            </p>
            <a
              className={buttonVariants({ variant: "outline", size: "sm" })}
              href="https://maps.google.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Google Maps
              <ExternalLinkIcon />
            </a>
          </div>
          {mapsShareUrl.trim() && !isGoogleMapsShareUrl(mapsShareUrl.trim()) && (
            <p role="alert" className="text-sm text-destructive">
              Paste a Google Maps share link, for example https://share.google/...
            </p>
          )}
          {isGoogleMapsShareUrl(mapsShareUrl.trim()) && (
            <a
              href={mapsShareUrl.trim()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              Preview this place
              <ExternalLinkIcon className="size-4" />
            </a>
          )}
        </div>
      )}
    </section>
  );
}
