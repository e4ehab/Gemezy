"use client";

import Image from "next/image";
import { ArrowUpRightIcon, CopyIcon, MapPinIcon, MessageCircleIcon } from "lucide-react";
import { toast } from "@/components/ui/toast";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getGoogleMapsUrl, getLocationSharePath } from "@/features/locations/utils";

type SharedLocation = {
  shareId: string;
  name: string;
  images: string[];
  mapsUrl: string;
  imagePositionX: number;
  imagePositionY: number;
};

export function SharedLocationView({ location }: { location: SharedLocation }) {
  const images = location.images ?? [];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        new URL(getLocationSharePath(location.shareId), window.location.origin).toString(),
      );
      toast.success("Share link copied");
    } catch {
      toast.error("Could not copy the share link");
    }
  };

  const shareOnWhatsApp = () => {
    const shareUrl = new URL(
      getLocationSharePath(location.shareId),
      window.location.origin,
    ).toString();
    const mapsUrl = getGoogleMapsUrl(location.mapsUrl);
    const message = `Check out ${location.name}\n${shareUrl}\nOpen in Google Maps: ${mapsUrl}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl space-y-5 px-3 py-6 sm:space-y-6 sm:px-6 sm:py-10">
      <Card className="overflow-hidden rounded-3xl border-border bg-card text-card-foreground shadow-xl shadow-black/10">
        <div className="relative flex aspect-[4/3] max-h-[32rem] w-full items-center justify-center overflow-hidden bg-linear-to-br from-primary/15 via-accent/25 to-muted sm:aspect-[2/1]">
          {images[0] ? (
            <>
              <Image
                src={images[0]}
                alt=""
                aria-hidden="true"
                fill
                unoptimized
                priority
                sizes="(max-width: 768px) 100vw, 896px"
                className="scale-110 object-cover opacity-60 blur-2xl"
                style={{
                  objectPosition: `${location.imagePositionX}% ${location.imagePositionY}%`,
                }}
              />
              <div className="absolute inset-0 bg-black/20" />
              <Image
                src={images[0]}
                alt={location.name}
                fill
                unoptimized
                priority
                sizes="(max-width: 768px) 100vw, 896px"
                className="z-10 object-contain p-2 drop-shadow-2xl sm:p-4"
              />
            </>
          ) : (
            <div className="flex size-20 items-center justify-center rounded-3xl border border-primary/25 bg-card/90 text-primary shadow-lg shadow-primary/10">
              <MapPinIcon className="size-10" />
            </div>
          )}
        </div>
        <CardHeader className="gap-3 px-4 pt-5 sm:px-8 sm:pt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Shared location
          </p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-4xl">{location.name}</h1>
        </CardHeader>
        <CardContent className="space-y-5 px-4 pb-5 sm:px-8 sm:pb-7">
          <p className="text-sm text-muted-foreground">
            Shared with you on Gemezy. Personal notes, tags, and exact coordinates are kept private.
          </p>
          <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:gap-3">
            <a
              className={`${buttonVariants()} min-h-11 w-full sm:w-auto`}
              href={getGoogleMapsUrl(location.mapsUrl)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open in Google Maps
              <ArrowUpRightIcon />
            </a>
            <Button type="button" variant="outline" className="min-h-11 w-full sm:w-auto" onClick={copyLink}>
              <CopyIcon />
              Copy link
            </Button>
            <Button
              type="button"
              variant="outline"
              className="min-h-11 w-full border-emerald-500/30 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-300 sm:w-auto"
              onClick={shareOnWhatsApp}
            >
              <MessageCircleIcon />
              WhatsApp
            </Button>
          </div>
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
                key={`${imageUrl}-${index}`}
                className="relative h-56 overflow-hidden rounded-2xl border border-border bg-card shadow-lg shadow-black/10 sm:h-72"
              >
                <Image
                  src={imageUrl}
                  alt={`${location.name} photo ${index + 2}`}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
