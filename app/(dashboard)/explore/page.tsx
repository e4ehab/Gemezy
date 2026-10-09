import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon, MapPinIcon } from "lucide-react";
import prisma from "@/lib/db";
import { getLocationSharePath } from "@/features/locations/utils";
import { requireAuth } from "@/lib/auth-utils";

export default async function ExplorePage() {
  await requireAuth();
  const locations = await prisma.savedLocation.findMany({
    where: { visibility: "PUBLIC" },
    orderBy: { createdAt: "desc" },
    select: { shareId: true, name: true, images: true },
  });

  return (
    <main className="mx-auto w-full max-w-7xl space-y-7 px-4 py-7 sm:px-6 sm:py-8 lg:px-10">
      <header className="space-y-2">
        <p className="text-sm font-medium text-primary">Discover</p>
        <h1 className="text-3xl font-semibold tracking-tight">Explore public places</h1>
        <p className="text-muted-foreground">
          Places shared publicly by the Gemezy community.
        </p>
      </header>

      {locations.length ? (
        <div className="grid auto-rows-fr grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {locations.map((location) => (
            <Link
              key={location.shareId}
              href={getLocationSharePath(location.shareId)}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative flex h-44 items-center justify-center overflow-hidden bg-linear-to-br from-primary/20 via-accent/20 to-muted">
                {location.images[0] ? (
                  <Image
                    src={location.images[0]}
                    alt={location.name}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <MapPinIcon className="size-10 text-primary" />
                )}
              </div>
              <div className="flex grow items-center justify-between gap-3 p-4">
                <h2 className="line-clamp-2 font-semibold">{location.name}</h2>
                <ArrowUpRightIcon className="size-4 shrink-0 text-primary" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed bg-card/60 py-16 text-center">
          <p className="font-medium">No public places yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Public locations shared by the community will appear here.
          </p>
        </div>
      )}
    </main>
  );
}
