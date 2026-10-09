"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { type Dispatch, type SetStateAction } from "react";
import { MapPinIcon } from "lucide-react";
import {
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandResponsiveDialog,
} from "@/components/ui/command";
import { useTRPC } from "@/trpc/client";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const DashboardCommand = ({ open, setOpen }: Props) => {
  const router = useRouter();
  const trpc = useTRPC();
  const locationsQuery = useQuery({
    ...trpc.locations.getMany.queryOptions(),
    enabled: open,
  });
  const locations = locationsQuery.data ?? [];

  return (
    <CommandResponsiveDialog
      open={open}
      onOpenChange={setOpen}
      title="Search your locations"
      description="Search locations by name, description, location ID, or tag."
    >
      <CommandInput placeholder="Search by name, #tag, or location ID..." />
      <CommandList>
        {locationsQuery.isPending && (
          <div className="px-4 py-6 text-center text-sm text-muted-foreground">
            Searching your collection...
          </div>
        )}
        {locationsQuery.isError && (
          <div className="px-4 py-6 text-center text-sm text-destructive">
            Could not load your locations. Close this and try again.
          </div>
        )}
        {!locationsQuery.isPending && !locationsQuery.isError && (
          <>
            {locations.map((location) => (
              <CommandItem
                key={location.publicId}
                value={`${location.name} ${location.description ?? ""} ${location.publicId} ${location.tags.map((tag) => `#${tag} ${tag}`).join(" ")}`}
                onSelect={() => {
                  setOpen(false);
                  router.push(`/locations/${encodeURIComponent(location.slug)}`);
                }}
                className="items-start gap-3 px-3 py-3"
              >
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MapPinIcon className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{location.name}</span>
                  <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                    {location.description || location.address || location.publicId}
                  </span>
                  {location.tags.length > 0 && (
                    <span className="mt-2 flex flex-wrap gap-1.5">
                      {location.tags.map((tag) => (
                        <span key={tag} className="rounded-md border px-1.5 py-0.5 text-[11px] text-muted-foreground">
                          #{tag}
                        </span>
                      ))}
                    </span>
                  )}
                </span>
                <span className="shrink-0 self-center font-mono text-[10px] text-muted-foreground">
                  {location.publicId}
                </span>
              </CommandItem>
            ))}
            <CommandEmpty>
              {locations.length === 0
                ? "No saved locations yet. Add a location to start your collection."
                : "No matching locations. Try another name, ID, or tag."}
            </CommandEmpty>
          </>
        )}
      </CommandList>
    </CommandResponsiveDialog>
  );
};
