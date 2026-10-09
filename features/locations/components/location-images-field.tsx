"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import {
  LOCATION_IMAGE_ACCEPT,
  LOCATION_IMAGE_TYPES,
  MAX_LOCATION_IMAGES,
  MAX_LOCATION_IMAGE_SIZE,
} from "@/features/locations/constants";
import { cn } from "@/lib/utils";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  GripVerticalIcon,
  ImagePlusIcon,
  Trash2Icon,
} from "lucide-react";

export type LocationImageItem =
  | { id: string; type: "saved"; url: string }
  | { id: string; type: "file"; file: File; previewUrl: string };

type LocationImagesFieldProps = {
  images: LocationImageItem[];
  onImagesChange: (images: LocationImageItem[]) => void;
  imagePositionX: number;
  imagePositionY: number;
  onImagePositionChange: (position: { x: number; y: number }) => void;
};

export function LocationImagesField({
  images,
  onImagesChange,
  imagePositionX,
  imagePositionY,
  onImagePositionChange,
}: LocationImagesFieldProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const previewUrls = useRef(new Set<string>());
  const mainImage = images[0];
  const mainPreviewUrl = mainImage
    ? mainImage.type === "saved"
      ? mainImage.url
      : mainImage.previewUrl
    : undefined;

  useEffect(() => {
    const activePreviewUrls = previewUrls.current;
    return () => activePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  const handleSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.currentTarget.files ?? []);
    event.currentTarget.value = "";

    const invalidFile = selectedFiles.find(
      (file) => !LOCATION_IMAGE_TYPES.has(file.type) || file.size > MAX_LOCATION_IMAGE_SIZE,
    );
    if (invalidFile) {
      toast.error("Choose JPG, PNG, WebP, or AVIF images under 5 MB each");
      return;
    }

    if (images.length + selectedFiles.length > MAX_LOCATION_IMAGES) {
      toast.error(`You can add up to ${MAX_LOCATION_IMAGES} images per location`);
      return;
    }

    const newItems = selectedFiles.map((file) => {
      const previewUrl = URL.createObjectURL(file);
      previewUrls.current.add(previewUrl);
      return {
        id: crypto.randomUUID(),
        type: "file" as const,
        file,
        previewUrl,
      };
    });
    onImagesChange([...images, ...newItems]);
  };

  const moveImage = (imageId: string, targetId: string) => {
    if (imageId === targetId) return;
    const from = images.findIndex((image) => image.id === imageId);
    const to = images.findIndex((image) => image.id === targetId);
    if (from < 0 || to < 0) return;
    const reordered = [...images];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);
    onImagesChange(reordered);
  };

  const moveBy = (index: number, offset: number) => {
    const targetIndex = index + offset;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    const reordered = [...images];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
    onImagesChange(reordered);
  };

  return (
    <section className="space-y-5 rounded-2xl bg-card p-5 shadow-sm ring-1 ring-foreground/10 sm:p-7">
      <div>
        <h2 className="font-semibold">
          Photos <span className="font-normal text-muted-foreground">(optional)</span>
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Drag photos to reorder them. The first photo is the main card image. Add up to{" "}
          {MAX_LOCATION_IMAGES} photos, up to 5 MB each.
        </p>
      </div>

      <label
        htmlFor="location-images"
        className={cn(
          "flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed bg-muted/20 px-4 py-5 text-center transition-colors hover:border-primary/50 hover:bg-muted/40",
          images.length >= MAX_LOCATION_IMAGES && "pointer-events-none opacity-50",
        )}
      >
        <ImagePlusIcon className="size-6 text-primary" />
        <span className="text-sm font-medium">Choose photos</span>
        <span className="text-xs text-muted-foreground">
          {images.length}/{MAX_LOCATION_IMAGES} selected
        </span>
        <input
          id="location-images"
          type="file"
          accept={LOCATION_IMAGE_ACCEPT}
          multiple
          disabled={images.length >= MAX_LOCATION_IMAGES}
          onChange={handleSelection}
          className="sr-only"
        />
      </label>

      {images.length > 0 && (
        <ol className="space-y-2">
          {images.map((image, index) => {
            const preview = image.type === "saved" ? image.url : image.previewUrl;
            const imageName = image.type === "saved" ? `Saved photo ${index + 1}` : image.file.name;
            return (
              <li
                key={image.id}
                draggable
                onDragStart={() => setDraggingId(image.id)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  if (draggingId) moveImage(draggingId, image.id);
                  setDraggingId(null);
                }}
                onDragEnd={() => setDraggingId(null)}
                className={cn(
                  "flex items-center gap-2 rounded-lg border bg-background px-3 py-2",
                  draggingId === image.id && "opacity-50",
                )}
              >
                <span className="relative size-12 shrink-0 overflow-hidden rounded-md bg-muted">
                  {preview && (
                    <Image
                      src={preview}
                      alt=""
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  )}
                </span>
                <GripVerticalIcon
                  aria-hidden="true"
                  className="size-4 shrink-0 cursor-grab text-muted-foreground"
                />
                <span className="min-w-0 flex-1 truncate text-sm">
                  {index === 0 && (
                    <span className="mr-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      Main
                    </span>
                  )}
                  {imageName}
                </span>
                {image.type === "file" && (
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {(image.file.size / (1024 * 1024)).toFixed(1)} MB
                  </span>
                )}
                <div className="flex shrink-0">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    aria-label={`Move ${imageName} earlier`}
                    disabled={index === 0}
                    onClick={() => moveBy(index, -1)}
                  >
                    <ArrowUpIcon />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    aria-label={`Move ${imageName} later`}
                    disabled={index === images.length - 1}
                    onClick={() => moveBy(index, 1)}
                  >
                    <ArrowDownIcon />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    aria-label={`Remove ${imageName}`}
                    onClick={() => {
                      if (image.type === "file") {
                        URL.revokeObjectURL(image.previewUrl);
                        previewUrls.current.delete(image.previewUrl);
                      }
                      onImagesChange(images.filter((item) => item.id !== image.id));
                    }}
                  >
                    <Trash2Icon />
                  </Button>
                </div>
              </li>
            );
          })}
        </ol>
      )}

      {mainImage && mainPreviewUrl && (
        <div className="space-y-4 rounded-xl border border-primary/20 bg-primary/[0.03] p-4">
          <div>
            <h3 className="text-sm font-semibold">Crop main card image</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Adjust the focal point and preview how the main photo will be cropped on your
              location card.
            </p>
          </div>
          <div className="mx-auto w-full max-w-md">
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl border bg-muted shadow-sm">
              <Image
                src={mainPreviewUrl}
                alt="Main location photo crop preview"
                fill
                unoptimized
                className="object-cover"
                style={{ objectPosition: `${imagePositionX}% ${imagePositionY}%` }}
              />
              <span className="absolute left-3 top-3 rounded-full border border-white/30 bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
                Card preview
              </span>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm">
              <span className="flex justify-between">
                <span>Horizontal position</span>
                <span className="text-muted-foreground">{imagePositionX}%</span>
              </span>
              <input
                type="range"
                min="0"
                max="100"
                value={imagePositionX}
                onChange={(event) =>
                  onImagePositionChange({ x: Number(event.currentTarget.value), y: imagePositionY })
                }
                className="w-full accent-primary"
              />
            </label>
            <label className="space-y-2 text-sm">
              <span className="flex justify-between">
                <span>Vertical position</span>
                <span className="text-muted-foreground">{imagePositionY}%</span>
              </span>
              <input
                type="range"
                min="0"
                max="100"
                value={imagePositionY}
                onChange={(event) =>
                  onImagePositionChange({ x: imagePositionX, y: Number(event.currentTarget.value) })
                }
                className="w-full accent-primary"
              />
            </label>
          </div>
        </div>
      )}
    </section>
  );
}
