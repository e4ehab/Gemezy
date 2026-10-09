"use client";

import { EyeIcon, EyeOffIcon, Globe2Icon, UsersIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { LocationVisibility } from "@/features/locations/constants";

const descriptions: Record<LocationVisibility, string> = {
  PRIVATE: "Only you can view this location.",
  Unlisted: "Anyone with its unique share link can view it. It will not appear in Explore.",
  PUBLIC: "Anyone can view it, and it may appear in Explore.",
  SHARED: "Sharing with specific accounts is not available yet.",
};

const icons = {
  PRIVATE: EyeOffIcon,
  Unlisted: EyeIcon,
  PUBLIC: Globe2Icon,
  SHARED: UsersIcon,
};

export function LocationVisibilityField({
  value,
  onChange,
  disabled = false,
}: {
  value: LocationVisibility;
  onChange: (value: LocationVisibility) => void;
  disabled?: boolean;
}) {
  const Icon = icons[value];
  return (
    <section className="space-y-3 rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm sm:p-6">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-5" />
        </span>
        <div className="min-w-0 flex-1 space-y-1">
          <h2 className="font-semibold">Location visibility</h2>
          <p className="text-sm text-muted-foreground">{descriptions[value]}</p>
        </div>
        <Select
          value={value}
          onValueChange={(nextValue) => {
            if (
              nextValue === "PRIVATE" ||
              nextValue === "PUBLIC" ||
              nextValue === "Unlisted" ||
              nextValue === "SHARED"
            ) {
              onChange(nextValue);
            }
          }}
          disabled={disabled}
        >
          <SelectTrigger className="w-36" aria-label="Location visibility">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PRIVATE">Private</SelectItem>
            <SelectItem value="Unlisted">Unlisted</SelectItem>
            <SelectItem value="PUBLIC">Public</SelectItem>
            <SelectItem value="SHARED" disabled>
              Shared (coming soon)
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </section>
  );
}
