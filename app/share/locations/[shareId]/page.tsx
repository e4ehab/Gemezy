import type { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import { SharedLocationView } from "@/features/locations/components/shared-location-view";

type SharedLocationPageProps = {
  params: Promise<{ shareId: string }>;
};

export async function generateMetadata({
  params,
}: SharedLocationPageProps): Promise<Metadata> {
  const { shareId } = await params;
  if (!/^[a-f0-9]{32}$/i.test(shareId)) return { title: "Shared location | Gemezy" };
  const location = await prisma.savedLocation.findFirst({
    where: { shareId, visibility: { in: ["PUBLIC", "Unlisted"] } },
    select: { name: true, visibility: true },
  });
  return {
    title: location ? `${location.name} | Gemezy` : "Shared location | Gemezy",
    description: location ? `View ${location.name} on Gemezy.` : undefined,
    robots: location?.visibility === "PUBLIC"
      ? { index: true, follow: true }
      : { index: false, follow: false },
  };
}

export default async function SharedLocationPage({ params }: SharedLocationPageProps) {
  const { shareId } = await params;
  if (!/^[a-f0-9]{32}$/i.test(shareId)) notFound();

  const location = await prisma.savedLocation.findFirst({
    where: { shareId, visibility: { in: ["PUBLIC", "Unlisted"] } },
    select: {
      shareId: true,
      name: true,
      images: true,
      mapsUrl: true,
      imagePositionX: true,
      imagePositionY: true,
    },
  });
  if (!location) notFound();

  return <SharedLocationView location={location} />;
}
